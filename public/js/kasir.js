/**
 * Kasir POS - Toko Jireh
 * Tampilan 1 Layar Penuh (No Scroll), Fast Input & Pop-up Pembayaran
 */

document.addEventListener('DOMContentLoaded', function () {
    // Database Produk Pokok Toko Jireh
    const defaultCatalog = [
        { code: 'B01', barcode: '8991001', name: 'Beras Rojolele 5kg', unit: 'Sak', price: 68000 },
        { code: 'B02', barcode: '8991002', name: 'Minyak Bimoli 1L', unit: 'Pcs', price: 19500 },
        { code: 'B03', barcode: '8991003', name: 'Gula Pasir 1kg', unit: 'Pcs', price: 17500 },
        { code: 'B04', barcode: '8991004', name: 'Telur Ayam 1kg', unit: 'Kg', price: 28000 },
        { code: 'B05', barcode: '8991005', name: 'Terigu Segitiga 1kg', unit: 'Bks', price: 12500 },
        { code: 'B06', barcode: '8991006', name: 'Kopi Kapal Api 165g', unit: 'Bks', price: 14000 },
        { code: 'B07', barcode: '8991007', name: 'Teh Sariwangi 25s', unit: 'Kotak', price: 7500 },
        { code: 'B08', barcode: '8991008', name: 'Indomie Goreng', unit: 'Bks', price: 3500 },
        { code: 'B09', barcode: '8991009', name: 'Indomie Kuah Soto', unit: 'Bks', price: 3500 },
        { code: 'B10', barcode: '8991010', name: 'Susu Frisian Flag', unit: 'Klg', price: 12000 },
        { code: 'B11', barcode: '8991011', name: 'Sabun Lifebuoy', unit: 'Btg', price: 4500 },
        { code: 'B12', barcode: '8991012', name: 'Sunlight 650ml', unit: 'Pch', price: 15000 },
        { code: 'B13', barcode: '8991013', name: 'Rinso 770g', unit: 'Bks', price: 22000 },
        { code: 'B14', barcode: '8991014', name: 'Aqua 600ml', unit: 'Btl', price: 4000 },
        { code: 'B15', barcode: '8991015', name: 'Gas LPG 3kg', unit: 'Tbg', price: 22000 },
        { code: 'B16', barcode: '8991016', name: 'Garam Dapur 250g', unit: 'Bks', price: 3000 },
        { code: 'B17', barcode: '8991017', name: 'Kecap Bango 550ml', unit: 'Pch', price: 24000 },
        { code: 'B18', barcode: '8991018', name: 'Saus Sambal ABC', unit: 'Btl', price: 16000 },
        { code: 'B19', barcode: '8991019', name: 'Biskuit Roma Kelapa', unit: 'Bks', price: 11500 }
    ];

    let catalog = JSON.parse(localStorage.getItem('jpos_catalog')) || defaultCatalog;
    let cart = [];
    let trxNumber = parseInt(localStorage.getItem('jpos_trx_no') || '1', 10);
    let selectedIdx = -1;
    let canPrintReceipt = false;
    let pendingProduct = null;

    // DOM Elements Utama
    const elSearch = document.getElementById('productSearchInput');
    const elQty = document.getElementById('productQtyInput');
    const elBtnAdd = document.getElementById('btnAddItem');
    const elDropdown = document.getElementById('autocompleteDropdown');
    const elCartBody = document.getElementById('cartTableBody');
    const elEmptyHint = document.getElementById('emptyCartHint');
    const elDisplayMini = document.getElementById('displayMiniTotal');
    const elBottomTotal = document.getElementById('bottomTotal');
    const elItemCount = document.getElementById('itemCount');
    const elCash = document.getElementById('inputCash');
    const elBtnUangPas = document.getElementById('btnUangPas');
    const elChange = document.getElementById('changeAmount');
    const elNotaNo = document.getElementById('notaNumber');
    const elClock = document.getElementById('liveClock');
    const elBtnClear = document.getElementById('btnClearCart');
    const elBtnPay = document.getElementById('btnCompleteTransaction');
    const elBtnNew = document.getElementById('btnNewTransaction');

    // DOM Elements Pop-up Pembayaran Sesuai Gambar
    const elPosModal = document.getElementById('posPaymentModal');
    const elPosModalTotal = document.getElementById('posPayModalTotal');
    const elPosCashInput = document.getElementById('posPayCashInput');
    const elPosChangeDisplay = document.getElementById('posPayChangeDisplay');
    const elPosQtyDisplay = document.getElementById('posPayQtyDisplay');

    // DOM Elements Struk
    const elModal = document.getElementById('receiptModal');
    const elReceipt = document.getElementById('receiptText');
    const elBtnPrint = document.getElementById('btnPrintReceipt');
    const elBtnClose = document.getElementById('btnCloseReceipt');

    function formatRp(val) {
        return 'Rp ' + Math.round(Number(val) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function formatComma(num) {
        return Math.round(Number(num) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function getInvoiceStr() {
        const d = new Date();
        const datePart = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
        return `TRX-${datePart}-${String(trxNumber).padStart(4, '0')}`;
    }

    function updateTime() {
        if (!elClock) return;
        const d = new Date();
        elClock.textContent = d.toLocaleDateString('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).replace(/\./g, ':');
    }
    setInterval(updateTime, 1000);
    updateTime();

    function refreshInvoice() {
        if (elNotaNo) elNotaNo.textContent = getInvoiceStr();
    }
    refreshInvoice();

    // Hitung Total Belanja, Qty Total & Kembalian
    function calculateTotals() {
        let total = 0;
        let qtyTotal = 0;
        cart.forEach(it => {
            total += (it.price * it.qty);
            qtyTotal += it.qty;
        });

        const str = formatRp(total);
        if (elDisplayMini) elDisplayMini.textContent = str;
        if (elBottomTotal) elBottomTotal.textContent = str;
        if (elItemCount) elItemCount.textContent = `${cart.length} item (${qtyTotal} pcs)`;

        const cash = parseFloat(elCash ? elCash.value : '0') || 0;
        const change = cash - total;
        if (elChange) {
            elChange.textContent = formatRp(cash > 0 ? (change >= 0 ? change : 0) : 0);
        }
        return total;
    }

    // Render Tabel Belanja
    function renderTable() {
        if (!elCartBody) return;
        elCartBody.innerHTML = '';

        if (cart.length === 0) {
            if (elEmptyHint) elEmptyHint.style.display = 'block';
            calculateTotals();
            return;
        }

        if (elEmptyHint) elEmptyHint.style.display = 'none';

        cart.forEach((it, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="t-center">${i + 1}</td>
                <td class="t-mono">${it.code}</td>
                <td style="font-weight: 600;">${it.name}</td>
                <td class="t-center">${it.unit || 'Pcs'}</td>
                <td class="t-right t-mono">${formatRp(it.price).replace('Rp ', '')}</td>
                <td class="t-center">
                    <button type="button" class="btn-mini-qty" data-act="dec" data-idx="${i}">-</button>
                    <input type="number" min="1" class="input-table-qty" value="${it.qty}" data-idx="${i}">
                    <button type="button" class="btn-mini-qty" data-act="inc" data-idx="${i}">+</button>
                </td>
                <td class="t-right t-mono" style="font-weight: 600;">${formatRp(it.price * it.qty).replace('Rp ', '')}</td>
                <td class="t-center">
                    <button type="button" class="btn-row-del" data-act="del" data-idx="${i}" title="Hapus item">&times;</button>
                </td>
            `;
            elCartBody.appendChild(tr);
        });

        calculateTotals();
    }

    // Tambah Item ke Keranjang
    function addItem(product, qty = 1) {
        if (!product) return;
        qty = parseInt(qty, 10) || 1;

        const idx = cart.findIndex(c => c.code === product.code);
        if (idx >= 0) {
            cart[idx].qty += qty;
        } else {
            cart.push({
                code: product.code,
                name: product.name,
                unit: product.unit || 'Pcs',
                price: product.price,
                qty: qty
            });
        }

        renderTable();
        if (elSearch) elSearch.value = '';
        if (elQty) elQty.value = '1';
        hideDropdown();
        if (elSearch) elSearch.focus();
    }

    // Pilih Barang -> Langsung Beralih & Edit Quantity
    function selectProduct(product) {
        if (!product) return;
        pendingProduct = product;
        if (elSearch) elSearch.value = product.name;
        hideDropdown();
        if (elQty) {
            elQty.value = '1';
            elQty.focus();
            elQty.select();
        }
    }

    // Otomatis buat item baru jika belum terdaftar lalu beralih ke input quantity
    function selectCustomProduct(name) {
        if (!name) return;
        const trimmed = name.trim();
        let existing = catalog.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
        if (existing) {
            selectProduct(existing);
            return;
        }
        const newCode = 'B' + (catalog.length + 1);
        const newItem = {
            code: newCode,
            name: trimmed,
            unit: 'Pcs',
            price: 10000
        };
        catalog.push(newItem);
        localStorage.setItem('jpos_catalog', JSON.stringify(catalog));
        selectProduct(newItem);
    }

    // Selesai Input Quantity -> Masukkan ke Keranjang & Otomatis Kembali ke Pencarian Barang
    function commitPendingItem() {
        const qty = parseInt(elQty ? elQty.value : '1', 10) || 1;
        if (pendingProduct) {
            addItem(pendingProduct, qty);
            pendingProduct = null;
        } else if (elSearch && elSearch.value.trim()) {
            const matches = filterProducts(elSearch.value.trim());
            if (matches.length > 0) {
                addItem(matches[0], qty);
            } else {
                selectCustomProduct(elSearch.value.trim());
                return;
            }
        }
        if (elSearch) {
            elSearch.value = '';
            elSearch.focus();
        }
        if (elQty) {
            elQty.value = '1';
        }
    }

    // Event Input Quantity: Tekan Enter untuk Masukkan ke Keranjang & Balik ke Kolom Cari Barang
    if (elQty) {
        elQty.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitPendingItem();
            }
        });
    }

    // KOSONGKAN / CLEAR SEMUA ITEM PESANAN (Shortcut Del / F7)
    function clearCart() {
        if (cart.length === 0) return;
        cart = [];
        renderTable();
        if (elCash) elCash.value = '';
        if (elSearch) {
            elSearch.value = '';
            elSearch.focus();
        }
    }

    if (elBtnClear) {
        elBtnClear.addEventListener('click', clearCart);
    }

    // Pencarian / Autocomplete
    function filterProducts(query) {
        query = query.trim().toLowerCase();
        if (!query) return [];
        return catalog.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.code.toLowerCase().includes(query) ||
            (p.barcode && p.barcode.includes(query))
        );
    }

    function showDropdown(matches) {
        if (!elDropdown) return;
        elDropdown.innerHTML = '';
        selectedIdx = -1;

        if (matches.length === 0) {
            const val = elSearch.value.trim();
            if (val) {
                const li = document.createElement('li');
                li.innerHTML = `<span>+ Tambah "<strong>${val}</strong>"</span><span style="color:#16a34a;">(Rp 10.000)</span>`;
                li.addEventListener('click', () => selectCustomProduct(val));
                elDropdown.appendChild(li);
                elDropdown.style.display = 'block';
            } else {
                hideDropdown();
            }
            return;
        }

        matches.slice(0, 8).forEach((p, idx) => {
            const li = document.createElement('li');
            li.setAttribute('data-idx', idx);
            li.innerHTML = `
                <span>[${p.code}] ${p.name}</span>
                <span class="t-mono" style="color: #16a34a; font-weight: 600;">${formatRp(p.price)}</span>
            `;
            li.addEventListener('click', () => {
                selectProduct(p);
            });
            elDropdown.appendChild(li);
        });

        elDropdown.style.display = 'block';
    }

    function hideDropdown() {
        if (elDropdown) {
            elDropdown.style.display = 'none';
            selectedIdx = -1;
        }
    }

    // Input Search Events
    if (elSearch) {
        elSearch.addEventListener('input', function () {
            const val = this.value;
            if (val.trim()) {
                showDropdown(filterProducts(val));
            } else {
                hideDropdown();
            }
        });

        elSearch.addEventListener('keydown', function (e) {
            const items = elDropdown ? elDropdown.querySelectorAll('li') : [];
            if (elDropdown && elDropdown.style.display === 'block' && items.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectedIdx = (selectedIdx + 1) % items.length;
                    items.forEach((it, i) => it.classList.toggle('is-active', i === selectedIdx));
                    return;
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIdx = (selectedIdx - 1 + items.length) % items.length;
                    items.forEach((it, i) => it.classList.toggle('is-active', i === selectedIdx));
                    return;
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedIdx >= 0 && items[selectedIdx]) {
                        items[selectedIdx].click();
                    } else if (items[0]) {
                        items[0].click();
                    }
                    return;
                }
            }

            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                const matches = filterProducts(this.value);
                if (matches.length > 0) {
                    selectProduct(matches[0]);
                } else {
                    selectCustomProduct(this.value.trim());
                }
            }
        });
    }

    if (elBtnAdd) {
        elBtnAdd.addEventListener('click', function () {
            commitPendingItem();
        });
    }

    // Event Aksi di Tabel Keranjang
    if (elCartBody) {
        elCartBody.addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            const act = btn.getAttribute('data-act');
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (isNaN(idx) || !cart[idx]) return;

            if (act === 'inc') {
                cart[idx].qty += 1;
                renderTable();
            } else if (act === 'dec') {
                if (cart[idx].qty > 1) {
                    cart[idx].qty -= 1;
                } else {
                    cart.splice(idx, 1);
                }
                renderTable();
            } else if (act === 'del') {
                cart.splice(idx, 1);
                renderTable();
            }
        });

        elCartBody.addEventListener('change', function (e) {
            const inp = e.target.closest('.input-table-qty');
            if (!inp) return;
            const idx = parseInt(inp.getAttribute('data-idx'), 10);
            if (isNaN(idx) || !cart[idx]) return;
            const val = parseInt(inp.value, 10);
            if (val > 0) {
                cart[idx].qty = val;
            } else {
                cart.splice(idx, 1);
            }
            renderTable();
        });
    }

    // ==============================================================
    // POP-UP PEMBAYARAN SESUAI GAMBAR REFERENSI (F8 / Klik Bayar)
    // ==============================================================
    function openPosPaymentModal() {
        let total = 0;
        let qtyTotal = 0;
        cart.forEach(it => {
            total += (it.price * it.qty);
            qtyTotal += it.qty;
        });

        if (total === 0 || cart.length === 0) {
            alert('Keranjang kasir masih kosong!');
            if (elSearch) elSearch.focus();
            return;
        }

        if (elPosModalTotal) elPosModalTotal.textContent = formatComma(total);
        if (elPosQtyDisplay) elPosQtyDisplay.textContent = qtyTotal;
        if (elPosCashInput) elPosCashInput.value = '';
        if (elPosChangeDisplay) elPosChangeDisplay.textContent = '-' + formatComma(total);

        if (elPosModal) elPosModal.style.display = 'flex';
        setTimeout(() => {
            if (elPosCashInput) elPosCashInput.focus();
        }, 50);
    }

    function closePosPaymentModal() {
        if (elPosModal) elPosModal.style.display = 'none';
        if (elSearch) elSearch.focus();
    }

    if (elPosCashInput) {
        elPosCashInput.addEventListener('input', function () {
            const raw = this.value.replace(/[^0-9]/g, '');
            const total = calculateTotals();
            const cash = parseInt(raw, 10) || 0;
            this.value = raw ? formatComma(cash) : '';

            const change = cash - total;
            if (elPosChangeDisplay) {
                if (change < 0) {
                    elPosChangeDisplay.textContent = '-' + formatComma(Math.abs(change));
                } else {
                    elPosChangeDisplay.textContent = formatComma(change);
                }
            }
        });

        elPosCashInput.addEventListener('keydown', function (e) {
            const total = calculateTotals();
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                const raw = this.value.replace(/[^0-9]/g, '');
                let cash = parseInt(raw, 10) || 0;
                if (cash === 0) {
                    // Jika kosong tekan enter, otomatis uang pas
                    cash = total;
                }
                finishPayment(cash);
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                // Spasi untuk set uang pas
                this.value = formatComma(total);
                if (elPosChangeDisplay) elPosChangeDisplay.textContent = '0';
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closePosPaymentModal();
            }
        });
    }

    // Input Bayar & Uang Pas di Baris Bawah (Tetap Sinkron)
    if (elCash) {
        elCash.addEventListener('input', calculateTotals);
        elCash.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                openPosPaymentModal();
            }
        });
        elCash.addEventListener('focus', function () {
            openPosPaymentModal();
        });
    }

    if (elBtnUangPas) {
        elBtnUangPas.addEventListener('click', function () {
            openPosPaymentModal();
            const total = calculateTotals();
            if (elPosCashInput) {
                elPosCashInput.value = formatComma(total);
                if (elPosChangeDisplay) elPosChangeDisplay.textContent = '0';
            }
        });
    }

    // Transaksi Baru
    function newTransaction() {
        cart = [];
        trxNumber++;
        localStorage.setItem('jpos_trx_no', trxNumber);
        refreshInvoice();
        if (elCash) elCash.value = '';
        renderTable();
        if (elSearch) {
            elSearch.value = '';
            elSearch.focus();
        }
    }

    if (elBtnNew) {
        elBtnNew.addEventListener('click', newTransaction);
    }

    // Selesaikan & Cetak Struk
    function finishPayment(cashAmount) {
        const total = calculateTotals();
        const cash = (cashAmount !== undefined && cashAmount !== null) ? cashAmount : (parseFloat(elCash ? elCash.value : '0') || total);
        const change = cash - total;

        closePosPaymentModal();

        let receipt = '';
        receipt += '========================================\n';
        receipt += '             TOKO JIREH                \n';
        receipt += '      Wonorejo - Balak, Banyuwangi      \n';
        receipt += '========================================\n';
        receipt += `No. Nota : ${getInvoiceStr()}\n`;
        receipt += `Waktu    : ${elClock ? elClock.textContent : ''}\n`;
        receipt += 'Kasir    : 01\n';
        receipt += 'Pelanggan: Umum (Tunai)\n';
        receipt += '----------------------------------------\n';

        cart.forEach(it => {
            const lineSub = it.price * it.qty;
            receipt += `${it.name.padEnd(24).substring(0, 24)} \n`;
            receipt += `   ${it.qty} x ${formatRp(it.price).replace('Rp ', '')}`.padEnd(25) + `${formatRp(lineSub).replace('Rp ', '')}\n`;
        });

        receipt += '----------------------------------------\n';
        receipt += `TOTAL    : ${formatRp(total).padStart(30)}\n`;
        receipt += `Bayar    : ${formatRp(cash).padStart(30)}\n`;
        receipt += `Kembali  : ${formatRp(change > 0 ? change : 0).padStart(30)}\n`;
        receipt += '========================================\n';
        receipt += '      Terima Kasih Atas Kunjungan Anda! \n';
        receipt += ' Barang yang dibeli tidak dapat ditukar  \n';

        if (elReceipt) elReceipt.textContent = receipt;
        if (elModal) {
            canPrintReceipt = false;
            elModal.style.display = 'flex';
            // Beri jeda 400ms agar tombol Enter dari pop-up bayar tidak langsung mengeksekusi print
            setTimeout(() => {
                canPrintReceipt = true;
                if (elBtnPrint) elBtnPrint.focus();
            }, 400);
        }
    }

    if (elBtnPay) {
        elBtnPay.addEventListener('click', openPosPaymentModal);
    }

    if (elBtnPrint) {
        elBtnPrint.addEventListener('click', function () {
            window.print();
            if (elModal) elModal.style.display = 'none';
            newTransaction();
        });
    }

    if (elBtnClose) {
        elBtnClose.addEventListener('click', function () {
            if (elModal) elModal.style.display = 'none';
            newTransaction();
        });
    }

    // Keyboard Shortcuts Global
    document.addEventListener('keydown', function (e) {
        // Jika Modal Struk sedang terbuka:
        if (elModal && elModal.style.display === 'flex') {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (canPrintReceipt && elBtnPrint) {
                    elBtnPrint.click();
                }
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                if (elBtnClose) elBtnClose.click();
                return;
            }
        }

        // Esc: tutup modal
        if (e.key === 'Escape') {
            closePosPaymentModal();
            if (elModal) elModal.style.display = 'none';
            hideDropdown();
            return;
        }

        // F7 atau Del: Kosongkan / Clear semua item dalam pesanan
        if (e.key === 'F7') {
            e.preventDefault();
            clearCart();
            return;
        }

        if (e.key === 'Delete') {
            const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            // Jika Shift+Del, Ctrl+Del, atau kursor tidak sedang di dalam input teks
            if (e.shiftKey || e.ctrlKey || (tag !== 'input' && tag !== 'textarea')) {
                e.preventDefault();
                clearCart();
                return;
            }
        }

        // F2: Fokus kolom cari barang
        if (e.key === 'F2') {
            e.preventDefault();
            if (elSearch) {
                elSearch.focus();
                elSearch.select();
            }
            return;
        }

        // F8: Buka Pop-up Pembayaran
        if (e.key === 'F8') {
            e.preventDefault();
            openPosPaymentModal();
            return;
        }

        // F9: Selesaikan & Cetak jika pop-up bayar buka
        if (e.key === 'F9') {
            e.preventDefault();
            if (elPosModal && elPosModal.style.display === 'flex') {
                const total = calculateTotals();
                const raw = elPosCashInput ? elPosCashInput.value.replace(/[^0-9]/g, '') : '';
                const cash = parseInt(raw, 10) || total;
                finishPayment(cash);
            } else {
                openPosPaymentModal();
            }
            return;
        }

        // F12: Transaksi Baru
        if (e.key === 'F12') {
            e.preventDefault();
            newTransaction();
            return;
        }
    });

    document.addEventListener('click', function (e) {
        if (elDropdown && !e.target.closest('.search-input-box')) {
            hideDropdown();
        }
    });

    renderTable();
    if (elSearch) elSearch.focus();
});
