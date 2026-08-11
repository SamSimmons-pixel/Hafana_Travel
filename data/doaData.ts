/**
 * Doa & Dzikir Data Source — data/doaData.ts
 * Single source of truth for all 8 doa categories.
 *
 * Two item types:
 *  - "doa"     → has arabic + latin + translation (rendered as doa detail)
 *  - "article" → has content: string (rendered as rich text article for Fiqh Haji)
 */

export type DoaItem = {
  id: string;
  title: string;
  type: 'doa' | 'article';
  arabic?: string;
  latin?: string;
  translation?: string;
  content?: string; // for article type
};

export type DoaCategory = {
  id: string;
  label: string;
  icon: string; // MaterialCommunityIcons name
  items: DoaItem[];
};

export const DOA_CATEGORIES: DoaCategory[] = [
  // ── 1. HAJI ──────────────────────────────────────────────────────────────────
  {
    id: 'haji',
    label: 'Haji',
    icon: 'kaaba',
    items: [
      {
        id: 'haji-1',
        title: 'Bacaan Talbiyah',
        type: 'doa',
        arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        latin: 'Labbaikallahumma labbaik, labbaika laa syariikalaka labbaik, innal hamda wan ni\'mata laka wal mulk, laa syariikalak.',
        translation: 'Aku datang memenuhi panggilanMu ya Allah, aku datang memenuhi panggilanMu. Tidak ada sekutu bagiMu, aku datang memenuhi panggilanMu. Sesungguhnya segala pujian, kenikmatan dan kekuasaan hanyalah milikMu, tidak ada sekutu bagiMu.',
      },
      {
        id: 'haji-2',
        title: 'Doa Setelah Talbiyah Niat Umroh dan Haji',
        type: 'doa',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، اللَّهُمَّ إِنِّي أَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ وَأَعُوذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ',
        latin: 'Allahumma shalli \'ala Muhammadin wa \'ala aali Muhammad. Allahumma inni as-aluka ridhaaka wal jannah, wa a\'uudzu bika min sakhatika wan naar.',
        translation: 'Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan kepada keluarga Nabi Muhammad. Ya Allah, sesungguhnya aku memohon keridhaanMu dan surga kepadaMu, dan aku berlindung darimu dari kemurkaanMu dan neraka.',
      },
      {
        id: 'haji-3',
        title: 'Doa Masuk Masjidil Haram',
        type: 'doa',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        latin: 'Allahummaf-tah li abwaaba rahmatik.',
        translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmatMu.',
      },
      {
        id: 'haji-4',
        title: 'Doa Ketika Diantara Rukun Yamani dan Hajar Aswad',
        type: 'doa',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        latin: 'Rabbana aatina fid dunya hasanatan wa fil aakhirati hasanatan wa qina \'adzaban naar.',
        translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.',
      },
      {
        id: 'haji-5',
        title: 'Doa Ketika Menuju Maqam Ibrahim',
        type: 'doa',
        arabic: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
        latin: 'Wattakhidzu min maqaami Ibraahiima mushalla.',
        translation: 'Dan jadikanlah sebagian Maqam Ibrahim sebagai tempat shalat.',
      },
      {
        id: 'haji-6',
        title: 'Doa Minum Air Zamzam',
        type: 'doa',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
        latin: 'Allahumma inni as-aluka \'ilman naafi\'an wa rizqan waasi\'an wa syifaa-an min kulli daa-in.',
        translation: 'Ya Allah, sesungguhnya aku memohon kepadaMu ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala penyakit.',
      },
      {
        id: 'haji-7',
        title: 'Doa Ketika Menuju Bukit Shafa',
        type: 'doa',
        arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ',
        latin: 'Innash-shafaa wal marwata min sya\'aa-irillah.',
        translation: 'Sesungguhnya Shafa dan Marwa adalah bagian dari syi\'ar Allah.',
      },
      {
        id: 'haji-8',
        title: 'Doa Ketika di Shafa dan Marwa',
        type: 'doa',
        arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ. لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Allaahu akbar, allaahu akbar, allaahu akbar, walillaahil hamd. Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, dan bagi Allah segala puji. Tiada Tuhan selain Allah, tidak ada sekutu bagiNya. MilikNya lah kerajaan dan bagiNya segala pujian, Dia yang menghidupkan dan mematikan, dan Dia Mahakuasa atas segala sesuatu.',
      },
      {
        id: 'haji-9',
        title: 'Doa Sa\'i Ketika Hendak Mendaki Bukit Shafa',
        type: 'doa',
        arabic: 'أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
        latin: 'Ab-da-u bimaa bada-allaahu bihi.',
        translation: 'Aku mulai dengan apa yang Allah mulai dengannya.',
      },
      {
        id: 'haji-10',
        title: 'Doa Sa\'i Melihat Ka\'bah (di Atas Bukit)',
        type: 'doa',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ',
        latin: 'Laa ilaaha illallaahu, wallaahu akbar.',
        translation: 'Tiada Tuhan selain Allah, dan Allah Maha Besar.',
      },
      {
        id: 'haji-11',
        title: 'Doa Keluar Masjid',
        type: 'doa',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        latin: 'Allahumma innii as-aluka min fadhlika.',
        translation: 'Ya Allah, sesungguhnya aku memohon kepadaMu dari karuniaMu.',
      },
      {
        id: 'haji-12',
        title: 'Doa Ketika Wukuf di Arafah',
        type: 'doa',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Tiada Tuhan selain Allah, Yang Maha Esa, tiada sekutu bagiNya, milikNya segala kerajaan dan bagiNya segala pujian, dan Dia Maha Kuasa atas segala sesuatu.',
      },
      {
        id: 'haji-13',
        title: 'Doa Ketika di Masy\'aril Haram (di Muzdalifah)',
        type: 'doa',
        arabic: 'اللَّهُمَّ كَمَا وَقَفْتَنَا فِيهِ وَأَرَيْتَنَا إِيَّاهُ، فَوَفِّقْنَا لِذِكْرِكَ كَمَا هَدَيْتَنَا',
        latin: 'Allahumma kamaa waqaftanaa fiihi wa araytanaa iyyaahu, fa waffiqnaa lidzikrika kamaa hadaytanaa.',
        translation: 'Ya Allah, sebagaimana Engkau telah menempatkan kami di sini dan memperlihatkannya kepada kami, maka jadikanlah kami mampu untuk mengingatMu sebagaimana Engkau telah memberi kami petunjuk.',
      },
      {
        id: 'haji-14',
        title: 'Ucapan Ketika Melontar Jumroh',
        type: 'doa',
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allaahu akbar.',
        translation: 'Allah Maha Besar. (Diucapkan setiap kali melempar satu batu)',
      },
      {
        id: 'haji-15',
        title: 'Ucapan Ketika Menyembelih pada Hari Nahr',
        type: 'doa',
        arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ هَذَا مِنْكَ وَلَكَ',
        latin: 'Bismillahi wallaahu akbar, allahumma haadza minka wa laka.',
        translation: 'Dengan nama Allah dan Allah Maha Besar. Ya Allah, ini adalah dariMu dan untukMu.',
      },
      {
        id: 'haji-16',
        title: 'Doa Setelah Melontar Jumroh',
        type: 'doa',
        arabic: 'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا',
        latin: 'Allahummaj\'alhu hajjan mabruudan wa dzamban maghfuura.',
        translation: 'Ya Allah, jadikanlah ini haji yang mabrur dan dosa yang terampuni.',
      },
    ],
  },

  // ── 2. FIQH HAJI ─────────────────────────────────────────────────────────────
  {
    id: 'fiqh-haji',
    label: 'Fiqh Haji',
    icon: 'book-open-variant',
    items: [
      {
        id: 'fiqh-1',
        title: 'Rukun Haji & Umroh',
        type: 'article',
        content: `**Rukun Haji** adalah amalan-amalan yang wajib dilaksanakan dan tidak bisa diganti dengan dam (denda). Jika ditinggalkan, maka haji tidak sah.

**Rukun Haji (6 Rukun):**
1. **Ihram** — Niat masuk dalam ibadah haji
2. **Wukuf di Arafah** — Hadir di Arafah pada tanggal 9 Dzulhijjah
3. **Tawaf Ifadhah** — Mengelilingi Ka'bah 7 kali setelah Wukuf
4. **Sa'i** — Berlari-lari kecil antara Shafa dan Marwa 7 kali
5. **Tahallul** — Mencukur atau memotong rambut
6. **Tertib** — Dilaksanakan secara berurutan

**Rukun Umroh (5 Rukun):**
1. Ihram
2. Tawaf
3. Sa'i
4. Tahallul
5. Tertib`,
      },
      {
        id: 'fiqh-2',
        title: 'Wajib Haji & Umroh',
        type: 'article',
        content: `**Wajib Haji** adalah amalan yang harus dilakukan. Jika ditinggalkan, hajinya tetap sah namun wajib membayar dam (denda).

**Wajib Haji (6 Kewajiban):**
1. **Ihram dari Miqat** — Berniat ihram dari tempat yang ditentukan
2. **Bermalam di Muzdalifah** — Mabit di Muzdalifah malam 10 Dzulhijjah
3. **Bermalam di Mina** — Mabit di Mina pada hari Tasyrik
4. **Melontar Jumroh** — Melempar ketiga Jumroh pada hari Tasyrik
5. **Tawaf Wada'** — Tawaf perpisahan sebelum meninggalkan Makkah
6. **Menjauhi Larangan Ihram**

**Wajib Umroh:**
1. Ihram dari Miqat yang ditentukan
2. Menjauhi larangan Ihram`,
      },
      {
        id: 'fiqh-3',
        title: 'Sunah Haji & Umroh',
        type: 'article',
        content: `Amalan-amalan sunah dalam ibadah Haji dan Umroh yang dianjurkan untuk dilaksanakan:

**Sunah Haji:**
1. Mandi ihram sebelum niat
2. Memakai kain ihram putih bagi laki-laki
3. Shalat sunnah ihram 2 rakaat
4. Membaca Talbiyah dengan suara keras (bagi laki-laki)
5. Tawaf Qudum (tawaf kedatangan)
6. Mencium Hajar Aswad
7. Shalat 2 rakaat di belakang Maqam Ibrahim
8. Minum air Zamzam
9. Khutbah di Arafah, Muzdalifah, dan Mina

**Sunah Umroh:**
1. Mandi sebelum ihram
2. Membaca Talbiyah
3. Masuk Ka'bah (jika memungkinkan)`,
      },
      {
        id: 'fiqh-4',
        title: 'Tiga Macam Haji',
        type: 'article',
        content: `Ibadah Haji dapat dilaksanakan dengan tiga cara:

**1. Haji Ifrad**
Mendahulukan haji kemudian umroh. Jamaah berhaji lebih dulu, kemudian boleh berumroh setelahnya. Tidak ada kewajiban membayar dam.

**2. Haji Tamattu'**
Mendahulukan umroh kemudian haji dalam satu perjalanan. Setelah umroh, bertahallul, kemudian ihram kembali untuk haji. Wajib membayar dam tamattu' (menyembelih seekor kambing).

**3. Haji Qiran**
Menggabungkan niat haji dan umroh sekaligus dari awal. Ibadah haji dan umroh dilaksanakan bersamaan tanpa bertahallul di antaranya. Wajib membayar dam qiran.

Mayoritas jamaah Indonesia melaksanakan **Haji Tamattu'** karena lebih praktis dan sesuai kondisi.`,
      },
      {
        id: 'fiqh-5',
        title: 'Manasik Umroh — Ihram',
        type: 'article',
        content: `**Ihram** adalah keadaan seseorang yang telah berniat untuk masuk dalam ibadah umroh atau haji.

**Tata Cara Ihram:**
1. Mandi sunnah sebelum ihram (bagi pria maupun wanita)
2. Memakai wewangian pada tubuh (bukan pakaian) — ini sunnah sebelum ihram
3. Memakai pakaian ihram:
   - **Pria:** 2 lembar kain putih tanpa jahitan (izar dan rida)
   - **Wanita:** Pakaian yang menutup seluruh tubuh kecuali muka dan telapak tangan
4. Shalat sunnah ihram 2 rakaat
5. Berniat umroh dari Miqat:
   *لَبَّيْكَ اللَّهُمَّ عُمْرَةً*
   "Ya Allah, aku penuhi panggilanMu untuk umroh"
6. Membaca Talbiyah`,
      },
      {
        id: 'fiqh-6',
        title: 'Larangan Ihram',
        type: 'article',
        content: `Selama dalam keadaan ihram, terdapat larangan-larangan yang harus dijauhi:

**Larangan bagi Pria dan Wanita:**
1. Memotong/mencabut rambut
2. Memotong kuku
3. Memakai wewangian
4. Memburu atau membunuh binatang darat
5. Melakukan akad nikah
6. Berjima' (hubungan suami istri)
7. Melakukan pendahuluan jima'

**Larangan Khusus Pria:**
1. Memakai pakaian berjahit
2. Menutup kepala (kecuali untuk keperluan medis)

**Larangan Khusus Wanita:**
1. Menutup wajah dengan niqab/cadar
2. Memakai sarung tangan

Melanggar larangan ihram dapat dikenakan **dam (denda)** sesuai jenis pelanggaran.`,
      },
      {
        id: 'fiqh-7',
        title: 'Manasik Umroh — Thawaf',
        type: 'article',
        content: `**Tawaf** adalah mengelilingi Ka'bah sebanyak 7 putaran searah jarum jam, dimulai dan diakhiri di Hajar Aswad.

**Syarat Tawaf:**
1. Suci dari hadats besar dan kecil
2. Menutup aurat
3. Ka'bah berada di sebelah kiri
4. Di dalam Masjidil Haram
5. 7 putaran sempurna

**Tata Cara Tawaf:**
1. Mulai dari garis Hajar Aswad
2. Mengucapkan "Bismillah, Allaahu Akbar" saat memulai
3. Lakukan Idhtiba' (pria): menyelipkan kain ihram di bawah ketiak kanan
4. Lakukan Raml (3 putaran pertama): berjalan cepat dengan langkah pendek
5. Berdoa sesuai yang dianjurkan di setiap putaran
6. Istilam (mengusap/mencium) Hajar Aswad setiap putaran jika memungkinkan
7. Setelah selesai, shalat 2 rakaat di belakang Maqam Ibrahim`,
      },
      {
        id: 'fiqh-8',
        title: 'Manasik Umroh — Sa\'i',
        type: 'article',
        content: `**Sa'i** adalah berjalan bolak-balik antara Bukit Shafa dan Bukit Marwa sebanyak 7 kali perjalanan.

**Tata Cara Sa'i:**
1. Naiki Bukit Shafa menghadap Ka'bah
2. Membaca doa di Shafa, kemudian berjalan menuju Marwa
3. Lakukan Harwalah (berlari-lari kecil) di area yang ditandai (antara lampu hijau)
4. Sampai di Marwa, naiki dan berdoa menghadap Ka'bah
5. Berjalan kembali ke Shafa — ini dihitung **2 perjalanan**
6. Ulangi hingga 7 perjalanan (berakhir di Marwa)

**Catatan:**
- Shafa ke Marwa = 1 perjalanan
- Marwa ke Shafa = 1 perjalanan
- Total: 7 perjalanan (4 kali ke Marwa, 3 kali ke Shafa)
- Sa'i dilakukan setelah Tawaf
- Tidak disyaratkan suci dari hadats, namun lebih utama dalam keadaan suci`,
      },
      {
        id: 'fiqh-9',
        title: 'Manasik Umroh — Tahalul',
        type: 'article',
        content: `**Tahallul** adalah keluarnya seseorang dari keadaan ihram dengan mencukur atau memotong rambut kepala. Ini adalah rukun terakhir umroh.

**Hukum:**
Tahallul adalah **wajib** dan merupakan rukun umroh.

**Tata Cara:**
- **Pria:** Disunnahkan untuk **mencukur habis** (gundul) seluruh rambut kepala. Boleh juga hanya memotong minimal 3 helai rambut.
- **Wanita:** Hanya memotong rambut minimal sepanjang **ujung jari** (sekitar 2-3 cm).

**Setelah Tahallul:**
Semua larangan ihram menjadi halal kembali, kecuali berjima' bagi yang sedang melaksanakan haji Qiran/Ifrad (sebelum Tawaf Ifadhah).

Dengan tahallul, ibadah umroh telah sempurna dilaksanakan.`,
      },
      {
        id: 'fiqh-10',
        title: 'Amalan Haji 8/9/10/11/12/13 Dzulhijjah',
        type: 'article',
        content: `**Urutan Amalan Haji per Tanggal:**

**8 Dzulhijjah (Hari Tarwiyah):**
• Ihram dari penginapan/Miqat dengan niat haji
• Berangkat ke Mina
• Mabit (bermalam) di Mina
• Shalat Zuhur, Ashar, Maghrib, Isya, dan Subuh di Mina

**9 Dzulhijjah (Hari Arafah):**
• Berangkat ke Arafah setelah matahari terbit
• Wukuf di Arafah (ini rukun haji terpenting)
• Khutbah dan shalat Zuhur-Ashar jamak taqdim
• Perbanyak doa, dzikir, dan istighfar
• Berangkat ke Muzdalifah setelah maghrib
• Mabit di Muzdalifah, shalat Maghrib-Isya jamak takhir
• Kumpulkan kerikil untuk lontar jumroh

**10 Dzulhijjah (Hari Nahr/Idul Adha):**
• Subuh di Muzdalifah dengan memperbanyak dzikir
• Berangkat ke Mina sebelum matahari terbit
• Lontar Jumroh Aqabah (7 batu)
• Menyembelih hewan qurban/hadyu (jika tamattu' atau qiran)
• Tahallul awal: potong rambut
• Tawaf Ifadhah dan Sa'i
• Tahallul tsani: semua larangan ihram gugur
• Kembali ke Mina untuk mabit

**11, 12, 13 Dzulhijjah (Hari Tasyrik):**
• Mabit di Mina setiap malam
• Lontar 3 Jumroh (Ula, Wustha, Aqabah) setiap hari setelah zawal
• Boleh Nafar Awal (pulang 12 Dzulhijjah sebelum maghrib)
• Atau Nafar Tsani (pulang 13 Dzulhijjah)`,
      },
      {
        id: 'fiqh-11',
        title: 'Thawaf Wada\'',
        type: 'article',
        content: `**Tawaf Wada'** (Tawaf Perpisahan) adalah tawaf yang dilakukan sebelum meninggalkan kota Makkah sebagai amalan terakhir di Masjidil Haram.

**Hukum:** Wajib bagi jamaah haji. Jika ditinggalkan, wajib membayar dam.

**Waktu Pelaksanaan:** Setelah seluruh manasik haji selesai, tepat sebelum berangkat meninggalkan Makkah.

**Tata Cara:**
1. Tawaf seperti biasa, 7 putaran mengelilingi Ka'bah
2. Shalat 2 rakaat di belakang Maqam Ibrahim
3. Minum air Zamzam
4. Berdoa di Multazam (antara Hajar Aswad dan pintu Ka'bah)
5. Segera berangkat setelah selesai, tidak berlama-lama di Masjidil Haram

**Catatan:** Wanita haid/nifas dimaafkan dari kewajiban Tawaf Wada' tanpa perlu membayar dam.`,
      },
    ],
  },

  // ── 3. UMRAH ─────────────────────────────────────────────────────────────────
  {
    id: 'umrah',
    label: 'Umrah',
    icon: 'mosque',
    items: [
      {
        id: 'umrah-1',
        title: 'Manasik Bagian 1',
        type: 'article',
        content: `**Manasik Umroh — Bagian 1: Persiapan dan Ihram**

**A. Persiapan Sebelum Umroh:**
1. Pelajari tata cara umroh secara menyeluruh
2. Persiapkan fisik dan mental (olahraga rutin, cukup istirahat)
3. Persiapkan dokumen (paspor, visa, tiket)
4. Bawa perlengkapan ihram yang cukup
5. Niatkan ikhlas karena Allah Ta'ala

**B. Ihram di Miqat:**
1. Mandi sebelum ihram
2. Memakai pakaian ihram
3. Shalat sunnah ihram 2 rakaat
4. Niat umroh
5. Membaca Talbiyah

**C. Larangan selama Ihram:**
Hindari segala larangan ihram hingga tahallul dilaksanakan.

**Doa Niat Umroh:**
*لَبَّيْكَ اللَّهُمَّ عُمْرَةً*
"Ya Allah, aku penuhi panggilanMu untuk umroh"`,
      },
      {
        id: 'umrah-2',
        title: 'Manasik Bagian 2',
        type: 'article',
        content: `**Manasik Umroh — Bagian 2: Tawaf, Sa'i, dan Tahallul**

**A. Tawaf:**
1. Masuk Masjidil Haram dari pintu Bab As-Salam
2. Menghadap Ka'bah, angkat tangan membaca "Bismillah, Allaahu Akbar"
3. Mulai tawaf dari Hajar Aswad berlawanan arah jarum jam
4. 7 putaran mengelilingi Ka'bah
5. Shalat 2 rakaat di belakang Maqam Ibrahim

**B. Minum Air Zamzam**
Setelah tawaf, minumlah air Zamzam sambil berdoa.

**C. Sa'i:**
1. Menuju Bukit Shafa, menghadap Ka'bah
2. Membaca doa
3. Berjalan menuju Marwa (berlari kecil di area bertanda)
4. 7 perjalanan bolak-balik (berakhir di Marwa)

**D. Tahallul:**
Cukur atau potong rambut — umroh selesai!

Semua larangan ihram kembali halal.`,
      },
      {
        id: 'umrah-3',
        title: 'Doa dan Bacaan Umroh',
        type: 'doa',
        arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        latin: 'Allahumma antas salaam wa minkas salaam, tabaarakta yaa dzal jalaali wal ikraam.',
        translation: 'Ya Allah, Engkau adalah keselamatan dan dari-Mu lah keselamatan. Maha Suci Engkau wahai Tuhan yang memiliki keagungan dan kemuliaan.',
      },
      {
        id: 'umrah-4',
        title: 'Ziarah Madinah',
        type: 'article',
        content: `**Ziarah ke Kota Madinah Al-Munawwarah**

Madinah adalah kota yang sangat dicintai Rasulullah ﷺ. Berikut tempat-tempat ziarah utama:

**1. Masjid Nabawi**
Shalat di Masjid Nabawi nilainya 1.000 kali shalat di masjid lain (kecuali Masjidil Haram).
Kunjungi makam Rasulullah ﷺ dan beri salam.

**2. Raudhah**
Area antara rumah Nabi dan mimbar. Rasulullah ﷺ bersabda: "Antara rumahku dan mimbarku adalah taman surga."

**3. Pemakaman Baqi'**
Pemakaman para sahabat dan keluarga Nabi. Dianjurkan berdoa untuk mereka.

**4. Masjid Quba**
Masjid pertama yang dibangun dalam Islam. Shalat 2 rakaat di sini pahalanya seperti umroh.

**5. Masjid Qiblatayn**
Masjid yang di dalamnya terjadi perpindahan kiblat dari Baitul Maqdis ke Ka'bah.

**Adab Ziarah:**
- Berpakaian sopan dan bersih
- Memberi salam kepada Nabi dengan penuh hormat
- Menjaga ketenangan dan kekhusyukan`,
      },
    ],
  },

  // ── 4. DOA DAN DZIKIR ────────────────────────────────────────────────────────
  {
    id: 'doa-dzikir',
    label: 'Doa dan Dzikir',
    icon: 'hands-pray',
    items: [
      {
        id: 'dzikir-1',
        title: 'Doa Ketika Berpamitan',
        type: 'doa',
        arabic: 'أَسْتَوْدِعُكَ اللَّهَ الَّذِي لَا تَضِيعُ وَدَائِعُهُ',
        latin: 'Astawdi\'ukallaahal ladzii laa tadhii\'u wadaa-i\'uh.',
        translation: 'Aku titipkan engkau kepada Allah yang tidak akan hilang titipan-titipanNya.',
      },
      {
        id: 'dzikir-2',
        title: 'Doa Keluar Rumah',
        type: 'doa',
        arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        latin: 'Bismillaahi tawakkaltu \'alallaahi, wa laa hawla wa laa quwwata illaa billaah.',
        translation: 'Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan (pertolongan) Allah.',
      },
      {
        id: 'dzikir-3',
        title: 'Doa Berangkat Safar',
        type: 'doa',
        arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
        latin: 'Allahumma innaa nas-aluka fii safarinaa haadzal birra wat taqwaa, wa minal \'amali maa tardhaa, allahumma hawwin \'alaynaa safaranaa haadza wathwi \'annaa bu\'dah.',
        translation: 'Ya Allah, kami memohon kepadaMu dalam perjalanan kami ini kebaikan dan ketaqwaan, serta amal yang Engkau ridhai. Ya Allah, ringankanlah perjalanan kami ini dan dekatkanlah jaraknya bagi kami.',
      },
      {
        id: 'dzikir-4',
        title: 'Doa Terhindar Wabah Penyakit',
        type: 'doa',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ',
        latin: 'Allahumma innii a\'uudzu bika minal barashi wal junuuni wal judzaami wa min sayyi-il asqaam.',
        translation: 'Ya Allah, sesungguhnya aku berlindung kepadaMu dari penyakit kusta, gila, lepra, dan dari penyakit-penyakit yang buruk.',
      },
      {
        id: 'dzikir-5',
        title: 'Doa Dzikir Petang',
        type: 'doa',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Amsaynaa wa amsal mulku lillaahi, walhamdu lillaahi, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah. Tiada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagiNya. MilikNya kerajaan dan bagiNya pujian, Dia Mahakuasa atas segala sesuatu.',
      },
      {
        id: 'dzikir-6',
        title: 'Doa Dzikir Pagi',
        type: 'doa',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Ashbahnaa wa ashbahal mulku lillaahi, walhamdu lillaahi, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah. Segala puji bagi Allah. Tiada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagiNya. MilikNya kerajaan dan bagiNya pujian, Dia Mahakuasa atas segala sesuatu.',
      },
      {
        id: 'dzikir-7',
        title: 'Doa Masuk Rumah',
        type: 'doa',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        latin: 'Allahumma innii as-aluka khayral mawliji wa khayral makhraji, bismillaahi walajnaa wa bismillaahi kharajnaa wa \'alallaahi rabbinaa tawakkalnaa.',
        translation: 'Ya Allah, sesungguhnya aku memohon kepadaMu kebaikan tempat masuk dan tempat keluar. Dengan nama Allah kami masuk dan dengan nama Allah kami keluar, dan hanya kepada Allah Tuhan kami kami bertawakkal.',
      },
    ],
  },

  // ── 5. PUASA ─────────────────────────────────────────────────────────────────
  {
    id: 'puasa',
    label: 'Puasa',
    icon: 'moon-waning-crescent',
    items: [
      {
        id: 'puasa-1',
        title: 'Doa Berbuka Puasa',
        type: 'doa',
        arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        latin: 'Allahumma laka shumtu wa bika aamantu wa \'alaa rizqika afthartu.',
        translation: 'Ya Allah, hanya untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka puasa.',
      },
    ],
  },

  // ── 6. WUDHU ─────────────────────────────────────────────────────────────────
  {
    id: 'wudhu',
    label: 'Wudhu',
    icon: 'water',
    items: [
      {
        id: 'wudhu-1',
        title: 'Doa Sebelum Wudhu',
        type: 'doa',
        arabic: 'بِسْمِ اللَّهِ',
        latin: 'Bismillah.',
        translation: 'Dengan nama Allah.',
      },
      {
        id: 'wudhu-2',
        title: 'Doa Setelah Wudhu',
        type: 'doa',
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
        latin: 'Asyhadu allaa ilaaha illallaahu wahdahu laa syariikalahu wa asyhadu anna Muhammadan \'abduhu wa rasuuluh. Allahummaj\'alnii minat tawwaabiina waj\'alnii minal mutathahhariin.',
        translation: 'Aku bersaksi bahwa tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagiNya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang suci.',
      },
    ],
  },

  // ── 7. SHALAT ────────────────────────────────────────────────────────────────
  {
    id: 'shalat',
    label: 'Shalat',
    icon: 'human-greeting-proximity',
    items: [
      {
        id: 'shalat-1',
        title: 'Doa Istiftah',
        type: 'doa',
        arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
        latin: 'Allahumma baa\'id baynii wa bayna khathaayaaya kamaa baa\'adta baynal masyriqi wal maghrib, allahumma naqqinii minal khathaayaa kamaa yunaqqats tsawbul abyadhu minad danas, allahummagh-sil khathaayaaya bil maa-i wats tsalji wal barad.',
        translation: 'Ya Allah, jauhkanlah antara aku dan kesalahanku sebagaimana Engkau menjauhkan antara timur dan barat. Ya Allah, sucikanlah aku dari kesalahan-kesalahan sebagaimana pakaian putih dibersihkan dari kotoran. Ya Allah, cucilah kesalahan-kesalahanku dengan air, salju, dan es.',
      },
      {
        id: 'shalat-2',
        title: 'Dzikir Setelah Shalat',
        type: 'doa',
        arabic: 'أَسْتَغْفِرُ اللَّهَ (3×)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        latin: 'Astaghfirullah (3×). Allahumma antas salaam wa minkas salaam, tabaarakta yaa dzal jalaali wal ikraam.',
        translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau adalah keselamatan, dan dari-Mu lah keselamatan. Maha Suci Engkau wahai Tuhan yang memiliki keagungan dan kemuliaan.',
      },
      {
        id: 'shalat-3',
        title: 'Doa I\'tidal',
        type: 'doa',
        arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
        latin: 'Rabbanaa wa lakal hamdu hamdan katsiiran thayyiban mubaarakan fiih.',
        translation: 'Wahai Tuhan kami, bagiMu segala puji yang banyak, baik, dan penuh berkah.',
      },
      {
        id: 'shalat-4',
        title: 'Doa Ruku\'',
        type: 'doa',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
        latin: 'Subhaana rabbiyal \'adzhiimi wa bihamdih.',
        translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memujiNya.',
      },
      {
        id: 'shalat-5',
        title: 'Doa Sujud',
        type: 'doa',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
        latin: 'Subhaana rabbiyal a\'laa wa bihamdih.',
        translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memujiNya.',
      },
      {
        id: 'shalat-6',
        title: 'Doa Bacaan Duduk di antara Dua Sujud',
        type: 'doa',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
        latin: 'Rabbighfirlii warhamnii wajburnii warfa\'nii warzuqnii wahdinii wa \'aafinii wa\'fu \'annii.',
        translation: 'Wahai Tuhanku, ampunilah aku, rahmatilah aku, perbaikilah keadaanku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.',
      },
    ],
  },

  // ── 8. SHALAT JENAZAH ────────────────────────────────────────────────────────
  {
    id: 'shalat-jenazah',
    label: 'Shalat Jenazah',
    icon: 'gravestone',
    items: [
      {
        id: 'jenazah-1',
        title: 'Rukun Shalat Jenazah',
        type: 'article',
        content: `**Rukun Shalat Jenazah**

Shalat jenazah adalah shalat yang dilakukan untuk mendoakan jenazah Muslim. Terdiri dari 4 takbir tanpa ruku' dan sujud.

**Rukun Shalat Jenazah:**
1. **Niat** — Berniat shalat jenazah
2. **Berdiri** — Jika mampu
3. **Takbir 4 kali**
4. **Membaca Al-Fatihah** — Setelah takbir pertama
5. **Membaca Shalawat** — Setelah takbir kedua
6. **Mendoakan Jenazah** — Setelah takbir ketiga
7. **Salam** — Setelah takbir keempat

**Tata Cara Lengkap:**

*Takbir 1:* Niat + Al-Fatihah
*لَبَّيْكَ اللَّهُمَّ ...* → Baca Al-Fatihah

*Takbir 2:* Shalawat Nabi
*اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ...*

*Takbir 3:* Doa untuk jenazah
*اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ...*
(Ganti "لَهُ" dengan "لَهَا" jika jenazah perempuan, atau "لَهُمْ" jika banyak)

*Takbir 4:* Doa
*اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تَفْتِنَّا بَعْدَهُ وَاغْفِرْ لَنَا وَلَهُ*

*Salam* ke kanan dan kiri.`,
      },
    ],
  },
];
