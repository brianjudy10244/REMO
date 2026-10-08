import { groups } from './studyspace-options.js';
const baseFields = [['id','응답 ID'],['submittedAt','응답 시각 (한국 시간)'],['surveyVersion','설문 버전'],['stage','1. 공부 상황'],['notionUsage','2. 노션 사용 경험'],['pain','3. 가장 불편한 점'],['features','4. 선택한 공간'],['priority','5. 공간별 가장 필요한 기능'],['quickAction','6. 메인에서 먼저 할 일'],['interest','7. 사용 의향'],['feedback','8. 자유 의견']];
export function buildSurveyCsv(rows, valueFor) {
 const columns = baseFields.map(([key,title]) => ({ title, value: row => key === 'submittedAt' ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false }).format(new Date(row.submittedAt)) : valueFor(row,key) }));
 for (const [key,group] of Object.entries(groups)) {
  columns.push({ title: `4. ${group.label} 선택 여부`, value: row => row.surveyVersion >= 3 ? (row.features?.includes(key) ? '선택' : '미선택') : '미수집' });
  columns.push({ title: `5. ${group.label} 세부 기능`, value: row => {
   if (!row.priorities) return '미수집';
   if (!row.features?.includes(key)) return '미선택';
   return group.options.find(([value]) => value === row.priorities[key])?.[1] || '미수집';
  }});
 }
 // Quoting preserves commas, newlines and quotes; a prefix prevents formula execution.
 const cell = value => '"' + String(value ?? '').replace(/^[\s]*[=+@-]/, "'$&").replaceAll('"','""') + '"';
 return '\uFEFF' + [columns.map(column=>cell(column.title)).join(','), ...rows.map(row=>columns.map(column=>cell(column.value(row))).join(','))].join('\r\n');
}
export function downloadSurveyCsv(rows, valueFor, scope) {
 const blob = new Blob([buildSurveyCsv(rows,valueFor)], { type:'text/csv;charset=utf-8' });
 const url = URL.createObjectURL(blob), a = document.createElement('a');
 const stamp = new Date().toISOString().replace(/[:.]/g,'-');
 a.href=url; a.download=`studyspace-google-sheets-${scope}-${stamp}.csv`;
 document.body.append(a); a.click(); a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
