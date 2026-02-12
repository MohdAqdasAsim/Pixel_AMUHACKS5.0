/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { generateText } from "../../services/gemini";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  explanation?: string;
}

interface AssessmentConfig {
  topics: string[];
  scope: "entire" | "selected";
}

interface AssessmentTestProps {
  course: any;
  assessmentConfig: AssessmentConfig;
  onComplete: (results: any) => void;
  onCancel: () => void;
}

const AssessmentTest = ({
  course,
  assessmentConfig,
  onComplete,
  onCancel,
}: AssessmentTestProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateQuestionsFromGemini();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, assessmentConfig]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateQuestionsFromGemini = async () => {
    setLoading(true);
    setError(null);

    try {
      let scopeDescription = "";

      if (assessmentConfig.scope === "entire") {
        scopeDescription = `Cover the entire ${course.name} subject with a broad range of topics.`;
      } else if (assessmentConfig.topics.length > 0) {
        scopeDescription = `Focus ONLY on these specific topics: ${assessmentConfig.topics.join(", ")}. All questions must be directly related to these topics.`;
      } else {
        scopeDescription = `Cover the entire ${course.name} subject.`;
      }

      const prompt = `Generate 15 adaptive assessment questions for a university course on "${course.name}".

${scopeDescription}

Requirements:
1. Create exactly 15 multiple-choice questions
2. Include 5 easy, 5 medium, and 5 hard questions
3. Each question should have 4 options with only one correct answer
4. Provide a brief explanation for each correct answer
5. ${assessmentConfig.scope === "selected" && assessmentConfig.topics.length > 0 ? `IMPORTANT: All questions must be about the specified topics: ${assessmentConfig.topics.join(", ")}` : "Cover different important topics within the subject"}

Format your response as a valid JSON array with this structure:
[
  {
    "id": "q1",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "Topic name",
    "explanation": "Brief explanation of why this is correct"
  }
]

Important: Return ONLY the JSON array, no additional text or markdown formatting.`;

      const response = await generateText(prompt);

      // Clean the response to extract JSON
      let cleanedResponse = response.trim();

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
      }

      // Parse the JSON
      const generatedQuestions = JSON.parse(cleanedResponse);

      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length === 0
      ) {
        throw new Error("Invalid questions format received");
      }

      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(null));
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");

      // Fallback to sample questions
      const fallbackQuestions = generateFallbackQuestions(
        course.name,
        assessmentConfig,
      );
      setQuestions(fallbackQuestions);
      setAnswers(new Array(fallbackQuestions.length).fill(null));
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackQuestions = (
    _courseName: string,
    config: AssessmentConfig,
  ): Question[] => {
    const topicText =
      config.scope === "selected" && config.topics.length > 0
        ? config.topics[0]
        : "core concepts";

    return [
      {
        id: "q1",
        question: `What is a fundamental concept in ${topicText}?`,
        options: [
          "Understanding core principles and methodologies",
          "Memorizing facts without context",
          "Skipping foundational topics",
          "Avoiding challenging problems",
        ],
        correctAnswer: 0,
        difficulty: "easy",
        topic: topicText,
        explanation: "Understanding core principles is essential for mastery.",
      },
      {
        id: "q2",
        question: `Which approach is most effective for learning ${topicText}?`,
        options: [
          "Passive reading only",
          "Active practice and problem-solving",
          "Last-minute cramming",
          "Avoiding difficult topics",
        ],
        correctAnswer: 1,
        difficulty: "medium",
        topic: topicText,
        explanation: "Active engagement leads to deeper understanding.",
      },
    ];
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(answers[currentQuestionIndex + 1]);
      } else {
        setShowConfirmSubmit(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const topicPerformance: Record<string, { correct: number; total: number }> =
      {};
    const skillGaps: string[] = [];

    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;

      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[question.topic].total++;
      if (isCorrect) topicPerformance[question.topic].correct++;
    });

    // Identify skill gaps (topics with < 70% accuracy)
    Object.entries(topicPerformance).forEach(([topic, perf]) => {
      const accuracy = (perf.correct / perf.total) * 100;
      if (accuracy < 70) {
        skillGaps.push(topic);
      }
    });

    const results = {
      courseId: course.id,
      courseName: course.name,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: Math.round((correctCount / questions.length) * 100),
      timeElapsed,
      topicPerformance,
      skillGaps,
      answers: answers.map((answer, index) => ({
        questionId: questions[index].id,
        question: questions[index].question,
        selectedAnswer: answer,
        correctAnswer: questions[index].correctAnswer,
        isCorrect: answer === questions[index].correctAnswer,
        topic: questions[index].topic,
        difficulty: questions[index].difficulty,
        explanation: questions[index].explanation,
      })),
      completedAt: new Date().toISOString(),
      assessmentConfig,
    };

    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const loadingMessages = [
    "Analyzing your selected topics",
    "Understanding your knowledge level",
    "Designing personalized questions",
    "Optimizing difficulty balance",
    "Structuring your assessment flow",
    "Finalizing intelligent evaluation model",
  ];

  const [dots, setDots] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;

    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Rotate AI messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) =>
        prev === loadingMessages.length - 1 ? 0 : prev + 1,
      );
    }, 2500);

    return () => {
      clearInterval(dotInterval);
      clearInterval(messageInterval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E131C] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg font-semibold mb-2 transition-opacity duration-300">
            {loadingMessages[messageIndex]}
            {dots}
          </p>

          <p className="text-gray-400">
            {assessmentConfig.scope === "selected" &&
            assessmentConfig.topics.length > 0
              ? `Focusing on: ${assessmentConfig.topics.join(", ")}`
              : "Covering the entire subject"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0E131C] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Error Generating Questions
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => generateQuestionsFromGemini()}
            className="bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0E131C] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {course.name}
              </h2>
              <p className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
                {assessmentConfig.scope === "selected" &&
                  assessmentConfig.topics.length > 0 && (
                    <span className="ml-2 text-[#028CC0]">
                      • Topics: {assessmentConfig.topics.join(", ")}
                    </span>
                  )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#2B303B] px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="font-mono text-lg text-white">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors px-4 py-2 hover:bg-[#2B303B] rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-[#2B303B] rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-[#028CC0] to-[#0279A6]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-8 mb-6 shadow-xl"
          >
            {/* Difficulty Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  currentQuestion.difficulty === "easy"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : currentQuestion.difficulty === "medium"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {currentQuestion.difficulty.charAt(0).toUpperCase() +
                  currentQuestion.difficulty.slice(1)}
              </span>
              <span className="text-sm text-gray-400 bg-[#2B303B] px-3 py-1 rounded-full">
                Topic: {currentQuestion.topic}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-2xl font-semibold text-white mb-8 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-[#028CC0] bg-[#028CC0]/10 shadow-lg shadow-[#028CC0]/20"
                      : "border-gray-700/40 bg-[#2B303B] hover:border-gray-600 hover:bg-[#353A47]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedAnswer === index
                          ? "border-[#028CC0] bg-[#028CC0]"
                          : "border-gray-600"
                      }`}
                    >
                      {selectedAnswer === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={selectedAnswer === null}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Assessment
              <CheckCircle size={20} />
            </button>
          )}
        </div>

        {/* Confirm Submit Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#242833] border border-gray-700/60 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="bg-yellow-500/10 p-4 rounded-xl mb-6 border border-yellow-500/20">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white text-center mb-2">
                  Submit Assessment?
                </h3>
                <p className="text-gray-400 text-center text-sm">
                  You have answered {answers.filter((a) => a !== null).length}{" "}
                  out of {questions.length} questions.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition"
                >
                  Submit Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentTest;
