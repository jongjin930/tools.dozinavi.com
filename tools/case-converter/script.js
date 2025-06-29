// script.js

const inputEl = document.getElementById("inputText");
const outputEl = document.getElementById("outputText");

document.getElementById("upperBtn").addEventListener("click", () => {
  outputEl.value = inputEl.value.toUpperCase();
});

document.getElementById("lowerBtn").addEventListener("click", () => {
  outputEl.value = inputEl.value.toLowerCase();
});

document.getElementById("capBtn").addEventListener("click", () => {
  // 먼저 모두 소문자로 변환한 뒤, 문장 시작 혹은 . ! ? 뒤의 첫 영문자만 대문자로
  const text = inputEl.value.toLowerCase();
  const result = text.replace(
    /(^\s*|[\.!\?]\s*)([a-z])/g,
    (match, lead, ch) => lead + ch.toUpperCase()
  );
  outputEl.value = result;
});

document.getElementById("toggleBtn").addEventListener("click", () => {
  const toggled = [...inputEl.value]
    .map(ch => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
    .join("");
  outputEl.value = toggled;
});

document.getElementById("copyBtn").addEventListener("click", () => {
  outputEl.select();
  document.execCommand("copy");
  alert("결과가 클립보드에 복사되었습니다!");
});
