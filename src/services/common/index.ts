import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type {
  SkillGap,
  ActionPlan,
  UserProfileData,
  Task,
} from "../../types";

const db = getFirestore();

// Skill Gap Functions
export const fetchUserSkillGaps = async (): Promise<SkillGap[]> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) return [];

  const userData = userDoc.data() as UserProfileData;
  const assessments = userData.assessments || {};
  const skillGaps: SkillGap[] = [];

  // Fetch all action plans to link progress
  const actionPlans = await fetchUserActionPlans();
  const plansBySkillGap = new Map<string, ActionPlan>();
  actionPlans.forEach((plan) => {
    plansBySkillGap.set(plan.skillGapId, plan);
  });

  // Get skill gap statuses
  const skillGapStatuses = (userData as any).skillGapStatuses || {};

  Object.entries(assessments).forEach(([courseName, assessment]) => {
    const course = userData.courses.find(
      (c) => c.basicInfo.name === courseName,
    );
    if (!course || !assessment.skillGaps) return;

    assessment.skillGaps.forEach((skillName: string) => {
      const gapId = `${courseName}-${skillName}`;
      const actionPlan = plansBySkillGap.get(gapId);
      const gapStatus = skillGapStatuses[gapId] || {};

      const skillGap: SkillGap = {
        id: gapId,
        skill: skillName,
        course: course.basicInfo.code,
        courseName: courseName,
        severity: getSeverity(skillName),
        urgency: getUrgency(skillName),
        daysToAddress: getDaysToAddress(skillName),
        blocks: getBlockedSkills(skillName),
        reason: getReason(skillName),
        impact: getImpact(skillName),
        performance: assessment.topicPerformance?.[skillName] || {
          correct: 0,
          total: 1,
        },
        actionPlanId: actionPlan?.id,
        progress: actionPlan
          ? (actionPlan.completedHours / actionPlan.estimatedHours) * 100
          : 0,
        isFixed: gapStatus.isFixed || false,
        createdAt: assessment.completedAt,
        fixedAt: gapStatus.fixedAt,
      };

      skillGaps.push(skillGap);
    });
  });

  return skillGaps.sort((a, b) => {
    // Sort fixed gaps to the bottom
    if (a.isFixed !== b.isFixed) return a.isFixed ? 1 : -1;
    
    const severityOrder = { critical: 0, moderate: 1, manageable: 2 };
    const urgencyOrder = { immediate: 0, high: 1, medium: 2, low: 3 };

    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
};

export const markSkillGapAsFixed = async (
  skillGapId: string,
  isFixed: boolean,
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) throw new Error("User not found");

  const userData = userDoc.data() as UserProfileData;
  
  // Update skill gap status
  const skillGapStatuses = (userData as any).skillGapStatuses || {};
  skillGapStatuses[skillGapId] = {
    isFixed,
    fixedAt: isFixed ? new Date().toISOString() : null,
  };

  // Calculate progress for the course
  const [courseName] = skillGapId.split("-");
  const assessment = userData.assessments?.[courseName];
  
  if (assessment && assessment.skillGaps) {
    const totalGaps = assessment.skillGaps.length;
    const fixedCount = assessment.skillGaps.filter((skill: string) => {
      const gapId = `${courseName}-${skill}`;
      return skillGapStatuses[gapId]?.isFixed === true;
    }).length;
    
    const progress = totalGaps > 0 ? (fixedCount / totalGaps) * 100 : 0;
    const canReassess = progress === 100;
    
    // Update assessment with progress
    const assessments = { ...userData.assessments };
    assessments[courseName] = {
      ...assessment,
      skillGapProgress: progress,
      canReassess,
    };
    
    await updateDoc(doc(db, "users", user.uid), {
      skillGapStatuses,
      assessments,
    });
  } else {
    await updateDoc(doc(db, "users", user.uid), {
      skillGapStatuses,
    });
  }
};

export const removeSkillGap = async (skillGapId: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) throw new Error("User not found");

  const userData = userDoc.data() as UserProfileData;
  const [courseName, skillName] = skillGapId.split("-");

  if (!userData.assessments?.[courseName]) {
    throw new Error("Assessment not found");
  }

  // Remove skill gap from assessment
  const assessments = { ...userData.assessments };
  assessments[courseName].skillGaps = assessments[courseName].skillGaps.filter(
    (s: string) => s !== skillName,
  );

  await updateDoc(doc(db, "users", user.uid), {
    assessments,
  });
};

// Action Plan Functions
export const fetchUserActionPlans = async (): Promise<ActionPlan[]> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const plansRef = collection(db, "actionPlans");
  const q = query(plansRef, where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  const plans: ActionPlan[] = [];
  querySnapshot.forEach((doc) => {
    plans.push({ id: doc.id, ...doc.data() } as ActionPlan);
  });

  return plans.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export const createActionPlan = async (
  planData: Omit<ActionPlan, "id">,
): Promise<string> => {
  const docRef = await addDoc(collection(db, "actionPlans"), planData);
  return docRef.id;
};

export const updateActionPlan = async (
  planId: string,
  updates: Partial<ActionPlan>,
): Promise<void> => {
  const planRef = doc(db, "actionPlans", planId);
  await updateDoc(planRef, updates);
};

export const deleteActionPlan = async (planId: string): Promise<void> => {
  const planRef = doc(db, "actionPlans", planId);
  await deleteDoc(planRef);
};

export const updateTaskStatus = async (
  planId: string,
  taskId: string,
  completed: boolean,
): Promise<void> => {
  const planRef = doc(db, "actionPlans", planId);
  const planDoc = await getDoc(planRef);

  if (!planDoc.exists()) throw new Error("Action plan not found");

  const plan = planDoc.data() as ActionPlan;
  const updatedTasks = plan.tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        completed,
        completedDate: completed ? new Date().toISOString() : undefined,
      };
    }
    return task;
  });

  const completedHours = updatedTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.estimatedTime / 60, 0);

  const status: ActionPlan["status"] =
    completedHours >= plan.estimatedHours ? "completed" : "in_progress";

  await updateDoc(planRef, {
    tasks: updatedTasks,
    completedHours,
    status,
    ...(status === "completed" && { completedAt: new Date().toISOString() }),
  });

  // Auto-mark skill gap as fixed when action plan is completed
  if (status === "completed" && plan.skillGapId) {
    await markSkillGapAsFixed(plan.skillGapId, true);
  }
};

export const createActionPlansForSkillGaps = async (
  skillGapIds: string[],
  weeklyHours: number,
  dueDate: string,
  customTitle?: string,
  generateTasksFunction?: (gap: SkillGap, formData: any) => Promise<Task[]>,
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const skillGaps = await fetchUserSkillGaps();
  const selectedGaps = skillGaps.filter((gap) => skillGapIds.includes(gap.id));

  for (const gap of selectedGaps) {
    const tasks = generateTasksFunction
      ? await generateTasksFunction(gap, { weeklyHours })
      : [];

    const estimatedHours = tasks.reduce(
      (sum, task) => sum + task.estimatedTime / 60,
      0,
    );

    const plan: Omit<ActionPlan, "id"> = {
      userId: user.uid,
      title: customTitle || `Master ${gap.skill}`,
      skillGapId: gap.id,
      skillGap: gap.skill,
      course: gap.course,
      courseName: gap.courseName,
      priority:
        gap.severity === "critical"
          ? "critical"
          : gap.severity === "moderate"
            ? "high"
            : "medium",
      dueDate:
        dueDate ||
        new Date(Date.now() + gap.daysToAddress * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: Math.max(estimatedHours, gap.daysToAddress * 0.5),
      completedHours: 0,
      weeklyAllocation: weeklyHours,
      status: "not_started",
      tasks: tasks,
      createdAt: new Date().toISOString(),
    };

    await createActionPlan(plan);
  }
};

// Helper Functions for Skill Gap Metadata
const skillConsequences: Record<
  string,
  {
    severity: SkillGap["severity"];
    urgency: SkillGap["urgency"];
    daysToAddress: number;
    blocks: string[];
    reason: string;
    impact: string;
  }
> = {
  Limits: {
    severity: "critical",
    urgency: "immediate",
    daysToAddress: 7,
    blocks: ["Differentiation", "Integration", "Sequences and Series"],
    reason: "Foundation for all calculus concepts",
    impact: "Without limits, you cannot understand derivatives or integrals",
  },
  Differentiation: {
    severity: "critical",
    urgency: "immediate",
    daysToAddress: 10,
    blocks: [
      "Applications of Derivatives",
      "Integration",
      "Differential Equations",
    ],
    reason: "Core technique used throughout calculus",
    impact: "Required for optimization, rates of change, and advanced topics",
  },
  Integration: {
    severity: "critical",
    urgency: "high",
    daysToAddress: 14,
    blocks: [
      "Multivariable Calculus",
      "Differential Equations",
      "Vector Calculus",
    ],
    reason: "Essential for area, volume, and advanced mathematics",
    impact: "Blocks progress in physics, engineering, and higher math",
  },
  Functions: {
    severity: "critical",
    urgency: "immediate",
    daysToAddress: 5,
    blocks: ["Limits", "Differentiation", "Integration"],
    reason: "Absolute foundation - everything builds on this",
    impact: "Cannot proceed with any calculus without understanding functions",
  },
  "Multivariable Calculus": {
    severity: "moderate",
    urgency: "medium",
    daysToAddress: 21,
    blocks: ["Vector Calculus"],
    reason: "Advanced topic for later in semester",
    impact: "Important for 3D applications but can be addressed later",
  },
  "Differential Equations": {
    severity: "moderate",
    urgency: "medium",
    daysToAddress: 21,
    blocks: [],
    reason: "Advanced application topic",
    impact: "Critical for physics and engineering applications",
  },
  "Sequences and Series": {
    severity: "moderate",
    urgency: "medium",
    daysToAddress: 18,
    blocks: [],
    reason: "Important for convergence and approximation",
    impact: "Needed for Taylor series and numerical methods",
  },
  "Applications of Derivatives": {
    severity: "manageable",
    urgency: "low",
    daysToAddress: 30,
    blocks: [],
    reason: "Practice-based skill",
    impact: "Improves problem-solving but less foundational",
  },
  "Vector Calculus": {
    severity: "manageable",
    urgency: "low",
    daysToAddress: 30,
    blocks: [],
    reason: "End-of-semester topic",
    impact: "Important but typically covered later",
  },
};

const getSeverity = (skill: string): SkillGap["severity"] => {
  return skillConsequences[skill]?.severity || "manageable";
};

const getUrgency = (skill: string): SkillGap["urgency"] => {
  return skillConsequences[skill]?.urgency || "low";
};

const getDaysToAddress = (skill: string): number => {
  return skillConsequences[skill]?.daysToAddress || 30;
};

const getBlockedSkills = (skill: string): string[] => {
  return skillConsequences[skill]?.blocks || [];
};

const getReason = (skill: string): string => {
  return skillConsequences[skill]?.reason || "Skill needs review";
};

const getImpact = (skill: string): string => {
  return (
    skillConsequences[skill]?.impact || "Moderate impact on course performance"
  );
};