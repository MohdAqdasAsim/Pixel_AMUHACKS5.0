/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Target,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AssessmentResultsProps {
  results: any;
  course: any;
  onBackToCourses: () => void;
}

const AssessmentResults = ({
  results,
  onBackToCourses,
}: AssessmentResultsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return "border-green-500/30";
    if (score >= 60) return "border-yellow-500/30";
    return "border-red-500/30";
  };

  const skillGaps = results.skillGaps || [];

  return (
    <div className="min-h-screen bg-[#0E131C] p-3 sm:p-4 md:p-6 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#028CC0]/10 rounded-full mb-3 sm:mb-4">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#028CC0]" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            Assessment Complete!
          </h1>
          <p className="text-sm sm:text-base text-gray-400 px-4">
            Here's your detailed performance analysis
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${getScoreBg(results.score)} border-2 ${getScoreBorder(results.score)} rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-4 sm:mb-6`}
        >
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-400 mb-2">
              Your Score
            </p>
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${getScoreColor(results.score)} mb-3 sm:mb-4`}
            >
              {results.score}%
            </h2>
            <p className="text-sm sm:text-base text-white">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#242833] border border-gray-700/60 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
              <span className="text-[10px] sm:text-sm text-gray-400">Time</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {formatTime(results.timeElapsed)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#242833] border border-gray-700/60 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
              <span className="text-[10px] sm:text-sm text-gray-400">
                Accuracy
              </span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {Math.round(
                (results.correctAnswers / results.totalQuestions) * 100,
              )}
              %
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#242833] border border-gray-700/60 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />
              <span className="text-[10px] sm:text-sm text-gray-400">Gaps</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {skillGaps.length}
            </p>
          </motion.div>
        </div>

        {/* Topic Performance */}
        {results.topicPerformance &&
          Object.keys(results.topicPerformance).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                Performance by Topic
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(results.topicPerformance).map(
                  ([topic, perf]: any) => {
                    const accuracy = Math.round(
                      (perf.correct / perf.total) * 100,
                    );
                    return (
                      <div key={topic}>
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                          <span className="text-sm sm:text-base text-white font-medium truncate flex-1">
                            {topic}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                            {perf.correct}/{perf.total} ({accuracy}%)
                          </span>
                        </div>
                        <div className="h-2 sm:h-3 bg-[#2B303B] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              accuracy >= 70
                                ? "bg-green-500"
                                : accuracy >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </motion.div>
          )}

        {/* Skill Gaps Identified */}
        {skillGaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0 mt-0.5 sm:mt-1" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-yellow-200 mb-1.5 sm:mb-2">
                  Skill Gaps Identified
                </h3>
                <p className="text-xs sm:text-sm text-yellow-200/80 mb-3 sm:mb-4">
                  We've identified areas where you scored below 70% and need
                  improvement:
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {skillGaps.map((gap: string) => (
                    <span
                      key={gap}
                      className="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-lg text-xs sm:text-sm border border-yellow-500/30"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
                <p className="text-yellow-200/80 text-xs sm:text-sm mb-3 sm:mb-4">
                  These skill gaps have been saved to your profile and will be
                  available in the Skill Gaps section for targeted practice.
                </p>
                <Link
                  to="/skill-gaps"
                  className="inline-flex items-center gap-1.5 sm:gap-2 text-yellow-200 hover:text-yellow-100 font-medium transition-colors text-xs sm:text-sm"
                >
                  View all your skill gaps
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {skillGaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 shrink-0 mt-0.5 sm:mt-1" />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-200 mb-1.5 sm:mb-2">
                  Excellent Performance!
                </h3>
                <p className="text-xs sm:text-sm text-green-200/80">
                  You scored 70% or higher on all topics. Great job! Keep up the
                  excellent work.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assessment Configuration Info */}
        {results.assessmentConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#242833] border border-gray-700/60 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
              Assessment Configuration
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Scope:</span>
                <span className="text-white font-medium">
                  {results.assessmentConfig.scope === "entire"
                    ? "Entire Subject"
                    : "Selected Topics"}
                </span>
              </div>
              {results.assessmentConfig.scope === "selected" &&
                results.assessmentConfig.topics.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 shrink-0">Topics:</span>
                    <div className="flex flex-wrap gap-1">
                      {results.assessmentConfig.topics.map((topic: string) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 bg-[#028CC0]/10 text-[#028CC0] rounded text-xs border border-[#028CC0]/20"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onBackToCourses}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition text-sm sm:text-base"
          >
            Back to Courses
          </button>
          <Link
            to="/skill-gaps"
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition text-center flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            View Skill Gaps
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
