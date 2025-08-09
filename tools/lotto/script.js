// script.js

// 전역 상태
let mode = 'random';
let includeNumbers = [], excludeNumbers = [], lastSets = [];
let oddEven = false, lowHigh = false;

// 탭 전환
document.querySelectorAll('.tab').forEach(tab => {
  tab.querySelector('h3').addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// 토스트 메시지
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
}

// 모드 버튼 이벤트
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
  });
});

// 번호 선택기 세팅
function setupPicker() {
  const picker = document.getElementById('number-picker');
  picker.innerHTML = '';
  for (let i = 1; i <= 45; i++) {
    const span = document.createElement('div');
    span.textContent = i;
    span.classList.add('picker-ball');
    span.dataset.num = i;
    span.addEventListener('click', () => {
      const num = +span.dataset.num;
      if (mode === 'include') {
        if (includeNumbers.includes(num)) {
          includeNumbers = includeNumbers.filter(x => x !== num);
          span.classList.remove('include');
        } else {
          includeNumbers.push(num);
          span.classList.add('include');
          excludeNumbers = excludeNumbers.filter(x => x !== num);
          span.classList.remove('exclude');
        }
      } else if (mode === 'exclude') {
        if (excludeNumbers.includes(num)) {
          excludeNumbers = excludeNumbers.filter(x => x !== num);
          span.classList.remove('exclude');
        } else {
          excludeNumbers.push(num);
          span.classList.add('exclude');
          includeNumbers = includeNumbers.filter(x => x !== num);
          span.classList.remove('include');
        }
      }
    });
    picker.appendChild(span);
  }
}

// 결과 렌더링
function renderResult(nums) {
  const container = document.getElementById('result');
  container.innerHTML = '';
  nums.forEach(n => {
    const ball = document.createElement('div');
    ball.textContent = n;
    ball.classList.add('ball');
    if (n <= 10) ball.classList.add('blue');
    else if (n <= 20) ball.classList.add('green');
    else if (n <= 30) ball.classList.add('orange');
    else if (n <= 40) ball.classList.add('gray');
    else ball.classList.add('pink');
    container.appendChild(ball);
  });
}

// 랜덤/제외/지정 한 세트 생성
function generateSingle() {
  let pool = Array.from({length:45},(_,i)=>i+1)
    .filter(n => !excludeNumbers.includes(n));
  
let nums = [];
if (mode === 'include') {
  if (includeNumbers.length > 6) {
    // 6개 초과 시 랜덤으로 6개 선택
    const shuffled = [...includeNumbers].sort(() => Math.random() - 0.5);
    nums = shuffled.slice(0, 6);
  } else {
    nums = [...includeNumbers];
  }
} else {
  nums = [];
}

  while (nums.length < 6 && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    nums.push(pool.splice(idx,1)[0]);
  }
  nums.sort((a,b)=>a-b);
  renderResult(nums);
}

// 5세트 & 조합 생성
function generateSetsCombo() {
  lastSets = [];
  const container = document.getElementById('sets-container');
  container.innerHTML = '';
  let count = 0;
  const iv = setInterval(() => {
    if (count >= 5) {
      clearInterval(iv);
      const pool = [...new Set(lastSets.flat())];
      const combo = [];
      while (combo.length < 6 && pool.length) {
        const idx = Math.floor(Math.random() * pool.length);
        combo.push(pool.splice(idx,1)[0]);
      }
      combo.sort((a,b)=>a-b);
      renderResult(combo);
      document.querySelectorAll('.set .ball').forEach(b => {
        if (combo.includes(+b.textContent)) b.classList.add('highlight');
      });
      return;
    }
    const set = [];
    while (set.length < 6) { const r = Math.floor(Math.random()*45)+1; if (!set.includes(r)) set.push(r); }
    set.sort((a,b)=>a-b);
    lastSets.push(set);
    const div = document.createElement('div'); div.classList.add('set');
    set.forEach(n => {
      const b = document.createElement('div'); b.textContent = n; b.classList.add('ball');
      if (n <= 10) b.classList.add('blue'); else if (n <= 20) b.classList.add('green');
      else if (n <= 30) b.classList.add('orange'); else if (n <= 40) b.classList.add('gray');
      else b.classList.add('pink');
      div.appendChild(b);
    });
    container.appendChild(div);
    count++;
  }, 500);
}

// 고정 패턴 옵션 토글
document.querySelectorAll('.pattern-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const p = btn.dataset.pattern;
    if (p === 'odd-even') oddEven = btn.classList.contains('active');
    if (p === 'low-high') lowHigh = btn.classList.contains('active');
  });
});

// 고정 패턴 생성
function generatePattern() {
  if (!oddEven && !lowHigh) return showToast('패턴을 하나 이상 선택하세요.');
  let nums = [];
  if (oddEven && lowHigh) {
    const OL = Math.floor(Math.random()*4), OH = 3-OL, EL = 3-OL, EH = OL;
    const oddsL = Array.from({length:22},(_,i)=>i+1).filter(n=>n%2),
          oddsH = Array.from({length:45},(_,i)=>i+1).filter(n=>n>22&&n%2),
          evensL=Array.from({length:22},(_,i)=>i+1).filter(n=>n%2===0),
          evensH=Array.from({length:45},(_,i)=>i+1).filter(n=>n>22&&n%2===0);
    for (let i=0;i<OL;i++) nums.push(oddsL.splice(Math.floor(Math.random()*oddsL.length),1)[0]);
    for (let i=0;i<OH;i++) nums.push(oddsH.splice(Math.floor(Math.random()*oddsH.length),1)[0]);
    for (let i=0;i<EL;i++) nums.push(evensL.splice(Math.floor(Math.random()*evensL.length),1)[0]);
    for (let i=0;i<EH;i++) nums.push(evensH.splice(Math.floor(Math.random()*evensH.length),1)[0]);
  } else if (oddEven) {
    const odds=Array.from({length:45},(_,i)=>i+1).filter(n=>n%2),
          evens=Array.from({length:45},(_,i)=>i+1).filter(n=>n%2===0);
    for (let i=0;i<3;i++){ nums.push(odds.splice(Math.floor(Math.random()*odds.length),1)[0]); nums.push(evens.splice(Math.floor(Math.random()*evens.length),1)[0]); }
  } else {
    const lows=Array.from({length:22},(_,i)=>i+1),
          highs=Array.from({length:45},(_,i)=>i+1).filter(n=>n>22);
    for (let i=0;i<3;i++){ nums.push(lows.splice(Math.floor(Math.random()*lows.length),1)[0]); nums.push(highs.splice(Math.floor(Math.random()*highs.length),1)[0]); }
  }
  nums.sort((a,b)=>a-b);
  renderResult(nums);
}

// 저장된 기록 불러오기
function loadHistory() {
  const hist = JSON.parse(localStorage.getItem('lotto_history')||'[]');
  const list = document.getElementById('history-list');
  list.innerHTML = '';

  hist.forEach((item, idx) => {
    const li = document.createElement('li');

    // 왼쪽: 번호 + 메타
    const left = document.createElement('div');
    const numsText = item.nums.map(n => String(n).padStart(2,'0')).join(', ');
    const numsSpan = document.createElement('span');
    numsSpan.textContent = `[${numsText}]`;
    const metaSpan = document.createElement('span');
    metaSpan.className = 'meta';
    metaSpan.textContent = ` ${item.time} · ${item.type}`;
    left.appendChild(numsSpan);
    left.appendChild(metaSpan);

    // 오른쪽: 개별 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '삭제';
    delBtn.addEventListener('click', () => {
      const cur = JSON.parse(localStorage.getItem('lotto_history')||'[]');
      cur.splice(idx, 1);
      localStorage.setItem('lotto_history', JSON.stringify(cur));
      loadHistory();
      showToast('삭제되었습니다.');
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}


// 타입 감지
function detectCurrentType() {
  const t = document.querySelector('.tab.active h3').textContent;
  if (t.includes('제외')) return '번호제외';
  if (t.includes('지정')) return '번호지정';
  if (t.includes('세트')) return '5세트';
  if (t.includes('고정')) return '고정패턴';
  return '랜덤';
}

// TXT로 내보내기
function exportHistoryTxt() {
  const hist = JSON.parse(localStorage.getItem('lotto_history')||'[]');
  if (!hist.length) return showToast('내보낼 저장 내역이 없습니다.');

  const lines = hist.map(item => {
    const nums = item.nums.map(n => String(n).padStart(2,'0')).join(', ');
    return `${nums} | ${item.time} | ${item.type}`;
  }).join('\n');

  const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lotto_saved.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('TXT로 내보냈습니다.');
}

// 전체 삭제
function clearHistoryAll() {
  const hist = JSON.parse(localStorage.getItem('lotto_history')||'[]');
  if (!hist.length) return showToast('삭제할 저장 내역이 없습니다.');
  if (!confirm('저장된 번호를 모두 삭제할까요?')) return;
  localStorage.setItem('lotto_history', JSON.stringify([]));
  loadHistory();
  showToast('전체 삭제되었습니다.');
}

// 버튼 바인딩
document.getElementById('export-history-btn').addEventListener('click', exportHistoryTxt);
document.getElementById('clear-history-btn').addEventListener('click', clearHistoryAll);

// 이벤트 바인딩
document.getElementById('generate-btn').addEventListener('click', generateSingle);
document.getElementById('reset-btn').addEventListener('click', () => {
  includeNumbers=[]; excludeNumbers=[]; document.querySelectorAll('.picker-ball').forEach(s=>s.classList.remove('include','exclude'));
});
document.getElementById('generate-sets-combo-btn').addEventListener('click', generateSetsCombo);
document.getElementById('generate-pattern-btn').addEventListener('click', generatePattern);
document.getElementById('save-btn').addEventListener('click', () => {
  const nums = Array.from(document.querySelectorAll('#result .ball')).map(b=>+b.textContent);
  if (nums.length!==6) return showToast('저장할 번호가 없습니다.');
  const hist = JSON.parse(localStorage.getItem('lotto_history')||'[]');
  const now=new Date();
  const ts=now.toLocaleString('ko-KR',{hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  hist.unshift({nums,time:ts,type:detectCurrentType()});
  if(hist.length>20) hist.pop();
  localStorage.setItem('lotto_history',JSON.stringify(hist));
  loadHistory();
  showToast('저장되었습니다.');
});

// 초기 실행
window.addEventListener('load', () => {
  setupPicker();
  loadHistory();
  generateSingle();
});
