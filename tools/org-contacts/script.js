const input = document.getElementById("searchInput");
const table = document.getElementById("contactsTable");
const tbody = table.querySelector("tbody");
const toast = document.getElementById("toast");
let rows = [];

fetch("centers.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n");
    const header = lines[0].split(",");
    const idxName = header.indexOf("최하위기관명");
    const idxType = header.indexOf("기관유형별분류");
    const idxTel  = header.indexOf("대표전화번호");
    const idxAddr = header.indexOf("도로명주소");

    rows = lines.slice(1).map(line => {
      const cols = line.split(",");
      return {
        name: cols[idxName]?.trim(),
        type: cols[idxType]?.trim(),
        tel:  cols[idxTel]?.trim(),
        addr: cols[idxAddr]?.trim()
      };
    });
  });

input.addEventListener("input", () => {
  const keyword = input.value.trim().toLowerCase();
  tbody.innerHTML = "";

  if (keyword === "") {
    table.style.display = "none";
    return;
  }

  const filtered = rows.filter(row =>
    Object.values(row).some(v => v?.toLowerCase().includes(keyword))
  );

  filtered.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.type}</td>
      <td class="phone">${row.tel}</td>
      <td>${row.addr}</td>
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
