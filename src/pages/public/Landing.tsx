import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const trailerVideoId = import.meta.env.VITE_TRAILER_VIDEO_ID;
  const showcaseVideoId = import.meta.env.VITE_SHOWCASE_VIDEO_ID;

  return (
    <div className="flex-1">
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-linear-to-b from-blue-600/10 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
              <Zap className="w-4 h-4" />
              <span>Consequence-Aware Learning</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Stop Guessing.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                Start Prioritizing.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Kryva helps first-semester students identify and tackle critical
              skill gaps before they become irreversible academic failures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                className="group px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/how-it-works")}
                className="px-8 py-4 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {(trailerVideoId || showcaseVideoId) && (
        <section className="px-6 py-20 bg-linear-to-b from-transparent to-blue-950/20">
          <div className="max-w-6xl mx-auto space-y-16">
            {trailerVideoId && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Meet Kryva
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Watch our trailer to see the future of academic success
                  </p>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerVideoId}`}
                    title="Kryva Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              The Real Problem Isn't{" "}
              <span className="text-red-400">Motivation</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              It's misprioritization. First-semester students struggle not
              because they don't care, but because they don't know which skill
              gaps to fix first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-linear-to-br from-red-500/10 to-transparent border border-red-500/20">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                The Consequences
              </h3>
              <ul className="space-y-2 text-gray-400">
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
            </div>

            <div className="p-8 rounded-2xl bg-linear-to-br from-green-500/10 to-transparent border border-green-500/20">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                The Solution
              </h3>
              <ul className="space-y-2 text-gray-400">
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
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-linear-to-b from-blue-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Smarter Learning, Better Outcomes
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Kryva treats learning as a decision-making problem, not a
              motivation issue
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Consequence-Aware Prioritization
              </h3>
              <p className="text-gray-400">
                Identifies which skill gaps pose the greatest risk to your
                academic success and prioritizes them accordingly.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Adaptive Assessment
              </h3>
              <p className="text-gray-400">
                Smart tests that adapt to your level and accurately pinpoint
                your current proficiencies and gaps.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Early Intervention
              </h3>
              <p className="text-gray-400">
                Catches time-critical deficiencies before they cascade into
                larger academic problems.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Personalized Action Plans
              </h3>
              <p className="text-gray-400">
                Tailored step-by-step guidance that fits your schedule, learning
                style, and academic goals.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-400">
                Continuous monitoring and reassessment to ensure you're always
                on the right track.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Built for First-Semester
              </h3>
              <p className="text-gray-400">
                Specifically designed for the unique challenges and
                vulnerabilities of first-semester students.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                85%
              </div>
              <div className="text-gray-400">
                of first-semester struggles stem from misprioritization
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-cyan-400">
                3x
              </div>
              <div className="text-gray-400">
                faster skill gap identification than traditional methods
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-red-400">
                100%
              </div>
              <div className="text-gray-400">
                autonomous - no dependency on advisors or instructors
              </div>
            </div>
          </div>
        </div>
      </section>

      {(trailerVideoId || showcaseVideoId) && (
        <section className="px-6 py-20 bg-linear-to-b from-transparent to-blue-950/20">
          <div className="max-w-6xl mx-auto space-y-16">
            {showcaseVideoId && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    See It In Action
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Detailed walkthrough of Kryva's powerful features
                  </p>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${showcaseVideoId}`}
                    title="Kryva Showcase"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="px-6 py-20 bg-linear-to-b from-transparent via-blue-950/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Take Control of Your Academic Journey?
          </h2>
          <p className="text-xl text-gray-400">
            Join Kryva today and start making smarter learning decisions.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="group px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            Start Your Free Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
