<nav class="menu-bar" aria-label="Menu utama">
    <a class="menu-link{{ request()->routeIs('menu.file') ? ' is-active' : '' }}"
       href="{{ route('menu.file') }}"
       @if (request()->routeIs('menu.file')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 3.75h8l4 4v12.5H6z" fill="#e7efff" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
            <path d="M14 3.75v4h4M9 12h6M9 15.5h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>File</span>
    </a>
    <a class="menu-link{{ request()->routeIs('menu.master') ? ' is-active' : '' }}"
       href="{{ route('menu.master') }}"
       @if (request()->routeIs('menu.master')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="8" r="3" fill="#dcfce7" stroke="currentColor" stroke-width="1.7"/>
            <circle cx="17" cy="9" r="2.3" fill="#dcfce7" stroke="currentColor" stroke-width="1.7"/>
            <path d="M3.5 19c.4-3 2.3-4.5 5.5-4.5s5.1 1.5 5.5 4.5M14.4 15c3.4-.7 5.6.7 6.1 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
        <span>Master</span>
    </a>
    <a class="menu-link{{ request()->routeIs('menu.transaksi') ? ' is-active' : '' }}"
       href="{{ route('menu.transaksi') }}"
       @if (request()->routeIs('menu.transaksi')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.5 5h2l2.2 10.1a1.7 1.7 0 0 0 1.7 1.3h8.2a1.7 1.7 0 0 0 1.6-1.2L21 8H6" fill="#ffedd5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="10" cy="20" r="1.5" fill="currentColor"/>
            <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
        </svg>
        <span>Transaksi</span>
    </a>
    <a class="menu-link{{ request()->routeIs('menu.angsuran') ? ' is-active' : '' }}"
       href="{{ route('menu.angsuran') }}"
       @if (request()->routeIs('menu.angsuran')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="#fef3c7" stroke="currentColor" stroke-width="1.7"/>
            <path d="M7.5 3.5v3M16.5 3.5v3M4 9.5h16M8 13h3M8 16h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
        <span>Angsuran</span>
    </a>
    <a class="menu-link{{ request()->routeIs('menu.laporan') ? ' is-active' : '' }}"
       href="{{ route('menu.laporan') }}"
       @if (request()->routeIs('menu.laporan')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 19.5h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M6.5 17v-5h3v5M11 17V7h3v10M15.5 17v-7h3v7" fill="#ede9fe" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
        </svg>
        <span>Laporan</span>
    </a>
    <a class="menu-link{{ request()->routeIs('menu.pengaturan') ? ' is-active' : '' }}"
       href="{{ route('menu.pengaturan') }}"
       @if (request()->routeIs('menu.pengaturan')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 3.8h4l.6 2.1a6.6 6.6 0 0 1 1.5.9l2.1-.6 2 3.5-1.5 1.6a7 7 0 0 1 0 1.7l1.5 1.6-2 3.5-2.1-.6a6.6 6.6 0 0 1-1.5.9l-.6 2.1h-4l-.6-2.1a6.6 6.6 0 0 1-1.5-.9l-2.1.6-2-3.5 1.5-1.6a7 7 0 0 1 0-1.7L3.8 9.7l2-3.5 2.1.6a6.6 6.6 0 0 1 1.5-.9z" fill="#e0f2fe" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
            <circle cx="12" cy="12.2" r="2.6" fill="white" stroke="currentColor" stroke-width="1.7"/>
        </svg>
        <span>Pengaturan</span>
    </a>
    <a class="menu-link{{ request()->routeIs('menu.help') ? ' is-active' : '' }}"
       href="{{ route('menu.help') }}"
       @if (request()->routeIs('menu.help')) aria-current="page" @endif>
        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="#fce7f3" stroke="currentColor" stroke-width="1.7"/>
            <path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-1 .9-1.6 1.2-1.6 2.5M12 16.8v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span>Help</span>
    </a>
</nav>
