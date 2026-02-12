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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/config";
import { useAuth } from "../../contexts/AuthContext";
import { useOnboarding } from "../../contexts/OnboardingContext";

const Onboarding = () => {
  const { user } = useAuth();
  const { setIsOnboardingComplete } = useOnboarding();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    major: "",
    courses: [] as string[],
    courseInput: "",
    priorExperience: "",
    weeklyHours: "",
    primaryConcern: "",
    targetGPA: "",
  });

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const addCourse = () => {
    if (formData.courseInput.trim() && formData.courses.length < 8) {
      updateField("courses", [
        ...formData.courses,
        formData.courseInput.trim(),
      ]);
      updateField("courseInput", "");
    }
  };

  const removeCourse = (index: number) => {
    updateField(
      "courses",
      formData.courses.filter((_, i) => i !== index),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCourse();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length > 0;
      case 1:
        return formData.major.trim().length > 0;
      case 2:
        return formData.courses.length > 0;
      case 3:
        return formData.priorExperience.length > 0;
      case 4:
        return (
          formData.weeklyHours.length > 0 && formData.primaryConcern.length > 0
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: formData.name.trim(),
        major: formData.major.trim(),
        courses: formData.courses,
        priorExperience: formData.priorExperience,
        weeklyHours: formData.weeklyHours,
        primaryConcern: formData.primaryConcern,
        targetGPA: formData.targetGPA,
        onboardingComplete: true,
        createdAt: new Date(),
      });

      setIsOnboardingComplete(true);
      navigate("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
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
              What's your name?
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
        </div>
      ),
    },
    {
      title: "Your academic journey",
      subtitle: "Help us understand your program",
      icon: GraduationCap,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What's your major or program?
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
                autoFocus
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your current courses",
      subtitle: "Add the courses you're taking this semester",
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Course names (press Enter to add)
            </label>
            <div className="relative">
              <BookOpen
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={formData.courseInput}
                onChange={(e) => updateField("courseInput", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Data Structures, Calculus I"
                className="w-full pl-10 pr-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
                autoFocus
              />
            </div>
            {formData.courseInput.trim() && (
              <button
                type="button"
                onClick={addCourse}
                className="mt-2 text-sm text-[#028CC0] hover:text-[#0279A6] transition-colors"
              >
                + Add course
              </button>
            )}
          </div>

          {formData.courses.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">
                Your courses ({formData.courses.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.courses.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between bg-[#2B303B] border border-gray-700/60 rounded-lg px-4 py-2.5"
                  >
                    <span className="text-white text-sm">{course}</span>
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
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
              your field?
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  value: "never",
                  label: "Never encountered",
                  desc: "These topics are new to me",
                },
                {
                  value: "beginner",
                  label: "Beginner",
                  desc: "I've seen them but struggle",
                },
                {
                  value: "comfortable",
                  label: "Comfortable",
                  desc: "I understand the basics",
                },
                {
                  value: "proficient",
                  label: "Proficient",
                  desc: "I'm confident with these",
                },
              ].map((option) => (
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
        </div>
      ),
    },
    {
      title: "Final touches",
      subtitle: "Help us personalize your learning path",
      icon: Clock,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              How many hours per week can you dedicate to skill-building?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["2-5 hours", "5-10 hours", "10-15 hours", "15+ hours"].map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateField("weeklyHours", option)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.weeklyHours === option
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-white text-sm font-medium">
                      {option}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Which course worries you the most?
            </label>
            <select
              value={formData.primaryConcern}
              onChange={(e) => updateField("primaryConcern", e.target.value)}
              className="w-full px-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white focus:outline-none focus:border-[#028CC0] transition-colors"
            >
              <option value="">Select a course</option>
              {formData.courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
              <option value="none">None specifically</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Target GPA this semester (optional)
            </label>
            <input
              type="text"
              value={formData.targetGPA}
              onChange={(e) => updateField("targetGPA", e.target.value)}
              placeholder="e.g., 3.5, 3.8"
              className="w-full px-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors"
            />
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
        className="w-full max-w-2xl"
      >
        {/* Progress bar */}
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

        {/* Main card */}
        <div className="bg-[#242833] border border-gray-700/60 rounded-2xl p-8 shadow-2xl">
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
              className="text-3xl font-bold text-white mb-2"
            >
              {currentStepData.title}
            </motion.h1>
            <motion.p
              key={`subtitle-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
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
              className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-[#028CC0] text-white rounded-lg font-semibold hover:bg-[#0279A6] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Setting up..." : "Complete Setup"}
                {!loading && <ChevronRight size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Skip option */}
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
