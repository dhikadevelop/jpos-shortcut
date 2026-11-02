<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('dashboard');
})->name('dashboard');

Route::view('/file', 'menus.file')->name('menu.file');
Route::view('/master', 'menus.master')->name('menu.master');
Route::view('/transaksi', 'menus.transaksi')->name('menu.transaksi');
Route::view('/angsuran', 'menus.angsuran')->name('menu.angsuran');
Route::view('/laporan', 'menus.laporan')->name('menu.laporan');
Route::view('/pengaturan', 'menus.pengaturan')->name('menu.pengaturan');
Route::view('/help', 'menus.help')->name('menu.help');
