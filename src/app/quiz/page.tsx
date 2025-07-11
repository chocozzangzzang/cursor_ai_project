"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Brain, ArrowRight, RefreshCw } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { cursorQuizData, QuizQuestion } from '@/lib/quiz-data';

interface QuizAnswer {
  questionId: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

interface AIAnalysis {
  analysis: {
    overallScore: number;
    percentage: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  detailedFeedback: {
    grade: string;
    message: string;
    nextSteps: string;
  };
  questionAnalysis: {
    questionId: number;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [showJsonResult, setShowJsonResult] = useState(false);

  const currentQuestion = cursorQuizData[currentQuestionIndex];
  const totalQuestions = cursorQuizData.length;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const quizAnswers: QuizAnswer[] = cursorQuizData.map((question, index) => {
      const userAnswer = answers[index] || -1;
      const isCorrect = userAnswer === question.answer;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.answer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const correctAnswers = quizAnswers.filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // OpenAI API 호출
    submitToAI(quizAnswers, correctAnswers, score);
  };

  const submitToAI = async (quizAnswers: QuizAnswer[], correctAnswers: number, score: number) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/quiz-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: quizAnswers,
          totalQuestions,
          correctAnswers,
          score
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAiAnalysis(result.data);
        setShowResults(true);
      } else {
        console.error('AI 분석 실패:', result.error);
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setAiAnalysis(null);
    setShowJsonResult(false);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (showResults && aiAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">퀴즈 결과</h1>
              <div className="text-6xl font-bold mb-4">
                <span className={getGradeColor(aiAnalysis.detailedFeedback.grade)}>
                  {aiAnalysis.detailedFeedback.grade}
                </span>
              </div>
              <p className="text-xl text-gray-300">{aiAnalysis.detailedFeedback.message}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  강점
                </h3>
                <ul className="space-y-2">
                  {aiAnalysis.analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  개선점
                </h3>
                <ul className="space-y-2">
                  {aiAnalysis.analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 rounded-xl p-6 mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                추천사항
              </h3>
              <ul className="space-y-2">
                {aiAnalysis.analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="flex gap-4 justify-center">
              <AnimatedButton
                variant="rainbow"
                animation="sparkle"
                onClick={() => setShowJsonResult(!showJsonResult)}
                icon={<Brain className="w-4 h-4" />}
              >
                {showJsonResult ? 'JSON 숨기기' : 'JSON 결과 보기'}
              </AnimatedButton>
              
              <AnimatedButton
                variant="cosmic"
                animation="magnetic"
                onClick={resetQuiz}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                다시 시작
              </AnimatedButton>
            </div>

            <AnimatePresence>
              {showJsonResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 bg-black/20 rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-4">AI 분석 JSON 결과</h3>
                  <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-green-400">
                      {JSON.stringify(aiAnalysis, null, 2)}
                    </code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
        >
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Cursor AI 퀴즈</h1>
            <p className="text-xl text-gray-300 mb-4">
              Cursor AI에 대한 지식을 테스트해보세요!
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="bg-white/20 rounded-full px-4 py-2">
                문제 {currentQuestionIndex + 1} / {totalQuestions}
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2">
                진행률: {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
              </div>
            </div>
          </div>

          {/* 진행바 */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* 문제 */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {currentQuestion.choices.map((choice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      answers[currentQuestionIndex] === index
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-100'
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestionIndex] === index
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-white/40'
                      }`}>
                        {answers[currentQuestionIndex] === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium">{choice}</span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 버튼 */}
          <div className="flex justify-between">
            <AnimatedButton
              variant="outline"
              animation="glow"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              이전
            </AnimatedButton>

            <AnimatedButton
              variant="rainbow"
              animation="sparkle"
              onClick={handleNextQuestion}
              disabled={answers[currentQuestionIndex] === undefined}
              icon={currentQuestionIndex === totalQuestions - 1 ? <Trophy className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            >
              {currentQuestionIndex === totalQuestions - 1 ? '결과 보기' : '다음'}
            </AnimatedButton>
          </div>

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-lg">AI가 결과를 분석하고 있습니다...</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 