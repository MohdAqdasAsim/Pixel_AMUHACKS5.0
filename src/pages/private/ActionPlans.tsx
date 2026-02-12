/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
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
  TrendingUp,
  AlertCircle,
  Filter,
  ChevronRight,
  ExternalLink,
  Play,
  Code,
  RotateCcw,
  Zap,
  Trash2,
} from "lucide-react";
import { generateText } from "../../services/gemini";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  estimatedTime: number;
  completed: boolean;
  completedDate?: string;
  dueDate?: string;
  resources: Resource[];
}

interface Resource {
  type: "video" | "article" | "practice" | "code";
  title: string;
  url: string;
  duration?: string;
  readTime?: string;
  problems?: number;
  exercises?: number;
}

interface ActionPlan {
  id: string;
  userId: string;
  title: string;
  skillGap: string;
  course: string;
  priority: "critical" | "high" | "medium";
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  weeklyAllocation: number;
  status: "in_progress" | "not_started" | "completed";
  tasks: Task[];
  createdAt: string;
}

const ActionPlansPage = () => {
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterView, setFilterView] = useState<"all" | "daily" | "weekly">(
    "all",
  );
  const [showCompleted, setShowCompleted] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchActionPlans();

    // Check if coming from skill gaps with selected skills
    if (location.state?.selectedGaps && location.state?.mode === "create") {
      setShowCreateModal(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActionPlans = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const plansRef = collection(db, "actionPlans");
      const q = query(plansRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const plans: ActionPlan[] = [];
      querySnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() } as ActionPlan);
      });

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
      const plan = actionPlans.find((p) => p.id === planId);
      if (!plan) return;

      const updatedTasks = plan.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed,
            completedDate: completed ? new Date().toISOString() : undefined,
          };
        }
        return task;
      });

      const completedHours = updatedTasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + t.estimatedTime / 60, 0);

      const planRef = doc(db, "actionPlans", planId);
      await updateDoc(planRef, {
        tasks: updatedTasks,
        completedHours,
        status:
          completedHours >= plan.estimatedHours ? "completed" : "in_progress",
      });

      // Update local state
      setActionPlans((prev) =>
        prev.map((p) =>
          p.id === planId ? { ...p, tasks: updatedTasks, completedHours } : p,
        ),
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deletePlan = async (planId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this action plan? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const planRef = doc(db, "actionPlans", planId);
      await deleteDoc(planRef);

      // Update local state
      setActionPlans((prev) => prev.filter((p) => p.id !== planId));

      // If deleted plan was selected, select another one or null
      if (selectedPlan === planId) {
        const remainingPlans = actionPlans.filter((p) => p.id !== planId);
        setSelectedPlan(
          remainingPlans.length > 0 ? remainingPlans[0].id : null,
        );
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0E131C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-wider">
            LOADING PLANS...
          </p>
        </div>
      </div>
    );
  }

  const currentPlan = actionPlans.find((p) => p.id === selectedPlan);
  const weeklyAvailableHours = 20; // Would come from onboarding

  const filteredTasks = currentPlan?.tasks.filter((task) => {
    if (!showCompleted && task.completed) return false;
    if (filterView === "all") return true;
    return task.type === filterView;
  });

  const totalAllocatedHours = actionPlans.reduce(
    (sum, plan) => sum + plan.weeklyAllocation,
    0,
  );
  const capacityPercentage = (totalAllocatedHours / weeklyAvailableHours) * 100;

  return (
    <div className="h-full bg-[#0E131C] overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
              <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">
                Learning Paths
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Action Plans</h1>
            <p className="text-gray-400">
              Personalized step-by-step paths to close your skill gaps
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Weekly Capacity */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Weekly Capacity</p>
                  <p className="text-lg font-bold text-white">
                    {totalAllocatedHours} / {weeklyAvailableHours} hrs
                  </p>
                </div>
              </div>
              <div className="w-24">
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
                <p className="text-xs text-gray-400 mt-1">
                  {capacityPercentage > 100
                    ? "Over capacity"
                    : `${Math.round(capacityPercentage)}% utilized`}
                </p>
              </div>
            </div>

            {/* Create Plan Button */}
            <button
              onClick={() => navigate("/skill-gaps")}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Plan
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plans Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Your Action Plans
              </h2>

              {actionPlans.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">
                    No action plans yet
                  </p>
                  <button
                    onClick={() => navigate("/skill-gaps")}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Create your first plan →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {actionPlans.map((plan) => {
                    const progress =
                      (plan.completedHours / plan.estimatedHours) * 100;

                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          selectedPlan === plan.id
                            ? "bg-blue-500/10 border-blue-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm mb-1">
                              {plan.title}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {plan.skillGap}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${
                              plan.priority === "critical"
                                ? "text-red-400 bg-red-500/10 border-red-500/20"
                                : plan.priority === "high"
                                  ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                                  : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                            }`}
                          >
                            {plan.priority}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Progress</span>
                            <span>
                              {plan.completedHours} / {plan.estimatedHours} hrs
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 text-xs">
                          <span className="text-gray-400">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Due {new Date(plan.dueDate).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              plan.status === "in_progress"
                                ? "text-blue-400 bg-blue-500/10"
                                : plan.status === "completed"
                                  ? "text-green-400 bg-green-500/10"
                                  : "text-gray-400 bg-gray-500/10"
                            }`}
                          >
                            {plan.status.replace("_", " ")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Adaptive Updates Notice */}
            <div className="bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Adaptive Updates
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">
                    Your plans automatically adjust based on your progress and
                    reassessment results.
                  </p>
                  <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentPlan ? (
              <>
                {/* Plan Header */}
                <div className="bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {currentPlan.title}
                      </h2>
                      <p className="text-gray-400 mb-4">
                        Closing gap in: {currentPlan.skillGap}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">
                            {currentPlan.weeklyAllocation} hrs/week
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">
                            {Math.round(
                              (currentPlan.completedHours /
                                currentPlan.estimatedHours) *
                                100,
                            )}
                            % complete
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg">
                          <Calendar className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-gray-300">
                            Due{" "}
                            {new Date(currentPlan.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span
                        className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${
                          currentPlan.priority === "critical"
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : currentPlan.priority === "high"
                              ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                              : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                        }`}
                      >
                        {currentPlan.priority.toUpperCase()}
                      </span>
                      <button
                        onClick={() => deletePlan(currentPlan.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete plan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-white font-semibold">
                        {currentPlan.completedHours} /{" "}
                        {currentPlan.estimatedHours} hours
                      </span>
                    </div>
                    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all"
                        style={{
                          width: `${(currentPlan.completedHours / currentPlan.estimatedHours) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => setFilterView("all")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filterView === "all"
                          ? "bg-blue-500 text-white"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      All Tasks
                    </button>
                    <button
                      onClick={() => setFilterView("daily")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filterView === "daily"
                          ? "bg-blue-500 text-white"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setFilterView("weekly")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filterView === "weekly"
                          ? "bg-blue-500 text-white"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      Weekly
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCompleted}
                      onChange={(e) => setShowCompleted(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
                    />
                    Show completed
                  </label>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                  {filteredTasks?.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      planId={currentPlan.id}
                      onToggle={(completed) =>
                        updateTaskStatus(currentPlan.id, task.id, completed)
                      }
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Plan Selected
                </h3>
                <p className="text-gray-400 mb-6">
                  Select an action plan from the sidebar or create a new one
                </p>
                <button
                  onClick={() => navigate("/skill-gaps")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Action Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          selectedGaps={location.state?.selectedGaps || []}
          onClose={() => {
            setShowCreateModal(false);
            navigate(location.pathname, { replace: true, state: {} });
          }}
          onSuccess={() => {
            fetchActionPlans();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

const TaskCard = ({
  task,
  onToggle,
}: {
  task: Task;
  planId: string;
  onToggle: (completed: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      className={`bg-white/5 border rounded-xl transition-all ${
        task.completed ? "border-green-500/20" : "border-white/10"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggle(!task.completed)}
            className="shrink-0 mt-1 transition-transform hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-gray-300" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3
                  className={`font-semibold mb-1 ${
                    task.completed ? "text-gray-400 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300">
                  {task.type}
                </span>
                {task.dueDate && !task.completed && (
                  <span className="text-xs text-orange-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.round(task.estimatedTime / 60)} min</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{task.resources.length} resources</span>
              </div>
              {task.completed && task.completedDate && (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Completed{" "}
                    {new Date(task.completedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isExpanded ? "Hide" : "View"} resources & materials
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10 p-4 bg-black/20">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Learning Resources
          </h4>
          <div className="space-y-3">
            {task.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/50 hover:bg-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                    {resource.title}
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-400" />
                  </h5>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {resource.duration && (
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {resource.duration}
                      </span>
                    )}
                    {resource.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.readTime}
                      </span>
                    )}
                    {resource.problems && (
                      <span>{resource.problems} problems</span>
                    )}
                    {resource.exercises && (
                      <span>{resource.exercises} exercises</span>
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

// Create Plan Modal Component
const CreatePlanModal = ({
  selectedGaps,
  onClose,
  onSuccess,
}: {
  selectedGaps: any[];
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedSkills: selectedGaps.map((g) => `${g.course}-${g.skill}`),
    weeklyHours: 6,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    customTitle: "",
  });
  const [creating, setCreating] = useState(false);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const auth = getAuth();
  const db = getFirestore();

  // Loading messages that cycle during AI generation
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
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [generatingTasks]);

  const generateActionPlan = async () => {
    setCreating(true);
    setGeneratingTasks(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // For each selected skill gap, create an action plan
      for (const gap of selectedGaps) {
        const gapId = `${gap.course}-${gap.skill}`;
        if (!formData.selectedSkills.includes(gapId)) continue;

        // Generate AI tasks for this skill gap
        const tasks = await generateAITasks(gap, formData);

        // Calculate total estimated hours from generated tasks
        const estimatedHours = tasks.reduce(
          (sum, task) => sum + task.estimatedTime / 60,
          0,
        );

        const plan: Omit<ActionPlan, "id"> = {
          userId: user.uid,
          title: formData.customTitle || `Master ${gap.skill}`,
          skillGap: gap.skill,
          course: gap.course,
          priority:
            gap.severity === "critical"
              ? "critical"
              : gap.severity === "moderate"
                ? "high"
                : "medium",
          dueDate:
            formData.dueDate ||
            new Date(
              Date.now() + gap.daysToAddress * 24 * 60 * 60 * 1000,
            ).toISOString(),
          estimatedHours: Math.max(estimatedHours, gap.daysToAddress * 0.5),
          completedHours: 0,
          weeklyAllocation: formData.weeklyHours,
          status: "not_started",
          tasks: tasks,
          createdAt: new Date().toISOString(),
        };

        // Add to Firestore
        await addDoc(collection(db, "actionPlans"), plan);
      }

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

  const generateAITasks = async (gap: any, formData: any): Promise<Task[]> => {
    try {
      // Create a detailed prompt for Gemini
      const prompt = `You are an expert educational content creator. Generate a comprehensive learning plan for mastering "${gap.skill}" in the context of "${gap.course}".

Skill Details:
- Skill: ${gap.skill}
- Course: ${gap.course}
- Severity: ${gap.severity}
- Days to Address: ${gap.daysToAddress}
- Weekly Study Hours: ${formData.weeklyHours}

Generate a structured learning plan with 5-8 tasks that progressively build mastery of this skill. Each task should include:
1. A clear, actionable title
2. A detailed description of what the learner will accomplish
3. Task type (either "daily" for shorter focused tasks or "weekly" for longer project-based tasks)
4. Estimated time in minutes (realistic for the complexity)
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
    "estimatedTime": number (in minutes),
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

      // Call Gemini API
      const response = await generateText(prompt);

      // Parse the JSON response
      let tasksData;
      try {
        // Try to extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          tasksData = JSON.parse(jsonMatch[0]);
        } else {
          tasksData = JSON.parse(response);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        console.log("Raw response:", response);
        throw new Error("Failed to parse AI-generated tasks");
      }

      // Transform the AI response into Task objects with unique IDs
      const tasks: Task[] = tasksData.map((taskData: any, index: number) => ({
        id: `task-${Date.now()}-${index}`,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        estimatedTime: taskData.estimatedTime,
        completed: false,
        resources: taskData.resources || [],
      }));

      return tasks;
    } catch (error) {
      console.error("Error generating AI tasks:", error);

      // Fallback to basic tasks if AI generation fails
      return [
        {
          id: `task-fallback-1-${Date.now()}`,
          title: `Learn ${gap.skill} Fundamentals`,
          description: `Study the core concepts and principles of ${gap.skill}`,
          type: "daily",
          estimatedTime: 90,
          completed: false,
          resources: [
            {
              type: "video",
              title: `${gap.skill} Introduction`,
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              duration: "20 min",
            },
            {
              type: "article",
              title: `Understanding ${gap.skill}`,
              url: "https://medium.com",
              readTime: "15 min read",
            },
          ],
        },
        {
          id: `task-fallback-2-${Date.now()}`,
          title: `Practice ${gap.skill}`,
          description: "Apply what you've learned through hands-on exercises",
          type: "daily",
          estimatedTime: 120,
          completed: false,
          resources: [
            {
              type: "practice",
              title: `${gap.skill} Exercises`,
              url: "https://leetcode.com",
              problems: 10,
            },
          ],
        },
        {
          id: `task-fallback-3-${Date.now()}`,
          title: `Build a ${gap.skill} Project`,
          description: "Create a real-world project demonstrating your mastery",
          type: "weekly",
          estimatedTime: 240,
          completed: false,
          resources: [
            {
              type: "code",
              title: `${gap.skill} Project Guide`,
              url: "https://github.com",
              exercises: 5,
            },
          ],
        },
      ];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Create Action Plan
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Step {currentStep} of 3
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={creating}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Review Selected Skills
                </h3>
                <div className="space-y-3">
                  {selectedGaps.map((gap) => {
                    const gapId = `${gap.course}-${gap.skill}`;
                    return (
                      <label
                        key={gapId}
                        className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedSkills.includes(gapId)}
                          onChange={(e) => {
                            const newSkills = e.target.checked
                              ? [...formData.selectedSkills, gapId]
                              : formData.selectedSkills.filter(
                                  (s) => s !== gapId,
                                );
                            setFormData({
                              ...formData,
                              selectedSkills: newSkills,
                            });
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">
                            {gap.skill}
                          </h4>
                          <p className="text-sm text-gray-400">{gap.course}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
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
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={formData.selectedSkills.length === 0}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Schedule
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 placeholder-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Review Plan
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Review & Confirm
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">
                      Skills to Master
                    </p>
                    <p className="text-white font-semibold">
                      {formData.selectedSkills.length} skill
                      {formData.selectedSkills.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">
                      Weekly Commitment
                    </p>
                    <p className="text-white font-semibold">
                      {formData.weeklyHours} hours per week
                    </p>
                  </div>

                  {formData.dueDate && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Target Date</p>
                      <p className="text-white font-semibold">
                        {new Date(formData.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI-Powered Learning Plan
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>✓ Personalized tasks generated by AI</li>
                      <li>✓ Curated video tutorials and articles</li>
                      <li>✓ Practice problems and exercises</li>
                      <li>✓ Progress tracking and checkpoints</li>
                    </ul>
                  </div>

                  {generatingTasks && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-purple-400 font-medium mb-1">
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
                  className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={generateActionPlan}
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default ActionPlansPage;
