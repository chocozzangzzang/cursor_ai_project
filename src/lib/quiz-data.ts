export interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export const cursorQuizData: QuizQuestion[] = [
  {
    id: 1,
    question: "Cursor AI의 주요 목적은 무엇인가요?",
    choices: [
      "이미지 편집",
      "코드 자동 완성 및 개발 지원", 
      "음악 생성",
      "동영상 편집"
    ],
    answer: 1,
    explanation: "Cursor AI는 개발자가 더 빠르고 효율적으로 소프트웨어를 만들 수 있도록 돕는 AI 코딩 도구입니다."
  },
  {
    id: 2,
    question: "Cursor Pro 구독 시 제공되는 주요 혜택이 아닌 것은?",
    choices: [
      "500 fast premium 요청",
      "무제한 slow premium 요청",
      "매일 10회 o1-mini 모델 사용",
      "무제한 동영상 편집"
    ],
    answer: 3,
    explanation: "동영상 편집 기능은 Cursor Pro의 혜택이 아닙니다."
  },
  {
    id: 3,
    question: "Cursor에서 AI가 코드베이스를 이해하는 데 사용하는 기술은?",
    choices: [
      "커스텀 검색 모델",
      "이미지 인식", 
      "음성 인식",
      "3D 렌더링"
    ],
    answer: 0,
    explanation: "Cursor는 커스텀 검색 모델을 통해 코드베이스를 이해합니다."
  },
  {
    id: 4,
    question: "Cursor에서 학생이 Pro를 1년간 무료로 사용하려면 필요한 것은?",
    choices: [
      "학생 이메일 인증 또는 재학 증명 제출",
      "유튜브 구독",
      "트위터 팔로우", 
      "페이스북 좋아요"
    ],
    answer: 0,
    explanation: "학생 이메일(.edu) 인증 또는 재학 증명 제출이 필요합니다."
  },
  {
    id: 5,
    question: "Cursor의 주요 기능이 아닌 것은?",
    choices: [
      "실시간 채팅 지원",
      "스마트 코드 리라이트",
      "이미지 및 문서 입력 지원",
      "음악 추천"
    ],
    answer: 3,
    explanation: "음악 추천은 Cursor의 기능이 아닙니다."
  }
];

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: {
    questionId: number;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  feedback: string;
  grade: string;
} 