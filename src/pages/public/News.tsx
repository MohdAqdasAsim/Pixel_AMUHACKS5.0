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
import { motion } from "framer-motion";

const News = () => {
  const navigate = useNavigate();

  const comingSoonFeatures = [
    {
      icon: Bell,
      color: "blue",
      title: "Feature Announcements",
      description:
        "Be the first to know about new capabilities and improvements to the Kryva platform.",
    },
    {
      icon: ChartLine,
      color: "purple",
      title: "Research Insights",
      description:
        "Learn about the science behind consequence-aware learning and our latest findings.",
    },
    {
      icon: GraduationCap,
      color: "green",
      title: "Success Stories",
      description:
        "Read inspiring stories from students who transformed their academic journey with Kryva.",
    },
    {
      icon: Rocket,
      color: "orange",
      title: "Product Updates",
      description:
        "Stay updated on bug fixes, performance improvements, and new integrations.",
    },
  ];

  return (
    <div className="flex-1 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-500 mb-4"
          >
            <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            News & Updates
          </h1>
          <p className="text-base sm:text-xl text-gray-400 px-4">
            Stay informed about the latest Kryva developments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-6 sm:space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10"
            >
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-white"
            >
              No News Yet
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4"
            >
              We're working hard to bring you exciting updates about Kryva.
              Check back soon for announcements about new features, research
              insights, and success stories from students using our platform.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {comingSoonFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 text-left"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.9 + index * 0.1 }}
                      className={`w-10 h-10 rounded-full bg-${feature.color}-500/20 flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 text-${feature.color}-400`} />
                    </motion.div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="pt-6 sm:pt-8 border-t border-white/10 mt-8 sm:mt-12"
          >
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              In the meantime, explore what Kryva can do for you
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/how-it-works")}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Learn How It Works
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/docs")}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Read Documentation
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Signup Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-8 sm:mt-12 bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
        >
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3"
          >
            Want to be notified?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4"
          >
            We'll let you know as soon as we have news to share. Updates will be
            posted here and announced to all users.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.7 }}
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300"
          >
            <Bell className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              Notifications enabled for your account
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default News;
