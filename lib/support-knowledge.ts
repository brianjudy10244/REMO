/** A dated, server-only retrieval index from the REMO briefing supplied by the team. */
export const briefingSource = {
  title: "REMO (LEINN Seoul Year 02) 브리핑 보고서",
  url: "https://docs.google.com/document/d/158Ht1W1tewFN_n7_qpjcsDnDUP1W6-0dKCmb9ZKPzII/edit",
};

type Passage = { id: string; heading: string; text: string; keywords: string[] };

const passages: Passage[] = [
  {
    id: "1",
    heading: "팀 정체성 및 개요",
    text: "REMO는 LEINN Seoul 2차년도(Year 02, 2026년)에 활동하는 프로젝트 팀이다. 문서에 적힌 핵심 슬로건은 ‘WE ARE REMO. A WAVE, TOGETHER’이며, 팀 방향성은 ‘서로 다른 우리가 모여 한 장면을 만듭니다.’이다. 팀의 주요 정보 채널로 ABOUT US와 COVER STORY ISSUE 02가 언급된다.",
    keywords: ["리모", "remo", "팀", "소개", "정체성", "방향", "슬로건", "비전", "모토", "leinn", "레인", "2년", "2차년도", "year", "wave", "together", "about us", "커버스토리"],
  },
  {
    id: "2",
    heading: "팀 게시판 운용 정책 및 기능",
    text: "REMO BOARD는 팀 내부의 소식과 생각을 자유롭게 공유하고 저장하기 위한 게시판이다. 누구나 글을 작성할 수 있고, 각 게시글의 점 세 개(···) 메뉴에서 작성자 구별 없이 누구나 수정하거나 삭제할 수 있다. 공동으로 사용하는 게시판이므로 다른 구성원의 글을 변경하거나 삭제할 때에는 신중하게 확인하고 진행하라는 내부 가이드라인이 있다.",
    keywords: ["게시판", "보드", "board", "글", "게시글", "작성", "수정", "삭제", "권한", "누구나", "점 세개", "메뉴", "소통", "운영", "기능"],
  },
  {
    id: "3",
    heading: "게시글 등록 및 소통 현황",
    text: "브리핑 문서의 2026년 10월 초 시점에는 팀 게시판에 게시글 4건이 등록되어 있었다. 기능 확인용 게시글과 팀원의 초기 인사·테스트성 게시글이 포함된다. 이 숫자와 내용은 문서 작성 시점의 기록이며, 현재 게시판의 실시간 현황을 뜻하지 않는다.",
    keywords: ["최근", "현황", "게시글", "몇개", "몇 건", "4건", "테스트", "인사", "등록", "작성일", "최신", "기록"],
  },
];

const ignored = new Set(["무엇", "어떤", "어떻게", "알려", "주세요", "있나요", "있어요", "뭐예요", "인가요", "가능한가요", "되나요", "하고", "대한", "관련", "문의", "상담"]);
const terms = (value: string) => (value.toLowerCase().match(/[가-힣a-z0-9]+/g) || []).filter((term) => term.length > 1 && !ignored.has(term));

export function retrieveSupportPassages(question: string): Passage[] {
  const query = question.toLowerCase();
  const queryTerms = terms(query);
  const ranked = passages.map((passage) => {
    const body = `${passage.heading} ${passage.text}`.toLowerCase();
    let score = 0;
    for (const keyword of passage.keywords) {
      if (query.includes(keyword)) score += keyword.length >= 3 ? 4 : 2;
    }
    for (const term of queryTerms) {
      if (body.includes(term)) score += term.length >= 3 ? 2 : 1;
    }
    return { passage, score };
  }).sort((a, b) => b.score - a.score);
  if (!ranked[0] || ranked[0].score < 2) return [];
  return ranked.filter((entry) => entry.score >= 2 && entry.score >= ranked[0].score * 0.24).slice(0, 3).map((entry) => entry.passage);
}
