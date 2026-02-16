import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  Brain,
  Award,
  ArrowRight,
  Flame,
  BookOpen,
  BarChart3,
  ChevronRight,
  Sparkles,
  Rocket,
  Play,
  Circle,
  ExternalLink,
  Plus,
  TrendingDown,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchUserSkillGaps,
  fetchUserActionPlans,
  updateTaskStatus as updateTaskStatusFn,
} from "../../services/common";
import type { Course, SkillGap, ActionPlan, Task } from "../../types";
import { fetchUserCourses } from "../../services/common/assessment";

interface DashboardStats {
  totalGaps: number;
  fixedGaps: number;
  hoursInvested: number;
  activePlans: number;
  completionRate: number;
  criticalGaps: number;
  totalCourses: number;
  pendingAssessments: number;
}

const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-4 sm:p-6 animate-pulse min-w-0"
  >
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-gray-700/50" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-5 bg-gray-700/50 rounded w-3/4" />
        <div className="h-4 bg-gray-700/50 rounded w-1/2" />
      </div>
    </div>
    <div className="h-16 bg-gray-700/50 rounded w-full mb-3" />
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-700/50 rounded w-24" />
      <div className="h-4 bg-gray-700/50 rounded w-20" />
    </div>
  </motion.div>
);

const SkeletonTask = () => (
  <div className="bg-linear-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-4 animate-pulse min-w-0">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
        <div className="h-3 bg-gray-700/50 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [, setCourses] = useState<Course[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGaps: 0,
    fixedGaps: 0,
    hoursInvested: 0,
    activePlans: 0,
    completionRate: 0,
    criticalGaps: 0,
    totalCourses: 0,
    pendingAssessments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const [coursesData, gapsData, plansData] = await Promise.all([
        fetchUserCourses(user.uid),
        fetchUserSkillGaps(),
        fetchUserActionPlans(),
      ]);

      setCourses(coursesData);
      setSkillGaps(gapsData);
      setActionPlans(plansData);

      const tasks: Task[] = [];
      plansData.forEach((plan) => {
        if (plan.status === "in_progress" && plan.tasks) {
          const incompleteTasks = plan.tasks
            .filter((task) => !task.completed && task.type === "daily")
            .slice(0, 3);
          tasks.push(...incompleteTasks);
        }
      });
      setTodayTasks(tasks.slice(0, 5));

      const totalGaps = gapsData.length;
      const fixedGaps = gapsData.filter((g) => g.isFixed).length;
      const criticalGaps = gapsData.filter(
        (g) => g.severity === "critical" && !g.isFixed,
      ).length;
      const activePlans = plansData.filter(
        (p) => p.status === "in_progress",
      ).length;
      const hoursInvested = plansData.reduce(
        (sum, plan) => sum + (plan.completedHours || 0),
        0,
      );
      const completionRate =
        plansData.length > 0
          ? plansData.reduce((sum, plan) => {
              const planCompletion =
                plan.estimatedHours > 0
                  ? (plan.completedHours / plan.estimatedHours) * 100
                  : 0;
              return sum + planCompletion;
            }, 0) / plansData.length
          : 0;

      const totalCourses = coursesData.length;
      const pendingAssessments = coursesData.filter(
        (c) => c.status === "pending",
      ).length;

      setStats({
        totalGaps,
        fixedGaps,
        hoursInvested,
        activePlans,
        completionRate,
        criticalGaps,
        totalCourses,
        pendingAssessments,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
      await loadDashboardData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "from-red-500/20 to-orange-500/20 border-red-500/40";
      case "moderate":
        return "from-orange-500/20 to-yellow-500/20 border-orange-500/40";
      default:
        return "from-green-500/20 to-green-500/20 border-green-500/40";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "moderate":
        return <Zap className="w-5 h-5 text-orange-400" />;
      default:
        return <Target className="w-5 h-5 text-green-400" />;
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0A0E14] overflow-x-hidden overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-1 h-8 sm:h-10 lg:h-12 bg-gray-700/50 rounded-full animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                  <div className="h-2.5 sm:h-3 bg-gray-700/50 rounded w-24 sm:w-32 animate-pulse" />
                  <div className="h-8 sm:h-10 bg-gray-700/50 rounded w-36 sm:w-48 animate-pulse" />
                </div>
              </div>
              <div className="h-5 sm:h-6 bg-gray-700/50 rounded w-48 sm:w-64 ml-3 sm:ml-4 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-linear-to-br from-gray-800/50 to-gray-700/30 border border-gray-700/50 rounded-xl p-3 sm:p-4 animate-pulse min-w-0"
                >
                  <div className="h-4 bg-gray-700/50 rounded w-16 mb-3" />
                  <div className="h-8 bg-gray-700/50 rounded w-12" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
              <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="h-8 bg-gray-700/50 rounded w-48 mb-6 animate-pulse" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="h-8 bg-gray-700/50 rounded w-48 mb-6 animate-pulse" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonTask key={i} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 min-w-0">
              <div className="bg-linear-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-sm animate-pulse">
                <div className="h-6 bg-gray-700/50 rounded w-40 mb-6" />
                <div className="space-y-4">
                  <div className="h-3 bg-gray-700/50 rounded w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-black/20 rounded-xl p-4 border border-purple-500/20"
                      >
                        <div className="h-3 bg-gray-700/50 rounded w-16 mb-2" />
                        <div className="h-8 bg-gray-700/50 rounded w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeGaps = skillGaps.filter((g) => !g.isFixed);
  const sortedActiveGaps = activeGaps.sort((a, b) => {
    const severityOrder = { critical: 0, moderate: 1, manageable: 2 };
    if (a.severity !== b.severity) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.daysToAddress - b.daysToAddress;
  });

  return (
    <div className="h-full bg-[#0A0E14] overflow-x-hidden overflow-y-auto no-scrollbar pb-18 lg:pb-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
              <div className="w-1 h-8 sm:h-10 lg:h-12 bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-400 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-emerald-400 uppercase mb-0.5 sm:mb-1">
                  Command Center
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight truncate">
                  Dashboard
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 ml-3 sm:ml-4 line-clamp-2">
              Your learning intelligence hub
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 sm:p-4 min-w-0 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <p className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">
                  Active
                </p>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                {stats.activePlans}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-linear-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 sm:p-4 min-w-0 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                <p className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">
                  Hours
                </p>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                {Math.round(stats.hoursInvested)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-3 sm:p-4 min-w-0 hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
                <p className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">
                  Gaps
                </p>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                {stats.totalGaps}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-3 sm:p-4 min-w-0 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
                <p className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">
                  Fixed
                </p>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                {stats.fixedGaps}
              </p>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {stats.criticalGaps > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-linear-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-2 border-red-500/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden min-w-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)]" />
              <div className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 flex items-center gap-2 flex-wrap">
                    Critical Risk Alert
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-pulse shrink-0" />
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-red-200 mb-3 sm:mb-4 line-clamp-2">
                    You have{" "}
                    <span className="font-bold text-red-400">
                      {stats.criticalGaps} critical skill gap
                      {stats.criticalGaps !== 1 ? "s" : ""}
                    </span>{" "}
                    requiring immediate attention. These gaps have severe
                    consequences if left unaddressed.
                  </p>
                  <button
                    onClick={() => navigate("/skill-gaps")}
                    className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2 group text-xs sm:text-sm lg:text-base"
                  >
                    View Critical Gaps
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm min-w-0"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 min-w-0 flex-1 truncate">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <span className="truncate">Priority Skill Gaps</span>
                </h2>
                <button
                  onClick={() => navigate("/skill-gaps")}
                  className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 group shrink-0 whitespace-nowrap"
                >
                  View All
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {sortedActiveGaps.slice(0, 4).map((gap, index) => (
                  <motion.div
                    key={gap.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`bg-linear-to-br ${getSeverityColor(gap.severity)} border rounded-xl p-3 sm:p-4 lg:p-5 hover:scale-[1.02] transition-all cursor-pointer group min-w-0`}
                    onClick={() => navigate("/skill-gaps")}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 mb-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                        {getSeverityIcon(gap.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors truncate">
                          {gap.skill}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-2 truncate">
                          {gap.courseName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 bg-black/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-white/10 line-clamp-2">
                          {gap.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full font-medium text-[10px] sm:text-xs ${
                            gap.severity === "critical"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : gap.severity === "moderate"
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                : "bg-green-500/20 text-green-300 border border-green-500/30"
                          }`}
                        >
                          {gap.severity.toUpperCase()}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                          {gap.daysToAddress} days
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {gap.performance.correct}/{gap.performance.total}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {sortedActiveGaps.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">
                      No Active Skill Gaps
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-400 mb-4 sm:mb-6">
                      {stats.fixedGaps > 0
                        ? "Great job! All your skill gaps are fixed. Take an assessment to identify new areas for growth."
                        : "Take an assessment to identify areas for improvement."}
                    </p>
                    <button
                      onClick={() => navigate("/assessments")}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all text-xs sm:text-sm lg:text-base inline-flex items-center gap-2"
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      Start Assessment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm min-w-0"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 min-w-0 flex-1 truncate">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                  <span className="truncate">Today's Action Items</span>
                </h2>
                <button
                  onClick={() => navigate("/action-plans")}
                  className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group shrink-0 whitespace-nowrap"
                >
                  View Plans
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task, index) => {
                  const planId = actionPlans.find((p) =>
                    p.tasks?.some((t) => t.id === task.id),
                  )?.id;

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-linear-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-3 sm:p-4 hover:border-cyan-500/40 transition-all group min-w-0"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <button
                          onClick={() => {
                            if (planId) {
                              updateTaskStatus(
                                planId,
                                task.id,
                                !task.completed,
                              );
                            }
                          }}
                          className="shrink-0 mt-1 transition-transform hover:scale-110"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-gray-300" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm sm:text-base font-semibold mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2 ${
                              task.completed
                                ? "text-gray-400 line-through"
                                : "text-white"
                            }`}
                          >
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-3 h-3 shrink-0" />
                              {task.estimatedTime} min
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] sm:text-xs font-medium border border-cyan-500/20 whitespace-nowrap">
                              {task.type}
                            </span>
                            {task.resources && task.resources.length > 0 && (
                              <span className="flex items-center gap-1 text-gray-500 whitespace-nowrap">
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                {task.resources.length} resources
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {todayTasks.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-3" />
                    <p className="text-xs sm:text-sm lg:text-base text-gray-400 mb-3 sm:mb-4">
                      No tasks scheduled for today. Create an action plan to get
                      started!
                    </p>
                    <button
                      onClick={() => navigate("/action-plans")}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all text-xs sm:text-sm inline-flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Create Plan
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-4 sm:space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-linear-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm min-w-0"
            >
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
                <span className="truncate">Overall Progress</span>
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      Completion Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {Math.round(stats.completionRate)}%
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.completionRate}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4 border border-purple-500/20">
                    <p className="text-[10px] sm:text-xs font-mono text-purple-300 uppercase mb-1 sm:mb-2 truncate">
                      Total Gaps
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {stats.totalGaps}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
                    <p className="text-[10px] sm:text-xs font-mono text-emerald-300 uppercase mb-1 sm:mb-2 truncate">
                      Fixed
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {stats.fixedGaps}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4 border border-cyan-500/20 col-span-2">
                    <p className="text-[10px] sm:text-xs font-mono text-cyan-300 uppercase mb-1 sm:mb-2 truncate">
                      Hours Invested
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                      {Math.round(stats.hoursInvested)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm min-w-0"
            >
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                <span className="truncate">Courses</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-400">
                    Total Courses
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">
                    {stats.totalCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <span className="text-xs sm:text-sm text-yellow-400 flex items-center gap-1.5">
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Pending Assessments</span>
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">
                    {stats.pendingAssessments}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm min-w-0"
            >
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />
                <span className="truncate">Quick Actions</span>
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/assessments")}
                  className="w-full p-3 sm:p-4 bg-linear-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl text-left hover:border-emerald-500/50 hover:bg-emerald-500/15 transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                        Take Assessment
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        Identify new skill gaps
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/skill-gaps")}
                  className="w-full p-3 sm:p-4 bg-linear-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl text-left hover:border-orange-500/50 hover:bg-orange-500/15 transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                        Review Skill Gaps
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        Prioritize your learning
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/action-plans")}
                  className="w-full p-3 sm:p-4 bg-linear-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl text-left hover:border-blue-500/50 hover:bg-blue-500/15 transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                        View Action Plans
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        Track your progress
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-linear-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden min-w-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.15),transparent_70%)]" />
              <div className="relative">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-3" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2 flex items-center gap-2">
                  Keep Going!
                  <Rocket className="w-4 h-4 shrink-0" />
                </h3>
                <p className="text-xs sm:text-sm text-yellow-100/80 line-clamp-3">
                  You've invested {Math.round(stats.hoursInvested)} hours into
                  your growth
                  {stats.fixedGaps > 0 &&
                    ` and fixed ${stats.fixedGaps} skill gap${stats.fixedGaps !== 1 ? "s" : ""}`}
                  . Every hour brings you closer to mastery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
