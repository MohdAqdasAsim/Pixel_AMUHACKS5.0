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
    <div className="min-h-screen bg-[#0E131C] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#028CC0]/10 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-[#028CC0]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Assessment Complete!
          </h1>
          <p className="text-gray-400">
            Here's your detailed performance analysis
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${getScoreBg(results.score)} border-2 ${getScoreBorder(results.score)} rounded-2xl p-8 mb-6`}
        >
          <div className="text-center">
            <p className="text-gray-400 mb-2">Your Score</p>
            <h2
              className={`text-6xl font-bold ${getScoreColor(results.score)} mb-4`}
            >
              {results.score}%
            </h2>
            <p className="text-white">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#242833] border border-gray-700/60 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Time Taken</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatTime(results.timeElapsed)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#242833] border border-gray-700/60 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-white">
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
            className="bg-[#242833] border border-gray-700/60 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Skill Gaps</span>
            </div>
            <p className="text-2xl font-bold text-white">{skillGaps.length}</p>
          </motion.div>
        </div>

        {/* Topic Performance */}
        {results.topicPerformance &&
          Object.keys(results.topicPerformance).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#242833] border border-gray-700/60 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Performance by Topic
              </h3>
              <div className="space-y-4">
                {Object.entries(results.topicPerformance).map(
                  ([topic, perf]: any) => {
                    const accuracy = Math.round(
                      (perf.correct / perf.total) * 100,
                    );
                    return (
                      <div key={topic}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            {topic}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {perf.correct}/{perf.total} correct ({accuracy}%)
                          </span>
                        </div>
                        <div className="h-3 bg-[#2B303B] rounded-full overflow-hidden">
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
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-200 mb-2">
                  Skill Gaps Identified
                </h3>
                <p className="text-yellow-200/80 mb-4">
                  We've identified areas where you scored below 70% and need
                  improvement:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillGaps.map((gap: string) => (
                    <span
                      key={gap}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-lg text-sm border border-yellow-500/30"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
                <p className="text-yellow-200/80 text-sm mb-4">
                  These skill gaps have been saved to your profile and will be
                  available in the Skill Gaps section for targeted practice.
                </p>
                <Link
                  to="/skill-gaps"
                  className="inline-flex items-center gap-2 text-yellow-200 hover:text-yellow-100 font-medium transition-colors"
                >
                  View all your skill gaps
                  <ArrowRight className="w-4 h-4" />
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
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-200 mb-2">
                  Excellent Performance!
                </h3>
                <p className="text-green-200/80">
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
            className="bg-[#242833] border border-gray-700/60 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              Assessment Configuration
            </h3>
            <div className="space-y-2 text-sm">
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
                    <span className="text-gray-400">Topics:</span>
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
        <div className="flex gap-4">
          <button
            onClick={onBackToCourses}
            className="flex-1 px-6 py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition"
          >
            Back to Courses
          </button>
          <Link
            to="/skill-gaps"
            className="flex-1 px-6 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition text-center flex items-center justify-center gap-2"
          >
            View Skill Gaps
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
