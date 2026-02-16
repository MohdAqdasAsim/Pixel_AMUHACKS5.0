import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Video,
  FileText,
  Target,
  Sparkles,
  X,
  Plus,
  Filter,
  ChevronRight,
  ExternalLink,
  Play,
  Code,
  Zap,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  fetchUserActionPlans,
  updateTaskStatus as updateTaskStatusFn,
  deleteActionPlan,
  createActionPlansForSkillGaps,
  fetchUserSkillGaps,
} from "../../services/common";
import { generateText } from "../../services/gemini";
import type { ActionPlan, Task, Resource, SkillGap } from "../../types";

const SkeletonPlanCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-4 animate-pulse min-w-0">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
        <div className="h-3 bg-gray-700/50 rounded w-1/2" />
      </div>
      <div className="h-6 w-16 bg-gray-700/50 rounded-full" />
    </div>
    <div className="space-y-2 mb-3">
      <div className="h-2 bg-gray-700/50 rounded w-20" />
      <div className="h-2 bg-gray-700/50 rounded w-full" />
    </div>
    <div className="flex items-center justify-between text-xs">
      <div className="h-3 bg-gray-700/50 rounded w-24" />
      <div className="h-5 w-20 bg-gray-700/50 rounded-full" />
    </div>
  </div>
);

const SkeletonTaskCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse min-w-0">
    <div className="flex items-start gap-4">
      <div className="w-6 h-6 rounded-full bg-gray-700/50 shrink-0" />
      <div className="flex-1 space-y-3 min-w-0">
        <div className="h-5 bg-gray-700/50 rounded w-3/4" />
        <div className="h-4 bg-gray-700/50 rounded w-full" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-700/50 rounded w-20" />
          <div className="h-3 bg-gray-700/50 rounded w-24" />
        </div>
      </div>
    </div>
  </div>
);

const parseDuration = (duration: string): number => {
  let totalMinutes = 0;
  const hourMatch = duration.match(/(\d+)\s*hr/);
  const minMatch = duration.match(/(\d+)\s*min/);

  if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1]);

  return totalMinutes;
};

const ActionPlans = () => {
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSkillGapSelectionModal, setShowSkillGapSelectionModal] =
    useState(false);
  const [filterView, setFilterView] = useState<"all" | "daily" | "weekly">(
    "all",
  );
  const [showCompleted, setShowCompleted] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadActionPlans();

    if (location.state?.selectedGaps && location.state?.mode === "create") {
      setShowCreateModal(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadActionPlans = async () => {
    try {
      const plans = await fetchUserActionPlans();
      setActionPlans(plans);
      if (plans.length > 0 && !selectedPlan) {
        setSelectedPlan(plans[0].id);
      }
    } catch (error) {
      console.error("Error fetching action plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (
    planId: string,
    taskId: string,
    completed: boolean,
  ) => {
    try {
      await updateTaskStatusFn(planId, taskId, completed);
      await loadActionPlans();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      await deleteActionPlan(planToDelete.id);
      await loadActionPlans();

      if (selectedPlan === planToDelete.id) {
        const remainingPlans = actionPlans.filter(
          (p) => p.id !== planToDelete.id,
        );
        setSelectedPlan(
          remainingPlans.length > 0 ? remainingPlans[0].id : null,
        );
      }

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan. Please try again.");
    }
  };

  const openDeleteModal = (planId: string, planTitle: string) => {
    setPlanToDelete({ id: planId, title: planTitle });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleOpenSkillGapSelection = () => {
    setShowSkillGapSelectionModal(true);
  };

  const handleSkillGapsSelected = (selectedGaps: SkillGap[]) => {
    setShowSkillGapSelectionModal(false);
    navigate(location.pathname, {
      replace: true,
      state: { selectedGaps, mode: "create" },
    });
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0E131C] overflow-x-hidden overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-6 max-w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 sm:h-8 bg-gray-700/50 rounded-full animate-pulse" />
                <div className="h-3 bg-gray-700/50 rounded w-32 animate-pulse" />
              </div>
              <div className="h-10 bg-gray-700/50 rounded w-48 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-700/50 rounded w-64 animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-20 bg-gray-700/50 rounded-xl w-full sm:w-64 animate-pulse" />
              <div className="h-12 bg-gray-700/50 rounded-lg w-full sm:w-32 animate-pulse" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <div className="h-6 bg-gray-700/50 rounded w-40 mb-4 animate-pulse" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonPlanCard key={i} />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 animate-pulse">
                <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-4" />
                <div className="h-5 bg-gray-700/50 rounded w-1/2 mb-6" />
                <div className="h-3 bg-gray-700/50 rounded w-full" />
              </div>

              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <SkeletonTaskCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const weeklyAvailableHours = 20;

  const totalAllocatedHours = actionPlans.reduce(
    (sum, plan) => sum + plan.weeklyAllocation,
    0,
  );
  const capacityPercentage = (totalAllocatedHours / weeklyAvailableHours) * 100;

  return (
    <div className="h-full bg-[#0E131C] overflow-x-hidden overflow-y-auto no-scrollbar pb-18 lg:pb-0">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-full min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
              <div className="w-1 h-8 sm:h-10 lg:h-12 bg-linear-to-b from-blue-500 to-purple-500 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-blue-400 uppercase mb-0.5 sm:mb-1">
                  Learning Paths
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight truncate">
                  Action Plans
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 ml-3 sm:ml-4 line-clamp-2">
              Personalized step-by-step paths to close your skill gaps
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Weekly Capacity</p>
                  <p className="text-base sm:text-lg font-bold text-white truncate">
                    {totalAllocatedHours} / {weeklyAvailableHours} hrs
                  </p>
                </div>
              </div>
              <div className="w-20 sm:w-24 shrink-0">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      capacityPercentage > 100
                        ? "bg-red-500"
                        : capacityPercentage > 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {capacityPercentage > 100
                    ? "Over capacity"
                    : `${Math.round(capacityPercentage)}% utilized`}
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenSkillGapSelection}
              className="flex flex-1 px-8 lg:py-0 py-2 items-center justify-center gap-2 min-w-0 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <p className="truncate font-inter font-medium lg:text-sm text-lg">
                New Plan
              </p>
            </button>
          </div>
        </div>

        {/* Responsive Action Plans Layout */}
        <div className="space-y-4 sm:space-y-6">
          {actionPlans.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-12 text-center">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                No action plans yet
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6">
                Create your first action plan to start tracking your learning
                progress
              </p>
              <button
                onClick={handleOpenSkillGapSelection}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create First Plan
              </button>
            </div>
          ) : (
            actionPlans.map((plan) => (
              <ActionPlanCard
                key={plan.id}
                plan={plan}
                isExpanded={selectedPlan === plan.id}
                onToggle={() =>
                  setSelectedPlan(selectedPlan === plan.id ? null : plan.id)
                }
                onDelete={() => openDeleteModal(plan.id, plan.title)}
                filterView={filterView}
                setFilterView={setFilterView}
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
                updateTaskStatus={updateTaskStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Skill Gap Selection Modal */}
      {showSkillGapSelectionModal && (
        <SkillGapSelectionModal
          onClose={() => setShowSkillGapSelectionModal(false)}
          onSkillGapsSelected={handleSkillGapsSelected}
        />
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          selectedGaps={location.state?.selectedGaps || []}
          onClose={() => {
            setShowCreateModal(false);
            navigate(location.pathname, { replace: true, state: {} });
          }}
          onSuccess={() => {
            loadActionPlans();
            setShowCreateModal(false);
            navigate(location.pathname, { replace: true, state: {} });
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && planToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#242833] border border-gray-700/60 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Delete Action Plan
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

              {/* Content */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm sm:text-base text-gray-300">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    "{planToDelete.title}"
                  </span>
                  ?
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  All tasks, progress, and associated data will be permanently
                  removed.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all text-sm sm:text-base border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlan}
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

const ActionPlanCard = ({
  plan,
  isExpanded,
  onToggle,
  onDelete,
  filterView,
  setFilterView,
  showCompleted,
  setShowCompleted,
  updateTaskStatus,
}: {
  plan: ActionPlan;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  filterView: "all" | "daily" | "weekly";
  setFilterView: (view: "all" | "daily" | "weekly") => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  updateTaskStatus: (
    planId: string,
    taskId: string,
    completed: boolean,
  ) => void;
}) => {
  const progress = (plan.completedHours / plan.estimatedHours) * 100;

  const filteredTasks = plan.tasks.filter((task) => {
    if (!showCompleted && task.completed) return false;
    if (filterView === "all") return true;
    return task.type === filterView;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
    >
      {/* Plan Header - Always Visible */}
      <div
        onClick={onToggle}
        className="p-4 sm:p-6 cursor-pointer hover:bg-white/5 transition-all"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
                {plan.title}
              </h3>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </motion.div>
            </div>
            <p className="text-sm text-gray-400 line-clamp-1 mb-3">
              Closing gap in: {plan.skillGap}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${
                  plan.priority === "critical"
                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                    : plan.priority === "high"
                      ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                      : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                }`}
              >
                {plan.priority}
              </span>
              <span
                className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                  plan.status === "in_progress"
                    ? "text-blue-400 bg-blue-500/10"
                    : plan.status === "completed"
                      ? "text-green-400 bg-green-500/10"
                      : "text-gray-400 bg-gray-500/10"
                }`}
              >
                {plan.status.replace("_", " ")}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Due{" "}
                  {new Date(plan.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
            title="Delete plan"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-semibold">
              {plan.completedHours} / {plan.estimatedHours} hours
            </span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{Math.round(progress)}% complete</span>
            <span>{plan.weeklyAllocation} hrs/week</span>
          </div>
        </div>

        {plan.status === "completed" && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-xs sm:text-sm text-green-400 font-semibold">
              Completed! Skill gap marked as fixed.
            </span>
          </div>
        )}
      </div>

      {/* Expanded Tasks Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-4">
              {/* Task Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterView("all");
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                      filterView === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterView("daily");
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                      filterView === "daily"
                        ? "bg-blue-500 text-white"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterView("weekly");
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                      filterView === "weekly"
                        ? "bg-blue-500 text-white"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    Weekly
                  </button>
                </div>

                <label
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 cursor-pointer whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => {
                      e.stopPropagation();
                      setShowCompleted(e.target.checked);
                    }}
                    className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
                  />
                  Show completed
                </label>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                      {plan.tasks.length === 0
                        ? "No tasks yet"
                        : "No tasks match the current filters"}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={(completed) =>
                        updateTaskStatus(plan.id, task.id, completed)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SkillGapSelectionModal = ({
  onClose,
  onSkillGapsSelected,
}: {
  onClose: () => void;
  onSkillGapsSelected: (selectedGaps: SkillGap[]) => void;
}) => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<
    "all" | "critical" | "moderate" | "manageable"
  >("all");

  useEffect(() => {
    loadSkillGaps();
  }, []);

  const loadSkillGaps = async () => {
    try {
      const gaps = await fetchUserSkillGaps();
      const unfixedGaps = gaps.filter((gap) => !gap.isFixed);
      setSkillGaps(unfixedGaps);
    } catch (error) {
      console.error("Error fetching skill gaps:", error);
    } finally {
      setLoading(false);
    }
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
    onSkillGapsSelected(selectedGaps);
  };

  const filteredGaps = skillGaps.filter((gap) => {
    if (activeFilter === "all") return true;
    return gap.severity === activeFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-2 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Select Skill Gaps
              </h2>
              <p className="text-sm text-gray-400">
                Choose the skills you want to work on in your action plan
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading skill gaps...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats & Filters */}
            <div className="pt-4 pb-2 px-8 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                {[
                  { value: "all", label: "All", color: "white" },
                  { value: "critical", label: "Critical", color: "red" },
                  { value: "moderate", label: "Moderate", color: "orange" },
                  { value: "manageable", label: "Manageable", color: "green" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() =>
                      setActiveFilter(filter.value as typeof activeFilter)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
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
            </div>

            {/* Skill Gaps List */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-2 pb-4">
              {filteredGaps.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No skill gaps found
                  </h3>
                  <p className="text-gray-400">
                    {skillGaps.length === 0
                      ? "Complete an assessment to identify skill gaps"
                      : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGaps.map((gap) => {
                    const isSelected = selectedSkills.has(gap.id);
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
                      <div
                        key={gap.id}
                        onClick={() => toggleSkillSelection(gap.id)}
                        className={`relative bg-linear-to-br ${colors.bg} to-transparent border ${colors.border} rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                          isSelected
                            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1a2e]"
                            : ""
                        }`}
                      >
                        <div
                          className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-white/20"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div
                          className={`h-1 ${colors.accent} rounded-full mb-3`}
                        />

                        <div className="text-xs text-gray-500 uppercase tracking-wider truncate pr-8 mb-2">
                          {gap.courseName}
                        </div>

                        <h3 className="text-base font-bold text-white mb-2 pr-8 line-clamp-2">
                          {gap.skill}
                        </h3>

                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {gap.reason}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-400">
                              {gap.daysToAddress} days
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${colors.text} ${colors.accent}/20 border ${colors.border}`}
                          >
                            {gap.severity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-4 sm:px-6 border-t border-white/10 shrink-0">
              {selectedSkills.size > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {selectedSkills.size} skill
                      {selectedSkills.size !== 1 ? "s" : ""} selected
                    </p>
                    <p className="text-xs text-gray-400">
                      Ready to create an action plan
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  disabled={selectedSkills.size === 0}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Create Action Plan
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (completed: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalMinutes =
    task.estimatedTime +
    task.resources.reduce((sum, r) => {
      let mins = 0;
      if (r.duration) mins += parseDuration(r.duration);
      if (r.readTime) mins += parseDuration(r.readTime);
      return sum + mins;
    }, 0);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-purple-400" />;
      case "article":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "practice":
        return <Target className="w-4 h-4 text-green-400" />;
      case "code":
        return <Code className="w-4 h-4 text-orange-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div
      className={`bg-white/5 border rounded-xl transition-all min-w-0 ${
        task.completed ? "border-green-500/20" : "border-white/10"
      }`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <button
            onClick={() => onToggle(!task.completed)}
            className="shrink-0 mt-1 transition-transform hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-gray-300" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm sm:text-base font-semibold mb-1 line-clamp-2 ${
                    task.completed ? "text-gray-400 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300 whitespace-nowrap">
                  {task.type}
                </span>
                {task.dueDate && !task.completed && (
                  <span className="text-xs text-orange-400 whitespace-nowrap hidden sm:inline">
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span>~{Math.round(totalMinutes)} min total</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span>{task.resources.length} resources</span>
              </div>
              {task.completed && task.completedDate && (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">
                    Completed{" "}
                    {new Date(task.completedDate).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    )}
                  </span>
                  <span className="sm:hidden">Done</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isExpanded ? "Hide" : "View"} resources & materials
              <ChevronRight
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10 p-3 sm:p-4 bg-black/20">
          <h4 className="text-xs sm:text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            Learning Resources
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {task.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/50 hover:bg-white/10 transition-all group min-w-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs sm:text-sm font-medium text-white mb-1 flex items-center gap-2 line-clamp-2">
                    {resource.title}
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-400 shrink-0" />
                  </h5>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400">
                    {resource.duration && (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Play className="w-3 h-3 shrink-0" />
                        {resource.duration}
                      </span>
                    )}
                    {resource.readTime && (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3 shrink-0" />
                        {resource.readTime}
                      </span>
                    )}
                    {resource.problems && (
                      <span className="whitespace-nowrap">
                        {resource.problems} problems
                      </span>
                    )}
                    {resource.exercises && (
                      <span className="whitespace-nowrap">
                        {resource.exercises} exercises
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CreatePlanModal = ({
  selectedGaps,
  onClose,
  onSuccess,
}: {
  selectedGaps: SkillGap[];
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedSkills: selectedGaps.map((g) => g.id),
    weeklyHours: 6,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    customTitle: "",
  });
  const [creating, setCreating] = useState(false);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (!generatingTasks) {
      setLoadingMessage("");
      return;
    }

    const messages = [
      "Analyzing skill requirements...",
      "Crafting personalized learning path...",
      "Curating educational resources...",
      "Structuring progressive tasks...",
      "Optimizing time estimates...",
      "Finding best practice materials...",
      "Building your action plan...",
      "Almost ready...",
    ];

    let currentIndex = 0;
    setLoadingMessage(messages[0]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingMessage(messages[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [generatingTasks]);

  const generateActionPlan = async () => {
    setCreating(true);
    setGeneratingTasks(true);

    try {
      await createActionPlansForSkillGaps(
        formData.selectedSkills,
        formData.weeklyHours,
        formData.dueDate,
        formData.customTitle,
        generateAITasks,
      );

      setGeneratingTasks(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating action plan:", error);
      alert("Failed to create action plan. Please try again.");
      setGeneratingTasks(false);
    } finally {
      setCreating(false);
    }
  };

  const generateAITasks = async (
    gap: SkillGap,
    formData: { weeklyHours: number },
  ): Promise<Task[]> => {
    try {
      const prompt = `You are an expert educational content creator. Generate a comprehensive learning plan for mastering "${gap.skill}" in the context of "${gap.courseName}".

Skill Details:
- Skill: ${gap.skill}
- Course: ${gap.courseName}
- Severity: ${gap.severity}
- Days to Address: ${gap.daysToAddress}
- Weekly Study Hours: ${formData.weeklyHours}

Generate a structured learning plan with 5-8 tasks that progressively build mastery of this skill. Each task should include:
1. A clear, actionable title
2. A detailed description of what the learner will accomplish
3. Task type (either "daily" for shorter focused tasks or "weekly" for longer project-based tasks)
4. Estimated time in minutes (realistic for the complexity - this is JUST the task time, not including resources)
5. 2-4 learning resources with:
   - Type: "video", "article", "practice", or "code"
   - Title: Specific, descriptive title
   - URL: Use realistic educational platform URLs (YouTube, Medium, LeetCode, GitHub, etc.)
   - Additional metadata based on type (duration for videos, readTime for articles, problems/exercises for practice/code)

Return ONLY a valid JSON array of tasks following this exact structure:
[
  {
    "title": "string",
    "description": "string",
    "type": "daily" | "weekly",
    "estimatedTime": number (in minutes - task time only),
    "resources": [
      {
        "type": "video" | "article" | "practice" | "code",
        "title": "string",
        "url": "string",
        "duration": "string (optional, e.g., '15 min')",
        "readTime": "string (optional, e.g., '10 min read')",
        "problems": number (optional),
        "exercises": number (optional)
      }
    ]
  }
]

Make the learning path:
- Progressive (start with fundamentals, build to advanced)
- Practical (include hands-on practice and real projects)
- Comprehensive (cover theory, practice, and application)
- Realistic (time estimates should be achievable)

Return only the JSON array, no additional text or markdown formatting.`;

      const response = await generateText(prompt);

      let tasksData;
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          tasksData = JSON.parse(jsonMatch[0]);
        } else {
          tasksData = JSON.parse(response);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        throw new Error("Failed to parse AI-generated tasks");
      }

      const tasks: Task[] = tasksData.map(
        (
          taskData: {
            title: string;
            description: string;
            type: "daily" | "weekly";
            estimatedTime: number;
            resources: Resource[];
          },
          index: number,
        ) => ({
          id: `task-${Date.now()}-${index}`,
          title: taskData.title,
          description: taskData.description,
          type: taskData.type,
          estimatedTime: taskData.estimatedTime,
          completed: false,
          resources: taskData.resources || [],
        }),
      );

      return tasks;
    } catch (error) {
      console.error("Error generating AI tasks:", error);

      return [
        {
          id: `task-fallback-1-${Date.now()}`,
          title: `Learn ${gap.skill} Fundamentals`,
          description: `Study the core concepts and principles of ${gap.skill}`,
          type: "daily" as const,
          estimatedTime: 60,
          completed: false,
          resources: [
            {
              type: "video" as const,
              title: `${gap.skill} Introduction`,
              url:
                "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(gap.skill),
              duration: "20 min",
            },
            {
              type: "article" as const,
              title: `Understanding ${gap.skill}`,
              url:
                "https://medium.com/search?q=" + encodeURIComponent(gap.skill),
              readTime: "15 min read",
            },
          ],
        },
        {
          id: `task-fallback-2-${Date.now()}`,
          title: `Practice ${gap.skill}`,
          description: "Apply what you've learned through hands-on exercises",
          type: "daily" as const,
          estimatedTime: 90,
          completed: false,
          resources: [
            {
              type: "practice" as const,
              title: `${gap.skill} Exercises`,
              url:
                "https://www.google.com/search?q=" +
                encodeURIComponent(gap.skill + " practice"),
              problems: 10,
            },
          ],
        },
      ];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto my-8">
        <div className="p-4 sm:p-6 border-b border-white/10 sticky top-0 bg-[#1a1a2e] z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Create Action Plan
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Step {currentStep} of 3
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={creating}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Step 1: Review Skills */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Review Selected Skills
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {selectedGaps.map((gap) => (
                    <label
                      key={gap.id}
                      className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all min-w-0"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedSkills.includes(gap.id)}
                        onChange={(e) => {
                          const newSkills = e.target.checked
                            ? [...formData.selectedSkills, gap.id]
                            : formData.selectedSkills.filter(
                                (s) => s !== gap.id,
                              );
                          setFormData({
                            ...formData,
                            selectedSkills: newSkills,
                          });
                        }}
                        className="mt-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-white truncate">
                          {gap.skill}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                          {gap.courseName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                              gap.severity === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : gap.severity === "moderate"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {gap.severity}
                          </span>
                          <span className="text-xs text-gray-500">
                            {gap.daysToAddress} days to address
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={formData.selectedSkills.length === 0}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Continue to Schedule
              </button>
            </div>
          )}

          {/* Step 2: Set Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Set Your Schedule
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Weekly Study Hours
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={formData.weeklyHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weeklyHours: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      How many hours per week can you dedicate to this skill?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Custom Plan Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Master Calculus Fundamentals"
                      value={formData.customTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customTitle: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 placeholder-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Review Plan
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Review & Confirm
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                    <p className="text-sm text-gray-400 mb-1">
                      Skills to Master
                    </p>
                    <p className="text-white font-semibold">
                      {formData.selectedSkills.length} skill
                      {formData.selectedSkills.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                    <p className="text-sm text-gray-400 mb-1">
                      Weekly Commitment
                    </p>
                    <p className="text-white font-semibold">
                      {formData.weeklyHours} hours per week
                    </p>
                  </div>

                  {formData.dueDate && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                      <p className="text-sm text-gray-400 mb-1">Target Date</p>
                      <p className="text-white font-semibold">
                        {new Date(formData.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                    <p className="text-sm text-blue-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI-Powered Learning Plan
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                      <li>✓ Personalized tasks generated by AI</li>
                      <li>✓ Curated video tutorials and articles</li>
                      <li>✓ Practice problems and exercises</li>
                      <li>✓ Auto-syncs with skill gap tracking</li>
                    </ul>
                  </div>

                  {generatingTasks && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-purple-400 font-medium mb-1 truncate">
                            {loadingMessage}
                          </p>
                          <div className="w-full h-1 bg-purple-500/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full animate-pulse"
                              style={{ width: "70%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={creating}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  onClick={generateActionPlan}
                  disabled={creating}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Action Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionPlans;
