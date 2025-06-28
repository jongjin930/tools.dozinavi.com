const memoArea = document.getElementById("memoArea");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const lastSaved = document.getElementById("lastSaved");
const memoList = document.getElementById("memoList");

const MAX_MEMOS = 20;

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
}

function downloadText(filename, text) {
  const element = document.createElement("a");
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // for Firefox
  element.click();
  document.body.removeChild(element);
}

function loadMemos() {
  const data = JSON.parse(localStorage.getItem("memoHistory") || "[]");
  memoList.innerHTML = "";
  data.forEach((item, index) => {
    const preview = item.content.length > 40 ? item.content.slice(0, 40) + "…" : item.content;
    const formattedDate = formatDate(item.timestamp);

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="memo-preview">
        🕒 ${formattedDate}<br />
        <strong>${preview}</strong>
      </div>
      <div>
        <button class="memo-download" data-index="${index}">다운</button>
        <button class="memo-delete" data-index="${index}">삭제</button>
      </div>
    `;

    li.addEventListener("click", (e) => {
      if (!e.target.classList.contains("memo-delete") && !e.target.classList.contains("memo-download")) {
        memoArea.value = item.content;
        lastSaved.textContent = formattedDate;
      }
    });

    memoList.appendChild(li);
  });
}

saveBtn.addEventListener("click", () => {
  const content = memoArea.value.trim();
  if (content === "") return;

  let memos = JSON.parse(localStorage.getItem("memoHistory") || "[]");
  memos.unshift({ timestamp: new Date().toISOString(), content });

  if (memos.length > MAX_MEMOS) {
    memos = memos.slice(0, MAX_MEMOS);
  }

  localStorage.setItem("memoHistory", JSON.stringify(memos));
  lastSaved.textContent = formatDate(memos[0].timestamp);
  loadMemos();
});

clearBtn.addEventListener("click", () => {
  memoArea.value = "";
});

memoList.addEventListener("click", (e) => {
  const index = e.target.getAttribute("data-index");
  let memos = JSON.parse(localStorage.getItem("memoHistory") || "[]");

  if (e.target.classList.contains("memo-delete")) {
    memos.splice(index, 1);
    localStorage.setItem("memoHistory", JSON.stringify(memos));
    loadMemos();
  }

  if (e.target.classList.contains("memo-download")) {
    const memo = memos[index];
    const filename = `메모_${formatDate(memo.timestamp).replace(/[\s.:]/g, "-")}.txt`;
    downloadText(filename, memo.content);
  }
});

loadMemos();
