/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Lock,
  Filter,
  Grid3x3,
  List,
  GitBranch,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SkillGap {
  skill: string;
  course: string;
  severity: "critical" | "moderate" | "manageable";
  urgency: "immediate" | "high" | "medium" | "low";
  daysToAddress: number;
  blocks: string[];
  reason: string;
  impact: string;
  performance: {
    correct: number;
    total: number;
  };
}

const SkillGaps = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<
    "grid" | "timeline" | "dependencies"
  >("grid");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const skillConsequences: Record<
    string,
    Omit<SkillGap, "skill" | "course" | "performance">
  > = {
    Limits: {
      severity: "critical",
      urgency: "immediate",
      daysToAddress: 7,
      blocks: ["Differentiation", "Integration", "Sequences and Series"],
      reason: "Foundation for all calculus concepts",
      impact: "Without limits, you cannot understand derivatives or integrals",
    },
    Differentiation: {
      severity: "critical",
      urgency: "immediate",
      daysToAddress: 10,
      blocks: [
        "Applications of Derivatives",
        "Integration",
        "Differential Equations",
      ],
      reason: "Core technique used throughout calculus",
      impact: "Required for optimization, rates of change, and advanced topics",
    },
    Integration: {
      severity: "critical",
      urgency: "high",
      daysToAddress: 14,
      blocks: [
        "Multivariable Calculus",
        "Differential Equations",
        "Vector Calculus",
      ],
      reason: "Essential for area, volume, and advanced mathematics",
      impact: "Blocks progress in physics, engineering, and higher math",
    },
    Functions: {
      severity: "critical",
      urgency: "immediate",
      daysToAddress: 5,
      blocks: ["Limits", "Differentiation", "Integration"],
      reason: "Absolute foundation - everything builds on this",
      impact:
        "Cannot proceed with any calculus without understanding functions",
    },
    "Multivariable Calculus": {
      severity: "moderate",
      urgency: "medium",
      daysToAddress: 21,
      blocks: ["Vector Calculus"],
      reason: "Advanced topic for later in semester",
      impact: "Important for 3D applications but can be addressed later",
    },
    "Differential Equations": {
      severity: "moderate",
      urgency: "medium",
      daysToAddress: 21,
      blocks: [],
      reason: "Advanced application topic",
      impact: "Critical for physics and engineering applications",
    },
    "Sequences and Series": {
      severity: "moderate",
      urgency: "medium",
      daysToAddress: 18,
      blocks: [],
      reason: "Important for convergence and approximation",
      impact: "Needed for Taylor series and numerical methods",
    },
    "Applications of Derivatives": {
      severity: "manageable",
      urgency: "low",
      daysToAddress: 30,
      blocks: [],
      reason: "Practice-based skill",
      impact: "Improves problem-solving but less foundational",
    },
    "Vector Calculus": {
      severity: "manageable",
      urgency: "low",
      daysToAddress: 30,
      blocks: [],
      reason: "End-of-semester topic",
      impact: "Important but typically covered later",
    },
  };

  const processSkillGaps = (): SkillGap[] => {
    if (!userData?.assessments) return [];

    const gaps: SkillGap[] = [];

    Object.entries(userData.assessments).forEach(
      ([course, assessment]: [string, any]) => {
        if (assessment.skillGaps) {
          assessment.skillGaps.forEach((skill: string) => {
            const consequence = skillConsequences[skill] || {
              severity: "manageable" as const,
              urgency: "low" as const,
              daysToAddress: 30,
              blocks: [],
              reason: "Skill needs review",
              impact: "Moderate impact on course performance",
            };

            gaps.push({
              skill,
              course,
              ...consequence,
              performance: assessment.topicPerformance?.[skill] || {
                correct: 0,
                total: 1,
              },
            });
          });
        }
      },
    );

    return gaps.sort((a, b) => {
      const severityOrder = { critical: 0, moderate: 1, manageable: 2 };
      const urgencyOrder = { immediate: 0, high: 1, medium: 2, low: 3 };

      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  };

  const filterGaps = (gaps: SkillGap[]): SkillGap[] => {
    let filtered = gaps;

    if (selectedCourse !== "all") {
      filtered = filtered.filter((gap) => gap.course === selectedCourse);
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter((gap) => gap.severity === activeFilter);
    }

    return filtered;
  };

  const toggleSkillSelection = (skill: string) => {
    const newSelection = new Set(selectedSkills);
    if (newSelection.has(skill)) {
      newSelection.delete(skill);
    } else {
      newSelection.add(skill);
    }
    setSelectedSkills(newSelection);
  };

  const handleCreatePlan = () => {
    if (selectedSkills.size === 0) {
      alert("Please select at least one skill gap to create an action plan");
      return;
    }

    const selectedGaps = skillGaps.filter((gap) =>
      selectedSkills.has(`${gap.course}-${gap.skill}`),
    );
    // Navigate to action plans with selected skills
    navigate("/action-plans", { state: { selectedGaps, mode: "create" } });
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0E131C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-wider">
            ANALYZING GAPS...
          </p>
        </div>
      </div>
    );
  }

  const skillGaps = processSkillGaps();
  const filteredGaps = filterGaps(skillGaps);
  const courses = userData?.courses || [];

  const stats = {
    critical: skillGaps.filter((g) => g.severity === "critical").length,
    moderate: skillGaps.filter((g) => g.severity === "moderate").length,
    manageable: skillGaps.filter((g) => g.severity === "manageable").length,
  };

  return (
    <div className="h-full bg-[#0E131C] overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-linear-to-b from-red-500 to-orange-500 rounded-full" />
            <span className="text-xs font-bold tracking-[0.2em] text-red-400 uppercase">
              Consequence Analysis
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight">
            Skill Gap Analysis
          </h1>

          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            Not all gaps are equal. We've prioritized your weaknesses by
            academic consequence— tackle the critical zones first to prevent
            cascading failures.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative bg-linear-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6 overflow-hidden group hover:border-red-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-xs font-semibold tracking-wider text-red-400/70 uppercase">
                  Critical
                </span>
              </div>
              <div className="text-4xl font-bold text-red-400 mb-1">
                {stats.critical}
              </div>
              <p className="text-sm text-gray-500">Address immediately</p>
            </div>
          </div>

          <div className="relative bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-6 overflow-hidden group hover:border-orange-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-xs font-semibold tracking-wider text-orange-400/70 uppercase">
                  Moderate
                </span>
              </div>
              <div className="text-4xl font-bold text-orange-400 mb-1">
                {stats.moderate}
              </div>
              <p className="text-sm text-gray-500">Plan within 2-3 weeks</p>
            </div>
          </div>

          <div className="relative bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6 overflow-hidden group hover:border-green-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-xs font-semibold tracking-wider text-green-400/70 uppercase">
                  Manageable
                </span>
              </div>
              <div className="text-4xl font-bold text-green-400 mb-1">
                {stats.manageable}
              </div>
              <p className="text-sm text-gray-500">Address when ready</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {selectedSkills.size > 0 && (
          <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">
                  {selectedSkills.size} skill
                  {selectedSkills.size !== 1 ? "s" : ""} selected
                </p>
                <p className="text-sm text-gray-400">
                  Ready to create an action plan
                </p>
              </div>
            </div>
            <button
              onClick={handleCreatePlan}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2 group"
            >
              Create Action Plan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            {[
              { value: "all", label: "All Gaps" },
              { value: "critical", label: "Critical", color: "red" },
              { value: "moderate", label: "Moderate", color: "orange" },
              { value: "manageable", label: "Manageable", color: "green" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

          <div className="flex items-center gap-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map((course: string) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <div className="flex bg-white/5 rounded-lg p-1">
              {[
                { value: "grid", icon: Grid3x3 },
                { value: "timeline", icon: List },
                { value: "dependencies", icon: GitBranch },
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.value}
                    onClick={() => setViewMode(view.value as any)}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === view.value
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Views */}
        {viewMode === "grid" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGaps.map((gap) => {
              const gapId = `${gap.course}-${gap.skill}`;
              const isSelected = selectedSkills.has(gapId);
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
                  key={gapId}
                  onClick={() => toggleSkillSelection(gapId)}
                  className={`relative bg-linear-to-br ${colors.bg} to-transparent border ${colors.border} rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                    isSelected
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0E131C]"
                      : ""
                  }`}
                >
                  {/* Selection Indicator */}
                  <div
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Top Bar */}
                  <div className={`h-1 ${colors.accent} rounded-full mb-4`} />

                  {/* Course Tag */}
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    {gap.course}
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-xl font-bold text-white mb-3 pr-8">
                    {gap.skill}
                  </h3>

                  {/* Reason */}
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {gap.reason}
                  </p>

                  {/* Performance Bar */}
                  <div className="mb-4">
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

                  {/* Timeline */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">
                        {gap.daysToAddress} days
                      </span>
                    </div>
                    {gap.blocks.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Blocks {gap.blocks.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "timeline" && (
          <div className="space-y-8">
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
              }[urgency];

              return (
                <div key={urgency}>
                  <div className="flex items-center gap-4 mb-4">
                    <Target className={`w-5 h-5 text-${labels!.color}-400`} />
                    <h2 className="text-2xl font-bold text-white">
                      {labels!.text}
                    </h2>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-sm text-gray-500">
                      {urgencyGaps.length} gaps
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {urgencyGaps.map((gap) => {
                      const gapId = `${gap.course}-${gap.skill}`;
                      const isSelected = selectedSkills.has(gapId);

                      return (
                        <div
                          key={gapId}
                          onClick={() => toggleSkillSelection(gapId)}
                          className={`bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all ${
                            isSelected ? "ring-2 ring-blue-500" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs text-gray-500 uppercase">
                              {gap.course}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {gap.skill}
                          </h4>
                          <p className="text-sm text-gray-400">{gap.reason}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "dependencies" && (
          <div className="space-y-6">
            {filteredGaps
              .filter((gap) => gap.blocks.length > 0)
              .map((gap) => {
                const gapId = `${gap.course}-${gap.skill}`;
                const isSelected = selectedSkills.has(gapId);
                const colors = {
                  critical: "red",
                  moderate: "orange",
                  manageable: "green",
                }[gap.severity];

                return (
                  <div
                    key={gapId}
                    onClick={() => toggleSkillSelection(gapId)}
                    className={`bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/20 transition-all ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className={`bg-${colors}-500/20 border border-${colors}-500/30 rounded-lg p-6 min-w-70`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">
                            Fix First
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {gap.skill}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">
                          {gap.course}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Clock className="w-4 h-4" />
                          {gap.daysToAddress} days
                        </div>
                      </div>

                      <div className="flex items-center px-4">
                        <ArrowRight className={`w-8 h-8 text-${colors}-400`} />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                          Unlocks
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {gap.blocks.map((blockedSkill) => (
                            <div
                              key={blockedSkill}
                              className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white"
                            >
                              {blockedSkill}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Empty State */}
        {filteredGaps.length === 0 && (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No skill gaps found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or complete an assessment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGaps;
