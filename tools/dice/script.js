// ===== 유틸 =====
const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

const diceArea    = $('#diceArea');
const diceCountEl = $('#diceCount');
const rollBtn     = $('#rollBtn');
const clearBtn    = $('#clearBtn');
const stage       = $('#stage');
const stageControls = $('.stage-controls');

const resultLine  = $('#resultLine');
const sumBig      = $('#sumBig');
const historyList = $('#historyList');

let dice = [];    // { scene, die, shadow }
let history = []; // 최근 10개

// ===== 주사위 DOM 생성 (정육면체) =====
function createDie() {
  const scene  = document.createElement('div');
  scene.className = 'scene';

  const die    = document.createElement('div');
  die.className = 'die';

  // 6면
  const faces = [
    { cls: 'front',  value: 1, pips: [5] },
    { cls: 'back',   value: 6, pips: [1,3,4,6,7,9] },
    { cls: 'right',  value: 3, pips: [1,5,9] },
    { cls: 'left',   value: 4, pips: [1,3,7,9] },
    { cls: 'top',    value: 5, pips: [1,3,5,7,9] },
    { cls: 'bottom', value: 2, pips: [1,9] },
  ];

  faces.forEach(f => {
    const face = document.createElement('div');
    face.className = `face face--${f.cls}`;
    const grid = document.createElement('div');
    grid.className = 'pips';
    for (let i = 1; i <= 9; i++) {
      const cell = document.createElement('div');
      if (f.pips.includes(i)) {
        const pip = document.createElement('div');
        pip.className = 'pip';
        cell.appendChild(pip);
      }
      grid.appendChild(cell);
    }
    face.appendChild(grid);
    die.appendChild(face);
  });

  // 바닥 그림자
  const shadow = document.createElement('div');
  shadow.className = 'die-shadow';

  scene.appendChild(die);
  scene.appendChild(shadow);
  return { scene, die, shadow };
}

// ===== 값 → 최종 회전 매핑 =====
function rotationForValue(value) {
  switch (value) {
    case 1: return 'rotateX(0deg) rotateY(0deg)';
    case 2: return 'rotateX(90deg) rotateY(0deg)';
    case 3: return 'rotateX(0deg) rotateY(-90deg)';
    case 4: return 'rotateX(0deg) rotateY(90deg)';
    case 5: return 'rotateX(-90deg) rotateY(0deg)';
    case 6: return 'rotateX(0deg) rotateY(180deg)';
    default: return 'rotateX(0deg) rotateY(0deg)';
  }
}

// ===== 굴리기(대구르르) — 주사위별 난수로 “동작/숫자” 다양화 =====
function rollOne(dieEl) {
  return new Promise(resolve => {
    // 1) 시작자세를 주사위별로 랜덤(굴리는 동안 보이는 숫자/면이 달라짐)
    const startX = Math.floor(Math.random() * 360);
    const startY = Math.floor(Math.random() * 360);
    const startZ = Math.floor(Math.random() * 360);
    dieEl.style.transform = `rotateX(${startX}deg) rotateY(${startY}deg) rotateZ(${startZ}deg)`;

    // 2) 애니메이션 속도/지연/반복 횟수도 랜덤화 (서로 다른 타이밍으로 구름)
    const dur   = 700 + Math.floor(Math.random() * 500);   // 700~1200ms
    const delay = Math.floor(Math.random() * 160);         // 0~160ms
    const iters = 2 + Math.floor(Math.random() * 2);       // 2~3회

    // 3) 실제 결과값
    const value = 1 + Math.floor(Math.random() * 6);

    // 4) 애니메이션 재시작
    dieEl.classList.remove('roll');
    dieEl.style.animation = 'none';
    void dieEl.offsetWidth; // reflow
    dieEl.style.animation = `tumble ${dur}ms cubic-bezier(.22,.61,.36,1) ${delay}ms ${iters} both`;

    // 5) 애니메이션 종료 후 결과 각도로 착지
    const total = dur * iters + delay + 40;
    setTimeout(() => {
      dieEl.classList.remove('roll');
      const tiltX = (Math.random() * 10 - 5).toFixed(1);
      const tiltY = (Math.random() * 10 - 5).toFixed(1);
      dieEl.style.animation = 'none';
      dieEl.style.transform = `${rotationForValue(value)} rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      resolve(value);
    }, total);
  });
}

// ===== UI 구성 =====
function mountDice(n) {
  diceArea.innerHTML = '';
  dice = [];
  for (let i = 0; i < n; i++) {
    const d = createDie();
    dice.push(d);
    diceArea.appendChild(d.scene);
  }
}

function dieChar(v) {
  return ['⚀','⚁','⚂','⚃','⚄','⚅'][v-1] || '?';
}

function renderResult(values) {
  if (!values || !values.length) {
    resultLine.textContent = '-';
    sumBig.textContent = '—';
    return;
  }
  const expr = values.map(dieChar).join(' + ');
  const sum  = values.reduce((a,b)=>a+b,0);
  resultLine.textContent = expr;
  sumBig.textContent = `${sum}`;
}

function pushHistory(values) {
  const sum = values.reduce((a,b)=>a+b,0);
  const item = { values, sum, at: new Date() };
  history.unshift(item);
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(h => {
    const li = document.createElement('li');
    const t = h.at.toLocaleTimeString();
    li.textContent = `[${t}] ${h.values.map(dieChar).join(' + ')} = ${h.sum}`;
    historyList.appendChild(li);
  });
}

// 전체 굴리기
async function rollAll() {
  rollBtn.disabled = true;
  const results = await Promise.all(dice.map(d => rollOne(d.die)));
  renderResult(results);
  pushHistory(results);
  rollBtn.disabled = false;
}

// 결과 지우기
function clearResults() {
  history = [];
  renderHistory();
  renderResult([]);
}

// ===== 이벤트 =====

// ✅ 컨트롤 바에서의 이벤트가 스테이지로 버블링되지 않도록 차단
['click','mousedown','touchstart'].forEach(type => {
  stageControls.addEventListener(type, e => e.stopPropagation(), { passive: true });
});
diceCountEl.addEventListener('click', e => e.stopPropagation());
rollBtn.addEventListener('click', e => e.stopPropagation());   // 클릭 자체는 아래에서 다시 rollAll로 처리
clearBtn.addEventListener('click', e => e.stopPropagation());

// ✅ 주사위 개수 변경 시 “재배치만” 하고 굴리지 않음
diceCountEl.addEventListener('change', () => {
  mountDice(parseInt(diceCountEl.value, 10));
  renderResult([]);
});

rollBtn.addEventListener('click', rollAll);
clearBtn.addEventListener('click', clearResults);

// 스테이지 클릭/키보드로도 굴리기
stage.addEventListener('click', () => rollAll());
stage.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rollAll(); }
});

// 초기 로딩
mountDice(parseInt(diceCountEl.value, 10));
renderResult([]);
