const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");
const result = document.getElementById("result");

function checkEligibility() {
  if (!q1.value || !q2.value || !q3.value) {
    result.textContent = "⚠️ 모든 항목을 선택해주세요.";
    return;
  }

  if (q1.value === "yes" && q2.value === "yes" && q3.value === "yes") {
    result.textContent = "✅ 수급 가능성이 있습니다. 복지로에서 신청해보세요!";
  } else {
    result.textContent = "❌ 조건을 충족하지 않아 수급이 어려울 수 있습니다.";
  }
}

[q1, q2, q3].forEach(select => {
  select.addEventListener("change", checkEligibility);
});
