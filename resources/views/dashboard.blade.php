<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#111111">
    <title>Aplikasi Penjualan - Toko Jireh</title>
    <link rel="stylesheet" href="{{ asset('css/menu.css') }}">
    <link rel="stylesheet" href="{{ asset('css/calendar.css') }}">
    <style>
        :root {
            color-scheme: light;
            font-family: Georgia, "Times New Roman", serif;
            font-synthesis: none;
            text-rendering: optimizeLegibility;
            --paper: #f4eddd;
            --paper-light: #fbf7ed;
            --ink: #3b2a1e;
            --walnut: #38241a;
            --brass: #c39a4a;
            --brass-light: #ead49a;
            --rule: #d7c6a3;
        }

        * {
            box-sizing: border-box;
        }

        html,
        body {
            width: 100%;
            min-width: 760px;
            min-height: 100%;
            margin: 0;
        }

        body {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
            overflow: hidden;
            background: var(--paper);
            color: var(--ink);
        }

        .window-title {
            display: flex;
            height: 24px;
            align-items: center;
            justify-content: space-between;
            padding-left: 8px;
            background: var(--paper-light);
            font-size: 12px;
        }

        .window-controls {
            display: flex;
            height: 24px;
            align-items: stretch;
        }

        .window-controls span {
            display: grid;
            width: 44px;
            place-items: center;
            font-size: 13px;
        }

        .window-controls span:last-child {
            width: 45px;
            font-size: 17px;
        }

        .store-banner {
            display: grid;
            width: 100%;
            height: 42px;
            flex: 0 0 42px;
            place-items: center;
            border-bottom: 3px double var(--brass);
            background: var(--walnut);
            color: var(--brass-light);
        }

        .store-banner h1 {
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            font-size: clamp(18px, 2.1vw, 28px);
            font-style: italic;
            font-weight: 700;
            letter-spacing: 1px;
            text-align: center;
            text-shadow: 1px 2px 0 #21140e;
        }

        .desktop {
            display: flex;
            align-items: stretch;
            min-height: 0;
            flex: 1;
            background:
                repeating-linear-gradient(0deg, rgb(105 76 41 / 2%) 0 1px, transparent 1px 4px),
                var(--paper);
        }

        .storefront {
            position: relative;
            width: 100%;
            min-height: 0;
            flex: 1;
            overflow: hidden;
        }

        .status-bar {
            display: flex;
            height: 20px;
            flex: 0 0 20px;
            align-items: center;
            border-top: 1px solid #d5d5d5;
            border-color: var(--rule);
            background: #ece1ca;
            color: #59442e;
            font-size: 11px;
        }

        .status-bar span {
            display: flex;
            height: 100%;
            align-items: center;
            padding: 0 8px;
            border-right: 1px solid #d5d5d5;
        }

        .status-bar span:first-child {
            width: 43px;
        }

        .status-bar span:last-child {
            min-width: 90px;
        }

        @media (max-width: 800px) {
            body {
                overflow: auto;
            }
        }
    </style>
</head>
<body>
    @include('partials.main-menu')

    <div class="store-banner">
        <h1>TOKO JIREH (Wonorejo - Balak)</h1>
    </div>

    <main class="desktop">
        <section class="storefront" aria-label="Dashboard Toko Jireh">
            @include('partials.calendar')
        </section>
    </main>

    <footer class="status-bar">
        <span>User</span>
        <span>Silahkan Login</span>
    </footer>
    <script src="{{ asset('js/calendar.js') }}" defer></script>
</body>
</html>
