const typeSelect = document.getElementById("typeSelect");
const incomeLabel = document.getElementById("incomeLabel");
const propertySelect = document.getElementById("propertySelect");
const resultDiv = document.getElementById("result");

typeSelect.addEventListener("change", updateIncomeQuestion);
incomeLabel.addEventListener("change", checkEligibility);
propertySelect.addEventListener("change", checkEligibility);

function updateIncomeQuestion() {
  const type = typeSelect.value;
  const limits = {
    "단독": 2200,
    "홑벌이": 3200,
    "맞벌이": 3800
  };

  if (type && limits[type]) {
    incomeLabel.style.display = "block";
    incomeLabel.innerHTML = `2. 작년 총소득이 ${limits[type]}만 원 이하인가요?
      <select id="incomeSelect" onchange="checkEligibility()">
        <option value="">-- 선택 --</option>
        <option value="true">예</option>
        <option value="false">아니오</option>
      </select>`;
  } else {
    incomeLabel.style.display = "none";
  }
  checkEligibility(); // 초기화
}

function checkEligibility() {
  const type = typeSelect.value;
  const incomeSelect = document.getElementById("incomeSelect");
  const income = incomeSelect ? incomeSelect.value : "";
  const property = propertySelect.value;

  if (!type || !income || !property) {
    resultDiv.innerHTML = "";
    return;
  }

  if (income === "true" && property === "true") {
    resultDiv.innerHTML = `<div class="result-info">✅ 위 조건이라면 <strong>신청 가능성이 높습니다!</strong></div>`;
  } else {
    resultDiv.innerHTML = `<div class="result-info">❌ 해당 조건으로는 <strong>지급 대상이 아닐 수 있습니다.</strong></div>`;
  }
}
