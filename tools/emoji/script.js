const emojiGrid = document.getElementById("emojiGrid");
const copied = document.getElementById("copied");
const search = document.getElementById("search");
const categoriesDiv = document.getElementById("categories");

let allEmojis = [];

// 이모지 렌더링 함수
function renderEmojis(data) {
  emojiGrid.innerHTML = "";
  data.forEach(({ emoji, name }) => {
    const item = document.createElement("div");
    item.className = "emoji-item";
    item.title = name;
    item.textContent = emoji;
    item.onclick = () => {
      navigator.clipboard.writeText(emoji);
      copied.textContent = `${name} (${emoji}) 복사됨! ✅`;
    };
    emojiGrid.appendChild(item);
  });
}

// 이모지 JSON 불러오기
fetch("emojis.json")
  .then((response) => response.json())
  .then((data) => {
    allEmojis = data;

    // "전체" 버튼 추가
    const allBtn = document.createElement("div");
    allBtn.textContent = "전체";
    allBtn.className = "category";
    allBtn.onclick = () => renderEmojis(allEmojis);
    categoriesDiv.appendChild(allBtn);

    // 카테고리 버튼 추가
    const categories = [...new Set(allEmojis.map(e => e.category))];
    categories.forEach(cat => {
      const btn = document.createElement("div");
      btn.textContent = cat;
      btn.className = "category";
      btn.onclick = () => renderEmojis(allEmojis.filter(e => e.category === cat));
      categoriesDiv.appendChild(btn);
    });

    renderEmojis(allEmojis); // 처음엔 전체 이모지 출력
  })
  .catch((error) => {
    console.error("emojis.json 로딩 실패:", error);
    emojiGrid.innerHTML = "<p style='color:red;'>이모지를 불러오지 못했습니다.</p>";
  });

// 검색 기능
search.addEventListener("input", () => {
  const keyword = search.value.trim();
  if (keyword === "") {
    renderEmojis(allEmojis);
  } else {
    renderEmojis(allEmojis.filter(e => e.name.includes(keyword)));
  }
});
