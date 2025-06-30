const modeSupply = document.getElementById('mode-supply');
const modeTotal = document.getElementById('mode-total');
const valueInput = document.getElementById('value-input');
const supplyValue = document.getElementById('supply-value');
const vatValue = document.getElementById('vat-value');
const totalValue = document.getElementById('total-value');
const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');

let mode = 'supply';

modeSupply.addEventListener('click', () => {
  mode = 'supply';
  modeSupply.classList.add('active');
  modeTotal.classList.remove('active');
  calculate();
});

modeTotal.addEventListener('click', () => {
  mode = 'total';
  modeTotal.classList.add('active');
  modeSupply.classList.remove('active');
  calculate();
});

// 숫자 콤마 자동 입력
valueInput.addEventListener('input', (e) => {
  const raw = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = Number(raw).toLocaleString();
  calculate();
});

copyBtn.addEventListener('click', () => {
  const text = `공급가액: ${supplyValue.textContent}원\n부가세: ${vatValue.textContent}원\n총액: ${totalValue.textContent}원`;
  navigator.clipboard.writeText(text);
  showToast();
});

function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function calculate() {
  const input = valueInput.value.replace(/[^0-9]/g, '');
  const val = parseInt(input, 10) || 0;

  let supply = 0;
  let vat = 0;
  let total = 0;

  if (mode === 'supply') {
    supply = val;
    vat = Math.round(supply * 0.1);
    total = supply + vat;
  } else {
    total = val;
    supply = Math.floor(total / 1.1);
    vat = total - supply;
  }

  supplyValue.textContent = supply.toLocaleString();
  vatValue.textContent = vat.toLocaleString();
  totalValue.textContent = total.toLocaleString();
}
