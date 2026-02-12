import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  ClipboardList,
  Brain,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Student Onboarding & Course Input",
      description:
        "Begin your journey by providing your course schedule, academic timeline, and learning goals. Kryva integrates your academic context to understand what matters most.",
      details: [
        "Add current courses and subjects",
        "Import syllabus and deadline information",
        "Define your academic goals and priorities",
        "Set up notification preferences",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: ClipboardList,
      title: "Skill Assessment",
      description:
        "Take adaptive tests designed to accurately identify your current proficiencies and skill gaps across all relevant domains.",
      details: [
        "Adaptive questioning that adjusts to your level",
        "Comprehensive coverage of course prerequisites",
        "30-45 minute initial assessment",
        "Pause and resume at your convenience",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "03",
      icon: Brain,
      title: "Consequence-Weighted Analysis",
      description:
        "Our intelligent engine analyzes your skill gaps and prioritizes them based on academic impact, timeline urgency, and prerequisite dependencies.",
      details: [
        "Identifies irreversible failure risks",
        "Calculates consequence scores for each gap",
        "Maps skill dependencies across courses",
        "Considers upcoming deadlines and milestones",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "04",
      icon: Target,
      title: "Action Plan Generation",
      description:
        "Receive a personalized, step-by-step roadmap that tells you exactly what to work on, when, and why it matters.",
      details: [
        "Prioritized learning objectives",
        "Resource recommendations and materials",
        "Time estimates for each task",
        "Clear success criteria and checkpoints",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      number: "05",
      icon: TrendingUp,
      title: "Progress Tracking & Reassessment",
      description:
        "Monitor your improvement with continuous tracking and periodic reassessments that keep your action plan current and relevant.",
      details: [
        "Real-time progress visualization",
        "Achievement tracking and milestones",
        "Regular reassessment recommendations",
        "Adaptive plan adjustments",
      ],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>The Kryva System</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            How It Works
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From assessment to action - discover how Kryva transforms academic
            uncertainty into confident, prioritized learning
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-24 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.number}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                {/* Visual Side */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-20 blur-3xl rounded-full`}
                    />
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                      <div
                        className={`w-32 h-32 rounded-full bg-linear-to-br ${step.color} flex items-center justify-center`}
                      >
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 px-4 py-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-gray-400">{step.description}</p>
                  </div>

                  <div className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 mt-0.5 shrink-0 bg-linear-to-br ${step.color} bg-clip-text text-transparent`}
                          style={{
                            WebkitTextFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                          }}
                        />
                        <span className="text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Differentiator Section */}
        <div className="bg-linear-to-br from-purple-500/10 via-transparent to-blue-500/10 border border-white/10 rounded-3xl p-8 md:p-12 mb-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-blue-500 mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              The Kryva Difference: Consequence-Aware Intelligence
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Traditional learning platforms tell you what you don't know. Kryva
              tells you which gaps will hurt you most and need immediate
              attention. We prioritize based on:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Timeline Urgency
                </h3>
                <p className="text-gray-400 text-sm">
                  How soon will this gap impact your courses and grades?
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Dependency Chain
                </h3>
                <p className="text-gray-400 text-sm">
                  What other skills and courses depend on this foundation?
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-3">💥</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Failure Risk
                </h3>
                <p className="text-gray-400 text-sm">
                  Can this gap be recovered later, or is it irreversible?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Scenario */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real-World Example
            </h2>
            <p className="text-lg text-gray-400">
              See how Kryva helps a first-semester computer science student
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-xl">❌</span>
                </div>
                <h3 className="text-xl font-bold text-white">Without Kryva</h3>
              </div>
              <div className="space-y-3 text-gray-400">
                <p>
                  Sarah struggles with both calculus and programming
                  fundamentals.
                </p>
                <p>
                  She spends equal time on both, thinking they're equally
                  important.
                </p>
                <p>
                  By midterm, her weak programming skills prevent her from
                  completing data structures assignments - a course that builds
                  heavily on programming basics.
                </p>
                <p className="text-red-400 font-semibold">
                  Result: Failed data structures course, lost confidence,
                  considering dropping CS major.
                </p>
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-white">With Kryva</h3>
              </div>
              <div className="space-y-3 text-gray-400">
                <p>
                  Sarah uses Kryva, which identifies both gaps but flags
                  programming as CRITICAL.
                </p>
                <p>
                  The system explains: "Programming fundamentals are
                  prerequisites for data structures starting Week 4. Calculus
                  has more recovery time."
                </p>
                <p>
                  Sarah focuses intensely on programming first, then addresses
                  calculus before the midterm.
                </p>
                <p className="text-green-400 font-semibold">
                  Result: Passed both courses, built strong foundation,
                  confident in CS path.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8 bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Make Smarter Academic Decisions?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join students who are taking control of their learning journey with
            consequence-aware prioritization.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="group px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            Start Your Free Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
