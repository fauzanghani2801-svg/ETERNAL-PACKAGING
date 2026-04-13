let dataBahan = [];
let selectedIndex = -1;

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const detailsDiv = document.getElementById('details');

// Load data.json
fetch('data.json')
  .then(resp => resp.json())
  .then(data => dataBahan = data);

// Realtime search
searchInput.addEventListener('input', function() {
  const keyword = this.value.toLowerCase();
  resultsDiv.innerHTML = '';
  detailsDiv.innerHTML = '';
  selectedIndex = -1;

  if (!keyword) return;

  const matches = dataBahan.filter(b => b.nama.toLowerCase().includes(keyword));

  matches.forEach((b, i) => {
    const div = document.createElement('div');
    div.textContent = b.nama;
    div.className = 'result-item';
    div.dataset.index = i;

    div.onclick = () => selectItem(b);
    div.onmouseover = () => { selectedIndex = i; highlight(); };
    div.onmouseout = () => { selectedIndex = -1; highlight(); };

    resultsDiv.appendChild(div);
  });
});

// Highlight hover
function highlight() {
  Array.from(resultsDiv.children).forEach((div, i) => {
    div.style.background = i === selectedIndex ? '#d0e0ff' : '';
  });
}

// Pilih item → dropdown jumlah pcs + harga
function selectItem(bahan) {
  searchInput.value = bahan.nama;
  resultsDiv.innerHTML = '';

  detailsDiv.innerHTML = `<strong>${bahan.nama}</strong>`;

  // Cup → ada pilihan jumlah pcs
  if (bahan.harga) {
    const jumlahOptions = Object.keys(bahan.harga).sort((a,b)=>a-b);
    const select = document.createElement('select');
    select.id = 'jumlahPcs';
    jumlahOptions.forEach(j => {
      const option = document.createElement('option');
      option.value = j;
      option.text = Number(j).toLocaleString('id-ID') + ' Pcs';
      select.appendChild(option);
    });

    const hargaDiv = document.createElement('div');
    hargaDiv.id = 'hargaDiv';
    hargaDiv.style.marginTop = '10px';
    updateHarga(bahan, select.value, hargaDiv);

    select.addEventListener('change', function() {
      updateHarga(bahan, this.value, hargaDiv);
    });

    detailsDiv.appendChild(select);
    detailsDiv.appendChild(hargaDiv);
  } 
  // Lid → hanya harga jual
  else if (bahan.hargaJual) {
    const hargaDiv = document.createElement('div');
    hargaDiv.style.marginTop = '10px';
    hargaDiv.innerHTML = `Harga: Rp ${Number(bahan.hargaJual).toLocaleString('id-ID')}`;
    detailsDiv.appendChild(hargaDiv);
  }
}

// Update harga Cup sesuai jumlah pcs
function updateHarga(bahan, jumlah, container) {
  const harga = bahan.harga[jumlah];
  container.innerHTML = `Harga: Rp ${Number(harga).toLocaleString('id-ID')}`;
}

// Keyboard navigation
searchInput.addEventListener('keydown', function(e) {
  const items = Array.from(resultsDiv.children);
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % items.length;
    highlight();
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    highlight();
    e.preventDefault();
  } else if (e.key === 'Enter') {
    if (selectedIndex >= 0) {
      const bahan = dataBahan[selectedIndex];
      selectItem(bahan);
      e.preventDefault();
    }
  }
});