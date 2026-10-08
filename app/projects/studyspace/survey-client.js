import { groups } from '@/lib/studyspace-options.js';

export function initSurvey(root) {
const controller = new AbortController();
const listen = (element, event, handler) => element.addEventListener(event, handler, { signal: controller.signal });
const form = root.querySelector('#survey-form');
const message = root.querySelector('#form-message');
const featureInputs = [...form.querySelectorAll('[name="features"]')];
const button = form.querySelector('[type="submit"]');
function syncPriorityGroups(selected) {
  const container = root.querySelector('#priority-groups');
  const keys = selected.map(input => input.value);
  for (const section of [...container.children]) if (!keys.includes(section.dataset.group)) section.remove();
  for (const [index, key] of keys.entries()) {
    let section = [...container.children].find(node => node.dataset.group === key);
    if (!section) {
      section = document.createElement('fieldset');
      section.className = 'priority-group'; section.dataset.group = key;
      const legend = document.createElement('legend'); legend.textContent = groups[key].label;
      const options = document.createElement('div'); options.className = 'options';
      for (const [value, text] of groups[key].options) {
        const label = document.createElement('label'), input = document.createElement('input');
        input.type = 'radio'; input.name = `priority_${key}`; input.value = value; input.required = true;
        label.append(input, document.createTextNode(text)); options.append(label);
      }
      section.append(legend, options);
    }
    if (container.children[index] !== section) container.insertBefore(section, container.children[index] || null);
  }
  root.querySelector('#priority-placeholder').hidden = keys.length > 0;
}
function updateProgress() {
  const selected = featureInputs.filter(input => input.checked);
  root.querySelector('#feature-count').textContent = `${selected.length} / 3`;
  featureInputs.forEach(input => { input.disabled = selected.length >= 3 && !input.checked; });
  syncPriorityGroups(selected);
  const prioritiesComplete = selected.length > 0 && selected.every(input => form.querySelector(`[name="priority_${input.value}"]:checked`));
  const answered = ['stage', 'notionUsage', 'pain', 'quickAction', 'interest'].filter(name => form.querySelector(`[name="${name}"]:checked`)).length + (selected.length ? 1 : 0) + (prioritiesComplete ? 1 : 0);
  root.querySelector('#progress-text').textContent = `${answered} / 7 필수 응답 · 마지막 질문은 선택입니다`;
  root.querySelector('#progress-bar').style.width = `${answered / 7 * 100}%`;
}
listen(form, 'input', updateProgress);
listen(form, 'submit', async event => {
  event.preventDefault();
  message.className = 'form-message';
  message.textContent = '';
  const data = new FormData(form);
  for (const name of ['stage', 'notionUsage', 'pain', 'quickAction', 'interest']) {
    if (!data.get(name)) {
      message.classList.add('error');
      message.textContent = '아직 답하지 않은 질문이 있어요. 선택 항목을 확인해 주세요.';
      form.querySelector(`[name="${name}"]`).focus();
      return;
    }
  }
  const features = data.getAll('features');
  if (features.length < 1 || features.length > 3) {
    message.classList.add('error');
    message.textContent = '사용하고 싶은 공간을 1~3개 골라주세요.';
    featureInputs[0].focus();
    return;
  }
  const priorities = {};
  for (const key of features) {
    const value = data.get(`priority_${key}`);
    if (!value) {
      message.classList.add('error');
      message.textContent = `5번에서 ${groups[key].label}의 가장 필요한 기능을 골라주세요.`;
      form.querySelector(`[name="priority_${key}"]`).focus();
      return;
    }
    priorities[key] = value;
  }
  button.disabled = true;
  button.innerHTML = '의견을 보내고 있어요 <span>↗</span>';
  const payload = { stage: data.get('stage'), notionUsage: data.get('notionUsage'), pain: data.get('pain'), features, priorities, quickAction: data.get('quickAction'), interest: data.get('interest'), feedback: String(data.get('feedback') || '').trim() };
  try {
    const response = await fetch('/api/studyspace/survey', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || '응답을 저장하지 못했어요. 잠시 후 다시 보내주세요.');
    message.classList.add('success');
    message.textContent = '의견이 저장됐어요. 함께 공부 공간을 만들어 주셔서 감사합니다.';
    form.reset();
    updateProgress();
    reward.showModal();
  } catch (error) {
    message.classList.add('error');
    message.textContent = error instanceof Error && error.message && error.message !== 'Failed to fetch' ? error.message : '연결이 원활하지 않아 저장하지 못했어요. 입력한 답변은 그대로 두었으니 다시 보내주세요.';
  } finally {
    button.disabled = false;
    button.innerHTML = '의견 보내기 <span>↗</span>';
  }
});
updateProgress();

const reward = root.querySelector('#reward-dialog');
for (const id of ['reward-close', 'reward-done']) listen(root.querySelector(`#${id}`), 'click', () => reward.close());
listen(root.querySelector('#reward-image'), 'error', () => { root.querySelector('#reward-image-fallback').hidden = false; });

return () => { controller.abort(); reward.close(); };
}
