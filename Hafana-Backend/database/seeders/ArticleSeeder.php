<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Tips Memilih Travel Umrah Sunnah Berizin Resmi & Amanah',
                'slug' => 'tips-memilih-travel-umrah-sunnah-berizin-resmi',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
                'author' => 'Tim Syariah Hafana',
                'summary' => 'Panduan lengkap bagi calon jamaah dalam memilih travel umrah yang terdaftar resmi PPIU Kementerian Agama dan membimbing ibadah sesuai sunnah.',
                'content' => "Memilih penyelenggara perjalanan ibadah umrah (PPIU) yang tepat adalah langkah awal yang sangat krusial demi kenyamanan dan kekhusyukan ibadah di Tanah Suci.

### 1. Pastikan Izin Resmi Kemenag (PPIU)
Langkah pertama yang paling utama adalah mengecek status izin travel di aplikasi **SIMPU Kemenag**. Travel resmi selalu memiliki nomor izin PPIU yang aktif dan terdaftar secara sah.

### 2. Bimbingan Ibadah Sesuai Sunnah Rasulullah ﷺ
Ibadah umrah adalah napak tilas perjuangan Rasulullah ﷺ. Pastikan travel menyediakan pembimbing ibadah (muthawwif) yang berpengalaman dan memiliki pemahaman agama yang lurus sesuai Al-Qur'an dan As-Sunnah.

### 3. Kepastian Jadwal Keberangkatan & Tiket PP
Travel yang amanah akan memberikan kepastian tanggal keberangkatan, maskapai penerbangan (tanpa transit berlebih), dan kode booking tiket pesawat yang valid sejak jauh hari.

### 4. Transparansi Fasilitas Hotel & Bus
Perhatikan jarak hotel dari Masjidil Haram di Makkah dan Masjid Nabawi di Madinah. Pilihlah travel yang transparan menyampaikan nama hotel dan kualifikasi bintangnya.",
                'is_published' => true,
                'is_pinned'    => true,
                'published_at' => '2026-05-08 09:00:00',
            ],
            [
                'title' => 'Panduan Kesehatan & Fisik Sebelum Berangkat Umrah',
                'slug' => 'panduan-kesehatan-fisik-sebelum-berangkat-umrah',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
                'author' => 'Dr. Ahmad Hafana',
                'summary' => 'Persiapan fisik dan kesehatan tubuh sangat penting agar jamaah tetap fit menjalani thawaf, sa\'i, dan ziarah di kota Makkah & Madinah.',
                'content' => "Ibadah umrah membutuhkan stamina fisik yang prima karena mencakup aktivitas jalan kaki sepanjang Thawaf 7 putaran dan Sa'i antara Shafa dan Marwah sejauh kuran lebih 3,5 kilometer.

### Persiapan Fisik 2 Minggu Sebelum Keberangkatan:
* **Olahraga Jalan Kaki Rutin**: Lakukan jalan santai 30-45 menit setiap pagi untuk melatih otot kaki dan jantung.
* **Vaksinasi Wajib**: Lakukan vaksin Meningitis Meningokokus dan vaksinasi influenza di fasilitas kesehatan terdekat.
* **Membawa Obat Pribadi**: Siapkan obat-obatan pribadi yang biasa dikonsumsi, vitamin C, suplemen daya tahan tubuh, dan pelembab kulit.
* **Cukup Minum Air Putih**: Udara di Arab Saudi cenderung lebih kering, pastikan minum air zamzam atau air mineral minimal 2-3 liter per hari.",
                'is_published' => true,
                'is_pinned'    => true,
                'published_at' => '2026-04-25 14:30:00',
            ],
            [
                'title' => 'Keutamaan Beribadah di Masjid Nabawi & Ziarah Raudhah',
                'slug' => 'keutamaan-beribadah-di-masjid-nabawi-ziarah-raudhah',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
                'author' => 'Ustadz Badru Salam, Lc',
                'summary' => 'Menelusuri keutamaan shalat di Masjid Nabawi Madinah yang berpahala 1.000 kali lipat serta adab mengunjungi Raudhah Syarifah.',
                'content' => "Rasulullah ﷺ bersabda: *'Shalat di masjidku ini (Masjid Nabawi) lebih utama daripada 1.000 shalat di masjid lainnya, kecuali Masjidil Haram.'* (HR. Bukhari & Muslim).

### Keutamaan Raudhah (Taman Surga)
Raudhah adalah area yang terletak di antara rumah (makam) Rasulullah ﷺ dan mimbar beliau. Rasulullah ﷺ bersabda: *'Antara rumahku dan mimbarku adalah taman di antara taman-taman surga.'*

### Adab Ziarah di Masjid Nabawi:
1. Menjaga ketenangan dan keheningan saat berada di dalam masjid.
2. Membaca shalawat dan salam saat melintasi makam Rasulullah ﷺ dan dua sahabat beliau (Abu Bakar Ash-Shiddiq & Umar bin Khattab).
3. Berdoa dengan khusyu' tanpa melakukan perbuatan syirik atau meminta-minta kepada penghuni kubur.",
                'is_published' => true,
                'is_pinned'    => true,
                'published_at' => '2026-04-18 10:15:00',
            ],
            [
                'title' => 'Doa & Zikir Utama Saat Melaksanakan Thawaf di Makkah',
                'slug' => 'doa-zikir-utama-saat-melaksanakan-thawaf',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
                'author' => 'Ustadz Abu Ya\'la Kurnaedi',
                'summary' => 'Panduan bacaan doa dan dzikir shahih dari sunnah Nabi saat mengelilingi Ka\'bah pada putaran 1 hingga 7.',
                'content' => "Thawaf adalah salah satu rukun utama dalam ibadah Umrah dan Haji. Diperbolehkan membaca dzikir, tasbih, tahmid, tahlil, maupun doa kebaikan dunia dan akhirat saat mengelilingi Ka'bah.

### Bacaan Antara Rukun Yamani dan Hajar Aswad:
Di antara Rukun Yamani dan Hajar Aswad, Rasulullah ﷺ membaca doa berikut:

> *'Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar.'*
> (Wahai Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat serta peliharalah kami dari siksa neraka).

### Syarat Sah Thawaf:
* Suci dari hadats kecil dan hadats besar (berwudhu).
* Menutup aurat dengan pakaian ihram yang bersih.
* Dimulai dari garis lurus Hajar Aswad dan menjadikan Ka'bah di sebelah kiri.",
                'is_published' => true,
                'published_at' => '2026-04-10 16:45:00',
            ],
            [
                'title' => 'Tata Cara Larangan & Pelanggaran Ihram yang Wajib Diketahui',
                'slug' => 'tata-cara-larangan-pelanggaran-ihram',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1565552070098-0073a1c207bc?auto=format&fit=crop&w=800&q=80',
                'author' => 'Redaksi Hafana',
                'summary' => 'Mengenal perbuatan yang dilarang saat dalam keadaan berihram beserta denda (fidyah) jika melanggar.',
                'content' => "Setelah jamaah mengucapkan niat ibadah umrah di Miqat dan mengenakan pakaian ihram, berlaku beberapa larangan ihram hingga selesai tahallul.

### Larangan Khusus Laki-Laki:
1. Memakai pakaian berjahit yang membentuk lekuk tubuh (seperti kemeja, celana).
2. Menutup kepala dengan topi, peci, atau penutup kepala yang menempel.
3. Memakai sepatu yang menutup tumit dan buku lali.

### Larangan Khusus Wanita:
1. Memakai cadar / niqab yang menutup wajah secara langsung.
2. Memakai sarung tangan yang menutup telapak tangan.

### Larangan Umum (Laki-laki & Wanita):
* Memotong kuku dan rambut/bulu tubuh.
* Memakai wangi-wangian / parfum pada badan atau kain ihram.
* Menikah atau menikahkan (akad nikah).
* Berburu atau membunuh hewan darat.",
                'is_published' => true,
                'published_at' => '2026-04-02 08:20:00',
            ],
            [
                'title' => 'Perbedaan Umrah Reguler, Umrah VIP, dan Umrah Ramadhan',
                'slug' => 'perbedaan-umrah-reguler-vip-dan-ramadhan',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
                'author' => 'Tim Syariah Hafana',
                'summary' => 'Ulasan mengenai fasilitas, durasi perjalanan, serta perbedaan keutamaan paket umrah reguler dan umrah di bulan suci Ramadhan.',
                'content' => "Hafana Travel menyediakan berbagai pilihan program paket perjalanan umrah yang disesuaikan dengan kebutuhan jamaah dan keluarga.

### 1. Umrah Reguler (9 - 12 Hari)
Program standar dengan akomodasi hotel bintang 4 atau 5 berjarak dekat dari masjid. Cocok untuk jamaah yang menginginkan perjalanan ibadah yang efisien dan khusyu'.

### 2. Umrah VIP Exclusif
Fasilitas hotel bintang 5 persis di depan halaman Masjidil Haram (seperti Clock Tower / Fairmont) dan penerbangan langsung *Direct Flight* tanpa transit.

### 3. Umrah Ramadhan
Menjelang bulan suci Ramadhan, keutamaan ibadah umrah berlipat ganda. Rasulullah ﷺ bersabda: *'Umrah di bulan Ramadhan menandingi pahala ibadah haji bersamaku.'*",
                'is_published' => true,
                'published_at' => '2026-03-20 11:00:00',
            ],
        ];

        foreach ($articles as $art) {
            Article::updateOrCreate(['slug' => $art['slug']], $art);
        }
    }
}
