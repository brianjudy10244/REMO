(() => {
  'use strict';

  const W = 1080;
  const H = 1350;
  const MAX_CARDS = 12;
  const templates = [
    { id: 'editorial', name: 'EDITORIAL', titleColor: '#19282b', bodyColor: '#43545a', titleSize: 84, bodySize: 38 },
    { id: 'blue', name: 'SKY BLUE', titleColor: '#1c3445', bodyColor: '#375366', titleSize: 82, bodySize: 38 },
    { id: 'night', name: 'MIDNIGHT', titleColor: '#f5f3eb', bodyColor: '#c7dbe2', titleSize: 86, bodySize: 38 },
    { id: 'coral', name: 'CORAL', titleColor: '#1a272b', bodyColor: '#2a3437', titleSize: 83, bodySize: 38 },
  ];
  const $ = (id) => document.getElementById(id);
  const dom = Object.fromEntries(['cardCanvas','cardList','cardCount','canvasPosition','templateList','templateUpload','titleInput','bodyInput','titleColor','bodyColor','titleSize','bodySize','titleSizeValue','bodySizeValue','addCard','duplicateCard','moveCardLeft','moveCardRight','removeCard','downloadCurrent','downloadAll','toast'].map((id) => [id, $(id)]));
  const imageCache = new Map();
  let cards = [
    makeCard('하루의 공부를\n한곳에', '계획하고, 집중하고, 돌아보는 시간을 하나로.', 'editorial'),
    makeCard('흩어진 공부를\n나만의 공간으로', '일정 · 할 일 · 집중 시간 · 회고까지\nSTUDYSPACE에서 한눈에 살펴보세요.', 'blue'),
    makeCard('당신에게 필요한\n공부 기능은?', 'STUDYSPACE 기능 설문에 참여하고\n당신의 생각을 들려주세요.', 'night'),
  ];
  let currentIndex = 0;
  let renderQueued = false;
  let toastTimer;

  function makeCard(title = '', body = '', templateId = 'editorial') {
    const preset = templates.find((template) => template.id === templateId) || templates[0];
    return { title, body, templateId, titleColor: preset.titleColor, bodyColor: preset.bodyColor, titleSize: preset.titleSize, bodySize: preset.bodySize };
  }

  function current() { return cards[currentIndex]; }
  function notify(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => dom.toast.classList.remove('visible'), 3500);
  }

  function drawCover(ctx, image) {
    const ratio = Math.max(W / image.width, H / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;
    ctx.drawImage(image, (W - width) / 2, (H - height) / 2, width, height);
  }

  function drawGrid(ctx, color, spacing, opacity = 1) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }

  function drawBackground(ctx, card) {
    if (card.templateId.startsWith('custom:')) {
      const image = imageCache.get(card.templateId);
      ctx.fillStyle = '#244350'; ctx.fillRect(0, 0, W, H);
      if (image && image.complete && image.naturalWidth) drawCover(ctx, image);
      const shade = ctx.createLinearGradient(0, 100, 0, H);
      shade.addColorStop(0, 'rgba(13,30,38,.08)');
      shade.addColorStop(.45, 'rgba(13,30,38,.22)');
      shade.addColorStop(1, 'rgba(13,30,38,.68)');
      ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
      return;
    }
    switch (card.templateId) {
      case 'blue': {
        ctx.fillStyle = '#bde0ef'; ctx.fillRect(0, 0, W, H);
        drawGrid(ctx, '#ffffff', 120, .47);
        ctx.fillStyle = '#d9eff7'; ctx.beginPath(); ctx.arc(1010, 240, 435, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#94cadd'; ctx.beginPath(); ctx.arc(1090, 150, 300, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#589ebc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(85, 1010); ctx.lineTo(985, 1010); ctx.stroke();
        break;
      }
      case 'night': {
        ctx.fillStyle = '#19394c'; ctx.fillRect(0, 0, W, H);
        drawGrid(ctx, '#7ea7b8', 116, .14);
        ctx.strokeStyle = '#83afc0'; ctx.lineWidth = 2;
        [0, 1, 2].forEach((i) => { ctx.beginPath(); ctx.arc(995, 258, 177 + i * 84, 0, Math.PI * 2); ctx.stroke(); });
        ctx.fillStyle = '#f08b70'; ctx.beginPath(); ctx.arc(955, 253, 35, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'coral': {
        ctx.fillStyle = '#ff765b'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ffad91'; ctx.beginPath(); ctx.arc(1000, 250, 330, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff765b'; ctx.beginPath(); ctx.arc(1000, 250, 190, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e7503c'; ctx.fillRect(0, 1120, W, 230);
        break;
      }
      default: {
        ctx.fillStyle = '#edf0eb'; ctx.fillRect(0, 0, W, H);
        drawGrid(ctx, '#bac9c7', 120, .26);
        ctx.strokeStyle = '#a6b8b5'; ctx.lineWidth = 2; ctx.strokeRect(42, 42, W - 84, H - 84);
        ctx.fillStyle = '#cadbd9'; ctx.fillRect(790, 116, 215, 215);
        ctx.fillStyle = '#f9faf4'; ctx.fillRect(825, 151, 215, 215);
        ctx.fillStyle = '#fe7656'; ctx.fillRect(854, 180, 215, 215);
      }
    }
  }

  function linesFor(ctx, value, maxWidth) {
    const lines = [];
    for (const paragraph of String(value || '').split('\n')) {
      if (!paragraph) { lines.push(''); continue; }
      let line = '';
      for (const char of paragraph) {
        const candidate = line + char;
        if (line && ctx.measureText(candidate).width > maxWidth) { lines.push(line.trimEnd()); line = char.trimStart(); }
        else line = candidate;
      }
      lines.push(line);
    }
    return lines;
  }

  function drawFittedText(ctx, value, opts) {
    const { x, y, maxWidth, maxHeight, size, minSize, weight, color, lineHeight } = opts;
    let fontSize = size;
    let lines = [];
    while (fontSize >= minSize) {
      ctx.font = `${weight} ${fontSize}px "Noto Sans KR", sans-serif`;
      lines = linesFor(ctx, value, maxWidth);
      if (lines.length * fontSize * lineHeight <= maxHeight) break;
      fontSize -= 2;
    }
    const linePixels = fontSize * lineHeight;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    lines.slice(0, Math.floor(maxHeight / linePixels)).forEach((line, index) => ctx.fillText(line, x, y + index * linePixels));
    return y + Math.min(lines.length, Math.floor(maxHeight / linePixels)) * linePixels;
  }

  function drawCard(canvas, card, index, total) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    drawBackground(ctx, card);
    const isNight = card.templateId === 'night';
    const isCustom = card.templateId.startsWith('custom:');
    const metaColor = isNight || isCustom ? '#f1f3eb' : '#24373b';
    ctx.fillStyle = metaColor;
    ctx.font = '700 30px "DM Sans", sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('STUDYSPACE', 84, 82);
    ctx.font = '600 24px "DM Sans", sans-serif';
    ctx.fillText('BY REMO  /  CARD NEWS', 84, 124);
    ctx.textAlign = 'right';
    ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, 996, 84);
    ctx.textAlign = 'left';
    ctx.strokeStyle = metaColor;
    ctx.globalAlpha = .6;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(84, 174); ctx.lineTo(996, 174); ctx.stroke();
    ctx.globalAlpha = 1;

    let titleY = card.templateId === 'coral' ? 380 : 430;
    if (card.templateId === 'blue') titleY = 466;
    if (card.templateId === 'night') titleY = 450;
    const titleBottom = drawFittedText(ctx, card.title || '제목을 입력하세요', { x: 84, y: titleY, maxWidth: 910, maxHeight: 515, size: Number(card.titleSize), minSize: 42, weight: 900, color: card.titleColor, lineHeight: 1.25 });
    const bodyY = Math.max(970, titleBottom + 30);
    drawFittedText(ctx, card.body || '내용을 입력하세요', { x: 86, y: bodyY, maxWidth: 880, maxHeight: 230, size: Number(card.bodySize), minSize: 24, weight: 600, color: card.bodyColor, lineHeight: 1.55 });

    ctx.strokeStyle = metaColor; ctx.globalAlpha = .6;
    ctx.beginPath(); ctx.moveTo(84, 1250); ctx.lineTo(996, 1250); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = metaColor;
    ctx.font = '700 22px "DM Sans", sans-serif';
    ctx.fillText('MAKE ROOM FOR YOUR STUDY', 84, 1274);
    ctx.textAlign = 'right'; ctx.fillText('STUDYSPACE ↗', 996, 1274); ctx.textAlign = 'left';
  }

  function drawMain() {
    drawCard(dom.cardCanvas, current(), currentIndex, cards.length);
    dom.canvasPosition.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  function scheduleDraw() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => { renderQueued = false; drawMain(); renderList(); });
  }

  function thumbColor(templateId) {
    return { editorial: '#edf0eb', blue: '#bde0ef', night: '#19394c', coral: '#ff765b' }[templateId] || '#789aa6';
  }

  function renderList() {
    dom.cardList.replaceChildren();
    cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'card-item';
      button.setAttribute('aria-current', String(index === currentIndex));
      button.setAttribute('aria-label', `${index + 1}번 카드: ${card.title.replace(/\n/g, ' ') || '제목 없음'}`);
      const thumb = document.createElement('canvas'); thumb.width = 108; thumb.height = 135; thumb.className = 'card-thumb';
      thumb.style.background = thumbColor(card.templateId);
      const preview = document.createElement('canvas'); preview.width = W; preview.height = H;
      drawCard(preview, card, index, cards.length);
      thumb.getContext('2d').drawImage(preview, 0, 0, 108, 135);
      const meta = document.createElement('span'); meta.className = 'card-meta';
      const number = document.createElement('small'); number.textContent = `CARD ${String(index + 1).padStart(2, '0')}`;
      const name = document.createElement('strong'); name.textContent = card.title.replace(/\n/g, ' ') || '제목 없음';
      meta.append(number, name);
      const arrow = document.createElement('span'); arrow.className = 'arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
      button.append(thumb, meta, arrow);
      button.addEventListener('click', () => selectCard(index));
      dom.cardList.append(button);
    });
    dom.cardCount.textContent = `${String(cards.length).padStart(2, '0')} CARDS`;
    dom.addCard.disabled = cards.length >= MAX_CARDS;
    dom.removeCard.disabled = cards.length === 1;
    dom.moveCardLeft.disabled = currentIndex === 0;
    dom.moveCardRight.disabled = currentIndex === cards.length - 1;
  }

  function renderTemplates() {
    dom.templateList.replaceChildren();
    templates.forEach((template) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'template-choice';
      button.setAttribute('aria-label', `${template.name} 템플릿 선택`);
      button.setAttribute('aria-pressed', String(current().templateId === template.id));
      const swatch = document.createElement('span'); swatch.className = `template-swatch swatch-${template.id}`;
      const name = document.createElement('span'); name.className = 'template-name'; name.textContent = template.name;
      button.append(swatch, name);
      button.addEventListener('click', () => applyTemplate(template.id));
      dom.templateList.append(button);
    });
    if (current().templateId.startsWith('custom:')) {
      const selected = document.createElement('p'); selected.className = 'upload-note'; selected.textContent = '현재 카드: 업로드한 이미지 템플릿';
      dom.templateList.after(selected);
      dom.customLabel = selected;
    } else if (dom.customLabel) { dom.customLabel.remove(); dom.customLabel = null; }
  }

  function syncControls() {
    const card = current();
    dom.titleInput.value = card.title;
    dom.bodyInput.value = card.body;
    dom.titleColor.value = card.titleColor;
    dom.bodyColor.value = card.bodyColor;
    dom.titleSize.value = card.titleSize;
    dom.bodySize.value = card.bodySize;
    dom.titleSizeValue.value = `${card.titleSize}px`;
    dom.bodySizeValue.value = `${card.bodySize}px`;
    renderTemplates(); renderList(); drawMain();
  }

  function selectCard(index) { currentIndex = index; syncControls(); }
  function applyTemplate(id) {
    const preset = templates.find((template) => template.id === id);
    Object.assign(current(), { templateId: id, titleColor: preset.titleColor, bodyColor: preset.bodyColor });
    syncControls();
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = name;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('이미지를 저장하지 못했습니다.')), 'image/png'));
  }

  async function exportCard(card, index, total) {
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    drawCard(canvas, card, index, total);
    return canvasBlob(canvas);
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; table[n] = c >>> 0; }
    return table;
  })();
  function crc32(bytes) { let crc = 0xffffffff; for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; }
  function zipFiles(files) {
    const encoder = new TextEncoder();
    const localParts = []; const centralParts = []; let offset = 0;
    for (const file of files) {
      const name = encoder.encode(file.name);
      const data = file.bytes;
      const crc = crc32(data);
      const local = new Uint8Array(30 + name.length);
      const l = new DataView(local.buffer);
      l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x0800, true);
      l.setUint16(8, 0, true); l.setUint32(14, crc, true); l.setUint32(18, data.length, true); l.setUint32(22, data.length, true); l.setUint16(26, name.length, true);
      local.set(name, 30); localParts.push(local, data);
      const central = new Uint8Array(46 + name.length);
      const c = new DataView(central.buffer);
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.set(name, 46); centralParts.push(central);
      offset += local.length + data.length;
    }
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22); const e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, centralSize, true); e.setUint32(16, offset, true);
    return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
  }

  async function withBusy(button, task) {
    button.disabled = true;
    try { await document.fonts.ready; await task(); }
    catch (error) { console.error(error); notify(error.message || '파일을 저장하지 못했습니다.'); }
    finally { button.disabled = false; }
  }

  ['titleInput', 'bodyInput', 'titleColor', 'bodyColor', 'titleSize', 'bodySize'].forEach((id) => {
    dom[id].addEventListener('input', () => {
      const key = { titleInput: 'title', bodyInput: 'body', titleColor: 'titleColor', bodyColor: 'bodyColor', titleSize: 'titleSize', bodySize: 'bodySize' }[id];
      current()[key] = dom[id].value;
      dom.titleSizeValue.value = `${dom.titleSize.value}px`;
      dom.bodySizeValue.value = `${dom.bodySize.value}px`;
      scheduleDraw();
    });
  });
  dom.addCard.addEventListener('click', () => {
    if (cards.length >= MAX_CARDS) return notify('카드는 최대 12장까지 만들 수 있습니다.');
    cards.splice(currentIndex + 1, 0, makeCard('새로운 이야기', '여기에 내용을 입력하세요.', current().templateId.startsWith('custom:') ? 'editorial' : current().templateId));
    selectCard(currentIndex + 1);
  });
  dom.duplicateCard.addEventListener('click', () => {
    if (cards.length >= MAX_CARDS) return notify('카드는 최대 12장까지 만들 수 있습니다.');
    cards.splice(currentIndex + 1, 0, { ...current() }); selectCard(currentIndex + 1);
  });
  dom.removeCard.addEventListener('click', () => {
    if (cards.length <= 1) return notify('최소 한 장의 카드는 남겨 주세요.');
    cards.splice(currentIndex, 1); selectCard(Math.min(currentIndex, cards.length - 1));
  });
  function move(direction) {
    const next = currentIndex + direction;
    if (next < 0 || next >= cards.length) return;
    [cards[currentIndex], cards[next]] = [cards[next], cards[currentIndex]];
    selectCard(next);
  }
  dom.moveCardLeft.addEventListener('click', () => move(-1));
  dom.moveCardRight.addEventListener('click', () => move(1));
  dom.templateUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return notify('PNG, JPG, WEBP 이미지를 선택해 주세요.');
    if (file.size > 10 * 1024 * 1024) return notify('10MB 이하 이미지를 선택해 주세요.');
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const id = `custom:${Date.now()}:${Math.random().toString(36).slice(2)}`;
      imageCache.set(id, image);
      Object.assign(current(), { templateId: id, titleColor: '#ffffff', bodyColor: '#ffffff' });
      syncControls(); notify('이미지 템플릿을 적용했습니다.');
      URL.revokeObjectURL(url);
    };
    image.onerror = () => { URL.revokeObjectURL(url); notify('이미지를 열지 못했습니다. 다른 파일을 선택해 주세요.'); };
    image.src = url;
    event.target.value = '';
  });
  dom.downloadCurrent.addEventListener('click', () => withBusy(dom.downloadCurrent, async () => {
    const blob = await exportCard(current(), currentIndex, cards.length);
    downloadBlob(blob, `studyspace-card-${String(currentIndex + 1).padStart(2, '0')}.png`);
    notify('현재 카드를 PNG로 저장했습니다.');
  }));
  dom.downloadAll.addEventListener('click', () => withBusy(dom.downloadAll, async () => {
    const files = [];
    for (let i = 0; i < cards.length; i++) {
      const blob = await exportCard(cards[i], i, cards.length);
      files.push({ name: `studyspace-card-${String(i + 1).padStart(2, '0')}.png`, bytes: new Uint8Array(await blob.arrayBuffer()) });
    }
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    downloadBlob(zipFiles(files), `studyspace-cardnews-${day}.zip`);
    notify(`${cards.length}장의 카드를 ZIP으로 저장했습니다.`);
  }));

  syncControls();
  document.fonts.ready.then(scheduleDraw);
})();
