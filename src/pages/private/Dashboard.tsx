import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
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
  PlayCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SkillGap {
  id: string;
  skill: string;
  course: string;
  severity: "critical" | "moderate" | "minor";
  currentLevel: number;
  requiredLevel: number;
  daysToAddress: number;
  consequence: string;
  identifiedDate: string;
  status: "identified" | "in_progress" | "resolved";
}

interface ActionPlan {
  id: string;
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
}

interface Task {
  id: string;
  title: string;
  type: "daily" | "weekly";
  estimatedTime: number;
  completed: boolean;
  dueDate?: string;
}

interface DashboardStats {
  totalGaps: number;
  resolvedGaps: number;
  hoursInvested: number;
  activePlans: number;
  completionRate: number;
  criticalGaps: number;
}

const Dashboard = () => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [, setActionPlans] = useState<ActionPlan[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGaps: 0,
    resolvedGaps: 0,
    hoursInvested: 0,
    activePlans: 0,
    completionRate: 0,
    criticalGaps: 0,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const fetchDashboardData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch user document to get skill gaps from assessments
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const gaps: SkillGap[] = [];

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const assessments = userData.assessments || {};

        // Extract skill gaps from all course assessments
        Object.keys(assessments).forEach((courseName) => {
          const assessment = assessments[courseName];
          const skillGapsList = assessment.skillGaps || [];
          const topicPerformance = assessment.topicPerformance || {};

          skillGapsList.forEach((skill: string) => {
            // Get performance data for this skill
            const performance = topicPerformance[skill] || {
              correct: 0,
              total: 1,
            };
            const currentLevel = Math.round(
              (performance.correct / performance.total) * 10,
            );
            const requiredLevel = 7; // Assuming 70% is required level

            // Determine severity based on performance
            let severity: "critical" | "moderate" | "minor";
            const percentageCorrect =
              (performance.correct / performance.total) * 100;

            if (percentageCorrect < 30) {
              severity = "critical";
            } else if (percentageCorrect < 60) {
              severity = "moderate";
            } else {
              severity = "minor";
            }

            // Calculate days to address based on severity
            const daysToAddress =
              severity === "critical" ? 7 : severity === "moderate" ? 14 : 21;

            gaps.push({
              id: `${courseName}-${skill}`,
              skill: skill,
              course: courseName,
              severity: severity,
              currentLevel: currentLevel,
              requiredLevel: requiredLevel,
              daysToAddress: daysToAddress,
              consequence: `Low proficiency in ${skill} may impact your performance in ${courseName}`,
              identifiedDate:
                assessment.completedAt || new Date().toISOString(),
              status: "identified",
            });
          });
        });
      }

      // Sort by severity and days to address
      const sortedGaps = gaps.sort((a, b) => {
        const severityOrder = { critical: 0, moderate: 1, minor: 2 };
        if (a.severity !== b.severity) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return a.daysToAddress - b.daysToAddress;
      });

      setSkillGaps(sortedGaps);

      // Fetch action plans
      const plansRef = collection(db, "actionPlans");
      const plansQuery = query(plansRef, where("userId", "==", user.uid));
      const plansSnapshot = await getDocs(plansQuery);

      const plans: ActionPlan[] = [];
      plansSnapshot.forEach((docSnap) => {
        plans.push({ id: docSnap.id, ...docSnap.data() } as ActionPlan);
      });

      setActionPlans(plans);

      // Extract today's tasks (daily tasks that are incomplete)
      const allTasks: Task[] = [];

      plans.forEach((plan) => {
        if (plan.tasks && Array.isArray(plan.tasks)) {
          plan.tasks
            .filter((task) => !task.completed && task.type === "daily")
            .forEach((task) => {
              allTasks.push(task);
            });
        }
      });

      setTodayTasks(allTasks.slice(0, 5)); // Limit to 5 tasks

      // Calculate stats
      const totalGaps = gaps.length;
      const resolvedGaps = 0; // We'll track this separately when users mark gaps as resolved
      const criticalGaps = gaps.filter((g) => g.severity === "critical").length;
      const hoursInvested = plans.reduce(
        (sum, plan) => sum + (plan.completedHours || 0),
        0,
      );
      const activePlans = plans.filter(
        (p) => p.status === "in_progress" || p.status === "not_started",
      ).length;
      const completionRate =
        plans.length > 0
          ? plans.reduce((sum, plan) => {
              const planCompletion =
                plan.estimatedHours > 0
                  ? (plan.completedHours / plan.estimatedHours) * 100
                  : 0;
              return sum + planCompletion;
            }, 0) / plans.length
          : 0;

      setStats({
        totalGaps,
        resolvedGaps,
        hoursInvested,
        activePlans,
        completionRate,
        criticalGaps,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "from-red-500/20 to-orange-500/20 border-red-500/40";
      case "moderate":
        return "from-orange-500/20 to-yellow-500/20 border-orange-500/40";
      default:
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/40";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "moderate":
        return <Zap className="w-5 h-5 text-orange-400" />;
      default:
        return <Target className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0A0E14] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-wider font-mono">
            INITIALIZING DASHBOARD...
          </p>
        </div>
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
                  Command Center
                </p>
                <h1 className="text-5xl font-bold text-white tracking-tight">
                  Dashboard
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg ml-4">
              Your learning intelligence hub
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-mono text-gray-400 uppercase">
                  Active
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.activePlans}
              </p>
            </div>

            <div className="bg-linear-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <p className="text-xs font-mono text-gray-400 uppercase">
                  Hours
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {Math.round(stats.hoursInvested)}
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-mono text-gray-400 uppercase">
                  Gaps
                </p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalGaps}</p>
            </div>

            <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-400" />
                <p className="text-xs font-mono text-gray-400 uppercase">
                  Rate
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {Math.round(stats.completionRate)}%
              </p>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        {stats.criticalGaps > 0 && (
          <div className="bg-linear-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-2 border-red-500/40 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)]" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Critical Risk Alert
                  <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                </h3>
                <p className="text-red-200 mb-4">
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
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2 group"
                >
                  View Critical Gaps
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Skill Gaps & Action Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prioritized Skill Gaps */}
            <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  Priority Skill Gaps
                </h2>
                <button
                  onClick={() => navigate("/skill-gaps")}
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {skillGaps.slice(0, 4).map((gap) => (
                  <div
                    key={gap.id}
                    className={`bg-linear-to-br ${getSeverityColor(gap.severity)} border rounded-xl p-5 hover:scale-[1.02] transition-all cursor-pointer group`}
                    onClick={() =>
                      navigate("/skill-gaps", { state: { course: gap.course } })
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                          {getSeverityIcon(gap.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                            {gap.skill}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {gap.course}
                          </p>
                          <p className="text-sm text-gray-300 bg-black/20 rounded-lg px-3 py-2 border border-white/10">
                            {gap.consequence}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            gap.severity === "critical"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : gap.severity === "moderate"
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {gap.severity.toUpperCase()}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {gap.daysToAddress} days to address
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <BarChart3 className="w-4 h-4" />
                        {gap.currentLevel}/{gap.requiredLevel}
                      </div>
                    </div>
                  </div>
                ))}

                {skillGaps.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Skill Gaps Detected
                    </h3>
                    <p className="text-gray-400 mb-6">
                      You're all caught up! Take an assessment to identify new
                      areas for growth.
                    </p>
                    <button
                      onClick={() => navigate("/assessment")}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Start Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Action Items */}
            <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  Action Items Today
                </h2>
                <button
                  onClick={() => navigate("/action-plans")}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group"
                >
                  View Plans
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-linear-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                        <PlayCircle className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.estimatedTime} min
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                            {task.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {todayTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                    <p className="text-gray-400">
                      No tasks scheduled for today. Create an action plan to get
                      started!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Progress & Quick Actions */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="bg-linear-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Overall Progress
              </h2>

              <div className="space-y-6">
                {/* Completion Rate */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">
                      Completion Rate
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(stats.completionRate)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-xs font-mono text-purple-300 uppercase mb-2">
                      Total Gaps
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalGaps}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/20">
                    <p className="text-xs font-mono text-emerald-300 uppercase mb-2">
                      Resolved
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {stats.resolvedGaps}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 border border-cyan-500/20 col-span-2">
                    <p className="text-xs font-mono text-cyan-300 uppercase mb-2">
                      Hours Invested
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {Math.round(stats.hoursInvested)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/assessment")}
                  className="w-full p-4 bg-linear-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl text-left hover:border-emerald-500/50 hover:bg-emerald-500/15 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        Take Assessment
                      </h4>
                      <p className="text-xs text-gray-400">
                        Identify new skill gaps
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/skill-gaps")}
                  className="w-full p-4 bg-linear-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl text-left hover:border-orange-500/50 hover:bg-orange-500/15 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-orange-300 transition-colors">
                        Review Skill Gaps
                      </h4>
                      <p className="text-xs text-gray-400">
                        Prioritize your learning
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/action-plans")}
                  className="w-full p-4 bg-linear-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl text-left hover:border-blue-500/50 hover:bg-blue-500/15 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        View Action Plans
                      </h4>
                      <p className="text-xs text-gray-400">
                        Track your progress
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>

            {/* Motivational Card */}
            <div className="bg-linear-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.15),transparent_70%)]" />
              <div className="relative">
                <Flame className="w-8 h-8 text-yellow-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">
                  Keep Going! 🚀
                </h3>
                <p className="text-sm text-yellow-100/80">
                  You've invested {Math.round(stats.hoursInvested)} hours into
                  your growth. Every hour brings you closer to mastery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
