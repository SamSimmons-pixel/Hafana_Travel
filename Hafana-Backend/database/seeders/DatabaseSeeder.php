<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Paket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use \Illuminate\Database\Console\Seeds\WithoutModelEvents;

    public function run(): void
    {
        // ── Jemaah Users ──
        User::factory()->create([
            'name' => 'Test User',
            'nomor_visa' => '1234567890',
            'tanggal_lahir' => '1995-08-15',
        ]);

        User::factory()->create([
            'name' => 'Ahmad Syahputra',
            'nomor_visa' => 'V-123456',
            'tanggal_lahir' => '1998-05-20',
        ]);

        // ── Admin Account ──
        Admin::create([
            'name'     => 'Admin Hafana',
            'email'    => 'admin@hafana.com',
            'password' => Hash::make('password'),
        ]);

        // ── Dummy Paket Umrah ──
        $pakets = [
            [
                'nama_paket'         => 'Umroh Heart 16 September 2026',
                'deskripsi'          => 'Paket Umroh 9 hari dengan bimbingan Ust. Yusuf As Sidawy. Fasilitas lengkap, hotel bintang 5 di Makkah & Madinah.',
                'maskapai'           => 'Saudia Airlines',
                'kota_keberangkatan' => 'Jakarta',
                'tanggal_berangkat'  => '2026-09-16',
                'durasi_hari'        => 9,
                'harga'              => 27500000,
                'kuota'              => 45,
                'is_visible'         => true,
            ],
            [
                'nama_paket'         => 'Umroh Hemaya Oktober 2026',
                'deskripsi'          => 'Paket Umroh 12 hari. Triple Room. Dibimbing Ust. Yusuf As Sidawy.',
                'maskapai'           => 'Garuda Indonesia',
                'kota_keberangkatan' => 'Jakarta',
                'tanggal_berangkat'  => '2026-10-06',
                'durasi_hari'        => 12,
                'harga'              => 32500000,
                'kuota'              => 40,
                'is_visible'         => true,
            ],
            [
                'nama_paket'         => 'Umroh Ramadhan 2027',
                'deskripsi'          => 'Paket spesial Ramadhan — ibadah di bulan suci di Tanah Haram.',
                'maskapai'           => 'Batik Air',
                'kota_keberangkatan' => 'Surabaya',
                'tanggal_berangkat'  => '2027-03-10',
                'durasi_hari'        => 14,
                'harga'              => 45000000,
                'kuota'              => 30,
                'is_visible'         => false, // Hidden from app initially
            ],
        ];

        foreach ($pakets as $paket) {
            Paket::create($paket);
        }
    }
}
