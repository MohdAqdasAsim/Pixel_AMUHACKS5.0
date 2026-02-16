import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config";
import type { Course } from "../../types";

export const fetchUserCourses = async (userId: string): Promise<Course[]> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  const userCourses = userData.courses || [];
  const assessments = userData.assessments || {};

  const coursesWithStatus: Course[] = userCourses.map(
    (courseData: any, index: number) => {
      const courseName = courseData.basicInfo?.name || courseData;
      const courseAssessment = assessments[courseName] || {};
      
      return {
        id: `course-${index}`,
        name: courseName,
        topics: courseData.topics || [],
        lastAssessed: courseAssessment.completedAt
          ? new Date(courseAssessment.completedAt)
          : undefined,
        nextAssessment: undefined,
        status: courseAssessment.status || "pending",
        skillGapsCount: courseAssessment.skillGaps?.length || 0,
        completionRate: courseAssessment.score || 0,
        canReassess: courseAssessment.canReassess || false,
        skillGapProgress: courseAssessment.skillGapProgress || 0,
      };
    },
  );

  return coursesWithStatus;
};

export const updateCourseTopics = async (
  userId: string,
  courseName: string,
  topics: string[]
): Promise<void> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const userCourses = userData.courses || [];

  const courseIndex = userCourses.findIndex((c: any) => {
    const cName = c.basicInfo?.name || c;
    return cName === courseName;
  });

  if (courseIndex === -1) {
    throw new Error("Course not found");
  }

  userCourses[courseIndex].topics = topics;
  
  await updateDoc(doc(db, "users", userId), {
    courses: userCourses,
  });
};

export const updateAssessmentResults = async (
  userId: string,
  courseName: string,
  results: any
): Promise<void> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const assessments = userData.assessments || {};

  assessments[courseName] = {
    status: "completed",
    completedAt: new Date().toISOString(),
    score: results.score,
    skillGaps: results.skillGaps || [],
    topicPerformance: results.topicPerformance,
    totalQuestions: results.totalQuestions,
    correctAnswers: results.correctAnswers,
    skillGapProgress: 0,
    canReassess: false,
  };

  await updateDoc(doc(db, "users", userId), {
    assessments: assessments,
  });
};