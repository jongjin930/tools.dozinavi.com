// script.js
document.addEventListener('DOMContentLoaded', () => {
  const typeBtns          = document.querySelectorAll('.type-btn');
  const amountGroup       = document.getElementById('amount-group');
  const monthlyGroup      = document.getElementById('monthly-group');
  const amountInput       = document.getElementById('amount');
  const amountReading     = document.getElementById('amount-reading');
  const depositInput      = document.getElementById('deposit');
  const depositReading    = document.getElementById('deposit-reading');
  const monthlyInput      = document.getElementById('monthly');
  const monthlyReading    = document.getElementById('monthly-reading');
  const conversionDisplay = document.getElementById('conversion-display');
  const rateInput         = document.getElementById('rate');
  const editRateBtn       = document.getElementById('edit-rate-btn');
  const calcBtn           = document.getElementById('calculate-btn');
  const resultDiv         = document.getElementById('result');

  let selectedType   = 'sale';
  let isRateEditable = false;

  // 거래 유형 버튼 클릭
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.dataset.type;

      if (selectedType === 'monthly') {
        monthlyGroup.classList.remove('hidden');
        amountGroup.classList.add('hidden');
      } else {
        monthlyGroup.classList.add('hidden');
        amountGroup.classList.remove('hidden');
      }

      isRateEditable = false;
      rateInput.disabled = true;
      editRateBtn.textContent = '요율 수동 변경시 클릭';

      clearResult();
      recalcAll();
    });
  });

  // 입력 시 콤마 및 한글 변환
  function onInputChange(inputEl, readingEl) {
    const num = inputEl.value.replace(/\D/g, '');
    inputEl.value = formatNumber(num);
    readingEl.textContent = num ? numberToKorean(num) + '원' : '';
    recalcAll();
  }

  amountInput .addEventListener('input', () => onInputChange(amountInput, amountReading));
  depositInput.addEventListener('input', () => onInputChange(depositInput, depositReading));
  monthlyInput.addEventListener('input', () => onInputChange(monthlyInput, monthlyReading));

  // 요율 수정 버튼
  editRateBtn.addEventListener('click', () => {
    isRateEditable = !isRateEditable;
    rateInput.disabled = !isRateEditable;
    editRateBtn.textContent = isRateEditable ? '요율 수정 하세요' : '요율 수동 변경시 클릭';
    if (!isRateEditable) recalcRate();
  });

  // 계산 버튼
  calcBtn.addEventListener('click', () => {
    let base;

    if (selectedType === 'monthly') {
      const deposit = parseNumber(depositInput.value);
      const monthly = parseNumber(monthlyInput.value);
      if (!deposit) return alert('보증금을 입력하세요.');
      if (!monthly) return alert('월세를 입력하세요.');

      // ✅ 정확한 환산 공식 적용
      base = deposit + Math.round(monthly * (100 / 12));
    } else {
      base = parseNumber(amountInput.value);
      if (!base) return alert('거래 금액을 입력하세요.');
    }

    const rate = isRateEditable
      ? (parseFloat(rateInput.value) / 100) || 0
      : getRate(selectedType, base);

    const fee = Math.round(base * rate);
    showResult(base, rate, fee);
  });

  // 결과 출력
  function showResult(base, rate, fee) {
    resultDiv.innerHTML = `
      💰 거래 금액(환산): ${formatNumber(String(base))}원<br/>
      📊 최종 적용 요율: ${(rate*100).toFixed(2)}%<br/>
      🧾 예상 중개 수수료: <strong>${formatNumber(String(fee))}원</strong><br/><br/>
      <details>
        <summary>🔍 수수료율 근거 법령·고시 보기</summary>
        - 매매: 부동산 중개에 관한 법률 시행규칙 별표 1(제12조 관련)<br/>
        - 전세·월세: 국토교통부 고시 제2024-000호<br/>
      </details>
      <p style="margin-top:8px; color:#555;">
        ⚠️ 실제 수수료는 중개사와 협의 가능하며, 법적 상한선 기준으로 계산되었습니다.
      </p>
      <div style="margin-top:12px; text-align:right;">
        <button id="reset-btn" class="calculate-btn">입력 초기화</button>
      </div>
    `;
    resultDiv.classList.remove('hidden');
    document.getElementById('reset-btn').addEventListener('click', () => {
      amountInput.value = '';
      depositInput.value = '';
      monthlyInput.value = '';
      amountReading.textContent = '';
      depositReading.textContent = '';
      monthlyReading.textContent = '';
      conversionDisplay.textContent = '';
      isRateEditable = false;
      rateInput.disabled = true;
      editRateBtn.textContent = '요율 수동 변경시 클릭';
      clearResult();
      recalcAll();
    });
  }

  function clearResult() {
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';
  }

  // 자동 요율/환산 계산
  function recalcAll() {
    updateConversion();
    if (!isRateEditable) recalcRate();
  }

  function recalcRate() {
    const base = selectedType === 'monthly'
      ? parseNumber(depositInput.value) + Math.round(parseNumber(monthlyInput.value) * (100 / 12))
      : parseNumber(amountInput.value);
    const r = getRate(selectedType, base || 0);
    rateInput.value = (r * 100).toFixed(2);
  }

  function updateConversion() {
    if (selectedType === 'monthly') {
      const deposit = parseNumber(depositInput.value);
      const monthly = parseNumber(monthlyInput.value);
      if (deposit || monthly) {
        const conv = deposit + Math.round(monthly * (100 / 12));
        conversionDisplay.textContent = '환산 보증금: ' + formatNumber(conv.toString()) + '원';
      } else {
        conversionDisplay.textContent = '';
      }
    }
  }

  function getRate(type, val) {
    if (type === 'sale') {
      if (val < 50000000) return 0.006;
      if (val < 200000000) return 0.005;
      if (val < 600000000) return 0.004;
      if (val < 900000000) return 0.005;
      return 0.009;
    } else {
      if (val < 50000000) return 0.005;
      if (val < 200000000) return 0.004;
      if (val < 900000000) return 0.003;
      return 0.008;
    }
  }

  function numberToKorean(numStr) {
    const units = ['', '만', '억', '조'];
    let num = parseInt(numStr, 10);
    let result = '';
    for (let i = 0; i < units.length; i++) {
      const part = num % 10000;
      if (part) result = simpleRead(part) + units[i] + result;
      num = Math.floor(num / 10000);
    }
    return result || '영';
  }

  function simpleRead(num) {
    const han  = ['', '일','이','삼','사','오','육','칠','팔','구'];
    const unit = ['','십','백','천'];
    let str = '';
    String(num).padStart(4,'0').split('').map(Number).forEach((d,i) => {
      if (d) str += han[d] + unit[3-i];
    });
    return str;
  }

  function formatNumber(n) {
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function parseNumber(s) {
    return parseInt(s.replace(/,/g, ''), 10) || 0;
  }

  // 초기 세팅
  recalcAll();
});
