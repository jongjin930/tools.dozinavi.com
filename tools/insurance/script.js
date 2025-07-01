function formatNumber(num) {
  return num.toLocaleString('ko-KR');
}

function parseNumber(str) {
  return parseFloat(str.replace(/,/g, '')) || 0;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '6px';
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

document.getElementById('salary').addEventListener('input', function () {
  let val = this.value.replace(/,/g, '');
  if (!isNaN(val) && val !== '') {
    this.value = formatNumber(parseInt(val));
  }
});

function calculateInsurance() {
  const input = document.getElementById('salary');
  const raw = parseNumber(input.value);

  if (!raw || raw < 1) {
    input.classList.add('error');
    showToast("월 급여를 올바르게 입력해주세요.");
    return;
  }

  input.classList.remove('error');

  // 기준 상한/하한 적용
  const pensionBase = Math.min(Math.max(raw, 360000), 5530000);
  const healthBase = Math.min(raw, 11000000); // 추정 상한 기준
  const careBase = healthBase;

  const rates = {
    pension: 0.045,
    health: 0.0709,
    careRate: 0.1281,
    employment: 0.009,
    employmentEr: 0.0135
  };

  const pensionEmp = Math.round(pensionBase * rates.pension);
  const pensionEr = pensionEmp;

  const healthEmp = Math.round(healthBase * rates.health);
  const healthEr = healthEmp;

  const careEmp = Math.round(healthEmp * rates.careRate);
  const careEr = careEmp;

  const empEmp = Math.round(raw * rates.employment);
  const empEr = Math.round(raw * rates.employmentEr);

  const totalEmp = pensionEmp + healthEmp + careEmp + empEmp;
  const totalEr = pensionEr + healthEr + careEr + empEr;
  const totalAll = totalEmp + totalEr;

  const html = `
    <table>
      <thead>
        <tr><th>항목</th><th>근로자 부담</th><th>사업주 부담</th><th>합계</th></tr>
      </thead>
      <tbody>
        <tr><td>국민연금</td><td>${formatNumber(pensionEmp)}원</td><td>${formatNumber(pensionEr)}원</td><td>${formatNumber(pensionEmp + pensionEr)}원</td></tr>
        <tr><td>건강보험</td><td>${formatNumber(healthEmp)}원</td><td>${formatNumber(healthEr)}원</td><td>${formatNumber(healthEmp + healthEr)}원</td></tr>
        <tr><td>장기요양</td><td>${formatNumber(careEmp)}원</td><td>${formatNumber(careEr)}원</td><td>${formatNumber(careEmp + careEr)}원</td></tr>
        <tr><td>고용보험</td><td>${formatNumber(empEmp)}원</td><td>${formatNumber(empEr)}원</td><td>${formatNumber(empEmp + empEr)}원</td></tr>
        <tr style="font-weight:bold;"><td>총합계</td><td>${formatNumber(totalEmp)}원</td><td>${formatNumber(totalEr)}원</td><td>${formatNumber(totalAll)}원</td></tr>
      </tbody>
    </table>
  `;

  const result = document.getElementById('result');
  result.innerHTML = html;
  result.style.display = 'block';
}
