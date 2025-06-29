document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.opt-btn');

  // 버튼 상태 제어 함수
  const setActive = (key, active) => {
    const btn = document.querySelector(`.opt-btn[data-key="${key}"]`);
    btn.setAttribute('data-active', active ? 'true' : 'false');
    btn.style.opacity = active ? '1' : '0.5';
  };

  // 버튼 클릭 이벤트 처리
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const isActive = btn.getAttribute('data-active') === 'true';

      // 줄바꿈 제거 ON → 줄바꿈 유지, 빈 줄 제거 OFF
      if (key === 'removeLine' && !isActive) {
        setActive('keepLine', false);
        setActive('removeEmpty', false);
      }

      // 줄바꿈 유지 ON → 줄바꿈 제거 OFF
      if (key === 'keepLine' && !isActive) {
        setActive('removeLine', false);
      }

      // 줄바꿈 유지 OFF → 빈 줄 제거도 OFF
      if (key === 'keepLine' && isActive) {
        setActive('removeEmpty', false);
      }

      // 빈 줄 제거는 줄바꿈 유지가 켜져 있을 때만 가능
      if (key === 'removeEmpty') {
        const keepOn = document.querySelector('.opt-btn[data-key="keepLine"]').getAttribute('data-active') === 'true';
        if (!keepOn) {
          alert("‘줄바꿈 유지’를 먼저 선택해야 빈 줄 제거가 가능합니다.");
          return;
        }
      }

      // 상태 토글 및 포커스 제거
      btn.setAttribute('data-active', isActive ? 'false' : 'true');
      btn.blur(); // 포커스 제거 → 색상 잔상 방지
    });
  });
});

document.getElementById('cleanBtn').addEventListener('click', () => {
  // 1. 텍스트 가져오기
  let text = document.getElementById('inputText').value;

  // 2. 글자 수 경고
  if (text.length > 50000) {
    alert("입력된 텍스트가 많아 정리 속도가 느릴 수 있습니다.");
  }

  // 3. 옵션 상태 가져오는 헬퍼 함수
  const get = key =>
    document.querySelector(`.opt-btn[data-key="${key}"]`).getAttribute('data-active') === 'true';

  // 4. 각 옵션 상태 체크
  const keepLines = get('keepLine');
  const rmEmpty   = get('removeEmpty');
  const collapse  = get('collapse');
  const trimEdges = get('trimEdges');
  const rmTabs    = get('removeTabs');
  const rmAll     = get('removeAll');
  const rmLine    = get('removeLine');

  // 5. 정리 로직
  if (rmTabs) text = text.replace(/\t/g, '');
  if (rmAll) {
    text = text.replace(/\s+/g, '');
  } else {
    let lines = text.split(/\r?\n/);
    if (trimEdges) lines = lines.map(line => line.trim());
    if (rmEmpty)   lines = lines.filter(line => line.trim() !== '');
    if (collapse)  lines = lines.map(line => line.replace(/ {2,}/g, ' '));
    text = keepLines ? lines.join('\n') : lines.join(' ');
  }

  if (rmLine && !keepLines) {
    text = text.replace(/[\r\n]+/g, '');
  }

  // 6. 출력
  document.getElementById('outputText').value = text;
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const out = document.getElementById('outputText');
  out.select();
  document.execCommand('copy');
  alert('정리된 텍스트가 복사되었습니다.');
});
