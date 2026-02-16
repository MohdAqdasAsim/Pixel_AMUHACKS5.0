/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Target,
  Clock,
  BookOpen,
  Brain,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../services/config";
import { updateProfile } from "firebase/auth";
import type { UserProfileData } from "../../types";
import {
  SEMESTER_OPTIONS,
  EXPERIENCE_LEVELS,
  WEEKLY_HOURS_OPTIONS,
  PART_TIME_WORK_OPTIONS,
  LEARNING_STYLES,
  STRESS_LEVELS,
} from "../../constants/onboarding";

const SkeletonCard = () => (
  <div className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 bg-gray-700 rounded"></div>
      <div className="h-5 bg-gray-700 rounded w-32"></div>
    </div>
    <div className="space-y-4">
      <div>
        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-12 bg-gray-700 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-12 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const AccountPreferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [originalData, setOriginalData] = useState({
    name: "",
    major: "",
    semester: "",
    institution: "",
    targetGPA: "",
    priorExperience: "",
    strongestSkill: "",
    hoursAvailable: "",
    partTimeWork: "",
    stressLevel: "",
    fallingBehind: false,
    learningStyle: [] as string[],
  });

  const [profileData, setProfileData] = useState({
    name: "",
    major: "",
    semester: "",
    institution: "",
    targetGPA: "",
    priorExperience: "",
    strongestSkill: "",
    hoursAvailable: "",
    partTimeWork: "",
    stressLevel: "",
    fallingBehind: false,
    learningStyle: [] as string[],
  });

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      setLoading(true);
      setError("");

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfileData;

          const loadedData = {
            name: data.demographics?.name || "",
            major: data.demographics?.major || "",
            semester: data.demographics?.semester || "",
            institution: data.demographics?.institution || "",
            targetGPA: data.goals?.targetGPA || "",
            priorExperience: data.skillAssessment?.priorExperience || "",
            strongestSkill: data.skillAssessment?.strongestSkill || "",
            hoursAvailable: data.constraints?.hoursAvailable || "",
            partTimeWork: data.constraints?.partTimeWork || "",
            stressLevel: data.psychologicalFactors?.stressLevel || "",
            fallingBehind: data.psychologicalFactors?.fallingBehind || false,
            learningStyle: data.learningPreferences?.learningStyle || [],
          };

          setProfileData(loadedData);
          setOriginalData(loadedData);
          setHasChanges(false);
        }
      } catch (error: unknown) {
        console.error("Error loading profile:", error);
        setError("Unable to load your profile. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  useEffect(() => {
    const arraysEqual = (a: string[], b: string[]) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    const changed =
      profileData.name !== originalData.name ||
      profileData.major !== originalData.major ||
      profileData.semester !== originalData.semester ||
      profileData.institution !== originalData.institution ||
      profileData.targetGPA !== originalData.targetGPA ||
      profileData.priorExperience !== originalData.priorExperience ||
      profileData.strongestSkill !== originalData.strongestSkill ||
      profileData.hoursAvailable !== originalData.hoursAvailable ||
      profileData.partTimeWork !== originalData.partTimeWork ||
      profileData.stressLevel !== originalData.stressLevel ||
      profileData.fallingBehind !== originalData.fallingBehind ||
      !arraysEqual(profileData.learningStyle, originalData.learningStyle);

    setHasChanges(changed);
  }, [profileData, originalData]);

  const getErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
      return "Unable to save changes. Please try again.";
    }

    const errorMessage = error.message.toLowerCase();
    const errorCode = (error as any).code;

    if (errorCode === "auth/requires-recent-login") {
      return "For security, please sign out and sign in again before updating your email.";
    }
    if (errorCode === "auth/email-already-in-use") {
      return "This email is already in use by another account.";
    }
    if (errorCode === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }
    if (errorCode === "auth/operation-not-allowed") {
      return "This operation is not allowed. Please contact support.";
    }

    if (errorMessage.includes("permission")) {
      return "You don't have permission to update this profile.";
    }
    if (errorMessage.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (errorMessage.includes("quota")) {
      return "Storage limit reached. Please contact support.";
    }

    return "Unable to save changes. Please try again.";
  };

  const updateField = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const toggleLearningStyle = (style: string) => {
    if (profileData.learningStyle.includes(style)) {
      updateField(
        "learningStyle",
        profileData.learningStyle.filter((s) => s !== style),
      );
    } else {
      updateField("learningStyle", [...profileData.learningStyle, style]);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError("You must be signed in to save changes.");
      return;
    }

    if (!profileData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!profileData.major.trim()) {
      setError("Major is required.");
      return;
    }
    if (!profileData.semester) {
      setError("Semester is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        "demographics.name": profileData.name,
        "demographics.major": profileData.major,
        "demographics.semester": profileData.semester,
        "demographics.institution": profileData.institution,
        "goals.targetGPA": profileData.targetGPA,
        "skillAssessment.priorExperience": profileData.priorExperience,
        "skillAssessment.strongestSkill": profileData.strongestSkill,
        "constraints.hoursAvailable": profileData.hoursAvailable,
        "constraints.partTimeWork": profileData.partTimeWork,
        "psychologicalFactors.stressLevel": profileData.stressLevel,
        "psychologicalFactors.fallingBehind":
          profileData.fallingBehind === true,
        "learningPreferences.learningStyle": profileData.learningStyle,
      });

      if (user.displayName !== profileData.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.name,
        });
      }

      setSuccess("Profile updated successfully!");

      setOriginalData(profileData);
      setHasChanges(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !auth.currentUser) {
      setDeleteError("You must be signed in to delete your account.");
      return;
    }

    if (deleteConfirmText !== "delete my account") {
      setDeleteError('Please type "delete my account" to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });

      await auth.currentUser.delete();
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        setDeleteError("Unable to delete account. Please try again.");
        return;
      }

      const errorCode = (error as any).code;

      if (errorCode === "auth/requires-recent-login") {
        setDeleteError(
          "For security, please sign out and sign in again before deleting your account.",
        );
      } else {
        setDeleteError("Unable to delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const DEFAULT_AVATAR =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE4IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+CjxwYXRoIGQ9Ik0yMCA4NUMyMCA2OC40MzE1IDMzLjQzMTUgNTUgNTAgNTVDNjYuNTY4NSA1NSA4MCA2OC40MzE1IDgwIDg1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCIgeTI9IjEwMCI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMjhDQzAiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDI3OUE2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+";

  const getUserPhotoURL = () => {
    if (user?.photoURL && !imageError) {
      return user.photoURL;
    }
    return DEFAULT_AVATAR;
  };

  const hasProfilePhoto = user?.photoURL && !imageError;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E131C] py-4 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 sm:h-9 bg-gray-700 rounded w-48 sm:w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-64 sm:w-80 animate-pulse"></div>
          </div>

          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E131C] py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Account Preferences
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Manage your profile information and learning preferences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-[#028CC0] sm:w-5 sm:h-5" />
            Profile Picture
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-[#028CC0] to-[#0279A6] flex items-center justify-center ring-4 ring-[#028CC0]/20 overflow-hidden shrink-0">
              <img
                src={getUserPhotoURL()}
                alt={profileData.name || "Profile"}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-300 mb-1">
                {hasProfilePhoto
                  ? "Your profile picture from Google"
                  : "Default profile picture"}
              </p>
              <p className="text-xs text-gray-500">
                {hasProfilePhoto
                  ? "Sign in with Google to update your profile picture"
                  : "Sign in with Google to add a custom profile picture"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-[#028CC0] sm:w-5 sm:h-5" />
            Personal Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-[#1A1F2C] border border-gray-700/60 rounded-lg text-gray-400 cursor-not-allowed text-sm sm:text-base"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-[#028CC0] sm:w-5 sm:h-5" />
            Academic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Major or Program *
              </label>
              <input
                type="text"
                value={profileData.major}
                onChange={(e) => updateField("major", e.target.value)}
                placeholder="e.g., Computer Science"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Current Semester *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {SEMESTER_OPTIONS.map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => updateField("semester", sem)}
                    className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                      profileData.semester === sem
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-white text-xs sm:text-sm font-medium">
                      {sem}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                University/Institution
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={profileData.institution}
                  onChange={(e) => updateField("institution", e.target.value)}
                  placeholder="Enter your institution name"
                  className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target size={18} className="text-[#028CC0] sm:w-5 sm:h-5" />
            Goals & Skills
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Target GPA this semester
              </label>
              <input
                type="text"
                value={profileData.targetGPA}
                onChange={(e) => updateField("targetGPA", e.target.value)}
                placeholder="e.g., 9.0, 9.5, 9.8"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Experience with foundational concepts
              </label>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {EXPERIENCE_LEVELS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("priorExperience", option.value)}
                    className={`text-left p-3 sm:p-4 rounded-lg border transition-all ${
                      profileData.priorExperience === option.value
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-medium text-white text-sm sm:text-base">
                      {option.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Strongest subject or skill area
              </label>
              <div className="relative">
                <Brain
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={profileData.strongestSkill}
                  onChange={(e) =>
                    updateField("strongestSkill", e.target.value)
                  }
                  placeholder="e.g., Mathematics, Writing"
                  className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0] transition-colors text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#028CC0] sm:w-5 sm:h-5" />
            Time & Commitments
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Weekly hours for skill-building
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {WEEKLY_HOURS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateField("hoursAvailable", option)}
                    className={`p-3 sm:p-4 rounded-lg border transition-all ${
                      profileData.hoursAvailable === option
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-white text-xs sm:text-sm font-medium">
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Part-time work
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {PART_TIME_WORK_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateField("partTimeWork", option)}
                    className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                      profileData.partTimeWork === option
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-white text-xs sm:text-sm font-medium">
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Current stress level
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {STRESS_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField("stressLevel", level)}
                    className={`p-2.5 sm:p-4 rounded-lg border transition-all ${
                      profileData.stressLevel === level
                        ? "bg-[#028CC0]/10 border-[#028CC0]"
                        : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-white text-xs sm:text-sm font-medium">
                      {level}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <span>Not stressed</span>
                <span className="hidden sm:inline">Very stressed</span>
                <span className="sm:hidden">Very</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Feeling behind in courses?
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => updateField("fallingBehind", true)}
                  className={`p-3 sm:p-4 rounded-lg border transition-all ${
                    profileData.fallingBehind === true
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">Yes</div>
                </button>
                <button
                  type="button"
                  onClick={() => updateField("fallingBehind", false)}
                  className={`p-3 sm:p-4 rounded-lg border transition-all ${
                    profileData.fallingBehind === false
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-sm font-medium">No</div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-[#028CC0] sm:w-5 sm:h-5" />
            Learning Preferences
          </h2>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              How do you learn best?{" "}
              <span className="text-gray-500 text-xs">
                (Select all that apply)
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {LEARNING_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleLearningStyle(style)}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-all text-left ${
                    profileData.learningStyle.includes(style)
                      ? "bg-[#028CC0]/10 border-[#028CC0]"
                      : "bg-[#2B303B] border-gray-700/60 hover:border-gray-600"
                  }`}
                >
                  <div className="text-white text-xs sm:text-sm font-medium">
                    {style}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm p-3 sm:p-4 rounded-lg">
              <AlertCircle
                size={16}
                className="shrink-0 mt-0.5 sm:w-4.5 sm:h-4.5"
              />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs sm:text-sm p-3 sm:p-4 rounded-lg">
              <CheckCircle
                size={16}
                className="shrink-0 mt-0.5 sm:w-4.5 sm:h-4.5"
              />
              <span>{success}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#242833] border border-red-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
            Danger Zone
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Once you delete your account, there is no going back. All your data,
            courses, assessments, and progress will be permanently deleted.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={16} className="sm:w-4.5 sm:h-4.5" />
            Delete My Account
          </button>
        </motion.div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#242833] border border-red-500/30 rounded-xl p-4 sm:p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="text-red-400" size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Delete Account
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                    setDeleteError("");
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 text-xs sm:text-sm">
                  This will permanently delete:
                </p>
                <ul className="text-xs sm:text-sm text-gray-400 space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Your profile and account information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>All courses and academic data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Assessment history and skill gaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Action plans and progress tracking</span>
                  </li>
                </ul>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-300 mb-2">
                    Type{" "}
                    <span className="font-mono text-red-400">
                      delete my account
                    </span>{" "}
                    to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="delete my account"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    autoComplete="off"
                  />
                </div>

                {deleteError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm p-3 rounded-lg"
                  >
                    <AlertCircle
                      size={14}
                      className="shrink-0 mt-0.5 sm:w-4 sm:h-4"
                    />
                    <span>{deleteError}</span>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText("");
                      setDeleteError("");
                    }}
                    disabled={isDeleting}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#2B303B] text-white rounded-lg text-sm font-medium hover:bg-[#353A47] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={
                      isDeleting || deleteConfirmText !== "delete my account"
                    }
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin sm:w-4 sm:h-4"
                        />
                        <span className="hidden sm:inline">Deleting...</span>
                        <span className="sm:hidden">Deleting</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Delete Account</span>
                        <span className="sm:hidden">Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-end gap-4 sticky bottom-4 sm:static"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin sm:w-4.5 sm:h-4.5"
                  />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Saving</span>
                </>
              ) : (
                <>
                  <Save size={16} className="sm:w-4.5 sm:h-4.5" />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AccountPreferences;
