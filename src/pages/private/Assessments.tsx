/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  BookOpen,
  Plus,
  Upload,
  X,
  ChevronRight,
  Brain,
  Zap,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  AssessmentTest,
  AssessmentResults,
  CourseSelector,
} from "../../components";

type AssessmentStatus = "pending" | "in-progress" | "completed";

interface Course {
  id: string;
  name: string;
  lastAssessed?: Date;
  nextAssessment?: Date;
  status: AssessmentStatus;
  skillGapsCount: number;
  completionRate: number;
}

interface AssessmentConfig {
  topics: string[];
  scope: "entire" | "selected";
}

const Assessments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    topics: [],
    scope: "entire",
  });

  // Modal states
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showTopicSelectionModal, setShowTopicSelectionModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [editedCourseName, setEditedCourseName] = useState("");

  // Topic selection states
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [selectedScope, setSelectedScope] = useState<"entire" | "selected">(
    "entire",
  );

  useEffect(() => {
    fetchUserCourses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserCourses = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userCourses = userData.courses || [];
        const assessments = userData.assessments || {};

        const coursesWithStatus: Course[] = userCourses.map(
          (courseName: string, index: number) => {
            const courseAssessment = assessments[courseName] || {};
            return {
              id: `course-${index}`,
              name: courseName,
              lastAssessed: courseAssessment.completedAt
                ? new Date(courseAssessment.completedAt)
                : undefined,
              nextAssessment: undefined,
              status: courseAssessment.status || "pending",
              skillGapsCount: courseAssessment.skillGaps?.length || 0,
              completionRate: courseAssessment.score || 0,
            };
          },
        );

        setCourses(coursesWithStatus);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!user || !newCourseName.trim()) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentCourses = userData.courses || [];

        if (currentCourses.includes(newCourseName.trim())) {
          alert("This course already exists!");
          return;
        }

        const updatedCourses = [...currentCourses, newCourseName.trim()];
        await updateDoc(doc(db, "users", user.uid), {
          courses: updatedCourses,
        });

        setNewCourseName("");
        setShowAddCourseModal(false);
        fetchUserCourses();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  const handleEditCourse = async () => {
    if (!user || !editedCourseName.trim() || !courseToEdit) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentCourses = userData.courses || [];

        const courseIndex = currentCourses.indexOf(courseToEdit.name);
        if (courseIndex !== -1) {
          currentCourses[courseIndex] = editedCourseName.trim();

          await updateDoc(doc(db, "users", user.uid), {
            courses: currentCourses,
          });

          setEditedCourseName("");
          setCourseToEdit(null);
          setShowEditCourseModal(false);
          fetchUserCourses();
        }
      }
    } catch (error) {
      console.error("Error editing course:", error);
      alert("Failed to edit course. Please try again.");
    }
  };

  const handleDeleteCourse = async () => {
    if (!user || !courseToDelete) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentCourses = userData.courses || [];

        const updatedCourses = currentCourses.filter(
          (course: string) => course !== courseToDelete.name,
        );

        await updateDoc(doc(db, "users", user.uid), {
          courses: updatedCourses,
        });

        setCourseToDelete(null);
        setShowDeleteConfirm(false);
        fetchUserCourses();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const openEditModal = (course: Course) => {
    setCourseToEdit(course);
    setEditedCourseName(course.name);
    setShowEditCourseModal(true);
  };

  const openDeleteConfirm = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCustomTopics([]);
    setSelectedScope("entire");
  };

  const handleOpenTopicSelection = () => {
    setShowTopicSelectionModal(true);
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !customTopics.includes(newTopic.trim())) {
      setCustomTopics([...customTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setCustomTopics(customTopics.filter((t) => t !== topic));
  };

  const handleStartAssessment = () => {
    setAssessmentConfig({
      topics: customTopics,
      scope: selectedScope,
    });
    setShowTopicSelectionModal(false);
    setAssessmentStarted(true);
  };

  const handleAssessmentComplete = async (results: any) => {
    setAssessmentResults(results);
    setAssessmentCompleted(true);
    setAssessmentStarted(false);

    // Update backend with completion status and skill gaps
    if (user && selectedCourse) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const assessments = userData.assessments || {};

          assessments[selectedCourse.name] = {
            status: "completed",
            completedAt: new Date().toISOString(),
            score: results.score,
            skillGaps: results.skillGaps || [],
            topicPerformance: results.topicPerformance,
            totalQuestions: results.totalQuestions,
            correctAnswers: results.correctAnswers,
          };

          await updateDoc(doc(db, "users", user.uid), {
            assessments: assessments,
          });
        }
      } catch (error) {
        console.error("Error updating assessment results:", error);
      }
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setAssessmentStarted(false);
    setAssessmentCompleted(false);
    setAssessmentResults(null);
    setCustomTopics([]);
    setSelectedScope("entire");
    fetchUserCourses();
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0A0E14] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-wider font-mono">
            LOADING ASSESSMENTS...
          </p>
        </div>
      </div>
    );
  }

  if (assessmentStarted && selectedCourse) {
    return (
      <AssessmentTest
        course={selectedCourse}
        assessmentConfig={assessmentConfig}
        onComplete={handleAssessmentComplete}
        onCancel={handleBackToCourses}
      />
    );
  }

  if (assessmentCompleted && assessmentResults) {
    return (
      <AssessmentResults
        results={assessmentResults}
        course={selectedCourse!}
        onBackToCourses={handleBackToCourses}
      />
    );
  }

  if (selectedCourse) {
    return (
      <div className="h-full bg-[#0A0E14] overflow-auto">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          <button
            onClick={handleBackToCourses}
            className="text-gray-400 hover:text-emerald-400 mb-6 flex items-center gap-2 transition-all group font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to courses
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {selectedCourse.name}
                </h1>
                <p className="text-gray-400 text-lg">
                  Assess your current skill level
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Brain className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            {/* Assessment Info Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Duration
                  </span>
                </div>
                <p className="text-3xl font-bold text-white">15-20 min</p>
              </div>

              <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-5 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Questions
                  </span>
                </div>
                <p className="text-3xl font-bold text-white">15-25</p>
              </div>

              <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Adaptive
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">Yes</p>
              </div>
            </div>

            {/* What to expect */}
            <div className="bg-linear-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                What to expect
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 group">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300">
                    Questions adapt to your skill level in real-time
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300">
                    Immediate feedback on your performance
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300">
                    Personalized action plan based on results
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300">
                    Progress saved automatically - you can pause anytime
                  </span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-semibold mb-1">
                    Tips for best results
                  </p>
                  <p className="text-yellow-200/80 text-sm">
                    Find a quiet place, avoid distractions, and answer honestly
                    - this helps us identify your actual skill gaps accurately.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowFileUploadModal(true)}
                className="flex-1 bg-linear-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 text-white py-4 rounded-xl font-semibold text-lg hover:border-gray-500/50 hover:bg-gray-700/60 transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Upload Study Materials
              </button>

              <button
                onClick={handleOpenTopicSelection}
                className="flex-1 bg-linear-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6" />
                Configure & Start Assessment
              </button>
            </div>
          </motion.div>
        </div>

        {/* Topic Selection Modal */}
        <AnimatePresence>
          {showTopicSelectionModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Configure Assessment
                  </h3>
                  <button
                    onClick={() => setShowTopicSelectionModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Scope Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Assessment Scope
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedScope("entire")}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        selectedScope === "entire"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-gray-700/60 bg-gray-800/50 hover:border-gray-600"
                      }`}
                    >
                      <BookOpen
                        className={`w-7 h-7 mb-3 mx-auto ${
                          selectedScope === "entire"
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-semibold mb-1 ${
                          selectedScope === "entire"
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      >
                        Entire Subject
                      </p>
                      <p className="text-xs text-gray-400">
                        Cover all topics in {selectedCourse.name}
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedScope("selected")}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        selectedScope === "selected"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-gray-700/60 bg-gray-800/50 hover:border-gray-600"
                      }`}
                    >
                      <Target
                        className={`w-7 h-7 mb-3 mx-auto ${
                          selectedScope === "selected"
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-semibold mb-1 ${
                          selectedScope === "selected"
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      >
                        Selected Topics
                      </p>
                      <p className="text-xs text-gray-400">
                        Focus on specific topics only
                      </p>
                    </button>
                  </div>
                </div>

                {/* Topic Input */}
                {selectedScope === "selected" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Add Topics
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="e.g., Binary Trees, Sorting Algorithms"
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleAddTopic();
                        }}
                      />
                      <button
                        onClick={handleAddTopic}
                        className="px-5 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {customTopics.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          Selected topics ({customTopics.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {customTopics.map((topic) => (
                            <div
                              key={topic}
                              className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg group"
                            >
                              <span className="text-sm text-white">
                                {topic}
                              </span>
                              <button
                                onClick={() => handleRemoveTopic(topic)}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedScope === "selected" &&
                      customTopics.length === 0 && (
                        <p className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          Add at least one topic or select "Entire Subject"
                        </p>
                      )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTopicSelectionModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartAssessment}
                    disabled={
                      selectedScope === "selected" && customTopics.length === 0
                    }
                    className="flex-1 px-4 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Start Assessment
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* File Upload Modal */}
        <AnimatePresence>
          {showFileUploadModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="bg-linear-to-br from-emerald-500/20 to-cyan-500/20 p-6 rounded-xl mb-6 border border-emerald-500/30">
                  <Upload className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white text-center mb-2">
                    Coming Soon!
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                    Upload your study materials (PDFs, notes, slides) and we'll
                    generate personalized quiz questions from them. This feature
                    will be available in the next update!
                  </p>
                </div>

                <button
                  onClick={() => setShowFileUploadModal(false)}
                  className="w-full px-4 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition"
                >
                  Got it!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0A0E14] overflow-auto">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-12 bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-400 rounded-full" />
              <div>
                <p className="text-xs font-mono tracking-[0.3em] text-emerald-400 uppercase mb-1">
                  Skill Analysis
                </p>
                <h1 className="text-5xl font-bold text-white tracking-tight">
                  Assessments
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg ml-4">
              Identify your skill gaps through adaptive testing
            </p>
          </div>
          <button
            onClick={() => setShowAddCourseModal(true)}
            className="px-6 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Course
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                Total
              </span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {courses.length}
            </p>
            <p className="text-sm text-gray-500">Active courses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-yellow-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                Pending
              </span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {courses.filter((c) => c.status === "pending").length}
            </p>
            <p className="text-sm text-gray-500">Awaiting assessment</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                Done
              </span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {courses.filter((c) => c.status === "completed").length}
            </p>
            <p className="text-sm text-gray-500">Assessments completed</p>
          </motion.div>
        </div>

        {/* Course List */}
        <CourseSelector
          courses={courses}
          onSelectCourse={handleCourseSelect}
          onEditCourse={openEditModal}
          onDeleteCourse={openDeleteConfirm}
        />

        {/* Modals */}
        {/* Add Course Modal */}
        <AnimatePresence>
          {showAddCourseModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Add New Course
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddCourseModal(false);
                      setNewCourseName("");
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g., Data Structures, Calculus I"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddCourse();
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddCourseModal(false);
                      setNewCourseName("");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCourse}
                    disabled={!newCourseName.trim()}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Course
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Course Modal */}
        <AnimatePresence>
          {showEditCourseModal && courseToEdit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Edit Course</h3>
                  <button
                    onClick={() => {
                      setShowEditCourseModal(false);
                      setCourseToEdit(null);
                      setEditedCourseName("");
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={editedCourseName}
                    onChange={(e) => setEditedCourseName(e.target.value)}
                    placeholder="Enter new course name"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleEditCourse();
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowEditCourseModal(false);
                      setCourseToEdit(null);
                      setEditedCourseName("");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditCourse}
                    disabled={!editedCourseName.trim()}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && courseToDelete && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="bg-linear-to-br from-red-500/20 to-orange-500/20 p-6 rounded-xl mb-6 border border-red-500/30">
                  <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white text-center mb-2">
                    Delete Course?
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                    Are you sure you want to delete "{courseToDelete.name}"?
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCourseToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessments;
