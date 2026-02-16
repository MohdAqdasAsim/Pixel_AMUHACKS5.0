import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Clock,
  Link,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const HowItWorks = () => {
  const { isAuthenticated } = useAuth();
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
    <div className="flex-1 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto overflow-x-hidden no-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Kryva System</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white px-4">
            How It Works
          </h1>
          <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            From assessment to action - discover how Kryva transforms academic
            uncertainty into confident, prioritized learning
          </p>
        </motion.div>

        <div className="space-y-16 sm:space-y-24 mb-12 sm:mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}
              >
                <div className="flex-1 flex justify-center w-full">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-20 blur-3xl rounded-full`}
                    />
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
                      <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        whileInView={{ rotate: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br ${step.color} flex items-center justify-center`}
                      >
                        <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.6 }}
                      className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 px-3 sm:px-4 py-1 sm:py-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full"
                    >
                      <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                        {step.number}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex-1 space-y-4 sm:space-y-6 w-full px-4 sm:px-0"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                      {step.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400">
                      {step.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div
                          className={`w-5 h-5 mt-0.5 shrink-0 rounded-full bg-linear-to-br ${step.color} flex items-center justify-center`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                          {detail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-br from-purple-500/10 via-transparent to-blue-500/10 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-12 sm:mb-20"
        >
          <div className="text-center space-y-4 sm:space-y-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-purple-500 to-blue-500 mb-4"
            >
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-4">
              The Kryva Difference: Consequence-Aware Intelligence
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4">
              Traditional learning platforms tell you what you don't know. Kryva
              tells you which gaps will hurt you most and need immediate
              attention. We prioritize based on:
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {[
                {
                  icon: Clock,
                  title: "Timeline Urgency",
                  desc: "How soon will this gap impact your courses and grades?",
                },
                {
                  icon: Link,
                  title: "Dependency Chain",
                  desc: "What other skills and courses depend on this foundation?",
                },
                {
                  icon: AlertTriangle,
                  title: "Failure Risk",
                  desc: "Can this gap be recovered later, or is it irreversible?",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6"
                  >
                    <div className="mb-3 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Real-World Example
            </h2>
            <p className="text-base sm:text-lg text-gray-400">
              See how Kryva helps a first-semester computer science student
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-red-500/5 border border-red-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Without Kryva
                </h3>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-400">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-green-500/5 border border-green-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  With Kryva
                </h3>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-400">
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
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 sm:space-y-8 bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-4">
            Ready to Make Smarter Academic Decisions?
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Join students who are taking control of their learning journey with
            consequence-aware prioritization.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate(isAuthenticated ? "/assessments" : "/signup")
            }
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
          >
            Start Your Free Assessment
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
