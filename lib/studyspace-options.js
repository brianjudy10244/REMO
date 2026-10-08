export const groups = {
 plan: { label: '계획 · PLAN', description: '오늘·주간·월간 일정과 반복 일정', options: [
  ['plan_today','오늘 일정과 시간 블록'], ['plan_weekly','주간 시간표와 공부 시간 배치'], ['plan_calendar','월간 일정과 마감일'], ['plan_repeat','매주 반복되는 수업·알바 등록'], ['plan_colors','일정 유형과 색상 직접 설정'], ['plan_progress','주간 완료율과 요일별 달성도']
 ]},
 learn: { label: '학습 · LEARN', description: '과목별 자료, 노트, 집중 기록', options: [
  ['learn_courses','과목별 강의·과제·노트 모아보기'], ['learn_notes','필기·요약·참고 자료 정리'], ['learn_focus','집중 세션과 공부 시간 기록']
 ]},
 manage: { label: '작업 관리 · MANAGE', description: '빠른 입력, 완료 체크, 밀린 작업', options: [
  ['manage_inbox','분류 없이 할 일 빠르게 입력'], ['manage_tasks','전체 작업 조회·수정·완료 체크'], ['manage_overdue','기한이 지난 작업 확인과 날짜 재지정']
 ]},
 review: { label: '회고 · REVIEW', description: '일간·주간 회고와 성장 기록', options: [
  ['review_reflect','일간·주간 회고 작성과 조회'], ['review_growth','달성도와 집중 시간 변화 확인'], ['review_archive','완료하거나 보관한 기록 다시 찾기']
 ]},
 now: { label: '지금의 공부 · NOW', description: '메인의 시간·날짜, 타이머, 디데이', options: [
  ['now_timer','시간을 직접 정하는 집중 타이머'], ['now_dday','목표 이름과 날짜를 정하는 디데이'], ['now_clock','현재 시간과 날짜 확인']
 ]}
};
export function validPriorities(selected, priorities) {
 return priorities && typeof priorities === 'object' && !Array.isArray(priorities)
  && Object.keys(priorities).length === selected.length
  && selected.every(key => groups[key]?.options.some(([value]) => value === priorities[key]));
}
