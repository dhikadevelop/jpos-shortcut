<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_dashboard_displays_the_store_home_screen(): void
    {
        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertSee('Aplikasi Penjualan')
            ->assertSee('TOKO JIREH (Wonorejo - Balak)')
            ->assertSee('Kalender Digital')
            ->assertSee('data-calendar-clock', false)
            ->assertSee('data-calendar-live-date', false)
            ->assertSee('LIVE')
            ->assertDontSee('data-calendar-grid', false)
            ->assertDontSee('data-calendar-previous', false)
            ->assertDontSee('data-calendar-selected', false)
            ->assertSee('css/calendar.css')
            ->assertSee('js/calendar.js')
            ->assertDontSee('stencil-art')
            ->assertDontSee('wood-knot')
            ->assertDontSee('Monday, 02 November 2026')
            ->assertSee('Silahkan Login');
    }

    public function test_each_main_menu_link_opens_its_own_page(): void
    {
        $pages = [
            'File' => route('menu.file'),
            'Master' => route('menu.master'),
            'Transaksi' => route('menu.transaksi'),
            'Angsuran' => route('menu.angsuran'),
            'Laporan' => route('menu.laporan'),
            'Pengaturan' => route('menu.pengaturan'),
            'Help' => route('menu.help'),
        ];

        $dashboard = $this->get('/');

        foreach ($pages as $label => $url) {
            $dashboard->assertSee($url)->assertSee($label);

            $this->get($url)
                ->assertOk()
                ->assertSee("<h2>{$label}</h2>", false)
                ->assertSee('aria-current="page"', false);
        }
    }

    public function test_menu_pages_use_the_same_store_name(): void
    {
        $this->get(route('menu.master'))
            ->assertOk()
            ->assertSee('TOKO JIREH (Wonorejo - Balak)');
    }
}
