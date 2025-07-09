📘 Next.js 15 기반 AI 웹앱 기능 명세서
🔧 기술 스택
프레임워크: Next.js 15 (App Router 기반, RSC 사용)

스타일링: Tailwind CSS

API 연동: OpenAI GPT API

상태 관리: React Context + useState (간단한 수준) or Zustand

데이터 저장 (선택): LocalStorage / 서버 API

인증 (선택): Clerk / Auth.js

UI 컴포넌트: ShadCN/UI or Custom Components

📂 전체 폴더 구조 예시
bash
복사
편집
/app
  /page.tsx                // 메인 페이지 (카드 목록)
  /chatbot                 // 1. 기본 챗봇
  /role-ai                 // 2. 역할 기반 AI
  /blog-writer             // 3. 블로그 생성기
  /structured-response     // 4. JSON → UI AI
/components
  /Card.tsx
  /ChatWindow.tsx
  /BlogForm.tsx
  /ResponseRenderer.tsx
/lib
  /openai.ts               // OpenAI API 연동 로직
  /utils.ts
/styles
  /globals.css

🏠 0. 홈 화면 (기능 선택 UI)
기능 설명
유저가 사용할 수 있는 AI 기능들을 카드 형식으로 나열

각 기능은 /chatbot, /role-ai, /blog-writer, /structured-response 등으로 이동

반응형 UI

UI 구성
제목: "AI 도구 모음"

카드 컴포넌트:

아이콘/이미지

간단한 설명

버튼 혹은 전체 카드 클릭 시 이동

예시 기능 카드 목록
이름	설명	이동 경로
기본 챗봇	GPT API를 활용한 기본 챗봇	/chatbot
역할 AI	특정 역할 (예: 선생님) 기반 응답	/role-ai
블로그 생성기	제목 키워드로 블로그 글 자동 생성	/blog-writer
구조적 응답 리더	GPT 응답을 JSON으로 받아 처리	/structured-response

💬 1. 기본 챗봇 (/chatbot)
기능 설명
사용자가 입력한 질문에 대해 GPT-4가 자유롭게 답변

기본 temperature 설정

대화 흐름 유지 (Context 포함)

주요 기능
사용자 입력창

GPT 응답 출력

이전 대화 표시

OpenAI API 호출 (chat/completions)

간단한 로딩 애니메이션

🧠 2. 역할 기반 AI (/role-ai)
기능 설명
특정 역할(예: 선생님, 멘토, 심리상담가 등)을 프롬프트에 포함하여 질문에 답함

역할 선택 UI 제공 (드롭다운/선택 버튼)

GPT 프롬프트 커스터마이징

주요 기능
역할 선택 UI (예: 드롭다운)

입력창, 응답창

역할 프롬프트에 따라 system 메시지 삽입

대화 유지

📝 3. 블로그 글 작성 AI (/blog-writer)
기능 설명
사용자가 주제(제목 키워드)를 입력하면 GPT가 블로그 글을 생성

옵션: 글 길이, 톤(공식/친근)

주요 기능
입력 폼 (주제, 톤, 글 길이)

버튼 클릭 시 OpenAI에 요청

블로그 글 결과 렌더링

복사 버튼

📊 4. 구조화된 응답 렌더링 AI (/structured-response)
기능 설명
GPT에게 특정 JSON 형태로 응답을 요청

해당 JSON을 기반으로 UI에 적절히 표시 (예: 카드, 리스트, 표 등)

프롬프트에서 JSON 형식 강제 지정

예시
사용자가 "삼성전자에 대한 주식 분석을 보여줘"라고 입력하면

GPT는 다음 형식으로 응답:

json
복사
편집
{
  "종목명": "삼성전자",
  "평가": "안정적",
  "현재가": "75,000원",
  "상승요인": ["반도체 수요 증가", "AI 서버 투자 확대"],
  "하락요인": ["글로벌 경기 둔화"]
}
→ 이 데이터를 바탕으로 UI 컴포넌트로 시각화

🔐 (선택) 인증 기능
특정 기능(예: 블로그 저장, 기록 조회)은 로그인 후 가능

Clerk/Auth.js 등을 이용한 간편 로그인 구현

📈 향후 추가 아이디어
대화 저장 기능 (LocalStorage or DB)

로그 기록 보기 (History Page)

GPT 모델 선택 (gpt-3.5 vs gpt-4)

업로드된 파일 요약 AI

이미지 생성 기능 (DALL·E API)

📌 단계별 구현 계획
단계	구현 항목	비고
1단계	홈 화면 및 카드 UI	/ 경로
2단계	기본 챗봇 구현	OpenAI 연동 확인 목적
3단계	역할 기반 AI 구현	System 메시지 구성 연습
4단계	블로그 생성기	Form → GPT → 결과 렌더링
5단계	구조적 응답 → UI 렌더링	JSON Parsing 및 유동 UI 구현
6단계	인증 및 사용자 기록 저장 기능 (선택)	Clerk 등 연동