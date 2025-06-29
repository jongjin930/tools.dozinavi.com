// script.js
document.addEventListener('DOMContentLoaded', () => {
  const modeRadios      = document.querySelectorAll('input[name="mode"]');
  const hourlyWageInput = document.getElementById('hourlyWage');
  const monthlyWageInput= document.getElementById('monthlyWage');
  const hourSelect      = document.getElementById('hourSelect');
  const minuteSelect    = document.getElementById('minuteSelect');
  const daysModeRadios  = document.querySelectorAll('input[name="daysMode"]');
  const weeklyDaysSelect= document.getElementById('weeklyDaysSelect');
  const monthlyDaysSelect= document.getElementById('monthlyDaysSelect');
  const includeHolidayChk = document.getElementById('includeHoliday');
  const resultBox       = document.getElementById('resultBox');
  const copyBtn         = document.getElementById('copyBtn');
  const WEEKS_PER_MONTH = 4.345;

  // 드롭다운 채우기
  for (let h = 1; h <= 24; h++) hourSelect.add(new Option(h, h));
  for (let m = 0; m < 60; m += 5) minuteSelect.add(new Option(m, m));
  for (let d = 1; d <= 7; d++) weeklyDaysSelect.add(new Option(d, d));
  for (let d = 1; d <= 31; d++) monthlyDaysSelect.add(new Option(d, d));

  // 모드 전환
  modeRadios.forEach(r => r.addEventListener('change', calculate));
  daysModeRadios.forEach(r => r.addEventListener('change', () => {
    weeklyDaysSelect.disabled = r.value !== 'weekly';
    monthlyDaysSelect.disabled= r.value !== 'monthly';
    calculate();
  }));

  // 입력 변경 시 계산
  [hourlyWageInput, monthlyWageInput, hourSelect, minuteSelect,
   weeklyDaysSelect, monthlyDaysSelect, includeHolidayChk]
   .forEach(el => el.addEventListener('input', calculate));

  // 복사 기능
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultBox.textContent)
      .then(() => alert('결과가 클립보드에 복사되었습니다.'))
      .catch(() => alert('복사에 실패했습니다.'));
  });

  calculate();

  function calculate() {
    const rate   = parseInt(hourlyWageInput.value.replace(/,/g,'')) || 0;
    const salary = parseInt(monthlyWageInput.value.replace(/,/g,''))||0;
    const hours  = parseInt(hourSelect.value,10) || 0;
    const mins   = parseInt(minuteSelect.value,10) || 0;
    const dailyHours = hours + mins/60;
    const isWeekly = document.querySelector('input[name="daysMode"]:checked').value==='weekly';
    const daysCount= isWeekly ? parseInt(weeklyDaysSelect.value,10) : parseInt(monthlyDaysSelect.value,10);
    // 월급 기준 분모
    const denom = isWeekly ? daysCount * WEEKS_PER_MONTH : daysCount;
    let text = '';

    if (document.querySelector('input[name="mode"]:checked').value === 'hourToMonth') {
      // 시급→월급
      let base = Math.floor(rate * dailyHours * denom);
      // 주휴수당 적용 가능 여부
      const weeklyTotalHours = dailyHours * (isWeekly ? daysCount : daysCount / WEEKS_PER_MONTH);
      if (includeHolidayChk.checked && weeklyTotalHours >= 15) {
        const holiday = Math.floor(rate * dailyHours * WEEKS_PER_MONTH);
        const total = base + holiday;
text = `💰 월급 (주휴포함): ₩${total.toLocaleString()}`;
 
      } else {
        text = `💰 월급: ₩${base.toLocaleString()}`;
      }
    } else {
      // 월급→시급
      let perHour = denom>0 ? salary / denom : 0;
      perHour = Math.floor(perHour);
      text = `💰 시급: ₩${perHour.toLocaleString()}`;
    }

    resultBox.textContent = text;
  }
});
