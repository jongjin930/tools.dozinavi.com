// /tools/week-pay/script.js

const wageInput   = document.getElementById('wage');
const hoursInput  = document.getElementById('hours');
const daysInput   = document.getElementById('days');
const calcBtn     = document.getElementById('calculateBtn');
const result      = document.getElementById('result');

// 시급 입력 시 콤마 자동 적용 (포맷용)
wageInput.addEventListener('blur', () => {
  const value = wageInput.value.replace(/[^0-9.]/g, '');
  if (value === '') return;
  const num = parseFloat(value);
  if (!isNaN(num)) {
    wageInput.value = num.toLocaleString('ko-KR');
  }
});

// 포커스 시 숫자만 남기기
wageInput.addEventListener('focus', () => {
  wageInput.value = wageInput.value.replace(/[^0-9.]/g, '');
});

calcBtn.addEventListener('click', () => {
  const wage = parseFloat(wageInput.value.replace(/,/g, ''));
  const hours = parseFloat(hoursInput.value);
  const days = parseInt(daysInput.value, 10);

  if (isNaN(wage) || isNaN(hours) || isNaN(days) || wage <= 0 || hours <= 0 || days <= 0) {
    result.innerHTML = `<p style="color:red;">입력값을 모두 올바르게 입력해주세요.</p>`;
    return;
  }

  const weeklyHours = hours * days;

  if (weeklyHours < 15) {
    result.innerHTML = `
      <p>주간 총 근로시간: ${weeklyHours}시간</p>
      <p><strong>⚠️ 주 15시간 미만 근무자는 주휴수당 지급 대상이 아닙니다.</strong></p>
    `;
    return;
  }

  const weeklyPay = wage * hours;
  const monthlyPay = Math.round(weeklyPay * (52 / 12));

  result.innerHTML = `
    <p>주휴수당 (주 단위): <strong>₩${weeklyPay.toLocaleString()}</strong></p>
    <p>월 환산 주휴수당 (52주 ÷ 12개월): <strong>₩${monthlyPay.toLocaleString()}</strong></p>
  `;
});
