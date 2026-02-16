import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Lock,
  Filter,
  Grid3x3,
  Calendar,
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle2,
  Award,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type {
  SkillGap,
  SeverityFilter,
  FixedFilter,
  ViewMode,
} from "../../types";
import {
  fetchUserSkillGaps,
  removeSkillGap,
  markSkillGapAsFixed,
} from "../../services/common";

const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 animate-pulse min-w-0">
    <div className="h-1 bg-gray-700/50 rounded-full mb-4" />
    <div className="h-3 bg-gray-700/50 rounded w-20 mb-2" />
    <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3" />
    <div className="h-4 bg-gray-700/50 rounded w-full mb-2" />
    <div className="h-4 bg-gray-700/50 rounded w-4/5 mb-4" />
    <div className="h-2 bg-gray-700/50 rounded w-full mb-4" />
    <div className="flex justify-between">
      <div className="h-4 bg-gray-700/50 rounded w-20" />
      <div className="h-4 bg-gray-700/50 rounded w-16" />
    </div>
  </div>
);

const CustomDropdown = ({
  value,
  options,
  onChange,
  placeholder = "Select...",
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative flex-1 lg:flex-initial min-w-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 flex items-center justify-between gap-2 hover:bg-white/10 transition-colors"
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm transition-colors ${
                    value === option.value
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillGaps = () => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<SeverityFilter>("all");
  const [fixedFilter, setFixedFilter] = useState<FixedFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gapToDelete, setGapToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSkillGaps();
  }, []);

  const loadSkillGaps = async () => {
    try {
      const gaps = await fetchUserSkillGaps();
      setSkillGaps(gaps);
    } catch (error) {
      console.error("Error fetching skill gaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGaps = (gaps: SkillGap[]): SkillGap[] => {
    let filtered = gaps;

    if (selectedCourse !== "all") {
      filtered = filtered.filter((gap) => gap.courseName === selectedCourse);
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter((gap) => gap.severity === activeFilter);
    }

    if (fixedFilter === "fixed") {
      filtered = filtered.filter((gap) => gap.isFixed);
    } else if (fixedFilter === "not_fixed") {
      filtered = filtered.filter((gap) => !gap.isFixed);
    }

    return filtered;
  };

  const toggleSkillSelection = (skillId: string) => {
    const newSelection = new Set(selectedSkills);
    if (newSelection.has(skillId)) {
      newSelection.delete(skillId);
    } else {
      newSelection.add(skillId);
    }
    setSelectedSkills(newSelection);
  };

  const handleCreatePlan = () => {
    if (selectedSkills.size === 0) {
      alert("Please select at least one skill gap to create an action plan");
      return;
    }

    const selectedGaps = skillGaps.filter((gap) => selectedSkills.has(gap.id));
    navigate("/action-plans", { state: { selectedGaps, mode: "create" } });
  };

  const openDeleteModal = (gapId: string, gapName: string) => {
    setGapToDelete({ id: gapId, name: gapName });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setGapToDelete(null);
  };

  const handleDeleteGap = async () => {
    if (!gapToDelete) return;

    try {
      await removeSkillGap(gapToDelete.id);
      await loadSkillGaps();
      closeDeleteModal();
    } catch (error) {
      console.error("Error removing skill gap:", error);
      alert("Failed to remove skill gap. Please try again.");
    }
  };

  const handleToggleFixed = async (gapId: string, currentFixed: boolean) => {
    try {
      await markSkillGapAsFixed(gapId, !currentFixed);
      await loadSkillGaps();
    } catch (error) {
      console.error("Error toggling fixed status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0E131C] overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gray-700/50 rounded-full animate-pulse" />
              <div className="h-3 bg-gray-700/50 rounded w-32 animate-pulse" />
            </div>
            <div className="h-12 bg-gray-700/50 rounded w-64 animate-pulse" />
            <div className="h-6 bg-gray-700/50 rounded w-full max-w-3xl animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-700/50 rounded w-20 mb-2" />
                <div className="h-10 bg-gray-700/50 rounded w-16 mb-1" />
                <div className="h-4 bg-gray-700/50 rounded w-32" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredGaps = filterGaps(skillGaps);
  const courses = Array.from(new Set(skillGaps.map((g) => g.courseName)));

  const stats = {
    critical: skillGaps.filter((g) => g.severity === "critical" && !g.isFixed)
      .length,
    moderate: skillGaps.filter((g) => g.severity === "moderate" && !g.isFixed)
      .length,
    manageable: skillGaps.filter(
      (g) => g.severity === "manageable" && !g.isFixed,
    ).length,
    fixed: skillGaps.filter((g) => g.isFixed).length,
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "not_fixed", label: "Not Fixed" },
    { value: "fixed", label: "Fixed" },
  ];

  const courseOptions = [
    { value: "all", label: "All Courses" },
    ...courses.map((course: string) => ({
      value: course,
      label: course,
    })),
  ];

  return (
    <div className="h-full bg-[#0E131C] overflow-x-hidden overflow-y-auto no-scrollbar pb-20 lg:pb-6">
      <div className="max-w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
            <div className="w-1 h-8 sm:h-10 lg:h-12 bg-linear-to-b from-red-500 to-orange-500 rounded-full shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-red-400 uppercase mb-0.5 sm:mb-1">
                Consequence Analysis
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight truncate">
                Skill Gap Analysis
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 ml-3 sm:ml-4 line-clamp-2">
            Track and fix your skill gaps. Fixed gaps show your mastery
            progress.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="relative bg-linear-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-3 sm:p-4 lg:p-6 overflow-hidden group hover:border-red-500/40 transition-all min-w-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-red-400/70 uppercase truncate">
                  Critical
                </span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-400 mb-1">
                {stats.critical}
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Address now
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-3 sm:p-4 lg:p-6 overflow-hidden group hover:border-orange-500/40 transition-all min-w-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-orange-400/70 uppercase truncate">
                  Moderate
                </span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-1">
                {stats.moderate}
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Plan soon
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="relative bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-3 sm:p-4 lg:p-6 overflow-hidden group hover:border-green-500/40 transition-all min-w-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-green-400/70 uppercase truncate">
                  Manageable
                </span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-1">
                {stats.manageable}
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                When ready
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="relative bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 sm:p-4 lg:p-6 overflow-hidden group hover:border-emerald-500/40 transition-all min-w-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-emerald-400/70 uppercase truncate">
                  Fixed
                </span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 mb-1">
                {stats.fixed}
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Mastered
              </p>
            </div>
          </motion.div>
        </div>

        {selectedSkills.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0"
          >
            <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base text-white font-semibold truncate">
                  {selectedSkills.size} skill
                  {selectedSkills.size !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Ready to create an action plan
                </p>
              </div>
            </div>
            <button
              onClick={handleCreatePlan}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base shrink-0"
            >
              Create Action Plan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 items-start min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            {[
              { value: "all", label: "All", color: "white" },
              { value: "critical", label: "Critical", color: "red" },
              { value: "moderate", label: "Moderate", color: "orange" },
              { value: "manageable", label: "Manageable", color: "green" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value as SeverityFilter)}
                className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter.value
                    ? filter.color === "red"
                      ? "bg-red-500 text-white"
                      : filter.color === "orange"
                        ? "bg-orange-500 text-white"
                        : filter.color === "green"
                          ? "bg-green-500 text-white"
                          : "bg-white text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 min-w-0 w-full lg:w-auto">
            <CustomDropdown
              value={fixedFilter}
              options={statusOptions}
              onChange={(value) => setFixedFilter(value as FixedFilter)}
            />

            <CustomDropdown
              value={selectedCourse}
              options={courseOptions}
              onChange={setSelectedCourse}
            />

            <div className="hidden lg:flex bg-white/5 rounded-lg p-1 shrink-0">
              {[
                { value: "grid", icon: Grid3x3, label: "Grid" },
                { value: "by_course", icon: BookOpen, label: "By Course" },
                { value: "timeline", icon: Calendar, label: "Timeline" },
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.value}
                    onClick={() => setViewMode(view.value as ViewMode)}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === view.value
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title={view.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {filteredGaps.map((gap, index) => (
              <SkillGapCard
                key={gap.id}
                gap={gap}
                index={index}
                isSelected={selectedSkills.has(gap.id)}
                onToggleSelection={() => toggleSkillSelection(gap.id)}
                onDelete={() => openDeleteModal(gap.id, gap.skill)}
                onToggleFixed={() => handleToggleFixed(gap.id, gap.isFixed)}
              />
            ))}
          </div>
        )}

        {viewMode === "by_course" && (
          <div className="space-y-6 sm:space-y-8 w-full">
            {courses.map((courseName) => {
              const courseGaps = filteredGaps.filter(
                (g) => g.courseName === courseName,
              );
              if (courseGaps.length === 0) return null;

              return (
                <div key={courseName} className="min-w-0">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 min-w-0">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate flex-1">
                      {courseName}
                    </h2>
                    <div className="hidden sm:block flex-1 h-px bg-white/10" />
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {courseGaps.length} gaps
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                    {courseGaps.map((gap, index) => (
                      <SkillGapCard
                        key={gap.id}
                        gap={gap}
                        index={index}
                        isSelected={selectedSkills.has(gap.id)}
                        onToggleSelection={() => toggleSkillSelection(gap.id)}
                        onDelete={() => openDeleteModal(gap.id, gap.skill)}
                        onToggleFixed={() =>
                          handleToggleFixed(gap.id, gap.isFixed)
                        }
                        compact
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "timeline" && (
          <div className="space-y-6 sm:space-y-8 w-full">
            {["immediate", "high", "medium", "low"].map((urgency) => {
              const urgencyGaps = filteredGaps.filter(
                (g) => g.urgency === urgency,
              );
              if (urgencyGaps.length === 0) return null;

              const labels = {
                immediate: { text: "NOW - Critical", color: "red" },
                high: { text: "THIS WEEK", color: "orange" },
                medium: { text: "THIS MONTH", color: "yellow" },
                low: { text: "LATER", color: "green" },
              }[urgency as "immediate" | "high" | "medium" | "low"];

              return (
                <div key={urgency} className="min-w-0">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 min-w-0">
                    <Target
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-${labels!.color}-400 shrink-0`}
                    />
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate flex-1">
                      {labels!.text}
                    </h2>
                    <div className="hidden sm:block flex-1 h-px bg-white/10" />
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {urgencyGaps.length} gaps
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                    {urgencyGaps.map((gap, index) => (
                      <SkillGapCard
                        key={gap.id}
                        gap={gap}
                        index={index}
                        isSelected={selectedSkills.has(gap.id)}
                        onToggleSelection={() => toggleSkillSelection(gap.id)}
                        onDelete={() => openDeleteModal(gap.id, gap.skill)}
                        onToggleFixed={() =>
                          handleToggleFixed(gap.id, gap.isFixed)
                        }
                        compact
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredGaps.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              No skill gaps found
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              {skillGaps.length === 0
                ? "Complete an assessment to identify skill gaps"
                : "Try adjusting your filters"}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteModalOpen && gapToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#242833] border border-gray-700/60 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Delete Skill Gap
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-white transition-colors p-1 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm sm:text-base text-gray-300">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    "{gapToDelete.name}"
                  </span>
                  ?
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  All associated data and progress will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all text-sm sm:text-base border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGap}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillGapCard = ({
  gap,
  index,
  isSelected,
  onToggleSelection,
  onDelete,
  onToggleFixed,
  compact = false,
}: {
  gap: SkillGap;
  index: number;
  isSelected: boolean;
  onToggleSelection: () => void;
  onDelete: () => void;
  onToggleFixed: () => void;
  compact?: boolean;
}) => {
  const colors = {
    critical: {
      bg: "from-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      accent: "bg-red-500",
    },
    moderate: {
      bg: "from-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      accent: "bg-orange-500",
    },
    manageable: {
      bg: "from-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      accent: "bg-green-500",
    },
  }[gap.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onToggleSelection}
      className={`relative bg-linear-to-br ${colors.bg} to-transparent border ${colors.border} rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:scale-[1.02] min-w-0 ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0E131C]"
          : ""
      } ${gap.isFixed ? "opacity-60" : ""}`}
    >
      <div
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
          isSelected ? "bg-blue-500 border-blue-500" : "border-white/20"
        }`}
      >
        {isSelected && (
          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        )}
      </div>

      <div className={`h-1 ${colors.accent} rounded-full mb-3 sm:mb-4`} />

      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="text-xs text-gray-500 uppercase tracking-wider truncate pr-8">
          {gap.course}
        </div>
        {gap.isFixed && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap flex items-center gap-1">
            <Award className="w-3 h-3" />
            Fixed
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 pr-8 line-clamp-2">
        {gap.skill}
      </h3>

      {!compact && (
        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 leading-relaxed line-clamp-3">
          {gap.reason}
        </p>
      )}

      {gap.actionPlanId && !gap.isFixed && (
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Action Plan Progress</span>
            <span>{Math.round(gap.progress || 0)}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${gap.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {!gap.actionPlanId && !gap.isFixed && (
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Performance</span>
            <span>
              {gap.performance.correct}/{gap.performance.total}
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.accent} rounded-full transition-all`}
              style={{
                width: `${(gap.performance.correct / gap.performance.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
          <span className="text-xs sm:text-sm text-gray-400 truncate">
            {gap.daysToAddress} days
          </span>
        </div>
        {gap.blocks.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              Blocks {gap.blocks.length}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        {!gap.isFixed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFixed();
            }}
            className="flex-1 px-2 sm:px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="xs:hidden">Mark as Fixed</span>
          </button>
        )}

        {gap.isFixed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFixed();
            }}
            className="flex-1 px-2 sm:px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Undo
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="px-2 sm:px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default SkillGaps;
