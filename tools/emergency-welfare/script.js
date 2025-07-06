// script.js
const typeSelect = document.getElementById("typeSelect");
const incomeSection = document.getElementById("incomeSection");
const incomeSelect = document.getElementById("incomeSelect");
const resultDiv = document.getElementById("result");
const applyBtn = document.getElementById("applyBtn");

// 디바이스 감지
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (!isMobile) {
  applyBtn.setAttribute("href", "#");
  applyBtn.addEventListener("click", function(e) {
    e.preventDefault();
    alert("📞 129로 직접 전화하셔야 합니다.\n(이 버튼은 모바일에서만 작동합니다)");
  });
}

// 질문 선택 시 자동 평가
typeSelect.addEventListener("change", () => {
  if (typeSelect.value === "yes") {
    incomeSection.style.display = "block";
  } else {
    incomeSection.style.display = "none";
    incomeSelect.value = "";
  }
  evaluate();
});

incomeSelect.addEventListener("change", evaluate);

function evaluate() {
  const type = typeSelect.value;
  const income = incomeSelect.value;
  if (!type) {
    resultDiv.textContent = "⚠️ 위기 사유를 선택해주세요.";
    return;
  }
  if (type === "no") {
    resultDiv.textContent = "❌ 위기 사유에 해당하지 않으면 지원 대상이 아닙니다.";
    return;
  }
  if (!income) {
    resultDiv.textContent = "⚠️ 소득 여부를 선택해주세요.";
    return;
  }
  if (income === "false") {
    resultDiv.textContent = "❌ 소득 기준을 초과하여 지원 대상이 아닙니다.";
    return;
  }
  resultDiv.textContent = "✅ 신청 가능성이 높습니다. 관할 주민센터에 문의해보세요!";
}
