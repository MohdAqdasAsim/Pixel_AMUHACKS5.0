import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  BookOpen,
  Clock,
  Target,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useOnboarding } from "../../contexts/OnboardingContext";
import type {
  OnboardingFormData,
  FormFieldValue,
  CourseFieldValue,
} from "../../types";
import { saveUserProfile } from "../../services/common/onboarding";
import {
  SEMESTER_OPTIONS,
  EXPERIENCE_LEVELS,
  WEEKLY_HOURS_OPTIONS,
  PART_TIME_WORK_OPTIONS,
  PREREQUISITE_OPTIONS,
  YES_NO_OPTIONS,
  LEARNING_STYLES,
  STRESS_LEVELS,
} from "../../constants/onboarding";

interface OnboardingCourse {
  name: string;
  code: string;
  credits: string;
  instructor: string;
  firstExamDate: string;
  dropDeadline: string;
  isPrerequisite: string;
  dependsOn: string[];
  missedClasses: string;
  currentGrade: string;
}

interface CourseCardProps {
  course: OnboardingCourse;
  index: number;
  onRemove: (index: number) => void;
}

const CourseCard = ({ course, index, onRemove }: CourseCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#2B303B] border border-gray-700/60 rounded-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
            <div>
              <span className="text-white font-medium">{course.name}</span>
              {course.code && (
                <span className="text-gray-400 text-sm ml-2">
                  ({course.code})
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-500 hover:text-red-400 transition-colors text-sm font-medium px-3 py-1"
        >
          Remove
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-700/60"
          >
            <div className="p-4 space-y-3 text-sm">
              {course.credits && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Credits:</span>
                  <span className="text-white">{course.credits}</span>
                </div>
              )}
              {course.instructor && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Instructor:</span>
                  <span className="text-white">{course.instructor}</span>
                </div>
              )}
              {course.firstExamDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">First Exam/Assignment:</span>
                  <span className="text-white">{course.firstExamDate}</span>
                </div>
              )}
              {course.dropDeadline && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Drop Deadline:</span>
                  <span className="text-white">{course.dropDeadline}</span>
                </div>
              )}
              {course.isPrerequisite && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Prerequisite:</span>
                  <span className="text-white capitalize">
                    {course.isPrerequisite}
                  </span>
                </div>
              )}
              {course.currentGrade && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Grade:</span>
                  <span className="text-white">{course.currentGrade}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Onboarding = () => {
  const { user } = useAuth();
  const { setIsOnboardingComplete } = useOnboarding();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<OnboardingFormData>({
    name: "",
    major: "",
    semester: "",
    institution: "",
    courses: [],
    currentCourse: {
      name: "",
      code: "",
      credits: "",
      instructor: "",
      firstExamDate: "",
      dropDeadline: "",
      isPrerequisite: "",
      dependsOn: [],
      missedClasses: "",
      currentGrade: "",
    },
    dependsOnInput: "",
    priorityCourse: "",
    priorExperience: "",
    strongestSkill: "",
    weeklyHours: "",
    otherCommitments: "",
    partTimeWork: "",
    studyTime: "",
    targetGPA: "",
    stressLevel: "",
    fallingBehind: "",
    learningStyle: [],
  });

  const getErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
      return "Unable to save your profile. Please check your connection and try again.";
    }

    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes("network")) {
      return "Network error. Please check your internet connection and try again.";
    }
    if (errorMessage.includes("permission")) {
      return "Permission denied. Please sign in again and try once more.";
    }
    if (errorMessage.includes("quota")) {
      return "Storage limit reached. Please contact support for assistance.";
    }
    if (errorMessage.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    if (errorMessage.includes("invalid")) {
      return "Some information is invalid. Please review your entries and try again.";
    }

    return "Unable to complete setup. Please try again or contact support if the issue persists.";
  };

  const updateField = (
    field: keyof OnboardingFormData,
    value: FormFieldValue,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const updateCourseField = (
    field: keyof OnboardingCourse,
    value: CourseFieldValue,
  ) => {
    setFormData((prev) => ({
      ...prev,
      currentCourse: { ...prev.currentCourse, [field]: value },
    }));
    setError("");
  };

  const addCourse = () => {
    if (formData.currentCourse.name.trim()) {
      updateField("courses", [...formData.courses, formData.currentCourse]);
      updateField("currentCourse", {
        name: "",
        code: "",
        credits: "",
        instructor: "",
        firstExamDate: "",
        dropDeadline: "",
        isPrerequisite: "",
        dependsOn: [],
        missedClasses: "",
        currentGrade: "",
      });
    }
  };

  const removeCourse = (index: number) => {
    updateField(
      "courses",
      formData.courses.filter((_, i) => i !== index),
    );
  };

  const toggleLearningStyle = (style: string) => {
    if (formData.learningStyle.includes(style)) {
      updateField(
        "learningStyle",
        formData.learningStyle.filter((s) => s !== style),
      );
    } else {
      updateField("learningStyle", [...formData.learningStyle, style]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.name.trim().length > 0 &&
          formData.major.trim().length > 0 &&
          formData.semester.length > 0
        );
      case 1:
        return formData.courses.length > 0;
      case 2:
        return formData.priorityCourse.length > 0;
      case 3:
        return formData.priorExperience.length > 0;
      case 4:
        return (
          formData.weeklyHours.length > 0 &&
          formData.stressLevel.length > 0 &&
          formData.fallingBehind.length > 0
        );
      case 5:
        return formData.targetGPA.trim().length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError(
        "You must be signed in to complete setup. Please sign in and try again.",
      );
      return;
    }

    if (!canProceed()) {
      setError("Please fill in all required fields before completing setup.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveUserProfile(user.uid, user.email, formData);
      setIsOnboardingComplete(true);
      navigate("/dashboard");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Welcome! Let's get to know you",
      subtitle:
        "We'll build your personalized learning path in just a few steps",
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What's your name? *
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What's your major or program? *
            </label>
            <div className="relative">
              <GraduationCap
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={formData.major}
                onChange={(e) => updateField("major", e.target.value)}
                placeholder="e.g., Computer Science, Biology, Business"
                className="w-full pl-10 pr-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Current semester *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SEMESTER_OPTIONS.map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => updateField("semester", sem)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.semester === sem
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">{sem}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              University/Institution{" "}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => updateField("institution", e.target.value)}
              placeholder="Enter your institution name"
              className="w-full px-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Your current courses",
      subtitle: "Add the courses you're taking this semester",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="bg-[#2B303B] border border-gray-700/60 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Course name *
                </label>
                <input
                  type="text"
                  value={formData.currentCourse.name}
                  onChange={(e) => updateCourseField("name", e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Course code{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.currentCourse.code}
                  onChange={(e) => updateCourseField("code", e.target.value)}
                  placeholder="e.g., CS201"
                  className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Credits{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.currentCourse.credits}
                  onChange={(e) => updateCourseField("credits", e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Instructor name{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.currentCourse.instructor}
                  onChange={(e) =>
                    updateCourseField("instructor", e.target.value)
                  }
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  First exam/assignment date{" "}
                  <span className="text-gray-500 text-xs">(DD/MM/YYYY)</span>
                </label>
                <input
                  type="text"
                  value={formData.currentCourse.firstExamDate}
                  onChange={(e) =>
                    updateCourseField("firstExamDate", e.target.value)
                  }
                  placeholder="e.g., 15/03/2024"
                  className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Drop deadline{" "}
                  <span className="text-gray-500 text-xs">(DD/MM/YYYY)</span>
                </label>
                <input
                  type="text"
                  value={formData.currentCourse.dropDeadline}
                  onChange={(e) =>
                    updateCourseField("dropDeadline", e.target.value)
                  }
                  placeholder="e.g., 31/03/2024"
                  className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-2">
                Is this a prerequisite for other courses?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PREREQUISITE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateCourseField("isPrerequisite", option.value)
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      formData.currentCourse.isPrerequisite === option.value
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#0E131C] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-white text-sm font-medium">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-2">
                Grade (if applicable){" "}
                <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.currentCourse.currentGrade}
                onChange={(e) =>
                  updateCourseField("currentGrade", e.target.value)
                }
                placeholder="e.g., A+, 9.2, 85%"
                className="w-full px-4 py-3 bg-[#0E131C] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
              />
            </div>

            {formData.currentCourse.name.trim() && (
              <button
                type="button"
                onClick={addCourse}
                className="w-full mt-4 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>+</span>
                <span>Add Course</span>
              </button>
            )}
          </div>

          {formData.courses.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm text-gray-400 font-medium">
                Added Courses ({formData.courses.length})
              </label>
              <div className="space-y-2">
                {formData.courses.map((course, index) => (
                  <CourseCard
                    key={index}
                    course={course}
                    index={index}
                    onRemove={removeCourse}
                  />
                ))}
              </div>
            </div>
          )}

          {formData.courses.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Add at least one course to continue
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Priority & concerns",
      subtitle: "Help us understand what matters most",
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Which course worries you the most? *
            </label>
            <select
              value={formData.priorityCourse}
              onChange={(e) => updateField("priorityCourse", e.target.value)}
              className="w-full px-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white focus:outline-none focus:border-[#028CC0] transition-colors [&>option]:bg-[#2B303B] [&>option]:text-white"
            >
              <option value="">Select a course</option>
              {formData.courses.map((course, index) => (
                <option key={index} value={course.name}>
                  {course.name} {course.code && `(${course.code})`}
                </option>
              ))}
              <option value="none">None specifically</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Your current skill level",
      subtitle: "This helps us identify where to focus",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              How would you rate your experience with foundational concepts in
              your field? *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {EXPERIENCE_LEVELS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("priorExperience", option.value)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    formData.priorExperience === option.value
                      ? "bg-[#028CC0]/10 border-[#028CC0] shadow-lg"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What's your strongest subject or skill area?{" "}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.strongestSkill}
              onChange={(e) => updateField("strongestSkill", e.target.value)}
              placeholder="e.g., Mathematics, Writing, Problem-solving"
              className="w-full px-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Time & commitments",
      subtitle: "Help us create a realistic plan for you",
      icon: Clock,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-3">
              How many hours per week can you dedicate to skill-building? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {WEEKLY_HOURS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField("weeklyHours", option)}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.weeklyHours === option
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">{option}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-3">
              Are you working part-time?{" "}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PART_TIME_WORK_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField("partTimeWork", option)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.partTimeWork === option
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">{option}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-3">
              How stressed do you feel about your courses right now? *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STRESS_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateField("stressLevel", level)}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.stressLevel === level
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">{level}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Not stressed</span>
              <span>Very stressed</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-3">
              Do you feel you're falling behind already? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {YES_NO_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("fallingBehind", option.value)}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.fallingBehind === option.value
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Goals & learning style",
      subtitle: "Let's personalize your experience",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Target GPA this semester *
            </label>
            <input
              type="text"
              value={formData.targetGPA}
              onChange={(e) => updateField("targetGPA", e.target.value)}
              placeholder="e.g., 9.0, 9.5, 9.8"
              className="w-full px-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              How do you learn best?{" "}
              <span className="text-gray-500 text-xs">
                (Select all that apply)
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleLearningStyle(style)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    formData.learningStyle.includes(style)
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">{style}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#0E131C]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </span>
          </div>
          <div className="h-2 bg-[#242833] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-[#028CC0] to-[#0279A6]"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="bg-[#242833] border border-gray-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#028CC0]/10 rounded-2xl mb-4"
            >
              <Icon className="text-[#028CC0]" size={32} />
            </motion.div>
            <motion.h1
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
            >
              {currentStepData.title}
            </motion.h1>
            <motion.p
              key={`subtitle-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              {currentStepData.subtitle}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#028CC0] text-white rounded-lg font-semibold hover:bg-[#0279A6] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Setting up..." : "Complete Setup"}
                {!loading && <ChevronRight size={20} />}
              </button>
            )}
          </div>
        </div>

        {currentStep < steps.length - 1 && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(steps.length - 1)}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Skip to final step
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
