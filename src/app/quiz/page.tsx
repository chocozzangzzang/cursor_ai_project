"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Brain, ArrowRight, RefreshCw, ArrowLeft, Check } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { cursorQuizData, QuizQuestion } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

const GENRES = [
  { value: 'general', label: '일반상식' },
  { value: 'science', label: '과학' },
  { value: 'history', label: '역사' },
  { value: 'sports', label: '스포츠' },
];

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [showJsonResult, setShowJsonResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCount, setSelectedCount] = useState(5);
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].value);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [selectLeft, setSelectLeft] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (selectRef.current) {
      setSelectLeft(selectRef.current.offsetLeft);
    }
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [quizStarted]);

  // 기존 문제 데이터 대신 quizQuestions 사용
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;

  // 퀴즈 시작 시 OpenAI API로 문제 받아오기
  const startQuiz = async () => {
    setLoadingQuestions(true);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAiAnalysis(null);
    setShowJsonResult(false);
    // 실제 OpenAI API 호출 부분 (예시)
    try {
      const response = await fetch('/api/openai-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: selectedCount,
          genre: selectedGenre,
        }),
      });
      const data = await response.json();
      setQuizQuestions(data.questions || []);
      setQuizStarted(true);
    } catch (e) {
      alert('문제 생성에 실패했습니다.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // 퀴즈 리셋 시 첫 화면으로 돌아가기
  const resetQuizAll = () => {
    setQuizStarted(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAiAnalysis(null);
    setShowJsonResult(false);
  };

  // 첫 화면: 문제 수/장르 선택
  if (!quizStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 pt-24">
        <div className="relative max-w-[600px] w-full mx-auto">
          <div ref={cardRef} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <div className="flex items-center mb-[15px] mt-[30px]">
              <Link href="/" className="flex items-center text-gray-400 hover:text-gray-200 transition-colors">
                <ArrowLeft className="w-6 h-6 mr-2" />
                <span>돌아가기</span>
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-center flex-1">퀴즈 생성</h1>
            </div>
            <div className="mb-[15px]">
              <label className="block mb-2 font-semibold">문제 수 선택</label>
              <select
                ref={selectRef}
                className="w-full p-2 rounded-lg text-black"
                value={selectedCount}
                onChange={e => setSelectedCount(Number(e.target.value))}
              >
                {[5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="mb-[15px]">
              <label className="block mb-2 font-semibold">장르 선택</label>
              <select
                className="w-full p-2 rounded-lg text-black"
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
              >
                {GENRES.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <Button
              variant="default"
              className="w-full py-3 rounded-lg bg-white text-black font-bold text-lg mt-[15px] disabled:opacity-50"
              onClick={startQuiz}
              disabled={loadingQuestions}
            >
              {loadingQuestions ? '문제 생성 중...' : '퀴즈 시작'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    if (newAnswers[currentQuestionIndex] === answerIndex) {
      // 이미 선택된 답을 한 번 더 누르면 해제
      newAnswers[currentQuestionIndex] = undefined;
    } else {
      newAnswers[currentQuestionIndex] = answerIndex;
    }
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
    const quizAnswers: QuizAnswer[] = quizQuestions.map((question, index) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 mt-[50px]">
      <div className="max-w-[600px] w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
        >
          {/* 헤더 */}
          <div className="mb-8">
            <div>
              <Link href="/" className="flex items-center text-gray-400 hover:text-gray-200 transition-colors">
                <ArrowLeft className="w-6 h-6 mr-2" />
                <span>돌아가기</span>
              </Link>
            </div>
            <div className="mt-4">
              <h1 className="text-4xl font-bold text-center">퀴즈</h1>
            </div>
          </div>

          {/* 진행바 + 진행률 텍스트 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-white/80 font-medium">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <span className="text-base text-white/80 font-medium">
                진행률: {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* 문제 */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8 flex flex-col gap-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {currentQuestion.question}
            </h2>

            {/* 선택지, 결과, 버튼을 한 div 아래에 배치 */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
              <div className="flex flex-col gap-2" style={{ marginBottom: '10px' }}>
                {currentQuestion.choices.map((choice: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left py-6 rounded-xl border-2 transition-all duration-200 text-lg font-medium mb-[10px] ${answers[currentQuestionIndex] === index ? '!bg-gray-200 !text-black border-gray-300' : '!bg-white !text-black border-gray-200 hover:!bg-gray-100'}`}
                      style={{ minHeight: 48 }}
                      disabled={!!aiAnalysis}
                    >
                      <span className="font-medium text-left w-full flex items-center justify-between">
                        <span>{choice}</span>
                        {answers[currentQuestionIndex] === index && (
                          <Check className="w-6 h-6 text-black ml-2" />
                        )}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* 마지막 문제에서 결과가 있으면 결과 컴포넌트 표시 */}
              {currentQuestionIndex === totalQuestions - 1 && aiAnalysis && (
                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                  {showJsonResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/20 rounded-xl p-6"
                    >
                      <h3 className="text-xl font-semibold mb-4">AI 분석 JSON 결과</h3>
                      <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code className="text-green-400">
                          {JSON.stringify(aiAnalysis, null, 2)}
                        </code>
                      </pre>
                      <div className="flex gap-4 justify-center mt-6">
                        <AnimatedButton
                          variant="rainbow"
                          animation="sparkle"
                          onClick={() => setShowJsonResult(false)}
                          icon={<Brain className="w-4 h-4" />}
                        >
                          결과 화면으로 돌아가기
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
                    >
                      {/* 강점/개선점/추천사항 제거, 결과 테이블만 남김 */}
                      <div className="overflow-x-auto mb-4" style={{ marginBottom: '15px' }}>
                        <table className="min-w-full text-sm text-left border border-white/20 rounded-lg overflow-hidden">
                          <thead className="bg-white/10">
                            <tr>
                              <th className="px-4 py-2">문항</th>
                              <th className="px-4 py-2">내 답</th>
                              <th className="px-4 py-2">정답</th>
                              <th className="px-4 py-2">정오</th>
                              <th className="px-4 py-2">피드백</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aiAnalysis.questionAnalysis.map((q, idx) => (
                              <tr key={q.questionId} className="border-t border-white/10">
                                <td className="px-4 py-2">{q.questionId}</td>
                                <td className="px-4 py-2">{q.userAnswer + 1}</td>
                                <td className="px-4 py-2">{q.correctAnswer + 1}</td>
                                <td className={`px-4 py-2 text-center ${q.isCorrect ? 'bg-green-900' : 'bg-red-900'}`}>
                                  {q.isCorrect ? (
                                    <CheckCircle className="inline w-5 h-5" style={{ color: '#10b981' }} />
                                  ) : (
                                    <XCircle className="inline w-5 h-5" style={{ color: '#ef4444' }} />
                                  )}
                                </td>
                                <td className="px-4 py-2">{q.feedback}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex gap-4 justify-center mt-4" style={{ gap: '15px' }}>
                        <Button
                          variant="ghost"
                          onClick={() => setShowJsonResult(true)}
                          className="flex items-center !bg-white !text-black !border-black"
                        >
                          <Brain className="w-4 h-4 mr-2" /> JSON 결과 보기
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={resetQuizAll}
                          className="flex items-center !bg-white !text-black !border-black"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" /> 다시 시작
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* 하단 네비게이션 버튼: flex justify-between, marginTop: 15px */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                {/* 왼쪽: 이전 버튼 (1번 문항이 아닐 때만) */}
                {currentQuestionIndex !== 0 && !(currentQuestionIndex === totalQuestions - 1 && aiAnalysis) ? (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    className="flex items-center bg-white text-black border border-black"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    이전
                  </Button>
                ) : <div />}

                {/* 오른쪽: 다음/결과 확인 버튼 */}
                {!(currentQuestionIndex === totalQuestions - 1 && aiAnalysis) && (
                  <Button
                    variant="default"
                    onClick={handleNextQuestion}
                    disabled={answers[currentQuestionIndex] === undefined}
                    className="flex items-center bg-white text-black border border-black"
                  >
                    {currentQuestionIndex === totalQuestions - 1 ? (
                      <>
                        <Trophy className="w-5 h-5 mr-2" /> 결과 확인
                      </>
                    ) : (
                      <>
                        다음 <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

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