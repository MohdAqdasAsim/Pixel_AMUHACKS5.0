import {
  Newspaper,
  Bell,
  Calendar,
  ArrowRight,
  ChartLine,
  GraduationCap,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const News = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-500 mb-4">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white">News & Updates</h1>
          <p className="text-xl text-gray-400">
            Stay informed about the latest Kryva developments
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-12 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border border-white/10">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>

            <h2 className="text-3xl font-bold text-white">No News Yet</h2>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We're working hard to bring you exciting updates about Kryva.
              Check back soon for announcements about new features, research
              insights, and success stories from students using our platform.
            </p>
          </div>

          {/* Coming Soon Features */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Feature Announcements
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Be the first to know about new capabilities and improvements
                    to the Kryva platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <span className="text-purple-400 text-xl">
                    <ChartLine size={20} />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Research Insights
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Learn about the science behind consequence-aware learning
                    and our latest findings.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <span className="text-green-400 text-xl">
                    <GraduationCap size={20} />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Success Stories
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Read inspiring stories from students who transformed their
                    academic journey with Kryva.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <span className="text-orange-400 text-xl">
                    <Rocket size={20} />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Product Updates
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Stay updated on bug fixes, performance improvements, and new
                    integrations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8 border-t border-white/10 mt-12">
            <p className="text-gray-400 mb-6">
              In the meantime, explore what Kryva can do for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/how-it-works")}
                className="px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn How It Works
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Read Documentation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Placeholder */}
        <div className="mt-12 bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Want to be notified?
          </h3>
          <p className="text-gray-400 mb-6">
            We'll let you know as soon as we have news to share. Updates will be
            posted here and announced to all users.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300">
            <Bell className="w-4 h-4" />
            <span className="text-sm">
              Notifications enabled for your account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
