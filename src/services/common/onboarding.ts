import { doc, setDoc } from "firebase/firestore";
import { db } from "../config";
import type { OnboardingFormData, UserProfileData } from "../../types";

export const saveUserProfile = async (
  userId: string,
  userEmail: string | null,
  formData: OnboardingFormData
): Promise<void> => {
  const userData: UserProfileData = {
    uid: userId,
    email: userEmail,
    demographics: {
      name: formData.name.trim(),
      major: formData.major.trim(),
      semester: formData.semester,
      institution: formData.institution.trim(),
    },
    courses: formData.courses.map((course) => ({
      basicInfo: {
        name: course.name,
        code: course.code,
        credits: course.credits,
        instructor: course.instructor,
      },
      timeline: {
        firstExamDate: course.firstExamDate,
        dropDeadline: course.dropDeadline,
      },
      dependencies: {
        isPrerequisite: course.isPrerequisite === "yes",
        dependsOn: course.dependsOn,
      },
      currentStatus: {
        missedClasses: course.missedClasses,
        currentGrade: course.currentGrade,
      },
    })),
    constraints: {
      hoursAvailable: formData.weeklyHours,
      partTimeWork: formData.partTimeWork,
      otherCommitments: formData.otherCommitments,
      preferredStudyTime: formData.studyTime,
    },
    goals: {
      targetGPA: formData.targetGPA.trim(),
      priorityCourse: formData.priorityCourse,
    },
    skillAssessment: {
      priorExperience: formData.priorExperience,
      strongestSkill: formData.strongestSkill.trim(),
    },
    psychologicalFactors: {
      stressLevel: formData.stressLevel,
      fallingBehind: formData.fallingBehind === "yes",
    },
    learningPreferences: {
      learningStyle: formData.learningStyle,
    },
    onboardingComplete: true,
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", userId), userData);
};