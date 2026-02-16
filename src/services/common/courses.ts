import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config";
import type { CourseData, CourseWithId } from "../../types";

export const fetchUserCourses = async (userId: string): Promise<CourseWithId[]> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  const courses = userData.courses || [];

  return courses.map((course: CourseData, index: number) => ({
    ...course,
    id: `course-${index}`,
  }));
};

export const addCourse = async (userId: string, newCourse: CourseData): Promise<void> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const currentCourses = userData.courses || [];

  const courseExists = currentCourses.some(
    (course: CourseData) => 
      course.basicInfo.name.toLowerCase() === newCourse.basicInfo.name.toLowerCase()
  );

  if (courseExists) {
    throw new Error("This course already exists!");
  }

  const updatedCourses = [...currentCourses, newCourse];
  await updateDoc(doc(db, "users", userId), {
    courses: updatedCourses,
  });
};

export const updateCourse = async (
  userId: string,
  courseId: string,
  updatedCourse: CourseData
): Promise<void> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const currentCourses = userData.courses || [];

  const courseIndex = parseInt(courseId.split('-')[1]);
  
  if (courseIndex < 0 || courseIndex >= currentCourses.length) {
    throw new Error("Course not found");
  }

  currentCourses[courseIndex] = updatedCourse;

  await updateDoc(doc(db, "users", userId), {
    courses: currentCourses,
  });
};

export const deleteCourse = async (userId: string, courseId: string): Promise<void> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const currentCourses = userData.courses || [];

  const courseIndex = parseInt(courseId.split('-')[1]);
  
  if (courseIndex < 0 || courseIndex >= currentCourses.length) {
    throw new Error("Course not found");
  }

  const updatedCourses = currentCourses.filter((_: CourseData, index: number) => index !== courseIndex);

  await updateDoc(doc(db, "users", userId), {
    courses: updatedCourses,
  });
};

export const addTopicsToCourse = async (
  userId: string,
  courseId: string,
  topics: string[]
): Promise<void> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const currentCourses = userData.courses || [];

  const courseIndex = parseInt(courseId.split('-')[1]);
  
  if (courseIndex < 0 || courseIndex >= currentCourses.length) {
    throw new Error("Course not found");
  }

  const existingTopics = currentCourses[courseIndex].topics || [];
  const uniqueTopics = Array.from(new Set([...existingTopics, ...topics]));

  currentCourses[courseIndex].topics = uniqueTopics;

  await updateDoc(doc(db, "users", userId), {
    courses: currentCourses,
  });
};