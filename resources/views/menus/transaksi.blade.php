@extends('layouts.menu-page')

@section('title', 'Modul Kasir')
@section('description', 'Terminal Kasir Sederhana Toko Jireh')
@section('body_class', 'is-kasir-screen')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/kasir.css') }}">
@endpush

@section('content')
<!-- Baris Info Kasir Ringkas -->
<div class="kasir-top-bar">
    <div class="kasir-top-left">
        <span>No. Faktur: <strong class="badge-nota" id="notaNumber">TRX-00000000-0000</strong></span>
        <span>Kasir: <strong>01</strong></span>
        <span>Pelanggan: <strong>Umum (Tunai)</strong></span>
    </div>
    <div>
        <span>Waktu:</span>
        <strong id="liveClock" style="font-family: monospace;">-</strong>
    </div>
</div>

<!-- Baris Input Pencarian Nama Barang & Total Layar Mini -->
<div class="kasir-search-row">
    <div class="search-input-box">
        <input type="text"
               id="productSearchInput"
               class="kasir-input-main"
               placeholder="Ketik nama barang / barcode lalu tekan Enter [F2]..."
               autocomplete="off"
               autofocus>
        <ul id="autocompleteDropdown" class="autocomplete-dropdown" role="listbox"></ul>
    </div>

    <div class="qty-input-box">
        <label for="productQtyInput">Qty:</label>
        <input type="number"
               id="productQtyInput"
               class="kasir-qty-main"
               value="1"
               min="1">
    </div>

    <button type="button" id="btnAddItem" class="btn-add-main" title="Tambah ke keranjang (Enter)">
        + Tambah
    </button>

    <!-- Total Display -->
    <div class="kasir-display-mini">
        <span class="display-mini-label">TOTAL:</span>
        <span class="display-mini-val" id="displayMiniTotal">Rp 0</span>
    </div>
</div>

<!-- Tabel Kasir Fleksibel (Mengisi ruang layar, tanpa scroll halaman) -->
<div class="kasir-table-container">
    <table class="kasir-table-jadul">
        <thead>
            <tr>
                <th style="width: 35px;" class="t-center">No</th>
                <th style="width: 70px;">Kode</th>
                <th>Nama Barang</th>
                <th style="width: 60px;" class="t-center">Satuan</th>
                <th style="width: 110px;" class="t-right">Harga (Rp)</th>
                <th style="width: 100px;" class="t-center">Qty</th>
                <th style="width: 120px;" class="t-right">Subtotal (Rp)</th>
                <th style="width: 50px;" class="t-center">Aksi</th>
            </tr>
        </thead>
        <tbody id="cartTableBody">
            <!-- Item belanja dinamis -->
        </tbody>
    </table>
    <div id="emptyCartHint" class="kasir-empty-hint">
        Belum ada barang dipilih. Ketik nama barang pada kolom di atas atau tekan <strong>[F2]</strong>.
    </div>
</div>

<!-- Baris Bawah / Pembayaran & Aksi -->
<div class="kasir-bottom-bar">
    <div class="bottom-info-left">
        <strong id="itemCount">0 item (0 pcs)</strong>
        <span class="shortcut-text">
            <kbd>F2</kbd> Cari &bull; <kbd>Enter</kbd> Pilih &bull; <kbd>Del</kbd> / <kbd>F7</kbd> Clear &bull; <kbd>F8</kbd> Bayar
        </span>
    </div>

    <div class="bottom-pay-right">
        <div class="pay-total-box">
            <span>TOTAL:</span>
            <span class="pay-total-num" id="bottomTotal">Rp 0</span>
        </div>

        <button type="button" id="btnClearCart" class="btn-kasir-action btn-kasir-clear" title="Kosongkan semua pesanan (Del / F7)">
            [F7] Clear
        </button>
        <button type="button" id="btnCompleteTransaction" class="btn-kasir-action btn-kasir-pay" title="Selesai & bayar (F8)">
            [F8] Bayar
        </button>
    </div>
</div>

<!-- Pop-up Pembayaran Sesuai Gambar Referensi (Muncul saat F8 / Bayar) -->
<div id="posPaymentModal" class="pos-payment-overlay" style="display: none;">
    <div class="pos-payment-dialog">
        <!-- Header Total Belanja Hijau -->
        <div class="pos-pay-header-green">
            <div class="pos-pay-head-title">TOTAL BELANJA (Rp)</div>
            <div class="pos-pay-head-subtitle">Tampilan standart : untuk menyelesaikan transaksi tekan Enter, Esc untuk batal</div>
            <div class="pos-pay-big-display">
                <span id="posPayModalTotal">0</span>
            </div>
        </div>

        <!-- Body Grid 2 Kolom -->
        <div class="pos-pay-grid">
            <!-- Kolom Kiri: Jumlah Bayar & Jumlah Kembali -->
            <div class="pos-pay-col-left">
                <!-- Bar Jumlah Bayar Merah -->
                <div class="pos-bar-title bar-red">JUMLAH BAYAR</div>
                <div class="pos-box-input box-pink">
                    <input type="text"
                           id="posPayCashInput"
                           class="pos-input-nominal"
                           placeholder="0"
                           autocomplete="off">
                </div>

                <!-- Bar Jumlah Kembali Biru -->
                <div class="pos-bar-title bar-blue">JUMLAH KEMBALI</div>
                <div class="pos-box-display box-blue">
                    <span id="posPayChangeDisplay">-0</span>
                </div>
            </div>

            <!-- Kolom Kanan: Jumlah QTY Hitam/Abu-abu -->
            <div class="pos-pay-col-right">
                <div class="pos-bar-title bar-black">JUMLAH QTY</div>
                <div class="pos-box-qty">
                    <span id="posPayQtyDisplay">0</span>
                </div>
            </div>
        </div>

        <div class="pos-pay-footer-hint">
            <span>Tekan <kbd>Enter</kbd> untuk Selesai &amp; Cetak Struk &bull; <kbd>Space</kbd> Uang Pas &bull; <kbd>Esc</kbd> Batal</span>
        </div>
    </div>
</div>

<!-- Modal Struk Cetak Kasir -->
<div id="receiptModal" class="simple-modal" style="display: none;">
    <div class="simple-modal-box">
        <div class="simple-modal-head">
            <span>Struk Kasir Toko Jireh</span>
            <span style="cursor: pointer;" onclick="document.getElementById('btnCloseReceipt').click()">✕</span>
        </div>
        <pre class="simple-modal-body" id="receiptText"></pre>
        <div class="simple-modal-foot">
            <button type="button" id="btnPrintReceipt" class="btn-modal-print">🖨️ Cetak [Enter]</button>
            <button type="button" id="btnCloseReceipt" class="btn-modal-close">Tutup [Esc]</button>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/kasir.js') }}"></script>
@endpush
