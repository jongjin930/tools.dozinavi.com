const input = document.getElementById("searchInput");
const table = document.getElementById("contactsTable");
const tbody = table.querySelector("tbody");
const toast = document.getElementById("toast");
let rows = [];

Papa.parse("centers.csv", {
  download: true,
  header: true,
  complete: function(results) {
    rows = results.data.filter(r => r["최하위기관명"]); // 빈 줄 제거
  }
});

input.addEventListener("input", () => {
  const keyword = input.value.trim().toLowerCase();
  tbody.innerHTML = "";

  if (keyword === "") {
    table.style.display = "none";
    return;
  }

  const filtered = rows.filter(row =>
    [row["최하위기관명"], row["기관유형별분류"], row["대표전화번호"], row["도로명주소"]]
      .some(value => value?.toLowerCase().includes(keyword))
  );

  filtered.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row["최하위기관명"]}</td>
      <td>${row["기관유형별분류"]}</td>
      <td class="phone">${row["대표전화번호"]}</td>
      <td>${row["도로명주소"]}</td>
    `;
    tbody.appendChild(tr);
  });

  table.style.display = filtered.length ? "table" : "none";
});

tbody.addEventListener("click", e => {
  if (e.target.classList.contains("phone")) {
    const tel = e.target.textContent.trim();
    navigator.clipboard.writeText(tel).then(() => {
      toast.style.display = "block";
      setTimeout(() => toast.style.display = "none", 1500);
    });
  }
});
