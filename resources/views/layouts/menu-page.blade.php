<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#111111">
    <title>{{ trim($__env->yieldContent('title')) }} - Aplikasi Penjualan</title>
    <link rel="stylesheet" href="{{ asset('css/menu.css') }}">
</head>
<body class="menu-page">
    @include('partials.main-menu')
    <div class="store-banner">
        <h1>TOKO JIREH (Wonorejo - Balak)</h1>
    </div>
    <main class="content">
        <h2>@yield('title')</h2>
        <p>@yield('description')</p>
    </main>
</body>
</html>
