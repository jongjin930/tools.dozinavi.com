// script.js
let rawSentences = [];
let currentMode = 'original';
let includeSpaces = true;
let includePunct = true;

function analyzeText() {
  const text = document.getElementById('textInput').value.trim();
  if (!text) return;

  rawSentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map((s, i) => ({ text: s, index: i }));

  document.getElementById('stats').style.display = 'block';
  document.getElementById('sortControls').style.display = 'flex';
  document.getElementById('toggleControls').style.display = 'flex';

  updateStats();
  renderResults(currentMode);
}

function computeLength(s) {
  let t = s;
  if (!includeSpaces) t = t.replace(/\s+/g, '');
  if (!includePunct) {
    // 문장부호: 기본 + 괄호 포함
    t = t.replace(/[.,!?;:…“”"'·\-\(\)\[\]\{\}]/g, '');
  }
  return [...t].length;
}


function updateStats() {
  const lengths = rawSentences.map(d => computeLength(d.text));
  const total = lengths.length;
  const sum = lengths.reduce((a, b) => a + b, 0);
  const avg = total ? (sum / total).toFixed(1) : 0;
  const min = total ? Math.min(...lengths) : 0;
  const max = total ? Math.max(...lengths) : 0;

  document.getElementById('totalSentences').textContent = `총 문장: ${total}`;
  document.getElementById('avgLength').textContent = `평균 길이: ${avg}`;
  document.getElementById('minLength').textContent = `최소: ${min}`;
  document.getElementById('maxLength').textContent = `최대: ${max}`;
}

function renderResults(mode) {
  currentMode = mode;
  let list = rawSentences.map(d => ({
    ...d,
    length: computeLength(d.text)
  }));

  if (mode === 'short') {
    list.sort((a, b) => a.length - b.length);
  } else if (mode === 'long') {
    list.sort((a, b) => b.length - a.length);
  } else { // 'original'
    list.sort((a, b) => a.index - b.index);
  }

  const html = list
    .map(d => `<li><strong>${d.length}자</strong>: ${d.text}</li>`)
    .join('');
  document.getElementById('resultArea').innerHTML = `<ul>${html}</ul>`;

  updateStats();
}

function resetAll() {
  rawSentences = [];
  currentMode = 'original';
  includeSpaces = true;
  includePunct = true;

  document.getElementById('textInput').value = '';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('sortControls').style.display = 'none';
  document.getElementById('toggleControls').style.display = 'none';
  document.getElementById('resultArea').innerHTML = '';

  document.getElementById('toggleSpacesBtn').textContent = '공백 포함';
  document.getElementById('togglePunctBtn').textContent = '문장부호 포함';
}

function copyResults() {
  navigator.clipboard
    .writeText(document.getElementById('resultArea').innerText)
    .then(() => alert('결과가 클립보드에 복사되었습니다.'));
}

function toggleSpaces() {
  includeSpaces = !includeSpaces;
  document.getElementById('toggleSpacesBtn').textContent = includeSpaces
    ? '공백 포함'
    : '공백 미포함';
  if (rawSentences.length) renderResults(currentMode);
}

function togglePunct() {
  includePunct = !includePunct;
  document.getElementById('togglePunctBtn').textContent = includePunct
    ? '문장부호 포함'
    : '문장부호 미포함';
  if (rawSentences.length) renderResults(currentMode);
}
