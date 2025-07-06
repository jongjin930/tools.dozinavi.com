const inputEl = document.getElementById("inputText");
const outputEl = document.getElementById("outputText");

const buttons = {
  upper: document.getElementById("upperBtn"),
  lower: document.getElementById("lowerBtn"),
  cap: document.getElementById("capBtn"),
  toggle: document.getElementById("toggleBtn")
};

function toggleState(buttonKey) {
  const clickedBtn = buttons[buttonKey];
  const isActive = clickedBtn.classList.contains("active");

  // 모든 버튼 초기화
  Object.values(buttons).forEach(btn => {
    btn.classList.remove("active");
    btn.classList.add("inactive");
  });

  // 다시 누르면 해제
  if (!isActive) {
    clickedBtn.classList.add("active");
    clickedBtn.classList.remove("inactive");
    applyConversion(buttonKey);
  } else {
    outputEl.value = "";
  }
}

function applyConversion(key) {
  const text = inputEl.value;

  switch (key) {
    case "upper":
      outputEl.value = text.toUpperCase();
      break;
    case "lower":
      outputEl.value = text.toLowerCase();
      break;
    case "cap":
      outputEl.value = text.toLowerCase().replace(
        /(^\s*|[\.!\?]\s*)([a-z])/g,
        (match, lead, ch) => lead + ch.toUpperCase()
      );
      break;
    case "toggle":
      outputEl.value = [...text]
        .map(ch => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
        .join("");
      break;
  }
}

// 이벤트 연결
buttons.upper.addEventListener("click", () => toggleState("upper"));
buttons.lower.addEventListener("click", () => toggleState("lower"));
buttons.cap.addEventListener("click", () => toggleState("cap"));
buttons.toggle.addEventListener("click", () => toggleState("toggle"));

// 복사 + 토스트 알림
document.getElementById("copyBtn").addEventListener("click", () => {
  outputEl.select();
  document.execCommand("copy");
  showToast("결과가 클립보드에 복사되었습니다!");
});

// ✅ 토스트 함수
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
