let fullSortedData = [];

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputText").value;
  const words = text
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w);

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  fullSortedData = Object.entries(freq)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

  showResults(25);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("inputText").value = "";
  document.getElementById("resultArea").innerHTML = "";
});

function getColor(freq, maxFreq) {
  if (freq === 1) return "skyblue";
  const ratio = (freq - 1) / (maxFreq - 1);
  const r = 255;
  const g = Math.round(160 + (100 - 160) * (1 - ratio));
  const b = Math.round(0 + 200 * (1 - ratio));
  return `rgb(${r}, ${g}, ${b})`;
}

function showResults(limit = fullSortedData.length) {
  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = "<h2>단어 빈도수 결과</h2>";

  const maxCount = fullSortedData[0]?.[1] || 1;

  const rows = fullSortedData.slice(0, limit).map(([word, count]) => {
    const percent = (count / maxCount) * 100;
    const color = getColor(count, maxCount);
    return `
      <div class="result-row">
        <span class="word">${word}</span>
        <span class="count">${count}회</span>
        <div class="bar" style="width:${percent}%; background-color:${color}">${count}</div>
      </div>
    `;
  }).join("");

  const more =
    limit < fullSortedData.length
      ? `<div class="more-buttons">
           <button onclick="showResults(${limit + 30})">30개씩 더보기</button>
           <button onclick="showResults()">전체 보기</button>
         </div>`
      : "";

  resultArea.innerHTML = `<div class="results">${rows}</div>${more}`;
}
