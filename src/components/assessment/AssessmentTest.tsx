/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type { JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
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

const renderTextWithMath = (text: string) => {
  const blockMathRegex = /\$\$(.+?)\$\$/gs;
  const blockMatches = [...text.matchAll(blockMathRegex)];

  if (blockMatches.length > 0) {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    blockMatches.forEach((match, i) => {
      const mathContent = match[1];
      const beforeMath = text.slice(lastIndex, match.index);

      if (beforeMath) {
        parts.push(beforeMath);
      }

      parts.push(<BlockMath key={`block-math-${i}`} math={mathContent} />);

      lastIndex = match.index! + match[0].length;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  }

  const inlineMathRegex = /\$(.+?)\$/g;
  const matches = [...text.matchAll(inlineMathRegex)];

  if (matches.length === 0) {
    return text;
  }

  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    const mathContent = match[1];
    const beforeMath = text.slice(lastIndex, match.index);

    if (beforeMath) {
      parts.push(beforeMath);
    }

    parts.push(<InlineMath key={`inline-math-${i}`} math={mathContent} />);

    lastIndex = match.index! + match[0].length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};

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
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateQuestionsFromGemini();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, assessmentConfig]);

  const generateQuestionsFromGemini = async () => {
    setLoading(true);
    setError(null);

    try {
      let scopeDescription = "";
      let topicGuidance = "";

      if (assessmentConfig.scope === "entire") {
        scopeDescription = `Generate a comprehensive assessment covering the entire ${course.name} subject.`;
        topicGuidance = `Include questions from various fundamental and advanced topics within ${course.name}.`;
      } else if (assessmentConfig.topics.length > 0) {
        scopeDescription = `Generate an assessment EXCLUSIVELY focused on the following topics: ${assessmentConfig.topics.join(", ")}.`;
        topicGuidance = `CRITICAL: Every single question MUST directly relate to one of these specific topics: ${assessmentConfig.topics.join(", ")}. Do NOT include questions from other areas of ${course.name}.`;
      } else {
        scopeDescription = `Generate a comprehensive assessment for ${course.name}.`;
        topicGuidance = `Cover the main topics within ${course.name}.`;
      }

      const prompt = `You are an expert assessment designer for university-level courses. Generate 18 high-quality, pedagogically sound assessment questions for "${course.name}".

${scopeDescription}

MANDATORY REQUIREMENTS:
1. Generate EXACTLY 18 questions
2. Difficulty distribution: 6 easy, 6 medium, 6 hard questions
3. Each question MUST have exactly 4 answer options
4. Only ONE option should be correct
5. ${topicGuidance}
6. Questions should test:
   - Easy: Basic concepts, definitions, fundamental understanding
   - Medium: Application of concepts, problem-solving, analysis
   - Hard: Synthesis, evaluation, complex scenarios, edge cases

MATH FORMATTING RULES (CRITICAL):
- Use $...$ for inline math expressions
- Use $$...$$ for block/display math expressions
- In JSON strings, you MUST use double backslashes for LaTeX commands: \\\\sqrt, \\\\frac, \\\\int
- Examples in JSON:
  * "question": "What is $\\\\sqrt{16}$?"
  * "options": ["$\\\\frac{3}{4}$", "$\\\\frac{1}{2}$", "$0.75$", "$1.5$"]
  * For display math: "$$\\\\int_0^1 x^2 dx$$"
- Common LaTeX commands: \\\\sqrt, \\\\frac, \\\\int, \\\\sum, \\\\pi, \\\\alpha, \\\\beta, \\\\theta
- Superscripts: x^2, x^{10}
- Subscripts: x_1, x_{10}

QUALITY STANDARDS:
- Make questions clear, unambiguous, and professionally worded
- Ensure incorrect options are plausible but clearly wrong to someone who knows the material
- Avoid trick questions or ambiguous wording
- Test actual understanding, not just memorization
- Include brief, educational explanations for correct answers
- Use realistic scenarios and practical examples where appropriate

${
  assessmentConfig.scope === "selected" && assessmentConfig.topics.length > 0
    ? `
CRITICAL TOPIC CONSTRAINT:
The assessment is SPECIFICALLY about: ${assessmentConfig.topics.join(", ")}
EVERY question must be directly about one of these topics. Label each question with its specific topic.
DO NOT include questions about other aspects of ${course.name}.
`
    : ""
}

Return your response as a valid JSON array with this EXACT structure:
[
  {
    "id": "q1",
    "question": "Clear, specific question text here (use $\\\\sqrt{x}$ for math)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "Specific topic name from the provided list",
    "explanation": "Clear explanation of why this answer is correct and why it matters"
  }
]

CRITICAL: Return ONLY the JSON array. No markdown, no code blocks, no additional text. Ensure all backslashes in LaTeX are properly doubled (\\\\).`;

      const response = await generateText(prompt);

      let cleanedResponse = response.trim();

      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
      }

      let generatedQuestions;
      try {
        generatedQuestions = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.warn(
          "Initial parse failed, attempting to fix LaTeX escaping...",
          parseError,
        );

        let fixedResponse = cleanedResponse;

        fixedResponse = fixedResponse.replace(
          /(\$\$?)((?:[^$]|\$(?!\$))*?)(\$\$?)/g,
          (open, content, close) => {
            const fixed = content.replace(/\\(?!\\)/g, "\\\\");
            return open + fixed + close;
          },
        );

        generatedQuestions = JSON.parse(fixedResponse);
      }

      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length === 0
      ) {
        throw new Error("Invalid questions format received");
      }

      const validatedQuestions = generatedQuestions.filter((q) => {
        return (
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctAnswer === "number" &&
          q.correctAnswer >= 0 &&
          q.correctAnswer < 4 &&
          q.difficulty &&
          q.topic
        );
      });

      if (validatedQuestions.length < 15) {
        throw new Error("Not enough valid questions generated");
      }

      setQuestions(validatedQuestions);
      setAnswers(new Array(validatedQuestions.length).fill(null));
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");

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
    courseName: string,
    config: AssessmentConfig,
  ): Question[] => {
    const topicText =
      config.scope === "selected" && config.topics.length > 0
        ? config.topics[0]
        : "core concepts";

    return Array.from({ length: 18 }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Question ${i + 1}: What is a fundamental concept in ${topicText} within ${courseName}?`,
      options: [
        "Understanding core principles and methodologies",
        "Memorizing facts without context",
        "Skipping foundational topics",
        "Avoiding challenging problems",
      ],
      correctAnswer: 0,
      difficulty: (i < 6 ? "easy" : i < 12 ? "medium" : "hard") as
        | "easy"
        | "medium"
        | "hard",
      topic: topicText,
      explanation: "Understanding core principles is essential for mastery.",
    }));
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
    const finalAnswers = [...answers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestionIndex] = selectedAnswer;
    }

    let correctCount = 0;
    const topicPerformance: Record<string, { correct: number; total: number }> =
      {};
    const skillGaps: string[] = [];

    questions.forEach((question, index) => {
      const isCorrect = finalAnswers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;

      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[question.topic].total++;
      if (isCorrect) topicPerformance[question.topic].correct++;
    });

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
      topicPerformance,
      skillGaps,
      answers: finalAnswers.map((answer, index) => ({
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

  const loadingMessages = [
    "Analyzing course curriculum",
    "Understanding topic depth",
    "Designing intelligent questions",
    "Optimizing difficulty progression",
    "Structuring comprehensive assessment",
    "Finalizing evaluation framework",
  ];

  const [dots, setDots] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

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
      <div className="min-h-screen bg-[#0E131C] flex items-center justify-center p-4 overflow-hidden lg:overflow-auto">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-white text-base sm:text-lg font-semibold mb-2 transition-opacity duration-300">
            {loadingMessages[messageIndex]}
            {dots}
          </p>

          <p className="text-gray-400 text-xs sm:text-sm px-4">
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
      <div className="min-h-screen bg-[#0E131C] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Error Generating Questions
          </h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            {error}
          </p>
          <button
            onClick={() => generateQuestionsFromGemini()}
            className="bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
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
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="min-h-screen bg-[#0E131C] p-3 sm:p-4 md:p-6 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white truncate">
                {course.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                <span className="hidden xs:inline">Question </span>
                {currentQuestionIndex + 1} of {questions.length}
                {assessmentConfig.scope === "selected" &&
                  assessmentConfig.topics.length > 0 && (
                    <span className="hidden sm:inline ml-2 text-[#028CC0]">
                      • Topics: {assessmentConfig.topics.join(", ")}
                    </span>
                  )}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-[#2B303B] rounded-lg text-xs sm:text-sm shrink-0"
            >
              Cancel
            </button>
          </div>

          <div className="relative h-1.5 sm:h-2 bg-[#2B303B] rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-[#028CC0] to-[#0279A6]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 shadow-xl"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${
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
              <span className="text-[10px] sm:text-sm text-gray-400 bg-[#2B303B] px-2 sm:px-3 py-1 rounded-full truncate max-w-50 sm:max-w-none">
                Topic: {currentQuestion.topic}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-6 sm:mb-8 leading-relaxed">
              {renderTextWithMath(currentQuestion.question)}
            </h3>

            <div className="space-y-2 sm:space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-[#028CC0] bg-[#028CC0]/10 shadow-lg shadow-[#028CC0]/20"
                      : "border-gray-700/40 bg-[#2B303B] hover:border-gray-600 hover:bg-[#353A47]"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        selectedAnswer === index
                          ? "border-[#028CC0] bg-[#028CC0]"
                          : "border-gray-600"
                      }`}
                    >
                      {selectedAnswer === index && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 max-h-20 sm:max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 pr-2">
                      <span className="text-sm sm:text-base text-white leading-relaxed">
                        {renderTextWithMath(option)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Previous</span>
            <span className="xs:hidden">Prev</span>
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Next
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={selectedAnswer === null}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <span className="hidden xs:inline">Submit Assessment</span>
              <span className="xs:hidden">Submit</span>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="bg-[#242833] border border-gray-700/60 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-md w-full"
            >
              <div className="bg-yellow-500/10 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-yellow-500/20">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-semibold text-white text-center mb-1 sm:mb-2">
                  Submit Assessment?
                </h3>
                <p className="text-gray-400 text-center text-xs sm:text-sm">
                  You have answered{" "}
                  {selectedAnswer !== null ? answeredCount + 1 : answeredCount}{" "}
                  out of {questions.length} questions.
                </p>
              </div>

              <div className="flex gap-2.5 sm:gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-[#2B303B] text-white rounded-lg font-semibold hover:bg-[#353A47] transition text-sm sm:text-base"
                >
                  Review
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-linear-to-r from-[#028CC0] to-[#0279A6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#028CC0]/30 transition text-sm sm:text-base"
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
