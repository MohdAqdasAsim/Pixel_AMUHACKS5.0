import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BookOpen,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const trailerVideoId = import.meta.env.VITE_TRAILER_VIDEO_ID;
  const showcaseVideoId = import.meta.env.VITE_SHOWCASE_VIDEO_ID;

  const features = [
    {
      icon: Target,
      color: "blue",
      title: "Consequence-Aware Prioritization",
      description:
        "Identifies which skill gaps pose the greatest risk to your academic success and prioritizes them accordingly.",
    },
    {
      icon: TrendingUp,
      color: "purple",
      title: "Adaptive Assessment",
      description:
        "Smart tests that adapt to your level and accurately pinpoint your current proficiencies and gaps.",
    },
    {
      icon: Shield,
      color: "green",
      title: "Early Intervention",
      description:
        "Catches time-critical deficiencies before they cascade into larger academic problems.",
    },
    {
      icon: BookOpen,
      color: "yellow",
      title: "Personalized Action Plans",
      description:
        "Tailored step-by-step guidance that fits your schedule, learning style, and academic goals.",
    },
    {
      icon: Zap,
      color: "pink",
      title: "Progress Tracking",
      description:
        "Continuous monitoring and reassessment to ensure you're always on the right track.",
    },
    {
      icon: Users,
      color: "cyan",
      title: "Built for First-Semester",
      description:
        "Specifically designed for the unique challenges and vulnerabilities of first-semester students.",
    },
  ];

  const stats = [
    {
      value: "85%",
      label: "of first-semester struggles stem from misprioritization",
      gradient: "from-blue-400 to-purple-400",
    },
    {
      value: "3x",
      label: "faster skill gap identification than traditional methods",
      gradient: "from-green-400 to-cyan-400",
    },
    {
      value: "100%",
      label: "autonomous - no dependency on advisors or instructors",
      gradient: "from-pink-400 to-red-400",
    },
  ];

  return (
    <div className="flex-1">
      <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-24 md:py-32">
        <div className="absolute inset-0 bg-linear-to-b from-blue-600/10 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4"
            >
              <Zap className="w-4 h-4" />
              <span>Consequence-Aware Learning</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight px-4"
            >
              Stop Guessing.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                Start Prioritizing.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto px-4"
            >
              Kryva helps first-semester students identify and tackle critical
              skill gaps before they become irreversible academic failures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-8 px-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/how-it-works")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 border border-white/10 transition-all duration-300 text-sm sm:text-base"
              >
                See How It Works
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {(trailerVideoId || showcaseVideoId) && (
        <section className="px-4 sm:px-6 py-12 sm:py-20 bg-linear-to-b from-transparent to-blue-950/20">
          <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
            {trailerVideoId && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="text-center space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    Meet Kryva
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg px-4">
                    Watch our trailer to see the future of academic success
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerVideoId}`}
                    title="Kryva Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-4">
              The Real Problem Isn't{" "}
              <span className="text-red-400">Motivation</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              It's misprioritization. First-semester students struggle not
              because they don't care, but because they don't know which skill
              gaps to fix first.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-linear-to-br from-red-500/10 to-transparent border border-red-500/20"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl sm:text-3xl">
                  <AlertTriangle size={20} />
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                The Consequences
              </h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Undue stress and anxiety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Poor grades despite effort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Higher risk of academic attrition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Irreversible skill gaps that compound</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-linear-to-br from-green-500/10 to-transparent border border-green-500/20"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl sm:text-3xl">
                  <Check size={20} />
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                The Solution
              </h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Consequence-based prioritization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Early identification of critical gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Actionable, step-by-step guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Self-guided progress tracking</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 bg-linear-to-b from-blue-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-4">
              Smarter Learning, Better Outcomes
            </h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Kryva treats learning as a decision-making problem, not a
              motivation issue
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-${feature.color}-500/20 flex items-center justify-center mb-4`}
                  >
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-${feature.color}-400`}
                    />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center space-y-2"
              >
                <div
                  className={`text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r ${stat.gradient}`}
                >
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-400 px-4">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {(trailerVideoId || showcaseVideoId) && (
        <section className="px-4 sm:px-6 py-12 sm:py-20 bg-linear-to-b from-transparent to-blue-950/20">
          <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
            {showcaseVideoId && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="text-center space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    See It In Action
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg px-4">
                    Detailed walkthrough of Kryva's powerful features
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${showcaseVideoId}`}
                    title="Kryva Showcase"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 py-12 sm:py-20 bg-linear-to-b from-transparent via-blue-950/30 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-4">
            Ready to Take Control of Your Academic Journey?
          </h2>
          <p className="text-base sm:text-xl text-gray-400 px-4">
            Join Kryva today and start making smarter learning decisions.
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
      </section>
    </div>
  );
};

export default Landing;
