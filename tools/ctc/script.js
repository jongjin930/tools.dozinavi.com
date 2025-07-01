const typeSelect = document.getElementById("typeSelect");
const incomeSection = document.getElementById("incomeSection");
const incomeLabel = document.getElementById("incomeLabel");
const incomeSelect = document.getElementById("incomeSelect");
const propertySelect = document.getElementById("propertySelect");
const childrenSelect = document.getElementById("childrenSelect");
const childrenInputSection = document.getElementById("childrenInputSection");
const childrenInput = document.getElementById("childrenInput");
const resultDiv = document.getElementById("result");

typeSelect.addEventListener("change", onTypeChange);
incomeSelect.addEventListener("change", onCheck);
propertySelect.addEventListener("change", onCheck);
childrenSelect.addEventListener("change", onChildrenChange);
childrenInput.addEventListener("input", onCheck);

function onTypeChange() {
  const type = typeSelect.value;
  if (type === "홑벌이" || type === "맞벌이") {
    incomeSection.style.display = "block";
    incomeLabel.textContent = "연간 총소득이 7,000만원 미만인가요?";
  } else {
    incomeSection.style.display = "none";
    incomeSelect.value = "";
  }
  onCheck();
}

function onChildrenChange() {
  if (childrenSelect.value === "more") {
    childrenInputSection.style.display = "block";
  } else {
    childrenInputSection.style.display = "none";
    childrenInput.value = "";
  }
  onCheck();
}

function onCheck() {
  const type = typeSelect.value;
  const incomeOk = incomeSelect.value;
  const propertyOk = propertySelect.value;
  const childrenCount = childrenSelect.value === "more"
    ? parseInt(childrenInput.value, 10)
    : parseInt(childrenSelect.value, 10);

  if (!type || (type !== "단독" && !incomeOk) || !propertyOk || isNaN(childrenCount)) {
    resultDiv.textContent = "";
    return;
  }

  if (type === "단독") {
    resultDiv.textContent = "⚠️ 단독 가구는 자녀장려금 지원 대상이 아닙니다.";
  } else if (incomeOk === "false") {
    resultDiv.textContent = "❌ 소득 기준(7,000만원 미만)을 초과하였습니다.";
  } else if (propertyOk === "false") {
    resultDiv.textContent = "❌ 재산 기준(2.4억 원 이하)을 초과하였습니다.";
  } else if (childrenCount < 1) {
    resultDiv.textContent = "❌ 부양 자녀 수를 올바르게 입력해주세요.";
  } else {
    resultDiv.textContent = `✅ 신청 가능합니다! (예상 지원액: ${childrenCount * 100}만원 이내)`;
  }
}
