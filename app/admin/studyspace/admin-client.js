import { groups } from '@/lib/studyspace-options.js';
export function initAdmin(root) {
const controller = new AbortController();
const listen = (element, event, handler) => element.addEventListener(event, handler, { signal: controller.signal });
const $ = selector => root.querySelector(selector);
let responses = [];
const labels = {
 stage:{student:'대학생',graduate:'대학원생',working:'직장인',other:'그 외'},
 notionUsage:{daily:'거의 매일',sometimes:'가끔 사용',tried:'써본 적 있음',never:'아직 사용 안 함'},
 features:{schedule:'오늘·주간·월간 일정',timetable:'시간표 (이전 설문)',repeat:'반복 일정',tasks:'할 일과 밀린 작업',notes:'과목별 학습 기록',focus:'타이머와 집중 기록',reflection:'일간·주간 회고',growth:'달성도와 성장 확인',dday:'날짜와 디데이'},
 pain:{scattered:'일정·할 일·자료가 흩어짐',planning:'공부 시간 계획의 어려움',overdue:'과제나 마감일을 놓침',focus:'집중 시간 파악의 어려움',review:'회고와 다음 계획의 어려움',none:'크게 불편한 점 없음'},
 quickAction:{schedule:'일정 확인과 빠른 추가',tasks:'할 일 입력과 완료 체크',reflection:'잘한 점·아쉬운 점·내일 할 일',unsure:'아직 모르겠음'},
 interest:{yes:'사용해 보고 싶어요',maybe:'더 살펴보고 결정',no:'지금은 필요 없어요'}
};
for (const [key, group] of Object.entries(groups)) { labels.features[key] = group.label; for (const [value, text] of group.options) labels.features[value] = `${group.label} · ${text}`; }
const label = (key,value) => labels[key]?.[value] || value || '미수집';
const date = value => new Date(value).toLocaleString('ko-KR');
const fields = [['submittedAt','응답 시간'],['stage','공부 상황'],['notionUsage','노션 경험'],['pain','가장 불편한 점'],['features','선택한 공간·기능'],['priority','공간별 세부 기능'],['quickAction','메인에서 먼저 할 일'],['interest','사용 의향'],['feedback','자유 의견'],['surveyVersion','설문 버전'],['id','응답 ID']];
function valueFor(response,key){
 if(key==='submittedAt') return date(response[key]);
 if(key==='features') return (response.features || []).map(v=>label('features',v)).join(', ');
 if(key==='priority') return response.priorities ? Object.values(response.priorities).map(v=>label('features',v)).join(' / ') : label('features',response[key]);
 if(key==='feedback') return response[key] || '의견 없음';
 if(key==='surveyVersion') return String(response[key] || 1);
 if(key==='id') return response[key] || '미수집';
 return label(key,response[key]);
}
function filtered(){return responses.filter(r => (!$('#stage-filter').value || r.stage===$('#stage-filter').value) && (!$('#interest-filter').value || r.interest===$('#interest-filter').value) && fields.map(([key])=>valueFor(r,key)).join(' ').toLowerCase().includes($('#search').value.trim().toLowerCase()));}
function renderList(){
 const rows=filtered();$('#result-count').textContent=`${responses.length}개 중 ${rows.length}개 표시`;
 $('#response-list').replaceChildren();$('#empty-state').hidden=rows.length>0;$('#empty-state').textContent=responses.length?'검색 조건에 맞는 응답이 없습니다.':'아직 설문 응답이 없습니다. 응답이 제출되면 여기에 표시됩니다.';
 rows.forEach(r=>{
  const tr=document.createElement('tr');
  for(const key of ['submittedAt','stage','notionUsage','features','priority','interest']){const td=document.createElement('td');td.textContent=valueFor(r,key);tr.append(td);}
  const td=document.createElement('td'),button=document.createElement('button');button.textContent='보기';button.setAttribute('aria-label',`${date(r.submittedAt)} 응답 상세 보기`);button.addEventListener('click',()=>showDetail(r));td.append(button);tr.append(td);$('#response-list').append(tr);
 });
}
function showDetail(r){$('#detail-content').replaceChildren();for(const [key,title] of fields){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=title;dd.textContent=valueFor(r,key);$('#detail-content').append(dt,dd);}$('#detail').showModal();}
function chart(id,key){
 const counts={};responses.forEach(r=>(key==='features'?(r.features||[]):(r.priorities?Object.values(r.priorities):[r.priority])).filter(Boolean).forEach(v=>counts[v]=(counts[v]||0)+1));
 const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);const target=$(id);target.replaceChildren();
 if(!entries.length){target.textContent='응답이 쌓이면 결과가 표시됩니다.';return;}
 for(const [v,n] of entries){const row=document.createElement('div');row.className='chart-row';const title=document.createElement('span'),track=document.createElement('div'),fill=document.createElement('div'),count=document.createElement('span');title.textContent=label('features',v);track.className='chart-track';fill.className='chart-fill';fill.style.width=`${n/responses.length*100}%`;count.textContent=n;track.append(fill);row.append(title,track,count);target.append(row);}
}
async function load(){
 $('#refresh').disabled=true;$('#admin-message').textContent='';
 try{const res=await fetch('/api/admin/studyspace',{cache:'no-store',signal:controller.signal});const data=await res.json();if(res.status===401){location.href = "/admin/login";return;}if(!res.ok)throw new Error(data.error);responses=data.responses;$('#total').textContent=responses.length;$('#today').textContent=responses.filter(r=>new Date(r.submittedAt).toDateString()===new Date().toDateString()).length;$('#interested').textContent=responses.length?`${Math.round(responses.filter(r=>r.interest==='yes').length/responses.length*100)}%`:'0%';$('#last-updated').textContent=`마지막 조회 ${new Date().toLocaleString('ko-KR')}`;chart('#feature-chart','features');chart('#priority-chart','priority');renderList();}catch(error){$('#admin-message').textContent=error.message || '응답을 불러오지 못했습니다.';}finally{$('#refresh').disabled=false;}
}
listen($('#refresh'),'click',load);for(const id of ['#search','#stage-filter','#interest-filter'])listen($(id),'input',renderList);listen($('#detail-close'),'click',()=>$('#detail').close());
listen($('#export'),'click',()=>{
 // Prevent free-text cells from being interpreted as spreadsheet formulas.
 const cell=v=>'"'+String(v).replace(/^[\s]*[=+@-]/,"'$&").replaceAll('"','""')+'"';
 const csv='\uFEFF'+[fields.map(([,title])=>cell(title)).join(','),...filtered().map(r=>fields.map(([key])=>cell(valueFor(r,key))).join(','))].join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`studyspace-survey-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
});
load();

return () => { controller.abort(); $("#detail").close(); };
}
