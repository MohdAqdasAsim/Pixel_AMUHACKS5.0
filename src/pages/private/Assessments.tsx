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
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AssessmentTest, AssessmentResults } from "../../components";
import {
  fetchUserCourses,
  updateCourseTopics,
  updateAssessmentResults,
} from "../../services/common/assessment";
import type { Course, AssessmentConfig } from "../../types";

const SkeletonStatCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm animate-pulse"
  >
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-700/50" />
      <div className="h-3 w-12 sm:w-16 bg-gray-700/50 rounded" />
    </div>
    <div className="h-8 sm:h-10 bg-gray-700/50 rounded w-12 sm:w-16 mb-1" />
    <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-20 sm:w-24" />
  </motion.div>
);

interface CourseSelectorProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

const CourseSelector = ({ courses, onSelectCourse }: CourseSelectorProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] sm:text-xs font-medium border border-green-500/20 whitespace-nowrap">
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span className="hidden xs:inline sm:hidden">Done</span>
            <span className="xs:hidden sm:inline">Completed</span>
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] sm:text-xs font-medium border border-blue-500/20 whitespace-nowrap">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span className="hidden xs:inline">Active</span>
            <span className="xs:hidden sm:inline">In Progress</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-[10px] sm:text-xs font-medium border border-yellow-500/20 whitespace-nowrap">
            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            Pending
          </span>
        );
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-6 sm:p-8 lg:p-12 text-center">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-1.5 sm:mb-2">
          No courses found
        </h3>
        <p className="text-xs sm:text-sm lg:text-base text-gray-400 max-w-md mx-auto">
          Add courses from the Courses page to start taking assessments
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0 w-full">
      <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#028CC0] shrink-0" />
        <span className="truncate">Your Courses</span>
      </h2>

      <div className="grid gap-2.5 sm:gap-3 lg:gap-4 w-full">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => onSelectCourse(course)}
            className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:border-[#028CC0]/50 hover:shadow-lg hover:shadow-[#028CC0]/10 transition-all duration-200 group cursor-pointer relative min-w-0"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                <div className="bg-linear-to-br from-[#028CC0]/20 to-[#0279A6]/20 p-1.5 sm:p-2 lg:p-3 rounded-lg group-hover:from-[#028CC0]/30 group-hover:to-[#0279A6]/30 transition-all border border-[#028CC0]/30 shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#028CC0]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 lg:gap-3 mb-1.5 sm:mb-2">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white group-hover:text-[#028CC0] transition-colors truncate leading-tight">
                      {course.name}
                    </h3>
                    {getStatusBadge(course.status)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 lg:gap-6 text-[10px] sm:text-xs lg:text-sm text-gray-400">
                    {course.lastAssessed && (
                      <span className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 shrink-0" />
                        <span className="truncate">
                          <span className="hidden sm:inline">
                            Last assessed:{" "}
                          </span>
                          {new Date(course.lastAssessed).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year:
                                window.innerWidth >= 640
                                  ? "numeric"
                                  : "2-digit",
                            },
                          )}
                        </span>
                      </span>
                    )}
                    {course.skillGapsCount > 0 && (
                      <span className="flex items-center gap-1 sm:gap-1.5 text-yellow-400 min-w-0">
                        <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 shrink-0" />
                        <span className="truncate">
                          {course.skillGapsCount} skill gap
                          {course.skillGapsCount !== 1 ? "s" : ""}
                          <span className="hidden sm:inline"> identified</span>
                        </span>
                      </span>
                    )}
                  </div>

                  {course.skillGapsCount > 0 && (
                    <div className="mt-2 sm:mt-3">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 mb-1">
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                          <span className="hidden xs:inline">
                            Skill Gap Resolution
                          </span>
                          <span className="xs:hidden">Progress</span>
                        </span>
                        <span className="font-semibold text-blue-400">
                          {Math.round(course.skillGapProgress || 0)}%
                        </span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-[#2B303B] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${course.skillGapProgress || 0}%`,
                          }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.05 + 0.2,
                          }}
                          className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-1 shrink-0">
                <div className="p-1.5 sm:p-2 hover:bg-[#2B303B] rounded-lg transition-colors group/arrow">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover/arrow:text-[#028CC0] group-hover/arrow:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Assessments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<unknown>(null);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    topics: [],
    scope: "entire",
    isReassessment: false,
  });

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTopicSelectionModal, setShowTopicSelectionModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  const [courseTopics, setCourseTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [selectedScope, setSelectedScope] = useState<"entire" | "selected">(
    "entire",
  );

  useEffect(() => {
    loadUserCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUserCourses = async () => {
    if (!user) return;

    try {
      const fetchedCourses = await fetchUserCourses(user.uid);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCourseTopics(course.topics || []);
    setSelectedTopics([]);
    setSelectedScope("entire");
    setShowCourseModal(true);
  };

  const handleOpenTopicSelection = () => {
    setShowCourseModal(false);
    setShowTopicSelectionModal(true);
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim() || !selectedCourse || !user) return;

    const trimmedTopic = newTopic.trim();
    if (courseTopics.includes(trimmedTopic)) {
      alert("This topic already exists!");
      return;
    }

    const updatedTopics = [...courseTopics, trimmedTopic];
    setCourseTopics(updatedTopics);
    setNewTopic("");

    try {
      await updateCourseTopics(user.uid, selectedCourse.name, updatedTopics);
    } catch (error) {
      console.error("Error adding topic:", error);
      alert("Failed to add topic. Please try again.");
    }
  };

  const handleRemoveTopic = async (topic: string) => {
    if (!selectedCourse || !user) return;

    const updatedTopics = courseTopics.filter((t) => t !== topic);
    setCourseTopics(updatedTopics);
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));

    try {
      await updateCourseTopics(user.uid, selectedCourse.name, updatedTopics);
    } catch (error) {
      console.error("Error removing topic:", error);
      alert("Failed to remove topic. Please try again.");
    }
  };

  const handleToggleTopicSelection = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const handleStartAssessment = () => {
    const isReassessment = selectedCourse?.canReassess || false;

    setAssessmentConfig({
      topics: selectedScope === "selected" ? selectedTopics : [],
      scope: selectedScope,
      isReassessment,
    });
    setShowTopicSelectionModal(false);
    setAssessmentStarted(true);
  };

  const handleAssessmentComplete = async (results: unknown) => {
    setAssessmentResults(results);
    setAssessmentCompleted(true);
    setAssessmentStarted(false);

    if (user && selectedCourse) {
      try {
        await updateAssessmentResults(user.uid, selectedCourse.name, results);
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
    setSelectedTopics([]);
    setSelectedScope("entire");
    setShowCourseModal(false);
    setShowTopicSelectionModal(false);
    loadUserCourses();
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0A0E14] overflow-x-hidden overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-1 h-8 sm:h-10 lg:h-12 bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-400 rounded-full" />
                <div className="flex-1 space-y-1.5 sm:space-y-2">
                  <div className="h-2.5 sm:h-3 bg-gray-700/50 rounded w-24 sm:w-32 animate-pulse" />
                  <div className="h-8 sm:h-10 bg-gray-700/50 rounded w-36 sm:w-48 animate-pulse" />
                </div>
              </div>
              <div className="h-5 sm:h-6 bg-gray-700/50 rounded w-48 sm:w-64 ml-3 sm:ml-4 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
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

  return (
    <div className="h-full bg-[#0A0E14] overflow-x-hidden overflow-y-auto no-scrollbar pb-18 lg:pb-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4 lg:gap-6 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
              <div className="w-1 h-8 sm:h-10 lg:h-12 bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-400 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-emerald-400 uppercase mb-0.5 sm:mb-1">
                  Skill Analysis
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight truncate">
                  Assessments
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 ml-3 sm:ml-4 line-clamp-2">
              Identify and track your skill gaps through adaptive testing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all min-w-0"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase tracking-wider">
                Total
              </span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">
              {courses.length}
            </p>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
              Active courses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 backdrop-blur-sm hover:border-yellow-500/30 transition-all min-w-0"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase tracking-wider">
                Pending
              </span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">
              {courses.filter((c) => c.status === "pending").length}
            </p>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
              Awaiting assessment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all min-w-0"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase tracking-wider">
                Done
              </span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">
              {courses.filter((c) => c.status === "completed").length}
            </p>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
              Assessments completed
            </p>
          </motion.div>
        </div>

        <div className="min-w-0 w-full">
          <CourseSelector
            courses={courses}
            onSelectCourse={handleCourseSelect}
          />
        </div>

        <AnimatePresence>
          {showCourseModal && selectedCourse && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col mb-14 lg:mb-0"
              >
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-700/50 shrink-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {selectedCourse.name}
                  </h3>
                  <button
                    onClick={() => setShowCourseModal(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar">
                  {selectedCourse.skillGapsCount > 0 && (
                    <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-white">
                            Skill Gap Resolution
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-blue-400">
                          {Math.round(selectedCourse.skillGapProgress || 0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedCourse.skillGapProgress || 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {selectedCourse.skillGapsCount} total skill gaps •{" "}
                        {Math.round(
                          (selectedCourse.skillGapsCount *
                            (selectedCourse.skillGapProgress || 0)) /
                            100,
                        )}{" "}
                        fixed
                      </p>

                      {selectedCourse.canReassess && (
                        <div className="mt-2 flex items-center gap-1.5 text-emerald-400 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-semibold">
                            All skill gaps fixed! Ready for reassessment
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                    <div className="flex-1 flex items-center">
                      <p className="text-gray-400 text-lg sm:text-sm">
                        {selectedCourse.canReassess
                          ? "Verify your mastery through reassessment"
                          : "Assess your current skill level"}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      {selectedCourse.canReassess ? (
                        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                      ) : (
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
                    <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg p-2.5 sm:p-3 hover:border-blue-500/50 transition-all">
                      <div className="flex flex-col gap-1 mb-1.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-blue-500/20 flex items-center justify-center mx-auto">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-300 text-center">
                          Duration
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-white text-center">
                        15-20
                        <span className="text-[10px] sm:text-xs font-normal text-gray-400 ml-0.5">
                          {" "}
                          min
                        </span>
                      </p>
                    </div>

                    <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-lg p-2.5 sm:p-3 hover:border-purple-500/50 transition-all">
                      <div className="flex flex-col gap-1 mb-1.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-purple-500/20 flex items-center justify-center mx-auto">
                          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-300 text-center">
                          Questions
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-white text-center">
                        15-20
                      </p>
                    </div>

                    <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-lg p-2.5 sm:p-3 hover:border-emerald-500/50 transition-all">
                      <div className="flex flex-col gap-1 mb-1.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-emerald-500/20 flex items-center justify-center mx-auto">
                          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-300 text-center">
                          Adaptive
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-white text-center">
                        Yes
                      </p>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      What to expect
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-1.5 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 group-hover:scale-150 transition-transform shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300">
                          Questions adapt to your skill level in real-time
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 group-hover:scale-150 transition-transform shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300">
                          Immediate feedback on your performance
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 group-hover:scale-150 transition-transform shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300">
                          {selectedCourse.canReassess
                            ? "Verify mastery of previously weak areas"
                            : "Personalized action plan based on results"}
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 group-hover:scale-150 transition-transform shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300">
                          Progress saved automatically
                        </span>
                      </li>
                    </ul>
                  </div>

                  {!selectedCourse.canReassess && (
                    <div className="bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-3 sm:p-4 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm text-yellow-200 font-semibold mb-0.5">
                            Tips for best results
                          </p>
                          <p className="text-[10px] sm:text-xs text-yellow-200/80">
                            Find a quiet place, avoid distractions, and answer
                            honestly - this helps us identify your actual skill
                            gaps accurately.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!selectedCourse.canReassess && (
                    <button
                      onClick={() => {
                        setShowCourseModal(false);
                        setShowFileUploadModal(true);
                      }}
                      className="w-full bg-linear-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 text-white py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:border-gray-500/50 hover:bg-gray-700/60 transition-all duration-200 flex items-center justify-center gap-1.5 group"
                    >
                      <Upload className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                      <span>Upload Study Materials</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-2.5 sm:gap-3 p-4 sm:p-5 border-t border-gray-700/50 shrink-0">
                  <button
                    onClick={() => setShowCourseModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOpenTopicSelection}
                    className="flex-1 px-2 py-1 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition flex items-center justify-center gap-1.5 text-sm"
                  >
                    {selectedCourse.canReassess ? (
                      <>
                        <RotateCcw className="w-4 h-4 shrink-0" />
                        <span>Reassess</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 shrink-0" />
                        <span>Start Assessment</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTopicSelectionModal && selectedCourse && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
              >
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-700/50 shrink-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Configure{" "}
                      {selectedCourse.canReassess
                        ? "Reassessment"
                        : "Assessment"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                      {selectedCourse.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTopicSelectionModal(false);
                      setShowCourseModal(true);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar">
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-300 mb-2">
                      Assessment Scope
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedScope("entire")}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
                          selectedScope === "entire"
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-gray-700/60 bg-gray-800/50 hover:border-gray-600"
                        }`}
                      >
                        <BookOpen
                          className={`w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 mx-auto ${
                            selectedScope === "entire"
                              ? "text-emerald-400"
                              : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                            selectedScope === "entire"
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          Entire Subject
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 line-clamp-2">
                          Cover all topics in {selectedCourse.name}
                        </p>
                      </button>

                      <button
                        onClick={() => setSelectedScope("selected")}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
                          selectedScope === "selected"
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-gray-700/60 bg-gray-800/50 hover:border-gray-600"
                        }`}
                      >
                        <Target
                          className={`w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 mx-auto ${
                            selectedScope === "selected"
                              ? "text-emerald-400"
                              : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                            selectedScope === "selected"
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          Selected Topics
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400">
                          Focus on specific topics only
                        </p>
                      </button>
                    </div>
                  </div>

                  {selectedScope === "selected" && (
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Manage Topics
                      </label>

                      <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="e.g., Binary Trees"
                          className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700/60 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleAddTopic();
                          }}
                        />
                        <button
                          onClick={handleAddTopic}
                          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {courseTopics.length > 0 ? (
                        <div className="space-y-1.5 sm:space-y-2">
                          <p className="text-[9px] sm:text-[10px] text-gray-400">
                            Available topics ({courseTopics.length}):
                          </p>
                          <div className="space-y-1 sm:space-y-1.5 max-h-40 sm:max-h-48 overflow-y-auto no-scrollbar">
                            {courseTopics.map((topic) => (
                              <div
                                key={topic}
                                className={`flex items-center justify-between px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                                  selectedTopics.includes(topic)
                                    ? "border-emerald-500 bg-emerald-500/10"
                                    : "border-gray-700/60 bg-gray-800/50 hover:border-gray-600"
                                }`}
                              >
                                <div
                                  onClick={() =>
                                    handleToggleTopicSelection(topic)
                                  }
                                  className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0"
                                >
                                  <div
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                      selectedTopics.includes(topic)
                                        ? "border-emerald-500 bg-emerald-500"
                                        : "border-gray-600"
                                    }`}
                                  >
                                    {selectedTopics.includes(topic) && (
                                      <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                                    )}
                                  </div>
                                  <span className="text-[10px] sm:text-xs text-white truncate">
                                    {topic}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveTopic(topic)}
                                  className="text-gray-400 hover:text-red-400 transition-colors ml-1.5 sm:ml-2 p-0.5 shrink-0"
                                >
                                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] sm:text-xs text-gray-400 bg-gray-800/50 border border-gray-700/60 rounded-lg p-2.5 sm:p-3 text-center">
                          No topics added yet. Add topics above to get started.
                        </p>
                      )}

                      {selectedScope === "selected" &&
                        selectedTopics.length === 0 &&
                        courseTopics.length > 0 && (
                          <p className="text-[10px] sm:text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 sm:p-2.5 flex items-start gap-1 sm:gap-1.5 mt-2">
                            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 shrink-0" />
                            <span className="text-[9px] sm:text-[10px]">
                              Select at least one topic or choose "Entire
                              Subject"
                            </span>
                          </p>
                        )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 sm:gap-3 p-4 sm:p-5 border-t border-gray-700/50 shrink-0">
                  <button
                    onClick={() => {
                      setShowTopicSelectionModal(false);
                      setShowCourseModal(true);
                    }}
                    className="flex-1 px-2 py-1 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartAssessment}
                    disabled={
                      selectedScope === "selected" &&
                      (courseTopics.length === 0 || selectedTopics.length === 0)
                    }
                    className="flex-1 px-3 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
                  >
                    {selectedCourse.canReassess
                      ? "Start Reassessment"
                      : "Start Assessment"}
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFileUploadModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-5 sm:p-6 max-w-md w-full"
              >
                <div className="bg-linear-to-br from-emerald-500/20 to-cyan-500/20 p-4 sm:p-5 rounded-xl mb-5 border border-emerald-500/30">
                  <Upload className="w-11 h-11 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
                    Coming Soon!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 text-center">
                    Upload your study materials (PDFs, notes, slides) and we'll
                    generate personalized quiz questions from them. This feature
                    will be available in the next update!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowFileUploadModal(false);
                    setShowCourseModal(true);
                  }}
                  className="w-full px-4 py-2.5 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition"
                >
                  Got it!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessments;
