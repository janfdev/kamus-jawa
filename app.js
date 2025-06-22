let kamus = JSON.parse(localStorage.getItem("kamus")) || [
  { indonesia: "ibu", wolio: "inaku" },
  { indonesia: "makan", jawa: "dahar" },
  { indonesia: "minum", jawa: "ngombe" },
  { indonesia: "teman", jawa: "kanca" },
  { indonesia: "ayah", jawa: "bapak" },
  { indonesia: "ibu", jawa: "ibu" }
];

const kataList = document.getElementById("kataList");
const logBox = document.getElementById("log");
let showAll = false;

let inputKata = document.getElementById("inputKata");
inputKata.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    mulaiSimulasi();
  }
});

function tampilkanKata(highlightIdx = -1, showAllKata = false) {
  kataList.innerHTML = "";
  const container = document.createElement("div");
  container.className = "flex flex-wrap gap-2";
  const limit = showAllKata ? kamus.length : 7;

  kamus.forEach((item, i) => {
    if (!showAllKata && i >= limit) return;
    const box = document.createElement("div");
    box.className = `px-3 py-1 rounded-full border text-sm ${
      highlightIdx === i ? "bg-green-200 font-bold" : "bg-gray-100"
    }`;
    box.textContent = `${item.indonesia} [${i}]`;
    container.appendChild(box);
  });

  kataList.appendChild(container);

  if (kamus.length > 7) {
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = showAllKata ? "Sembunyikan" : "Lihat Semua";
    toggleBtn.className = "mt-2 text-blue-500 underline text-sm";
    toggleBtn.onclick = () => {
      showAll = !showAll;
      tampilkanKata(-1, showAll);
    };
    kataList.appendChild(toggleBtn);
  }
}

function tambahKata() {
  const id = document.getElementById("inputID").value.trim().toLowerCase();
  const wolio= document.getElementById("inputJW").value.trim().toLowerCase();

  if (!id || !wolio) {
    Swal.fire("Gagal", "Kedua input harus diisi", "error");
    return;
  }

  if (kamus.some((item) => item.indonesia === id)) {
    Swal.fire("Gagal", "Kata sudah ada di kamus", "warning");
    return;
  }

  kamus.push({ indonesia: id, wolio: wolio });
  tampilkanKata(-1, showAll);

  document.getElementById("inputID").value = "";
  document.getElementById("inputJW").value = "";
  Swal.fire("Berhasil", "Kata ditambahkan ke kamus", "success");
}

function resetKamus() {
  Swal.fire({
    title: "Yakin ingin menghapus semua data?",
    text: "Tindakan ini tidak bisa dibatalkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("kamus");
      location.reload();
    }
  });
}

async function mulaiSimulasi() {
  document.getElementById("terjemahanID").textContent = "";
  document.getElementById("terjemahanJW").textContent = "";
  logBox.innerHTML = "";

  const input = document.getElementById("inputKata").value.trim().toLowerCase();
  tampilkanKata(-1, showAll);

  if (!input) {
    Swal.fire("Oops", "Teks harus diisi", "error");
    return;
  }

  let left = 0;
  let right = kamus.length - 1;
  let step = 1;

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    tampilkanKata(mid, true);

    let log = `Langkah ${step}:\nLeft = ${left} (${kamus[left].indonesia})\nMid = ${mid} (${kamus[mid].indonesia})\nRight = ${right} (${kamus[right].indonesia})\n`;

    await delay(1000);

    if (kamus[mid].indonesia === input) {
      log += `✅ Kata "${input}" ditemukan di indeks ${mid}\n\n`;
      logBox.innerHTML += log;

      document.getElementById("terjemahanID").textContent =
        kamus[mid].indonesia.charAt(0).toUpperCase() +
        kamus[mid].indonesia.slice(1);
      document.getElementById("terjemahanJW").textContent =
        kamus[mid].wolio.charAt(0).toUpperCase() + kamus[mid].wolio.slice(1);
      return;
    } else if (kamus[mid].indonesia > input) {
      log += `→ "${input}" lebih kecil dari "${kamus[mid].indonesia}", geser ke kiri\n\n`;
      right = mid - 1;
    } else {
      log += `→ "${input}" lebih besar dari "${kamus[mid].indonesia}", geser ke kanan\n\n`;
      left = mid + 1;
    }

    logBox.innerHTML += log;
    step++;
    await delay(500);
  }

  logBox.innerHTML += `❌ Kata "${input}" tidak ditemukan dalam kamus.\n`;
}

// Load awal
tampilkanKata();
