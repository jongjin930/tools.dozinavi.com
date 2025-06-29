// /tools/snippets/script.js

const saveBtn      = document.getElementById('saveBtn');
const titleInput   = document.getElementById('title');
const contentInput = document.getElementById('content');
const snippetsList = document.getElementById('snippetsList');
const toast        = document.getElementById('toast');

saveBtn.addEventListener('click', saveSnippet);

function saveSnippet() {
  const content = contentInput.value.trim();
  if (!content) return alert('내용을 입력하세요.');

  let title = titleInput.value.trim();
  const today = new Date().toISOString().slice(0,10);
  let snippets = JSON.parse(localStorage.getItem('snippets')||'[]');

  let auto = false;
  if (!title) {
    auto = true;
    const count = snippets.filter(s=>s.auto&&s.date===today).length+1;
    title = `${today.replace(/-/g,'.')}(${count})`;
  }

  const bgColors = ['#fffbe6','#e6f7ff','#fff0f6','#f9f0ff','#f6ffed'];
  const bg = bgColors[Math.floor(Math.random()*bgColors.length)];

  const snippet = { id: Date.now(), title, content, date: today, auto, bg };
  snippets.push(snippet);
  localStorage.setItem('snippets', JSON.stringify(snippets));

  titleInput.value   = '';
  contentInput.value = '';
  renderSnippets();
}

function renderSnippets() {
  snippetsList.innerHTML = '';
  const snippets = JSON.parse(localStorage.getItem('snippets')||'[]');

  snippets.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = item.bg;

    // ✏️ 편집 버튼
    const edit = document.createElement('button');
    edit.className = 'edit-btn';
    edit.textContent = '✏️';
    edit.addEventListener('click', e => {
      e.stopPropagation();
      titleInput.value   = item.title;
      contentInput.value = item.content;
    });

    // ❌ 삭제 버튼
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✖';
    del.addEventListener('click', e => {
      e.stopPropagation();
      deleteSnippet(item.id);
    });

    // 제목 · 날짜
    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = item.title;
    const dateDiv = document.createElement('div');
    dateDiv.className = 'card-date';
    dateDiv.textContent = item.date;

    // 내용
    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content collapsed';
    contentDiv.textContent = item.content;

    // 더보기
    const needMore = item.content.split('\n').length>3 || item.content.length>100;
    let moreBtn = null;
    if (needMore) {
      moreBtn = document.createElement('div');
      moreBtn.className = 'toggle-more';
      moreBtn.textContent = '더보기';
      moreBtn.addEventListener('click', e => {
        e.stopPropagation();
        const col = contentDiv.classList.toggle('collapsed');
        moreBtn.textContent = col?'더보기':'접기';
      });
    }

    card.append(edit, titleDiv, dateDiv, contentDiv);
    if (moreBtn) card.append(moreBtn);
    card.append(del);

    // 카드 클릭 → 복사
    card.addEventListener('click', () => {
      navigator.clipboard.writeText(item.content);
      showToast('복사되었습니다');
    });

    snippetsList.appendChild(card);
  });
}

function deleteSnippet(id) {
  let arr = JSON.parse(localStorage.getItem('snippets')||'[]');
  arr = arr.filter(s=>s.id!==id);
  localStorage.setItem('snippets', JSON.stringify(arr));
  renderSnippets();
}

function showToast(msg) {
  toast.textContent = msg;
  toast.style.opacity = 1;
  setTimeout(()=> toast.style.opacity = 0, 1000);
}

window.addEventListener('DOMContentLoaded', renderSnippets);
