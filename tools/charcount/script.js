const input = document.getElementById('inputText');
const withSpace = document.getElementById('withSpace');
const withoutSpace = document.getElementById('withoutSpace');
const wordCount = document.getElementById('wordCount');
const lineTotal = document.getElementById('lineTotal');
const lineNonEmpty = document.getElementById('lineNonEmpty');
const copyBtn = document.getElementById('copyBtn');

function updateCounts() {
  const text = input.value;

  withSpace.textContent = text.length;
  withoutSpace.textContent = text.replace(/\s/g, '').length;

  const words = text.trim().split(/\s+/).filter(word => word !== '');
  wordCount.textContent = words.length;

  const lines = text === '' ? [] : text.split('\n');
  lineTotal.textContent = lines.length;
  lineNonEmpty.textContent = lines.filter(line => line.trim().length > 0).length;
}

input.addEventListener('input', updateCounts);

copyBtn.addEventListener('click', () => {
  input.select();
  document.execCommand('copy');
  copyBtn.textContent = '✅ 복사됨!';
  setTimeout(() => {
    copyBtn.textContent = '📋 복사하기';
  }, 2000);
});
