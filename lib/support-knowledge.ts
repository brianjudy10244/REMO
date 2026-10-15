/** Server-only passages curated from the REMO strategy briefing supplied by the team. */
export const briefingSource = {
  title: "REMO (LEINN SEOUL · YEAR 02) 핵심 현황 및 전략 브리핑 문서",
  url: "https://docs.google.com/document/d/1qMLG4ENcxf4EMzkAbq2ACEUmo3STpbZoXKo2tpBdAKQ/edit",
};

type Passage = { id: string; heading: string; text: string; keywords: string[] };

const passages: Passage[] = [
  {
    id: "1",
    heading: "팀 정체성과 슬로건",
    text: "REMO는 LEINN SEOUL 2년 차(YEAR 02, 2026년) 프로젝트 팀이다. 서로 다른 관점과 경험을 가진 10명이 학습, 실험, 실행을 통해 비즈니스 성과를 만들고자 한다. 조직 슬로건은 ‘A WAVE, TOGETHER’와 ‘서로 다른 우리가 모여 한 장면을 만듭니다.’이다. 다양한 시선과 경험을 연결하고 개인과 팀이 함께 성장하는 선순환을 지향한다.",
    keywords: ["어떤 팀", "무슨 팀", "팀 소개", "리모 소개", "정체성", "슬로건", "모토", "wave", "together", "leinn", "레인", "2년", "2차년도", "year"],
  },
  {
    id: "2",
    heading: "미션·비전·정량적 목표",
    text: "REMO의 미션은 ‘가치와 문제를 비즈니스로 풀어내며 실행으로 증명한다.’이다. 비전은 ‘혼자가 아닌 팀으로 선순환하며, 시장의 평가 속에서 성장한다.’이다. 정량적 목표는 ‘인당 매출 600만 원 달성 또는 수익 n원 달성’이다. 이 목표는 달성 현황이 아니라 문서에 적힌 목표다.",
    keywords: ["미션", "비전", "목표", "매출", "수익", "600만", "비즈니스", "시장", "성과"],
  },
  {
    id: "3",
    heading: "5대 핵심 가치와 일하는 방식",
    text: "REMO의 5대 핵심 가치는 학습(GROWTH), 협력(COLLABORATION), 신뢰(PSYCHOLOGICAL SAFETY), 책임(ACCOUNTABILITY), 실행(EXPERIMENT)이다. 학습은 경험과 배움을 팀에 연결하고 질문하며 행동하는 것, 협력은 다양성과 강점을 합쳐 함께 성과를 만드는 것이다. 신뢰는 어려움과 실수를 제때 공유해 안전한 환경을 만드는 것, 책임은 역할과 약속을 지키고 문제를 함께 해결하는 것, 실행은 목적지가 정해지면 우선 행동하는 것이다.",
    keywords: ["핵심 가치", "가치", "일하는 방식", "행동 지침", "학습", "협력", "신뢰", "책임", "실행", "growth", "collaboration", "safety", "accountability", "experiment"],
  },
  {
    id: "4",
    heading: "팀 구성원",
    text: "REMO는 총 10명으로 구성된다. 문서의 구성원 명단과 순서는 유진(Member 01), 정우(02), 브루노(03), 이든(04), 막스(05), 조이(06), 로(07), 겸(08), 쏠(09), 비크(10)다. 문서는 각자의 상세 역할이나 연락처를 제공하지 않는다.",
    keywords: ["멤버", "구성원", "팀원", "인원", "명단", "몇 명", "유진", "정우", "브루노", "이든", "막스", "조이", "비크", "쏠"],
  },
  {
    id: "5",
    heading: "4개 프로젝트",
    text: "REMO가 기획·운영하는 4개 프로젝트는 무디즘(PROJECT 01), STUDYSPACE(PROJECT 02), 데이터플로우(PROJECT 03), 노웨사(PROJECT 04)다. 네 프로젝트 모두 TEAM REMO (LEINN SEOUL · YEAR 02)에 속한다. 이 브리핑 문서에는 각 프로젝트의 상세 기능이나 진행 상태는 적혀 있지 않다.",
    keywords: ["프로젝트", "무디즘", "studyspace", "스터디스페이스", "데이터플로우", "노웨사", "4개"],
  },
  {
    id: "6",
    heading: "팀 게시판 운영",
    text: "REMO BOARD는 팀 내 소식과 아이디어를 자유롭게 공유하고 기록·저장하는 온라인 게시판이다. 문서에 따르면 누구나 게시글 옆 더보기(···) 메뉴에서 글을 수정하거나 삭제할 수 있다. 공동 사용 공간이므로 다른 사람의 글을 변경하거나 삭제할 때는 신중하게 확인해야 한다. 문서의 LATEST NOTES는 기능 테스트용 글과 팀원 인사·소통 테스트 기록의 예시이며 현재 게시글 수나 실시간 현황은 제공하지 않는다.",
    keywords: ["게시판", "보드", "board", "게시글", "글쓰기", "작성", "수정", "삭제", "더보기", "점 세개", "권한", "소통", "운영", "latest notes"],
  },
];

export function retrieveSupportPassages(question: string): Passage[] {
  const query = question.toLowerCase();
  const ranked = passages.map((passage) => ({
    passage,
    score: passage.keywords.reduce((score, keyword) => score + (query.includes(keyword) ? (keyword.length >= 3 ? 3 : 2) : 0), 0),
  })).sort((a, b) => b.score - a.score);
  if (!ranked[0] || ranked[0].score === 0) return [];
  return ranked.filter((item) => item.score >= Math.max(2, ranked[0].score * 0.35)).slice(0, 3).map((item) => item.passage);
}
