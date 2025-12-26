// Helper to define CSS classes for UI states
const CSS_CLASSES = {
  TAB_INACTIVE: 'flex-1 min-w-[80px] py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-700/50',
  TAB_ACTIVE: 'flex-1 min-w-[80px] py-2.5 rounded-xl text-sm font-bold transition-all bg-gold-500 text-white shadow-md transform scale-105',
  NUM_DEFAULT: 'bg-slate-800 border-slate-700 text-slate-500 hover:border-gold-500 hover:text-white',
  NUM_EXCLUDE: 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)] scale-105 font-extrabold',
  NUM_INCLUDE: 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] scale-105 font-extrabold'
};

// Main initialization
function initApp() {

  // Global State
  const state = {
    mode: 'random',
    selectedNumbers: new Set(),
    history: [],
    patterns: {
      oddEven: false,
      lowHigh: false,
      sumFilter: false, // 100~175
      noConsecutive: false // No 3+ consecutive numbers (1,2,3)
    }
  };

  // DOM Elements Cache
  const els = {
    generateBtn: document.getElementById('generate-btn'),
    modeTabs: document.getElementById('mode-tabs'),
    numberGrid: document.getElementById('number-grid'),

    // Panels
    optRandom: document.getElementById('opt-random'),
    optSelector: document.getElementById('opt-selector'),
    optPattern: document.getElementById('opt-pattern'),
    optSet: document.getElementById('opt-set'),

    // Outputs
    machineStage: document.getElementById('machine-stage'),
    resultContainer: document.getElementById('result-container'),
    setResultContainer: document.getElementById('set-result-container'),
    loadingSpinner: document.getElementById('loading-spinner'),

    // Inputs/Controls
    resetSelector: document.getElementById('reset-selector'),
    selectorMsg: document.getElementById('selector-msg'),
    chkOddEven: document.getElementById('chk-oddeven'),
    chkLowHigh: document.getElementById('chk-lowhigh'),
    chkSum: document.getElementById('chk-sum'), // New
    chkConsecutive: document.getElementById('chk-consecutive'), // New

    // History
    historyList: document.getElementById('history-list'),
    clearHistoryBtn: document.getElementById('clear-history'),

    // Toast
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toast-msg')
  };

  // --- Core Logic ---

  // 1. Mode Switching
  function setMode(newMode) {
    state.mode = newMode;
    state.selectedNumbers.clear();
    state.patterns = { oddEven: false, lowHigh: false, sumFilter: false, noConsecutive: false };

    // Reset Inputs
    if (els.chkOddEven) els.chkOddEven.checked = false;
    if (els.chkLowHigh) els.chkLowHigh.checked = false;
    if (els.chkSum) els.chkSum.checked = false;
    if (els.chkConsecutive) els.chkConsecutive.checked = false;

    // Update Tab UI
    const buttons = els.modeTabs.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.dataset.mode === newMode) {
        btn.className = CSS_CLASSES.TAB_ACTIVE;
      } else {
        btn.className = CSS_CLASSES.TAB_INACTIVE;
      }
    });

    // Toggle Panels
    const panels = [els.optRandom, els.optSelector, els.optPattern, els.optSet];
    panels.forEach(p => { if (p) p.classList.add('hidden'); });

    if (newMode === 'random' && els.optRandom) els.optRandom.classList.remove('hidden');
    else if ((newMode === 'exclude' || newMode === 'include') && els.optSelector) {
      els.optSelector.classList.remove('hidden');
      renderNumberGrid();
      updateSelectorMsg();
    }
    else if (newMode === 'pattern' && els.optPattern) els.optPattern.classList.remove('hidden');
    else if (newMode === 'set' && els.optSet) els.optSet.classList.remove('hidden');
  }

  // 2. Number Grid Logic
  function renderNumberGrid() {
    if (!els.numberGrid) return;
    els.numberGrid.innerHTML = '';

    for (let i = 1; i <= 45; i++) {
      const btn = document.createElement('button');
      btn.type = 'button'; // Prevent form submission
      btn.dataset.num = i;
      btn.textContent = i;

      const isSelected = state.selectedNumbers.has(i);
      let cls = CSS_CLASSES.NUM_DEFAULT;

      if (isSelected) {
        if (state.mode === 'exclude') cls = CSS_CLASSES.NUM_EXCLUDE;
        else cls = CSS_CLASSES.NUM_INCLUDE;
      }

      btn.className = `num-btn aspect-square rounded-lg text-sm font-bold flex items-center justify-center border transition-all duration-200 ${cls}`;
      els.numberGrid.appendChild(btn);
    }
  }

  function toggleNumber(n) {
    if (state.selectedNumbers.has(n)) {
      state.selectedNumbers.delete(n);
    } else {
      if (state.mode === 'include' && state.selectedNumbers.size >= 6) {
        showToast('고정수는 최대 6개까지만 선택 가능합니다.');
        return;
      }
      state.selectedNumbers.add(n);
    }
    renderNumberGrid();
    updateSelectorMsg();
  }

  function updateSelectorMsg() {
    if (!els.selectorMsg) return;
    const txt = state.mode === 'exclude' ? '제외할 번호' : '고정할 번호';
    els.selectorMsg.innerHTML = `${txt} <span class="text-gold-500 ml-1 text-base">${state.selectedNumbers.size}</span>개`;
  }

  // 3. Calculation
  function calculate() {
    let pool = Array.from({ length: 45 }, (_, i) => i + 1);
    let fixed = [];

    if (state.mode === 'exclude') {
      pool = pool.filter(n => !state.selectedNumbers.has(n));
    } else if (state.mode === 'include') {
      fixed = Array.from(state.selectedNumbers);
      pool = pool.filter(n => !fixed.includes(n));
    } else if (state.mode === 'pattern') {
      return getPatternNumbers();
    }

    if (pool.length + fixed.length < 6) {
      throw new Error('생성 가능한 번호가 부족합니다. 필터를 확인해주세요.');
    }

    while (fixed.length < 6) {
      const idx = Math.floor(Math.random() * pool.length);
      fixed.push(pool.splice(idx, 1)[0]);
    }
    return fixed.sort((a, b) => a - b);
  }

  function getPatternNumbers() {
    const { oddEven, lowHigh, sumFilter, noConsecutive } = state.patterns;
    if (!oddEven && !lowHigh && !sumFilter && !noConsecutive) {
      throw new Error('패턴을 하나 이상 선택해주세요.');
    }

    for (let i = 0; i < 5000; i++) { // Increased max attempts for complex patterns
      const tempPool = Array.from({ length: 45 }, (_, i) => i + 1);
      const cand = [];
      for (let j = 0; j < 6; j++) {
        cand.push(tempPool.splice(Math.floor(Math.random() * tempPool.length), 1)[0]);
      }
      cand.sort((a, b) => a - b); // Sort first for consecutive logic

      let ok = true;

      // 1. Odd/Even (3:3)
      if (oddEven) {
        if (cand.filter(n => n % 2 !== 0).length !== 3) ok = false;
      }

      // 2. Low/High (3:3) -> Low(1-22), High(23-45)
      if (ok && lowHigh) {
        if (cand.filter(n => n <= 22).length !== 3) ok = false;
      }

      // 3. Sum Filter (100 ~ 175)
      if (ok && sumFilter) {
        const sum = cand.reduce((a, b) => a + b, 0);
        if (sum < 100 || sum > 175) ok = false;
      }

      // 4. Consecutive (No 3 consecutive numbers like 1,2,3)
      if (ok && noConsecutive) {
        // Check if any 3 numbers are consecutive
        for (let k = 2; k < 6; k++) {
          if (cand[k] === cand[k - 1] + 1 && cand[k] === cand[k - 2] + 2) {
            ok = false;
            break;
          }
        }
      }

      if (ok) return cand;
    }
    throw new Error('조건에 맞는 번호를 찾지 못했습니다. (조건 완화 권장)');
  }

  function getSetData() {
    const sets = [];
    const allNums = [];

    for (let k = 0; k < 5; k++) {
      const s = [];
      const p = Array.from({ length: 45 }, (_, i) => i + 1);
      while (s.length < 6) s.push(p.splice(Math.floor(Math.random() * p.length), 1)[0]);
      s.sort((a, b) => a - b);
      sets.push(s);
      allNums.push(...s);
    }

    // Combo logic: simple frequency-like pick from generated pool
    const unique = [...new Set(allNums)];
    const combo = [];
    while (combo.length < 6 && unique.length > 0) {
      combo.push(unique.splice(Math.floor(Math.random() * unique.length), 1)[0]);
    }
    // Fill if needed
    if (combo.length < 6) {
      const rest = Array.from({ length: 45 }, (_, i) => i + 1).filter(n => !combo.includes(n));
      while (combo.length < 6) combo.push(rest.splice(Math.floor(Math.random() * rest.length), 1)[0]);
    }

    return { sets, combo: combo.sort((a, b) => a - b) };
  }

  // 4. Execution & Animation
  async function runGenerator() {
    const btn = els.generateBtn;
    btn.disabled = true;
    btn.classList.add('opacity-50', 'grayscale', 'cursor-not-allowed');

    // Reset Displays
    if (els.setResultContainer) {
      els.setResultContainer.classList.add('hidden');
      els.setResultContainer.innerHTML = '';
    }
    if (els.resultContainer) els.resultContainer.innerHTML = '';

    try {
      // Calc
      let result, sets;
      if (state.mode === 'set') {
        const data = getSetData();
        result = data.combo;
        sets = data.sets;
      } else {
        result = calculate();
      }

      // Animate
      if (els.machineStage) els.machineStage.classList.add('animate-shake');
      if (els.loadingSpinner) els.loadingSpinner.classList.remove('hidden');

      await new Promise(r => setTimeout(r, 800));

      if (els.machineStage) els.machineStage.classList.remove('animate-shake');
      if (els.loadingSpinner) els.loadingSpinner.classList.add('hidden');

      // Render Balls
      for (let i = 0; i < result.length; i++) {
        createBall(result[i], i * 150);
      }
      await new Promise(r => setTimeout(r, result.length * 150 + 500));

      // Render Sets
      if (sets && els.setResultContainer) renderSets(sets, result);

      // History
      addToHistory(result);

    } catch (e) {
      showToast(e.message);
      if (els.resultContainer) els.resultContainer.innerHTML = `<div class="text-red-400 font-bold text-sm">${e.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'grayscale', 'cursor-not-allowed');
    }
  }

  function createBall(num, delay) {
    if (!els.resultContainer) return;
    const ball = document.createElement('div');

    let c = 'ball-41-45';
    if (num <= 10) c = 'ball-1-10';
    else if (num <= 20) c = 'ball-11-20';
    else if (num <= 30) c = 'ball-21-30';
    else if (num <= 40) c = 'ball-31-40';

    ball.className = `lotto-ball ${c} w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl`;
    ball.textContent = num;
    ball.style.animation = `popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
    ball.style.animationDelay = `${delay}ms`;

    els.resultContainer.appendChild(ball);
  }

  function renderSets(sets, combo) {
    els.setResultContainer.classList.remove('hidden');
    els.setResultContainer.innerHTML = '<div class="text-center text-[10px] text-slate-500 font-bold mb-3 tracking-widest uppercase">Simulation Results</div>';

    sets.forEach((set, i) => {
      const row = document.createElement('div');
      row.className = 'flex justify-center items-center gap-2 mb-2';
      const label = document.createElement('span');
      label.className = 'text-[10px] text-slate-600 w-4 text-right';
      label.textContent = i + 1;
      row.appendChild(label);

      set.forEach(n => {
        const isHit = combo.includes(n);
        const b = document.createElement('span');
        b.className = `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isHit ? 'bg-gold-500 text-white border-gold-400 shadow-md scale-110 z-10' : 'bg-slate-800 border-slate-700 text-slate-500'}`;
        b.textContent = n;
        row.appendChild(b);
      });
      els.setResultContainer.appendChild(row);
    });
  }

  // 5. History & Utils
  function addToHistory(nums) {
    state.history.unshift({
      nums,
      mode: state.mode,
      date: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    });
    // Limit history stored in localstorage but not display length (display is limited by CSS)
    if (state.history.length > 50) state.history.pop();
    localStorage.setItem('lotto_premium_history', JSON.stringify(state.history));
    renderHistory();
  }

  function loadHistory() {
    try {
      const s = localStorage.getItem('lotto_premium_history');
      if (s) state.history = JSON.parse(s);
    } catch (e) { state.history = []; }
  }

  function renderHistory() {
    if (!els.historyList) return;
    if (state.history.length === 0) {
      els.historyList.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-slate-600 gap-2 opacity-50 min-h-[150px]"><span class="material-symbols-outlined text-3xl">inbox</span><span class="text-xs">기록 없음</span></div>`;
      return;
    }
    els.historyList.innerHTML = '';
    state.history.forEach(item => {
      const div = document.createElement('div');
      div.className = 'bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 mb-2 relative group';

      let balls = item.nums.map(n => {
        let color = 'text-slate-400';
        if (n <= 10) color = 'text-yellow-500'; else if (n <= 20) color = 'text-blue-400'; else if (n <= 30) color = 'text-red-400'; else if (n <= 40) color = 'text-slate-400'; else color = 'text-green-400';
        return `<span class="${color} font-bold text-xs bg-slate-900/50 w-6 h-6 flex items-center justify-center rounded-full border border-white/5">${n}</span>`;
      }).join('');

      div.innerHTML = `
                <div class="flex justify-between items-center mb-1.5">
                    <span class="text-[10px] uppercase bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300 border border-slate-600">${item.mode}</span>
                    <span class="text-[10px] text-slate-600 font-mono">${item.date}</span>
                </div>
                <div class="flex justify-between gap-1">${balls}</div>
                <button type="button" class="copy-btn absolute top-2 right-2 p-1.5 text-slate-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"><span class="material-symbols-outlined text-sm">content_copy</span></button>
            `;

      div.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(item.nums.join(', '));
        showToast('복사되었습니다.');
      });
      els.historyList.appendChild(div);
    });
  }

  function showToast(msg) {
    if (!els.toast) return;
    els.toastMsg.textContent = msg;
    els.toast.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
    setTimeout(() => els.toast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none'), 2500);
  }

  // --- Wire Events ---
  if (els.modeTabs) {
    els.modeTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn && btn.dataset.mode) setMode(btn.dataset.mode);
    });
  }

  if (els.generateBtn) els.generateBtn.addEventListener('click', runGenerator);

  if (els.numberGrid) {
    els.numberGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn && btn.dataset.num) toggleNumber(parseInt(btn.dataset.num));
    });
  }

  if (els.resetSelector) els.resetSelector.addEventListener('click', () => {
    state.selectedNumbers.clear();
    renderNumberGrid();
    updateSelectorMsg();
    showToast('초기화되었습니다.');
  });

  if (els.chkOddEven) els.chkOddEven.addEventListener('change', (e) => state.patterns.oddEven = e.target.checked);
  if (els.chkLowHigh) els.chkLowHigh.addEventListener('change', (e) => state.patterns.lowHigh = e.target.checked);
  if (els.chkSum) els.chkSum.addEventListener('change', (e) => state.patterns.sumFilter = e.target.checked);
  if (els.chkConsecutive) els.chkConsecutive.addEventListener('change', (e) => state.patterns.noConsecutive = e.target.checked);

  if (els.clearHistoryBtn) els.clearHistoryBtn.addEventListener('click', () => {
    if (state.history.length === 0) return;
    if (confirm('기록을 모두 삭제하시겠습니까?')) {
      state.history = [];
      localStorage.setItem('lotto_premium_history', '[]');
      renderHistory();
      showToast('기록이 삭제되었습니다.');
    }
  });

  // Run Init
  loadHistory();
  renderHistory();
  // Default AdSense Load
  try {
    const slots = document.querySelectorAll('.adsbygoogle');
    slots.forEach(s => { (window.adsbygoogle = window.adsbygoogle || []).push({}); });
  } catch (e) { console.log('AdSense init error', e); }
}

// Ensure execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}