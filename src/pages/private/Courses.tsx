import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  X,
  Edit2,
  Trash2,
  GraduationCap,
  AlertCircle,
  ChevronDown,
  Tag,
  Save,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchUserCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../../services/common/courses";
import type { CourseWithId, CourseData, CourseBasicInfo } from "../../types";

type CourseCategory = NonNullable<CourseBasicInfo["category"]>;

const CATEGORIES: { value: CourseCategory; label: string }[] = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "generic", label: "Generic" },
  { value: "other", label: "Other" },
];

const SkeletonCard = () => (
  <div className="bg-linear-to-br from-gray-800/50 to-gray-700/30 border border-gray-700/50 rounded-xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gray-700/50" />
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-700/50" />
        <div className="w-8 h-8 rounded-lg bg-gray-700/50" />
      </div>
    </div>
    <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4" />
    <div className="h-10 bg-gray-700/50 rounded w-full" />
  </div>
);

interface CourseCardProps {
  course: CourseWithId;
  onEdit: (course: CourseWithId) => void;
  onDelete: (course: CourseWithId) => void;
  onManageTopics: (course: CourseWithId) => void;
}

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  onManageTopics,
}: CourseCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryColor = (category?: CourseCategory) => {
    switch (category) {
      case "major":
        return "from-emerald-500/20 to-emerald-500/10 border-emerald-500/30";
      case "minor":
        return "from-blue-500/20 to-blue-500/10 border-blue-500/30";
      case "generic":
        return "from-purple-500/20 to-purple-500/10 border-purple-500/30";
      default:
        return "from-gray-500/20 to-gray-500/10 border-gray-500/30";
    }
  };

  const getCategoryIconColor = (category?: CourseCategory) => {
    switch (category) {
      case "major":
        return "text-emerald-400";
      case "minor":
        return "text-blue-400";
      case "generic":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-linear-to-br ${getCategoryColor(course.basicInfo.category)} border rounded-xl p-6 hover:scale-[1.02] transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${getCategoryColor(course.basicInfo.category)} border flex items-center justify-center`}
        >
          <BookOpen
            className={`w-6 h-6 ${getCategoryIconColor(course.basicInfo.category)}`}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(course)}
            className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-gray-700/50 hover:border-blue-500/50 transition-all group/edit"
            aria-label={`Edit ${course.basicInfo.name}`}
          >
            <Edit2 className="w-4 h-4 text-gray-400 group-hover/edit:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-gray-700/50 hover:border-red-500/50 transition-all group/delete"
            aria-label={`Delete ${course.basicInfo.name}`}
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover/delete:text-red-400" />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
        {course.basicInfo.name}
      </h3>
      {course.basicInfo.code && (
        <p className="text-sm text-gray-400 mb-1">{course.basicInfo.code}</p>
      )}
      <p className="text-xs text-gray-500 capitalize mb-4">
        {course.basicInfo.category || "other"} •{" "}
        {course.basicInfo.credits
          ? `${course.basicInfo.credits} credits`
          : "No credits"}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700/50 hover:border-gray-600/50 transition-all flex items-center justify-center gap-2"
      >
        <span>{expanded ? "Hide" : "Show"} Details</span>
        <ChevronDown
          className={`w-4 h-4 transform transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 mb-4 pt-4 border-t border-gray-700/50 space-y-2 text-sm overflow-hidden"
          >
            {course.basicInfo.instructor && (
              <div className="flex justify-between">
                <span className="text-gray-400">Instructor:</span>
                <span className="text-white">
                  {course.basicInfo.instructor}
                </span>
              </div>
            )}
            {course.timeline.firstExamDate && (
              <div className="flex justify-between">
                <span className="text-gray-400">First Exam:</span>
                <span className="text-white">
                  {course.timeline.firstExamDate}
                </span>
              </div>
            )}
            {course.timeline.dropDeadline && (
              <div className="flex justify-between">
                <span className="text-gray-400">Drop Deadline:</span>
                <span className="text-white">
                  {course.timeline.dropDeadline}
                </span>
              </div>
            )}
            {course.currentStatus.currentGrade && (
              <div className="flex justify-between">
                <span className="text-gray-400">Current Grade:</span>
                <span className="text-white">
                  {course.currentStatus.currentGrade}
                </span>
              </div>
            )}
            {course.topics && course.topics.length > 0 && (
              <div>
                <span className="text-gray-400">
                  Topics ({course.topics.length}):
                </span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {course.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 rounded text-xs text-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => onManageTopics(course)}
        className="w-full mt-2 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-800/50 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2"
      >
        <Tag className="w-4 h-4" />
        Manage Topics ({course.topics?.length || 0})
      </button>
    </motion.div>
  );
};

const Courses = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithId[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    CourseCategory | "all"
  >("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);

  const [courseToEdit, setCourseToEdit] = useState<CourseWithId | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<CourseWithId | null>(
    null,
  );
  const [courseForTopics, setCourseForTopics] = useState<CourseWithId | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
    instructor: "",
    category: "major" as CourseCategory,
    firstExamDate: "",
    dropDeadline: "",
    isPrerequisite: "no",
    currentGrade: "",
  });

  const [newTopic, setNewTopic] = useState("");
  const [topicsToAdd, setTopicsToAdd] = useState<string[]>([]);
  const [topicsToRemove, setTopicsToRemove] = useState<string[]>([]);

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCourses = async () => {
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

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      credits: "",
      instructor: "",
      category: "major",
      firstExamDate: "",
      dropDeadline: "",
      isPrerequisite: "no",
      currentGrade: "",
    });
  };

  const handleAddCourse = async () => {
    if (!user || !formData.name.trim()) return;

    try {
      const newCourse: CourseData = {
        basicInfo: {
          name: formData.name.trim(),
          code: formData.code.trim(),
          credits: formData.credits.trim(),
          instructor: formData.instructor.trim(),
          category: formData.category,
        },
        timeline: {
          firstExamDate: formData.firstExamDate,
          dropDeadline: formData.dropDeadline,
        },
        dependencies: {
          isPrerequisite: formData.isPrerequisite === "yes",
          dependsOn: [],
        },
        currentStatus: {
          missedClasses: "",
          currentGrade: formData.currentGrade.trim(),
        },
        topics: [],
      };

      await addCourse(user.uid, newCourse);
      setShowAddModal(false);
      resetForm();
      loadCourses();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleEditCourse = async () => {
    if (!user || !courseToEdit || !formData.name.trim()) return;

    try {
      const updatedCourse: CourseData = {
        ...courseToEdit,
        basicInfo: {
          name: formData.name.trim(),
          code: formData.code.trim(),
          credits: formData.credits.trim(),
          instructor: formData.instructor.trim(),
          category: formData.category,
        },
        timeline: {
          firstExamDate: formData.firstExamDate,
          dropDeadline: formData.dropDeadline,
        },
        currentStatus: {
          ...courseToEdit.currentStatus,
          currentGrade: formData.currentGrade.trim(),
        },
      };

      await updateCourse(user.uid, courseToEdit.id, updatedCourse);
      setShowEditModal(false);
      setCourseToEdit(null);
      resetForm();
      loadCourses();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (!user || !courseToDelete) return;

    try {
      await deleteCourse(user.uid, courseToDelete.id);
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      loadCourses();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleMarkTopicForRemoval = (topic: string) => {
    setTopicsToRemove((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const openEditModal = (course: CourseWithId) => {
    setCourseToEdit(course);
    setFormData({
      name: course.basicInfo.name,
      code: course.basicInfo.code,
      credits: course.basicInfo.credits,
      instructor: course.basicInfo.instructor,
      category: course.basicInfo.category || "other",
      firstExamDate: course.timeline.firstExamDate,
      dropDeadline: course.timeline.dropDeadline,
      isPrerequisite: course.dependencies.isPrerequisite ? "yes" : "no",
      currentGrade: course.currentStatus.currentGrade,
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (course: CourseWithId) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const openTopicsModal = (course: CourseWithId) => {
    setCourseForTopics(course);
    setTopicsToAdd([]);
    setTopicsToRemove([]);
    setNewTopic("");
    setShowTopicsModal(true);
  };

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim();
    const existingTopics = courseForTopics?.topics || [];

    if (!trimmedTopic) return;

    if (
      existingTopics.includes(trimmedTopic) &&
      !topicsToRemove.includes(trimmedTopic)
    ) {
      alert("This topic already exists in the course");
      return;
    }

    if (topicsToAdd.includes(trimmedTopic)) {
      alert("This topic is already in your add list");
      return;
    }

    setTopicsToAdd([...topicsToAdd, trimmedTopic]);
    setNewTopic("");
  };

  const handleRemoveTopic = (topic: string) => {
    setTopicsToAdd(topicsToAdd.filter((t) => t !== topic));
  };

  const handleSaveTopics = async () => {
    if (!user || !courseForTopics) return;

    try {
      const existingTopics = courseForTopics.topics || [];

      const updatedTopics = existingTopics
        .filter((t) => !topicsToRemove.includes(t))
        .concat(topicsToAdd);

      const updatedCourse: CourseData = {
        ...courseForTopics,
        topics: Array.from(new Set(updatedTopics)),
      };

      await updateCourse(user.uid, courseForTopics.id, updatedCourse);

      setShowTopicsModal(false);
      setCourseForTopics(null);
      setTopicsToAdd([]);
      setTopicsToRemove([]);

      loadCourses();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter(
          (c) => (c.basicInfo.category || "other") === selectedCategory,
        );

  const coursesByCategory = CATEGORIES.map((cat) => ({
    ...cat,
    count: courses.filter(
      (c) => (c.basicInfo.category || "other") === cat.value,
    ).length,
  }));

  if (loading) {
    return (
      <div className="h-full bg-[#0A0E14] overflow-x-hidden overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="h-20 bg-gray-700/50 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0A0E14] overflow-x-hidden overflow-y-auto no-scrollbar pb-18 lg:pb-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
              <div className="w-1 h-8 sm:h-10 lg:h-12 bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-400 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-emerald-400 uppercase mb-0.5 sm:mb-1">
                  Course Management
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight truncate">
                  My Courses
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 ml-3 sm:ml-4 line-clamp-2">
              Manage all your courses and their details
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Course
          </button>
        </div>

        <div className="flex flex-row flex-nowrap lg:flex-wrap overflow-x-auto overflow-y-hidden gap-2 sm:gap-3 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`shirnk-0 whitespace-nowrap lg:shrink lg:whitespace-normal px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedCategory === "all"
                ? "bg-linear-to-r from-emerald-500 to-cyan-500 text-white"
                : "bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            All ({courses.length})
          </button>
          {coursesByCategory.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`shirnk-0 whitespace-nowrap lg:shrink lg:whitespace-normal px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === cat.value
                  ? "bg-linear-to-r from-emerald-500 to-cyan-500 text-white"
                  : "bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first course
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id}>
                <CourseCard
                  course={course}
                  onEdit={openEditModal}
                  onDelete={openDeleteConfirm}
                  onManageTopics={openTopicsModal}
                />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {(showAddModal || showEditModal) && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-[#1a1a2e] border-t sm:border border-gray-700/50 sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] flex flex-col no-scrollbar"
              >
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {showAddModal ? "Add New Course" : "Edit Course"}
                  </h3>
                  <div className="flex items-center gap-2 lg:hidden">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                        setCourseToEdit(null);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={
                        showAddModal ? handleAddCourse : handleEditCourse
                      }
                      disabled={!formData.name.trim()}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      aria-label={showAddModal ? "Add course" : "Save changes"}
                    >
                      <Save className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Data Structures"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Course Code
                        </label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) =>
                            setFormData({ ...formData, code: e.target.value })
                          }
                          placeholder="e.g., CS201"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value as CourseCategory,
                            })
                          }
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors [&>option]:bg-gray-800 [&>option]:text-white text-base"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Credits
                        </label>
                        <input
                          type="text"
                          value={formData.credits}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              credits: e.target.value,
                            })
                          }
                          placeholder="e.g., 3"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Instructor
                        </label>
                        <input
                          type="text"
                          value={formData.instructor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instructor: e.target.value,
                            })
                          }
                          placeholder="Optional"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Exam Date (DD/MM/YYYY)
                        </label>
                        <input
                          type="text"
                          value={formData.firstExamDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstExamDate: e.target.value,
                            })
                          }
                          placeholder="e.g., 15/03/2024"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Drop Deadline (DD/MM/YYYY)
                        </label>
                        <input
                          type="text"
                          value={formData.dropDeadline}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dropDeadline: e.target.value,
                            })
                          }
                          placeholder="e.g., 31/03/2024"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Grade
                      </label>
                      <input
                        type="text"
                        value={formData.currentGrade}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentGrade: e.target.value,
                          })
                        }
                        placeholder="e.g., A+, 9.2, 85%"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex gap-4 items-center justify-between p-4 sm:p-6 border-t border-gray-700/50 shrink-0">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setCourseToEdit(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition text-sm"
                    aria-label="Close modal"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showAddModal ? handleAddCourse : handleEditCourse}
                    disabled={!formData.name.trim()}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    aria-label={showAddModal ? "Add course" : "Save changes"}
                  >
                    <h3 className="text-sm sm:text-lg font-semibold text-white">
                      {showAddModal ? "Save" : "Update"}
                    </h3>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteConfirm && courseToDelete && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-5 sm:p-6 max-w-md w-full"
              >
                <div className="bg-linear-to-br from-red-500/20 to-orange-500/20 p-4 sm:p-5 rounded-xl mb-5 border border-red-500/30">
                  <AlertCircle className="w-11 h-11 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
                    Delete Course?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 text-center">
                    Are you sure you want to delete "
                    {courseToDelete.basicInfo.name}"? This action cannot be
                    undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCourseToDelete(null);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTopicsModal && courseForTopics && (
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
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Manage Topics
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {courseForTopics.basicInfo.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTopicsModal(false);
                      setCourseForTopics(null);
                      setTopicsToAdd([]);
                      setTopicsToRemove([]);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar">
                  <div className="space-y-4">
                    {courseForTopics.topics &&
                      courseForTopics.topics.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-300 mb-2">
                            Existing topics ({courseForTopics.topics.length}):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {courseForTopics.topics.map((topic, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition ${
                                  topicsToRemove.includes(topic)
                                    ? "bg-red-500/10 border-red-500/30 text-red-300 line-through"
                                    : "bg-emerald-500/10 border-emerald-500/30 text-white"
                                }`}
                              >
                                <span className="text-xs">{topic}</span>
                                <button
                                  onClick={() =>
                                    handleMarkTopicForRemoval(topic)
                                  }
                                  className="text-emerald-300 hover:text-red-400 transition-colors shrink-0"
                                  title={
                                    topicsToRemove.includes(topic)
                                      ? "Restore topic"
                                      : "Remove topic"
                                  }
                                  aria-label={
                                    topicsToRemove.includes(topic)
                                      ? "Restore topic"
                                      : "Remove topic"
                                  }
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Add New Topics
                      </label>
                      <div className="flex gap-2 mb-2.5">
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="e.g., Binary Trees"
                          className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleAddTopic();
                          }}
                        />
                        <button
                          onClick={handleAddTopic}
                          className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shrink-0"
                          aria-label="Add topic"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {topicsToAdd.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-300 mb-2">
                            Topics to add ({topicsToAdd.length}):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {topicsToAdd.map((topic) => (
                              <div
                                key={topic}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                              >
                                <span className="text-xs text-white">
                                  {topic}
                                </span>
                                <button
                                  onClick={() => handleRemoveTopic(topic)}
                                  className="text-gray-400 hover:text-red-400 transition-colors shrink-0"
                                  aria-label="Remove from add list"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-4 sm:p-5 border-t border-gray-700/50 shrink-0">
                  <button
                    onClick={() => {
                      setShowTopicsModal(false);
                      setCourseForTopics(null);
                      setTopicsToAdd([]);
                      setTopicsToRemove([]);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTopics}
                    disabled={
                      topicsToAdd.length === 0 && topicsToRemove.length === 0
                    }
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Update Topics
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

export default Courses;
