function formatNumber(input) {
  let value = input.value.replace(/,/g, '');
  if (!isNaN(value) && value !== '') {
    input.value = Number(value).toLocaleString();
  }
}

function parseNumber(str) {
  return Number(str.replace(/,/g, '') || 0);
}

// ✅ 토스트 알림 함수
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.className = 'toast show';
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// 실시간 콤마 적용
['salary1','salary2','salary3','bonus1','bonus2','bonus3'].forEach(id => {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => formatNumber(el));
  });
});

// 동일 급여/상여금 체크 기능
document.addEventListener('DOMContentLoaded', () => {
  const sameSalary = document.getElementById('sameSalary');
  const salary1 = document.getElementById('salary1');
  const salaryFields = [document.getElementById('salary2'), document.getElementById('salary3')];

  sameSalary.addEventListener('change', () => {
    if (sameSalary.checked) {
      salaryFields.forEach(field => {
        field.value = salary1.value;
        field.readOnly = true;
        field.classList.remove('invalid'); // ✅ 빨간 테두리 제거
      });
      salary1.addEventListener('input', syncSalary);
    } else {
      salaryFields.forEach(field => field.readOnly = false);
      salary1.removeEventListener('input', syncSalary);
    }
  });

  function syncSalary() {
    salaryFields.forEach(field => {
      field.value = salary1.value;
      formatNumber(field);
    });
  }

  const sameBonus = document.getElementById('sameBonus');
  const bonus1 = document.getElementById('bonus1');
  const bonusFields = [document.getElementById('bonus2'), document.getElementById('bonus3')];

  sameBonus.addEventListener('change', () => {
    if (sameBonus.checked) {
      bonusFields.forEach(field => {
        field.value = bonus1.value;
        field.readOnly = true;
        field.classList.remove('invalid'); // ✅ 빨간 테두리 제거
      });
      bonus1.addEventListener('input', syncBonus);
    } else {
      bonusFields.forEach(field => field.readOnly = false);
      bonus1.removeEventListener('input', syncBonus);
    }
  });

  function syncBonus() {
    bonusFields.forEach(field => {
      field.value = bonus1.value;
      formatNumber(field);
    });
  }
});

function validateInputs(ids) {
  let isValid = true;
  ids.forEach(id => {
    const el = document.getElementById(id);
    const value = parseNumber(el.value);
    if (value <= 0 || isNaN(value)) {
      el.classList.add('invalid');
      isValid = false;
    } else {
      el.classList.remove('invalid');
    }
  });
  return isValid;
}

function calculateSeverance() {
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);
  if (isNaN(start) || isNaN(end)) {
    showToast("입사일과 퇴사일을 모두 입력해주세요.");
    return;
  }

  const salaryValid = validateInputs(["salary1", "salary2", "salary3"]);
  if (!salaryValid) {
    showToast("급여를 모두 입력해주세요.");
    return;
  }

  const salary = ["salary1","salary2","salary3"].map(id => parseNumber(document.getElementById(id).value));
  const bonus = ["bonus1","bonus2","bonus3"].map(id => parseNumber(document.getElementById(id).value));
  const includeBonus = document.getElementById("includeBonus").checked;

  const total = salary.reduce((a, b) => a + b, 0) + (includeBonus ? bonus.reduce((a, b) => a + b, 0) : 0);
  const avgDaily = Math.round((total / 90) * 100) / 100;

  const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
  if (diffInDays < 30) {
    showToast("근속기간이 너무 짧습니다.");
    return;
  }

  const years = diffInDays / 365.25;
  const severancePreTax = Math.floor(avgDaily * 30 * years);
  const severancePostTax = Math.floor(severancePreTax * 0.967);

  const result = document.getElementById("result");
  result.classList.remove("hidden");
  result.innerHTML = `
    <h3>퇴직금 계산 결과</h3>
    <p>근속기간: 약 ${years.toFixed(2)}년 (${Math.floor(diffInDays)}일)</p>
    <p>일 평균임금: <strong>${avgDaily.toLocaleString()}원</strong></p>
    <p>예상 퇴직금 (세전): <strong>${severancePreTax.toLocaleString()}원</strong></p>
    <p>예상 퇴직금 (세후): <strong>${severancePostTax.toLocaleString()}원</strong></p>
    <div class="notice" style="margin-top:1rem; background:#fff8e1; padding:0.8rem; border-radius:6px;">
      ※ 세후 금액은 참고용입니다. 실제 퇴직소득세는 국세청 기준에 따라 달라질 수 있습니다.
    </div>
  `;
}
