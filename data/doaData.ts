/**
 * Doa & Dzikir Data Source — data/doaData.ts
 * Single source of truth for all doa categories.
 *
 * Content Types:
 *  - "doa"     → standard doa/reading structure with 1 or more sections (badge, arabic, optional latin, translation, etc.)
 *  - "artikel" → article/fiqh explanation structure (badge, heading, body, optional arabic/extra arabic blocks, etc.)
 */

export interface DoaSection {
  order: number;               // untuk badge #1, #2, #3
  heading?: string;            // Judul per section (e.g. "Rukun Haji dan Umroh", "1. Berihram", "Roml")
  body?: string | null;        // Paragraf penjelasan / teks isi section
  arabicText?: string | null;  // Teks Arab dengan harakat
  latinText?: string | null;   // Nullable — transliterasi cara baca
  translation?: string | null; // Terjemahan Indonesia dengan rujukan inline
  extraArabic?: string | null; // Teks Arab kedua dalam section yang sama
  extraLatin?: string | null;  // Transliterasi Latin kedua
  extraTranslation?: string | null; // Terjemahan kedua
  repeatNote?: string | null;  // cth "(3x)" atau "[dibaca 3x]" — render di atas teks Arab
  transitionLabel?: string | null; // cth "Kemudian membaca:" — muncul sebelum section berikutnya
  note?: string;               // Optional note per section
  status?: string;
}

export interface DoaItem {
  id: string;
  title: string;
  category?: string;
  contentType: 'doa' | 'artikel';
  heading?: string;            // Untuk Tipe B: Judul konten
  subLabel?: string;           // Untuk Tipe B: Sub-label kecil
  sections?: DoaSection[];
  content?: string;            // For legacy markdown articles
  note?: string;               // Optional note (e.g. for pending verification)
  status?: string;

  // Legacy fields for backward compatibility with existing categories
  arabic?: string;
  latin?: string;
  translation?: string;
  type?: 'doa' | 'article';
}

export interface DoaCategory {
  id: string;
  label: string;
  icon: string; // MaterialCommunityIcons name
  items: DoaItem[];
}

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
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لَا شَرِيكَ لَكَ',
            latinText: "Labbaik Allahuma labbaik, Labbaik laa syarikka laka labbaik, Innal haamda wanni'mata laka wal mulk, Laa syariika laka",
            translation: 'Aku memenuhi panggilan-Mu, ya Allah, aku memenuhi panggilan-Mu. Aku memenuhi panggilan-Mu, tiada sekutu bagi-Mu, aku memenuhi panggilan-Mu. Sesungguhnya pujaan dan nikmat hanyalah milik-Mu, begitu juga kerajaan, tiada sekutu bagi-Mu.',
          },
        ],
      },
      {
        id: 'haji-2',
        title: 'Doa Setelah Talbiyah Niat Umroh dan Haji',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'لَبَّيْكَ اللَّهُمَّ حَجًّا. اللَّهُمَّ هَذِهِ حَجَّةٌ لاَ رِيَاءَ فِيهَا وَلاَ سُمْعَةٌ',
            latinText: "Labbaika Allhumma hajjan Allahumma haadzihi hajjatun laa riyaa a fiihaa wa laa sum'ah",
            translation: 'Kupenuhi Panggilan-Mu ya Allah untuk Haji. Ya Allah ini adalah haji yang tidak mengandung unsur Riya dan Sum\'ah.',
          },
        ],
      },
      {
        id: 'haji-3',
        title: 'Doa Masuk Masjidil Haram',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اللَّهُمَّ افْتَحْ لِى أَبْوَابَ رَحْمَتِكَ',
            latinText: 'Allahummaf-tahlii abwaaba rohmatik',
            translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu',
          },
        ],
      },
      {
        id: 'haji-4',
        title: 'Doa Ketika Diantara Rukun Yamani dan Hajar Aswad',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            latinText: "Robbana aatina fid dunya hasanah, wa fil aakhiroti hasanah wa qina 'adzaban naar",
            translation: 'Ya Rabb kami, karuniakanlah pada kami kebaikan di dunia dan kebaikan di akhirat serta selamatkanlah kami dari siksa neraka. (QS. Al Baqarah: 201)',
          },
        ],
      },
      {
        id: 'haji-5',
        title: 'Doa Ketika Menuju Maqam Ibrahim',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
            latinText: null,
            translation: '"Dan jadikanlah sebahagian maqam Ibrahim tempat Shalat" (QS: Al-Baqarah[2]: 125)',
          },
        ],
      },
      {
        id: 'haji-6',
        title: 'Doa Minum Air Zamzam',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
            latinText: null,
            translation: '"Ya Allah, sesungguhnya aku mohon kepada-Mu ilmu yang bermanfaat, rizki yang luas dan kesembuhan dari segala penyakit."',
          },
        ],
      },
      {
        id: 'haji-7',
        title: 'Doa Ketika Menuju Bukit Shafa',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلاَ جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا وَمَنْ تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ',
            latinText: null,
            transitionLabel: 'Kemudian membaca:',
          },
          {
            order: 2,
            arabicText: 'أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
            latinText: null,
            translation: "Sesungguhnya Shafaa dan Marwa adalah sebahagian dari syi'ar Allah. Maka barangsiapa yang beribadah haji ke Baitullah atau ber-'umrah, maka tidak ada dosa baginya mengerjakan sa'i antara keduanya. Dan barangsiapa yang mengerjakan suatu kebajikan dengan kerelaan hati, maka sesungguhnya Allah Maha Mensyukuri kebaikan lagi Maha Mengetahui",
          },
        ],
      },
      {
        id: 'haji-8',
        title: 'Doa Ketika di Shafa dan Marwa',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اَللهُ أَكْبَرُ، اَللهُ أَكْبَرُ، اَللهُ أَكْبَرُ. لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
            latinText: null,
            translation: '"Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Tiada Ilah selain Allah dan tiada sekutu baginya, baginya segenap kerajaan dan segala pujian, Dia yang menghidupkan dan yang mematikan dan Dia maha mampu atas segala sesuatu, tiada Ilah selain Allah semata dan tidak ada sekutu baginya, Dia memenuhi janji-Nya, Dia membela Hamba-Nya dan Ia kalahkan sendiri musuh-musuh-Nya" [dibaca 3x] Dan disela-sela itu berdoa; jadi caranya ialah berdzikir seperti diatas, kemudian doa, berdzikir lagi, lalu doa dan ditutup dengan dzikir (tiga kali dzikir dan dua kali doa).',
          },
        ],
      },
      {
        id: 'haji-9',
        title: "Doa Sa'i Ketika Hendak Mendaki Bukit Shafa",
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ وَرَسُولِهِ',
            latinText: 'abda u bimaa bada-allahu bihi wa rosuulih',
            translation: 'Aku mulai dengan apa yang telah dimulai oleh Allah dan Rasul-Nya. (Sahih HR. Musim no.1218)',
          },
          {
            order: 2,
            arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلاَ جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا وَمَنْ تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ',
            latinText: "inna alshshafaa waalmarwata min sya'aa-iri allaahi faman hajja albayta awi i'tamara falaa junaaha 'alayhi an yaththhawwafa bihimaa waman tathawwa'a khayran fa-inna allaaha syaakirun 'aliimun",
            translation: "Sesungguhnya Shafaa dan Marwa adalah sebahagian dari syi'ar Allah. Maka barangsiapa yang beribadah haji ke Baitullah atau ber'umrah, maka tidak ada dosa baginya mengerjakan sa'i antara keduanya. Dan barangsiapa yang mengerjakan suatu kebajikan dengan kerelaan hati, maka sesungguhnya Allah Maha Mensyukuri kebaikan lagi Maha Mengetahui. (QS. al-Baqarah: 158)",
          },
        ],
      },
      {
        id: 'haji-10',
        title: "Doa Sa'i Melihat Kabah (Diatas Bukit)",
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ',
            latinText: 'Allahu akbar, Allahu akbar, Allahu akbar (3x)',
            translation: '"Allah Mahabesar, Allah Mahabesar, Allah Mahabesar. (3x)"',
            repeatNote: '(3x)',
          },
          {
            order: 2,
            arabicText: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            latinText: "Laa ilaaha illa Allah, wahdahu laa shariika lah, lahul mulku wa lahul hamdu, yuhyii wa yumiitu wa huwa 'alaa kulli shay'in qadiir.",
            translation: 'Tiada sesembahan yang berhak disembah kecuali hanya Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya lah segala kerajaan dan segala pujian untuk-Nya. Dia yang menghidupkan dan yang mematikan. Dia Mahakuasa atas segala sesuatu.',
          },
          {
            order: 3,
            arabicText: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
            latinText: "Laa ilaha illa Allah, wahdahu anjaza wa'dahu, wa nasara 'abdahu wa hazama ahzaba wahdahu.",
            translation: 'Tiada sesembahan yang berhak disembah kecuali hanya Allah semata. Dialah yang telah melaksanakan janji-Nya, menolong hamba-Nya dan mengalahkan tentara sekutu dengan sendirian.',
          },
        ],
      },
      {
        id: 'haji-11',
        title: 'Doa Keluar Masjid',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'بِسْمِ اللهِ وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُوْلِ اللهِ اَللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ اَللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ',
            latinText: null,
            translation: 'Dengan nama Allah, semoga sha-lawat dan salam terlimpahkan kepada Rasulullah. Ya Allah, sesungguhnya aku minta kepadaMu dari karuniaMu. Ya Allah, peliharalah aku dari godaan setan yang terkutuk',
          },
        ],
      },
      {
        id: 'haji-12',
        title: 'Doa Ketika Wukuf di Arafah',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'لا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            latinText: "Laa ilaha illallah wahdahu laa syarika lah, lahul mulku wa lahul hamdu, wa huwa 'ala kulli syai'in qadir",
            translation: 'Tiada Tuhan yang berhak disembah selain Allah, Yang Maha Esa, Tiada sekutu bagiNya. BagiNya kerajaan dan pujian. Dialah Yang Mahakuasa atas segala sesuatu.',
          },
        ],
      },
      {
        id: 'haji-13',
        title: "Doa Ketika di Masy'aril Haram (di Muzdalifah)",
        category: 'Haji',
        contentType: 'artikel',
        heading: 'Membaca Takbir, Tahlil dan Kalimat Tauhid',
        subLabel: 'Berdasarkan hadits',
        sections: [
          {
            order: 1,
            arabicText: 'رَكِبَ الْقَصْوَاءَ حَتَّى أَتَى الْمَشْعَرَ الْحَرَامَ فَاسْتَقْبَلَ الْقِبْلَةَ فَدَعَاهُ وَكَبَّرَهُ وَهَلَّلَهُ وَوَحَّدَهُ فَلَمْ يَزَلْ وَاقِفًا حَتَّى أَسْفَرَ جِدًّا فَدَفَعَ قَبْلَ أَنْ تَطْلُعَ الشَّمْسُ',
            latinText: null,
            translation: '"Nabi ﷺ naik unta bernama Al-Qaswa\' hingga di Masy\'aril Haram, lalu beliau menghadap kiblat, berdoa, membaca takbir dan tahlil serta kalimat tauhid. Beliau terus berdoa hingga fajar menyingsing. Kemudian beliau berangkat (ke Mina) sebelum matahari terbit." (HR. Muslim)',
          },
        ],
      },
      {
        id: 'haji-14',
        title: 'Ucapan Ketika Melontar Jumroh',
        category: 'Haji',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اللَّهُ أَكْبَرُ',
            latinText: 'Allahu Akbar',
            translation: 'Allah Maha Besar',
          },
        ],
      },
      {
        id: 'haji-15',
        title: 'Ucapan Ketika Menyembelih pada Hari Nahr',
        category: 'Haji',
        contentType: 'doa',
        heading: 'Ucapan Ketika Menyembelih pada Hari Nahr',
        sections: [
          {
            order: 1,
            arabicText: 'بِسْمِ اللَّهِ اَللَّهُ أَكْبَرُ اَللَّهُمَّ إِنَّ هَذَا مِنْكَ وَلَكَ اَللَّهُمَّ تَقَبَّلْ مِنِّي',
            latinText: 'Bismillaahi, Allahu akbar, Allahumma inna hadzaa minka wa laka, Allahumma taqabbal minnii',
            translation: 'Dengan nama Allah, Allah Maha Besar, Ya Allah, sesungguhnya (sembelihan) ini dari-Mu dan untuk-Mu. Ya Allah, terimalah (kurban) ini dariku',
          },
        ],
      },
      {
        id: 'haji-16',
        title: 'Doa Setelah Melontar Jumroh',
        category: 'Haji',
        contentType: 'artikel',
        heading: 'Doa Setelah Melontar Jumroh',
        subLabel: undefined,
        sections: [
          {
            order: 1,
            arabicText: null,
            latinText: null,
            translation: 'Pada tanggal 11, 12 dan 13 Dzulhijjah setelah melempar Jumrah Shugro menghadaplah ke kiblat dan angkatlah tangan berdoa kepada Allah dengan doa sepanjang-panjangnya dan sebanyak-banyaknya.\n\nAmalan ini juga dilakukan setelah melempar Jumrah Wustha, namun tidak dilakukan ketika selesai melempar Jumrah Kubra, yang disyariatkan ialah setelah selesai melempar Jumrah Kubro langsung berlalu.',
          },
        ],
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
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Rukun Haji dan Umroh',
            body: 'Pada ibadah umroh terdapat tiga rukun, dan pada ibadah haji ada tambahan satu rukun, sehingga ibadah haji memiliki empat rukun, yaitu sebagai berikut :',
          },
          { order: 2, heading: '1. Berihram', body: null },
          { order: 3, heading: '2. Thawaf', body: null },
          { order: 4, heading: "3. Sa'i", body: 'Rukun umroh sampai disini' },
          { order: 5, heading: '4. Wukuf', body: 'Di Padang Arafah' },
        ],
      },
      {
        id: 'fiqh-2',
        title: 'Wajib Haji & Umroh',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Wajib Haji dan Umroh',
            body: 'Pada ibadah umroh terdapat dua amalan wajib, dan pada ibadah haji terdapat tujuh amalan wajib, yaitu :',
          },
          { order: 2, heading: '1. Ihram', body: 'Berihram dari miqat' },
          { order: 3, heading: '2. Tahallul', body: 'Tahallul dengan menggundul rambut kepala atau memendekkan nya\n\nWajib umroh sampai disini' },
          { order: 4, heading: '3. Wukuf', body: 'Wukuf di arafah sampai terbenam matahari bagi yang wukuf pada siang hari' },
          { order: 5, heading: '4. Mabit', body: 'Mabit di Muzdalifah' },
          { order: 6, heading: '5. Jumroh', body: null },
          { order: 7, heading: '6. Mabit', body: 'Mabit di Mina pada hari tasyriq' },
          { order: 8, heading: "7. Thawaf wada'", body: null },
        ],
      },
      {
        id: 'fiqh-3',
        title: 'Sunah Haji & Umroh',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Sunnah Haji dan Umroh',
            body: 'Pada ibadah haji dan umroh, terdapat banyak amalan-amalan sunnah yang hendaknya dikerjakan oleh jamaah haji atau umroh, diantaranya :',
          },
          { order: 2, heading: 'Roml', body: 'Raml adalah berjalan cepat dengan memendekkan langkah kaki untuk kaum laki-laki pada tiga putaran pertama. Kemudian empat putaran berikutnya diselesaikan dengan jalan biasa.' },
          { order: 3, heading: "Idhtiba'", body: 'Khusus saat melakukan tawaf kedatangan, jemaah laki-laki disunnahkan memakai pakaian ihram dengan cara meletakkan bagian tengah selendang di bawah bahu kanan, sedangkan kedua ujungnya di atas bahu kiri. Dengan kata lain, membuka bahu kanan dan menutup bahu kiri.' },
          { order: 4, heading: 'Mencium Hajar Aswad', body: 'Mencium hajar aswad pada saat thawaf atau mengusap nya atau berisyarat kepadanya serta bertakbir ketika memulai putaran thawaf' },
          { order: 5, heading: 'Rukun Yamani', body: 'Mengusap rukun yamani' },
          { order: 6, heading: 'Sholat Sunah', body: 'Sholat sunah dua rakaat setelah thawaf' },
          { order: 7, heading: 'Air Zamzam', body: 'Minum air zamzam setelah thawaf' },
          { order: 8, heading: 'Shafa dan Marwa', body: 'Menaiki bukit Shafa dan Marwa, dan berdoa diatasnya dengan menghadap ke arah kiblat' },
          { order: 9, heading: "Berlari Ketika Sa'i", body: "Berlari pada tanda hijau ketika sa'i" },
          { order: 10, heading: 'Mina', body: 'Menetap di Mina pada hari Tarwiyah' },
          { order: 11, heading: 'Jumroh', body: 'Bertakbir ketika melempar jumroh, kemudian mengangkat tangan saat berdoa setelah melempar jumroh' },
        ],
      },
      {
        id: 'fiqh-4',
        title: 'Tiga Macam Haji',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          { order: 1, heading: 'Macam-macam Haji', body: "Ibadah haji memiliki beberapa bentuk (jenis haji), dan diperbolehkan seseorang untuk memilih salah satu diantara tiga bentuk haji, yaitu : tamattu', qiran dan ifrad." },
          { order: 2, heading: 'Ifrad', body: 'Berihram untuk haji saja sejak dari miqat dan tetap dalam keadaan ihram sampai selesai manasik hajinya.' },
          { order: 3, heading: 'Qiran', body: 'Berihram untuk haji dan umroh secara bersamaan.' },
          {
            order: 4,
            heading: "Tamattu'",
            body: "Berihram untuk umroh di bulan haji, lalu menyelesaikan manasik umrohnya (dengan bertahallul). Kemudian berihram untuk haji pada waktunya. Haji Tamattu' adalah haji yang biasanya dipakai oleh jamaah haji Indonesia.\n\nOrang yang menunaikan haji tamattu' memiliki dua manasik, yaitu :\n1. Mengerjakan manasik umroh tamattu' pada bulan-bulan haji lalu bertahallul darinya, yaitu dari ibadah umroh, dan menunggu tiba hari tarwiyah (tanggal 8 Dzulhijjah) kemudian kembali berihram untuk mulai mengerjakan manasik haji.\n2. Mulai mengerjakan manasik haji pada tanggal 8 Dzulhijjah, atau ketika hari tarwiyah sudah tiba.\n\nPelaksanaan ibadah umroh tamattu' sama dengan pelaksanaan umroh biasa, dari persiapan umroh sampai selesai, hanya saja ada perbedaan dalam ucapan talbiyah antara umroh tamattu' dengan umroh biasa.\n\nUcapan talbiyah umroh tamattu' adalah :",
            arabicText: 'لَبَّيكَ اللَّهُمَّ عُمرَةً مُتَمَتِّعًا بِهَا إِلَى الحَجِّ، لاَ رِيَاءَ فِيهِ وَلاَ سُمْعَة',
            latinText: "Labbaika Allaahumma umrotan mutamatti'an bihaa ilal hajji, laa riyaa-a fiihi walaa sum'ah",
            translation: '"Ya Allah, aku penuhi panggilan-Mu untuk melakukan umroh yang dilanjutkan dengan haji, tanpa ada riya\' dan sum\'ah."\n\nSetelah tahallul dari umroh tamattu\', selesailah manasiknya. Maka jamaah haji dibolehkan kembali melakukan hal-hal yang sebelumnya diharamkan ketika dalam keadaan ihram. Sesudah inilah baru dimulai manasik haji',
          },
        ],
      },
      {
        id: 'fiqh-5',
        title: 'Manasik Umroh - Ihram',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        status: 'COMPLETE',
        sections: [
          {
            order: 1,
            heading: 'Berihram dari miqat',
            body: "Setibanya di miqat, para jam'ah dianjurkan untuk mandi sebagaimana junub. Demikian juga wanita yang sedang haid, dianjurkan untuk tetap mandi ihram, karena hal itu bukanlah penghalang baginya untuk mengerjakan umroh.\n\nHanya saja wanita yang sedang haid dilarang melakukan thowaf di sekeliling ka'bah, kecuali setelah bersih atau suci dari haid nya. Hendaknya sebelum mandi ihram, tiap laki-laki dan wanita membersihkan dirinya, menggunting kuku, mencabut bulu ketiak, dll\n\nTidak mengapa apabila jam'ah mempersiapkan diri dengan mandi ihram dari hotel atau rumahnya",
          },
          {
            order: 2,
            heading: 'Memakai pakaian ihram',
            body: "Pakaian ihram bagi laki-laki berupa dua helai kain yang tidak berjahit, satu helai digunakan sebagai sarung, satu helai yang lain sebagai rida' (menutupi tubuh bagian atas)\n\nSedangkan pakaian ihram bagi wanita adalah pakaian yang disyariatkan bagi mereka, yaitu jubah dan jilbab yang menutupi seluruh tubuhnya, kecuali wajah dan kedua telapak tangan. Tidak ketat, tidak membentuk tubuh, tidak tembus pandangan (transparan), dan tidak menyerupai pakaian laki-laki. Dianjurkan berpakaian yang gelap\n\nCatatan:\n- Boleh menggunakan ikat pinggang\n- Boleh memakai jam tangan\n- Wewangian hanya boleh dikenakan pada tubuh, seperti ketiak, dada, leher, janggut, dll. Dan memakainya sebelum mengucapkan niat\n- Adapun wanita maka dilarang memakai wewangian saat keluar rumah, namun boleh menggunakan obat penghilang bau badan",
          },
          {
            order: 3,
            heading: 'Membaca talbiyah',
            body: "Membaca talbiyah atau niat umroh. Apabila semua persiapan telah dilakukan, dan jama'ah telah berada di miqat atau sejajar dengan miqat, mulailah berihram sebagai awal masuk dalam pelaksanaan ibadah umroh dengan membaca talbiyah atau niat umroh\n\nBacaan talbiyah atau niat umroh untuk haji tamattu' adalah :",
            arabicText: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً مُتَمَتِّعًا\n\nاللَّهُمَّ هَذِهِ عُمْرَة لاَ رِيَاءَ فِيْهَا وَلاَ سُمْعَة",
            latinText: "Labbaika allaahumma 'umrotan mutamatti'an,\nAllaahumma hadzihi 'umrotun laa riyaa-a fiihaa wa laa sum'ah",
            translation: "Ya Allah aku penuhi panggilanmu untuk mengerjakan umroh secara tamattu'\nYa Allah ini adalah umroh yang tidak ada riya' dan sum'ah di dalamnya\n\nApabila para jama'ah telah mengucapkan talbiyah umroh diatas dan dalam keadaan ihram, maka berarti telah masuk dalam ibadah umroh, dan sejak saat itu berlaku larangan-larangan ihram.",
          },
          {
            order: 4,
            heading: 'Mengucapkan kalimat syarat',
            body: 'Bagi orang yang sakit, atau mempunyai penyakit, atau khawatir terhalang sesuatu sehingga tidak bisa menyelesaikan umrohnya, maka hendaknya ia mengucapkan kalimat syarat, yaitu dengan membaca:',
            arabicText: 'اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي',
            latinText: 'Allaahumma mahillii haitsu habastanii',
            translation: "Ya Allah, tempat tahalulku dimana saja Engkau membatasiku\n\nSetelah itu semua jama'ah hendaknya memperbanyak membaca talbiyah",
          },
        ],
      },
      {
        id: 'fiqh-6',
        title: 'Larangan Ihram',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        status: 'COMPLETE',
        sections: [
          { order: 1, heading: 'Pengertian', body: "Larangan ihram adalah hal-hal yang harus dijauhi ketika seseorang dalam keadaan berihram yaitu setelah mengucapkan niat umroh atau haji. Larangan ini apabila dilanggar maka wajib bagi jama'ah umroh atau haji untuk menunaikan fidyah, puasa, atau memberi makan." },
          { order: 2, heading: 'Rambut', body: 'Mencukur rambut yang di ada di tubuh baik rambut kepala, bulu ketiak, bulu kemaluan, kumis, jenggot, dll' },
          { order: 3, heading: 'Kuku', body: 'Menggunting kuku' },
          { order: 4, heading: 'Wajah & Kepala', body: 'Menutup kepala dan wajah, wanita boleh menutup wajah jika lewat laki-laki yang bukan mahram di hadapannya' },
          { order: 5, heading: 'Pakaian', body: 'Laki-laki dilarang memakai pakaian yang dijahit dengan pola bentuk tubuh seperti baju, celana, dll.\n\nWanita dilarang memakai sarung tangan.' },
          { order: 6, heading: 'Parfum', body: 'Menggunakan parfum atau apapun yang mengandung parfum baik di tubuh atau di pakaian' },
          { order: 7, heading: 'Berburu', body: 'Memburu hewan darat yang halal dimakan' },
          { order: 8, heading: 'Nikah', body: 'Melakukan khitbah, akad nikah, atau menikahkan' },
          { order: 9, heading: 'Suami Istri', body: 'Jika mencumbui pasangan tetapi tidak sampai kemaluan maka hajinya tidak batal, tetapi wajib membayar fidyah.\n\nPada manasik haji, apabila dilakukan sebelum tahallul awal, maka ibadah hajinya batal. Tetapi tetap wajib menyelesaikan ritual haji dan wajib menyembelih seekor unta. Apabila tidak mampu, maka ia wajib berpuasa total sepuluh hari, dengan berpuasa tiga hari ketika waktu haji, dan tujuh hari sisanya ketika telah kembali ke negaranya.\n\nDan jika dilakukan setelah tahallul awal, sebelum tahallul tsani, maka ibadah hajinya sah, tidak batal, hanya saja ia wajib menyembelih kambing.' },
        ],
      },
      {
        id: 'fiqh-7',
        title: 'Manasik Umroh - Thowaf',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        status: 'COMPLETE',
        sections: [
          {
            order: 1,
            heading: 'Memasuki Masjidil Haram',
            body: 'Ada beberapa hal yang perlu diperhatikan saat memasuki Masjidil Haram:\n\n- Bersuci terlebih dahulu sebelum masuk masjid\n\n- Masuk dengan mendahulukan kaki kanan sambil membaca doa masuk masjid.',
            arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            latinText: 'Allahummaftha lii abwaaba rahmatik',
            translation: '"Ya Allah, bukalah pintu-pintu rahmat-Mu untukku." (HR. Muslim)\n\n- Berdoa ketika melihat ka\'bah',
            extraArabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، فَحَيِّنَا رَبَّنَا بِالسَّلاَمِ',
            extraLatin: 'Allahumma antas salaam wa minkas salaam fahayyinaa rabbanaa bis salaam',
            extraTranslation: '"Ya Allah sesungguhnya Engkau adalah As-Salaam (Yang suci/selamat dari segala aib dan kekurangan), dan dariMu-lah keselamatan, maka sambutlah kami wahai Rab kami dengan keselamatan"\n\n- Tidak mengerjakan sholat sunnah tahiyyatul masjid',
          },
          {
            order: 2,
            heading: 'Pelaksanaan Thawaf',
            body: "Yaitu mengerjakan thawaf sebanyak tujuh putaran dimulai dari rukun hajar aswad dan berakhir di rukun hajar aswad juga. Untuk mengetahui posisi yang sejajar dengan hajar aswad, maka perhatikanlah tanda lampu neon hijau.\n\nBagi laki-laki sebelum memulai thawaf hendaknya melakukan idhthiba'.\n\nKetika thawaf yang disunnahkan untuk diusap dari bagian ka'bah hanya rukun hajar aswad dan rukun yamani saja, selain keduanya tidak disunnahkan dan tidak boleh untuk diusap, apalagi untuk mencari keberkahan.\n\nAdapun tata cara mengerjakan thawaf adalah sebagai berikut:",
          },
          {
            order: 3,
            heading: 'Mengusap dan mencium hajar aswad',
            body: 'Tiga kondisi yang berkaitan dengan mencium atau mengusap hajar aswad:\n\n- Mengusap dan mencium hajar aswad jika memungkinkan\n- Jika tidak, maka cukup mengusap dengan tangan kanan lalu mencium tangan tersebut\n- Jika yang ke dua tidak memungkinkan juga, maka cukup berisyarat ke arah Hajar Aswad dengan tangan kanan tanpa mencium tangan kanan.\n\nApapun kondisinya, ketiga hal di atas dilakukan sambil membaca:',
            arabicText: 'الله أَكْبَر',
            latinText: 'Allahu akbar',
            translation: 'Atau',
            extraArabic: 'بِسْمِ اللهِ، اللهُ أَكْبَر',
            extraLatin: 'Bismillah, Allahu Akbar',
            extraTranslation: null,
          },
          {
            order: 4,
            heading: 'Jumlah Putaran',
            body: "Thowaf adalah dengan menjadikan ka'bah berada disebelah kiri badan. Satu putaran terhitung mulai dari hajar aswad, dan berakhir di hajar aswad. Laki-laki disunnahkan untuk berlari-lari kecil pada 3 putaran awal, dan 4 sisanya berjalan biasa.",
          },
          {
            order: 5,
            heading: 'Rukun Yamani',
            body: 'Mengusap rukun yamani dengan tangan kanan pada setiap putaran apabila memungkinkan. Jika tidak memungkinkan, maka tidak perlu memberi isyarat kepadanya dengan tangan. Juga tidak disyariatkan mencium rukun yamani, maupun mencium tangan yang digunakan untuk mengusapnya.\n\nTidak ada bacaan doa atau dzikir tertentu ketika mengusap rukun yamani.',
          },
          {
            order: 6,
            heading: 'Menuju Hajar Aswad',
            body: 'Ketika berjalan dari rukun yamani sampai ke hajar aswad pada setiap putaran, dianjurkan membaca:',
            arabicText: 'رَبَّنَا ءَاتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            latinText: "Robbanaa aatinaa fid dunyaa hasanah, wa fil aakhiroti hasanah, wa qinaa 'adzaaban naar",
            translation: '"Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka." Al-Baqarah: 201\n\nPada putaran kedua sampai ketujuh lakukan hal yang sama seperti pada putaran yang pertama.',
          },
          {
            order: 7,
            heading: "Mengusap Ka'bah",
            body: 'Tidak disyariatkan mengusap dua sudut dan dinding-dinding ka\'bah yang lain, karena Nabi ﷺ hanya mengusap hajar aswad dan rukun yamani saja.',
          },
          {
            order: 8,
            heading: 'Doa Dzikir Thawaf',
            body: 'Tidak ada bacaan, doa, dzikir, atau wirid yang khusus pada saat thawaf. Akan tetapi sangat dianjurkan untuk memperbanyak doa dan dzikir apa saja.',
          },
          {
            order: 9,
            heading: 'Menuju Maqam Ibrahim',
            body: 'Setelah selesai melaksanakan thowaf, tutuplah kedua pundak lalu berjalan menuju ke Maqam Ibrahim sambil membaca:',
            arabicText: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
            latinText: 'Wattakhidzuu mim maqoomi Ibroohima musholla',
            translation: '"Dan jadikanlah sebahagian maqom Ibrahim sebagai tempat shalat" (QS Al-Baqoroh : 125)',
          },
          {
            order: 10,
            heading: 'Sholat Sunah',
            body: 'Mengerjakan sholat sunah setelah thawaf di belakang Maqam Ibrahim',
          },
          {
            order: 11,
            heading: 'Air Zamzam',
            body: 'Setelah sholat sunah dianjurkan meminum air zamzam, serta menuangkannya di atas kepala',
          },
          {
            order: 12,
            heading: 'Kembali ke Hajar Aswad',
            body: 'Setelah meminum air zamzam, dianjurkan kembali ke hajar aswad untuk mengusap dan menciumnya, jika tidak memungkinkan cukup memberi isyarat kepadanya dari jauh dengan tangan sambil membaca,',
            arabicText: 'الله أَكْبَر',
            latinText: '"Allahu Akbar"',
            translation: 'atau',
            extraArabic: 'بِسْمِ اللهِ، اللهُ أَكْبَر',
            extraLatin: '"Bismillahi Allahu Akbar"',
            extraTranslation: "Kemudian menuju tempat sa'i (mas'a)",
          },
        ],
      },
      {
        id: 'fiqh-8',
        title: "Manasik Umroh - Sa'i",
        category: 'Fiqh Haji',
        contentType: 'artikel',
        status: 'COMPLETE',
        sections: [
          {
            order: 1,
            heading: 'Pengertian',
            body: "Setelah melaksanakan thowaf, para jama'ah segera menuju mas'a (tempat sa'i) yang terletak di antara bukit shafa dan marwa.\n\nSa'i dilaksanakan dengan jumlah tujuh putaran, dimulai dari bukit shafa dan berakhir di bukit marwa, sehingga dari bukit shafa sampai ke bukit marwa terhitung satu putaran, dan dari bukit marwa sampai ke bukit shafa terhitung satu putaran lagi.",
          },
          {
            order: 2,
            heading: 'Mendekati Shafa',
            body: 'Ketika sudah dekat dengan bukit shafa, bacalah:',
            arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللهِ',
            latinText: "Innas shofa wal marwata min sya'aairillaah",
            translation: 'Sesungguhnya Shafa dan Marwah merupakan sebagian syiar (agama) Allah. Al-Baqarah ayat 158:',
            extraArabic: 'أَبْدَأُ بِمَا بَدَأَ اللهُ بِهِ',
            extraLatin: 'Abda-u bimaa bada allaahu bih',
            extraTranslation: "Aku memulai sa'i dengan apa yang didahulukan oleh Allah.",
          },
          {
            order: 3,
            heading: 'Di atas Shafa',
            body: 'Adapun tata cara sa\'i adalah sebagai berikut:\n\nNaiklah sampai berada di bukit shafa, kemudian menghadap ke kiblat, dan membaca dzikir berikut:',
            arabicText: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ',
            latinText: 'Allaahu Akbar 3x',
            translation: null,
            extraArabic: 'لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            extraLatin: "Laa ilaaha illallaahu wah dahuu laa syariikalahu, lahul mulku wa lahul hamdu, yuhyii wa yumiitu, wa huwa 'alaa kulli syai-in qodiir",
            extraTranslation: 'Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, Tiada sekutu bagiNya. BagiNya kerajaan dan pujian. Dialah Yang Mahakuasa atas segala sesuatu.',
          },
          {
            order: 4,
            heading: "Doa Dzikir Sa'i",
            body: 'Selama perjalanan antara bukit shafa dengan bukit marwa, tidak ada doa atau bacaan dzikir yang khusus, para jama\'ah bisa bebas berdoa dan berdzikir dengan apapun yang diajarkan oleh Rasulullah ﷺ',
            arabicText: 'لاَ إِلَهَ إِلاَّ اللهُ، وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
            latinText: 'Laa ilaaha illallaahu wahdah, laa syariikalahu, anjaza wa\'dah, wa nashoro \'abdah, wa hazamal ahzaaba wahdah',
            translation: 'Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, yang melaksanakan janjiNya, membela hambaNya (Muhammad) dan mengalahkan golongan musuh sendirian.\n\nDzikir ini dibaca sebanyak 3x dibukit shofa dan marwa, dan diantara dzikir tersebut diselingi dengan berdoa. Tidak ada doa setelah membaca dzikir untuk yang ketiga kalinya. Setelah itu jama\'ah segera turun menuju bukit marwa.',
          },
          {
            order: 5,
            heading: 'Berlari',
            body: 'Bagi laki-laki dianjurkan untuk berlari diantara dua tanda lampu hijau sambil membaca:',
            arabicText: 'رَبِّ اغْفِرْ وَارْحَمْ إِنَّكَ أَنْتَ أَعَزُّ الْأَكْرَمُ',
            latinText: 'Robbighfir warham innaka antal a\'azzul akrom',
            translation: 'Ya Rabbku, ampuni dan rahmatilah aku. Sesungguhnya Engkaulah Yang Maha Perkasa dan Maha Pemurah',
          },
          {
            order: 6,
            heading: 'Selesai Putaran ke 1',
            body: 'Ketika sampai di Marwa untuk pertama kali, maka selesai putaran pertama. Lakukanlah pekerjaan yang sama ketika berada di Shafa sebelumnya, yaitu:\n\n- menghadap kiblat\n- membaca takbir\n- membaca dzikir tahlil\n- membaca doa\n- membaca dzikir tahlil\n- membaca doa\n- membaca dzikir tahlil\n\nMelanjutkan berjalan menuju Shafa',
          },
          {
            order: 7,
            heading: 'Selesai Putaran ke 2',
            body: 'Ketika sampai di Shafa untuk kedua-kalinya, maka selesai putaran kedua. Lakukanlah pekerjaan yang sama ketika berada di Shafa atau Marwa.',
          },
          {
            order: 8,
            heading: 'Selesai Putaran ke 3',
            body: 'Ketika sampai di Marwa untuk kedua-kalinya, maka selesai putaran ketiga. Lakukanlah pekerjaan yang sama ketika berada di Shafa atau Marwa.',
          },
          {
            order: 9,
            heading: 'Selesai Putaran ke 4',
            body: 'Ketika sampai di Shafa untuk ketiga-kalinya, maka selesai putaran keempat. Lakukanlah pekerjaan yang sama ketika berada di Shafa atau Marwa.',
          },
          {
            order: 10,
            heading: 'Selesai Putaran ke 5',
            body: 'Ketika sampai di Marwa untuk ketiga-kalinya, maka selesai putaran kelima. Lakukanlah pekerjaan yang sama ketika berada di Shafa atau Marwa.',
          },
          {
            order: 11,
            heading: 'Selesai Putaran ke 6',
            body: 'Ketika sampai di Shafa untuk keempat-kalinya, maka selesai putaran keenam. Lakukanlah pekerjaan yang sama ketika berada di Shafa atau Marwa.',
          },
          {
            order: 12,
            heading: 'Selesai Putaran ke 7',
            body: 'Ketika sampai di Marwa untuk keempat-kalinya, maka selesai putaran ketujuh. Tidak perlu melakukan ritual di atas bukit seperti sebelumnya.\n\nMenuju ke tempat cukur rambut atau salon untuk melakukan tahalul.',
          },
        ],
      },
      {
        id: 'fiqh-9',
        title: 'Manasik Umroh - Tahalul',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        status: 'COMPLETE',
        sections: [
          {
            order: 1,
            heading: 'Gundul',
            body: 'Bagi laki-laki yang paling afdhal adalah mencukur gundul rambut kepalanya. Sebab Nabi ﷺ mendoakan kebaikan sebanyak 3x bagi yang mencukur gundul rambutnya. Adapun yang memotong pendek rambutnya, beliau mendoakan kebaikan hanya satu kali saja.',
          },
          {
            order: 2,
            heading: 'Potong Rata',
            body: 'Bagi laki-laki yang bertahallul dengan hanya menggunting beberapa helai rambut, maka cara seperti ini tidak tepat dan tidak ada dasarnya dari sunah Rasulullah ﷺ\n\nJadi memotong rambut untuk tahalul sesuai sunah ada dua cara:\n1. Yang paling utama adalah dengan pisau kerok rambut sehingga kepala menjadi gundul halus. Bukan cukur gundul tapi menggunakan alat potong yang masih menyisakan rambut beberapa milimeter.\n2. Menggunakan alat potong rambut untuk memendekkan semua bagian rambut di kepala, bukan hanya sebagian rambut saja.\n\nCara yang tidak dicontohkan adalah menggunting beberapa helai rambut saja.',
          },
          {
            order: 3,
            heading: 'Wanita',
            body: 'Adapun wanita bertahalul dengan menggenggam seluruh rambutnya yang panjang, lalu memotong di bagian ujung sepanjang satu ruas jari.\nBagi wanita sebaiknya melakukan tahallul ditempat yang tertutup agar auratnya tidak tersingkap dan terlihat oleh laki-laki bukan mahram. Sebaiknya bertahallul di kamar mandi atau kamar hotel.',
          },
          {
            order: 4,
            heading: 'Selesai',
            body: 'Dengan melakukan tahallul, maka selesailah kegiatan umroh, dan jama\'ah boleh melakukan hal-hal yang sebelumnya dilarang ketika dalam keadaan ihram seperti memakai sabun, minyak wangi, dll.',
          },
        ],
      },
      {
        id: 'fiqh-10',
        title: 'Amalan Haji 8 Dzulhijjah',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        status: 'COMPLETE',
        sections: [
          {
            order: 1,
            heading: 'Pakaian Ihram',
            body: 'Jamaah haji laki-laki memakai kain ihram di hotel ketika masih di Makkah pada tanggal 8 Dzulhijjah (hari tarwiyah).\n\nJama\'ah haji wanita memakai pakaian yang menutupi aurat dan tidak boleh memakai cadar atau sarung tangan.',
          },
          {
            order: 2,
            heading: 'Talbiyah',
            body: 'Berdiri menghadap kiblat lalu mengucapkan:',
            arabicText: 'لَبَّيْكَ اللَّهُمَّ حَجًّا',
            latinText: 'Labbaika Allaahumma hajjan',
            translation: '"Aku menjawab panggilan-Mu ya Allah (dengan) menunaikan ibadah haji."\n\nKemudian ucapkan seperti yang diucapkan Rasulullah ﷺ:',
            extraArabic: 'اللَّهُمَّ هَذِهِ حَجَّةٌ لاَ رِيَاءَ فِيهَا وَلاَ سُمْعَةَ',
            extraLatin: 'Allaahumma hadzihi hajjatun laa riyaa-a fiiha walaa sum\'ah',
            extraTranslation: '"Ya Allah inilah ibadah haji yang tiada riya\' padanya dan tidak pula sum\'ah."',
          },
          {
            order: 3,
            heading: 'Memperbanyak Talbiah',
            body: 'Setelah berihram untuk haji, maka perbanyaklah membaca talbiyah berikut:',
            arabicText: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيكَ لَكَ',
            latinText: "Labbaika Allaahumma labbaik\nLabbaika laa syariika laka labbaik\nInnal hamda, wan ni'mata laka wal mulk\nLaa syariika lak",
            translation: 'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu\nAku penuhi panggilan-Mu, tidak ada sekutu bagi-Mu, aku penuhi panggilan-Mu,\nSesungguhnya segala puji dan nikmat hanya milik-Mu demikian pula segala kekuasaan\nTidak ada sekutu bagi-Mu',
          },
          { order: 4, heading: 'Menuju Mina', body: 'Setelah matahari terbit, berangkatlah ke Mina sambil terus membaca talbiyah.' },
          { order: 5, heading: 'Di Mina', body: 'Setelah anda di Mina, shalatlah pada waktunya masing-masing dengan cara di qashar atau diringkas.\n\nSelama berada di Mina pada hari ini, dianjurkan agar memperbanyak talbiyah dan berdzikir kepada Allah Ta\'ala' },
          { order: 6, heading: 'Mabit', body: 'Setelah itu anda pun mabit (menginap) hingga masuk waktu subuh, lalu sholat subuh.' },
        ],
      },
      {
        id: 'fiqh-11',
        title: 'Amalan Haji 9 Dzulhijjah',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Menuju Arafah',
            body: 'Setelah matahari terbit, berangkat dari Mina menuju padang Arafah dengan mengeraskan talbiyah dan bertakbir.',
          },
          {
            order: 2,
            heading: 'Makruh Puasa',
            body: 'Dimakruhkan bagi orang yang berhaji berpuasa pada hari Arafah, karena pada saat wukuf di Arafah Nabi tidak berpuasa, bahkan pada saat itu beliau minum susu segar.',
          },
          {
            order: 3,
            heading: 'Khutbah',
            body: 'Jika memungkinkan, kerjakanlah sholat Zhuhur dan Ashar berjamaah di Masjid Namira untuk mendengarkan khutbah yang disampaikan imam sebelum sholat. Namun jika tidak memungkinkan sholatlah di Arafah.',
          },
          {
            order: 4,
            heading: "Jama' Qashar",
            body: 'Jamaah haji disunnahkan melaksanakan sholat zhuhur dan Ashar dengan jamak dan qashar pada waktu Zhuhur.',
          },
          {
            order: 5,
            heading: 'Wuquf',
            body: 'Melakukan wukuf di Arafah dengan menghadap kiblat, lalu mengangkat kedua tangan sambil berdoa.\n\nPastikan dengan benar bahwa anda benar-benar wukuf di padang Arafah. Sebab wukuf di Arafah adalah merupakan rukun terpenting dalam ibadah haji.',
          },
          {
            order: 6,
            heading: 'Perbanyak Talbiah',
            body: 'Memperbanyak talbiyah dan bacaan tahlil (Laa ilaaha illallaah). Dzikir terbaik yang dibaca Rasulullah ﷺ dan para Nabi tatkala berada di Arafah adalah:',
            arabicText: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَاشَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            latinText: 'Laa ilaaha illallahu wahdahu laa syariikalahu, lahul mulku walahul hamdu wahuwa ‘alaa kulli syai-in qodiir',
            translation: 'Tiada ilaah yang berhak diibadahi dengan benar kecuali Allah semata, tiada sekutu bagi-Nya, hanya Dia pemilik kekuasaan, hanya Dia pula pemilik pujian, dan Dia Mahakuasa atas segala sesuatu.',
          },
          {
            order: 7,
            heading: 'Dzikir Sampai Maghrib',
            body: 'Tetaplah berdzikir, berdoa, tawadhu’ (rendah hati) di hadapan Allah Ta’ala dengan penuh kekhusyu’an serta kesungguhan, sampai matahari terbenam.',
          },
          {
            order: 8,
            heading: 'Menuju Muzdalifah',
            body: 'Setelah matahari terbenam, bertolaklah dengan tenang dan penuh kesabaran menuju Muzdalifah.',
          },
          {
            order: 9,
            heading: 'Di Muzdalifah',
            body: 'Tiba di Muzdalifah mengerjakan sholat Maghrib dan Isya’ dengan dijamak ta’khir (dikerjakan pada waktu Isya’) dan diqashar.',
          },
          {
            order: 10,
            heading: 'Mabit di Muzdalifah',
            body: 'Mabit atau bermalam di Muzdalifah hingga Subuh, dan mengerjakan sholat Subuh disana. Mabit hukumnya wajib, maka jamaah haji tidak boleh meninggalkan Muzdalifah sebelum sholat Subuh disana, kecuali bagi orang yang berudzur syar’i.',
          },
          {
            order: 11,
            heading: 'Boleh Mencari Batu',
            body: 'Diperbolehkan untuk mengambil atau mengumpulkan batu kerikil berdasarkan beberapa atsar riwayat salafus shalih.',
          },
          {
            order: 12,
            heading: 'Berdoa Setelah Shubuh',
            body: 'Setelah sholat Subuh anda berdoa sambil menghadap ke arah kiblat sampai langit terang.',
          },
        ],
      },
      {
        id: 'fiqh-12',
        title: 'Amalan Haji 10 Dzulhijjah',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Menuju Mina',
            body: 'Setelah sholat Subuh dan langit mulai terang atau sebelum matahari terbit, maka berangkat dengan tenang dan sabar dari Muzdalifah menuju ke Mina sambil bertalbiyah dan bertakbir.',
          },
          {
            order: 2,
            heading: 'Jumroh Aqobah',
            body: 'Melempar jumrotul Aqobah dengan tujuh batu kerikil yang dipersiapkan sebelumnya sambil mengucapkan takbir ‘Allaahu Akbar’ di setiap lemparan. Menghentikan bacaan talbiyah ketika selesai melempar jumroh Aqobah.',
          },
          {
            order: 3,
            heading: 'Al Hadyu',
            body: 'Menyembelih al-hadyu (sembelihan) di Mina diwajibkan bagi jamaah haji tamattu’ yang dilakukan pada hari ‘Idul Adha atau hari tasyriq, bisa mulai tanggal 10, 11,12, atau 13 Dzulhijjah.\n\nMakanlah sebagian sembelihan anda, dan sebagian besarnya diberikan kepada siapa saja.\n\nApabila anda tidak memiliki biaya untuk hewan sembelihan al-hadyu, maka diwajibkan perpuasa selama tiga hari pada saat haji dan tujuh hari setelah tiba di kampung halaman.\n\nKaum wanita dalam amalan ini sama dengan kaum laki-laki.',
          },
          {
            order: 4,
            heading: 'Tahallul Sughro',
            body: "Tahalul sughro bagi jama'ah haji tamattu' adalah setelah melempar jumroh aqobah dan menyembelih al-hadyu. Sedangkan tahalul sughro bagi jama'ah haji qiron dan ifrod adalah setelah melempar jumroh aqobah.\n\nSetelah bertahalul sughro ini jama'ah haji gugur larangan ihram kecuali berhubungan suami istri.",
          },
          {
            order: 5,
            heading: "Thawaf & Sa'i Haji",
            body: 'Jamaah haji menuju ke Makkah untuk melaksanakan thawaf haji (thawaf ifadhah) dan sa’i haji apabila memungkinkan, kemudian kembali ke Mina untuk mabit.\n\nTetapi karena biasanya kondisi tidak memungkinkan, maka thawaf ifadhah dan sa’i haji ini bisa dikerjakan pada hari tasyriq setelah selesai nafar awal atau nafar tsani.',
          },
          {
            order: 6,
            heading: 'Sunah Berurutan',
            body: 'Disunnahkan mengerjakan amalan-amalan tersebut secara berurutan:\n\n1. Melempar jumroh Aqobah\n2. Menyembelih hewan hadyu\n3. Tahalul\n4. Thowaf ifadhah\n5. Sa’i haji\n6. Kembali ke Mina untuk bermalam\n\nAkan tetapi diperbolehkan bagi jamaah haji tidak melakukannya seperti urutan tersebut.',
          },
        ],
      },
      {
        id: 'fiqh-13',
        title: 'Amalan Haji 11 Dzulhijjah',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Lempar Jumroh',
            body: 'Setelah masuk waktu Zhuhur, maka disunahkan untuk melempar tiga jumroh dengan urutan:\n\n1. Jumroh Sughro\n2. Jumroh Wustho\n3. Jumroh Aqobah',
          },
          {
            order: 2,
            heading: 'Jumroh Sughro',
            body: 'Melempar jumroh sughro dengan tujuh batu kerikil yang sudah dipersiapkan sambil mengucapkan takbir Allaahu Akbar di setiap lemparan.\n\nSetelah selesai melempar jumroh sughro, berdiri menghadap ke arah kiblat dan berdoa sepanjang dan sebanyak mungkin sambil mengangkat kedua tangan dengan penuh pengharapan kepada Allah Ta’ala.',
          },
          {
            order: 3,
            heading: 'Jumroh Wustho',
            body: 'Setelah berdoa, berjalan menuju jumroh wustho lalu melempar dengan tujuh batu kerikil yang sudah dipersiapkan, sambil mengucapkan takbir Allaahu Akbar di setiap lemparan.\n\nSetelah itu berdiri di sebelah kiri jumroh Wustho dan menghadap ke arah kiblat, kemudian berdoa sepanjang dan sebanyak mungkin sambil mengangkat kedua tangan.',
          },
          {
            order: 4,
            heading: 'Jumroh Aqobah',
            body: 'Setelah berdoa, berjalan menuju jumroh Aqobah lalu melempar dengan tujuh batu kerikil yang sudah dipersiapkan, sambil mengucapkan takbir Allaahu Akbar di setiap lemparan.\n\nPosisikan Mina berada disebelah kanan dan Makkah berada disebelah kiri ketika melempar jumroh Aqobah. Setelah melempar jumroh Aqobah, tidak ada doa seperti yang dilakukan pada dua jumroh sebelumnya.',
          },
          {
            order: 5,
            heading: 'Mabit di Mina',
            body: 'Waktu melempar jumrah selama di Mina adalah setelah dzuhur sampai magrib dan waktu afdhalnya adalah ketika mendekati magrib. Umumnya setiap daerah maktab di Mina telah ada jadwal melemparnya sehingga tidak penuh dan berdesak-desakan.\n\nSetelah selesai melempar jumrah maka Anda mabit di Mina untuk melempar jumroh pada hari selanjutnya yaitu tanggal 12 Dzulhijjah',
          },
        ],
      },
      {
        id: 'fiqh-14',
        title: 'Amalan Haji 12 Dzulhijjah',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Lempar Jumroh',
            body: 'Amalan yang dikerjakan pada tanggal 12 Dzulhijjah sama seperti yang dikerjakan pada tanggal 11 Dzulhijjah yaitu melempar tiga jumroh berurutan setelah masuk waktu Zhuhur dengan memperhatikan ketentuan di setiap jumroh.',
          },
          {
            order: 2,
            heading: 'Nafar Awal',
            body: 'Nafar Awal adalah jika Anda keluar dari Mina pada tanggal 12 Dzulhijjah sebelum matahari terbenam. Tetapi Anda akan mendapatkan keutamaan lebih banyak ketika mengerjakan nafar tsani yaitu melanjutkan ibadah dengan bermalam di Mina.',
          },
        ],
      },
      {
        id: 'fiqh-15',
        title: 'Amalan Haji 13 Dzulhijjah',
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Lempar Jumroh',
            body: 'Amalan yang dikerjakan pada tanggal 13 Dzulhijjah sama seperti yang dikerjakan pada tanggal 11 dan 12 Dzulhijjah yaitu melempar tiga jumroh berurutan setelah masuk waktu Zhuhur dengan memperhatikan ketentuan di setiap jumroh.',
          },
          {
            order: 2,
            heading: 'Nafar Tsani',
            body: "Jama'ah mendapatkan keutamaan lebih banyak dengan mengerjakan nafar tsani yaitu keluar dari Mina pada tanggal 13 Dzulhijjah setelah selesai melempar jumroh.",
          },
        ],
      },
      {
        id: 'fiqh-16',
        title: "Thowaf Wada'",
        category: 'Fiqh Haji',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Wajib',
            body: "Thowaf wada’ hukumnya wajib bagi jama'ah haji, kecuali wanita haid atau nifas berdasarkan hadits Abdullah bin Al-Abbas رضي الله عنه :",
          },
          {
            order: 2,
            arabicText: 'أُمِرَ الناس أن يكون آخِر عهدهم بالبيت إلَّا أنه خُفف عن المرأة الحائض',
            latinText: null,
            translation: '“Manusia diperintahkan untuk menjadikan thowaf wada’ sebagai akhir ibadah mereka di Baitullah. Hanya saja, diberi keringanan bagi wanita yang sedang haid untuk tidak melaksanakannya.” (HR. Al-Bukhari)',
          },
          {
            order: 3,
            heading: "Thawaf Wada'",
            body: 'Dilaksanakan dengan ketentuan sama seperti thawaf sunah yaitu:\n\n1. Tujuh putaran\n2. Memberikan isyarat di hajar aswad\n3. Berpakaian biasa\n4. Dalam keadaan suci (berwudhu)',
          },
          {
            order: 4,
            heading: 'Shalat Sunah',
            body: "Jama'ah haji dianjurkan mengerjakan sholat dua rakaat setelah thowaf wada'",
          },
        ],
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
        category: 'Umrah',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Persiapan Sebelum Berihram',
            body: 'Jika seseorang akan melaksanakan umrah, dianjurkan untuk mempersiapkan diri sebelum berihram dengan mandi sebagaimana seorang yang mandi junub, memakai wangi-wangian yang terbaik jika ada dan memakai pakaian ihram.',
          },
          {
            order: 2,
            heading: 'Ketentuan Pakaian Ihram',
            body: 'Pakaian ihram bagi laki-laki berupa dua lembar kain ihram yang berfungsi sebagai sarung dan penutup pundak. Adapun bagi wanita, ia memakai pakaian yang telah disyari’atkan yang menutupi seluruh tubuhnya.\n\nNamun tidak dibenarkan memakai cadar/niqab (penutup wajahnya) dan tidak dibolehkan memakai sarung tangan.',
          },
          {
            order: 3,
            heading: 'Niat Berihram dari Miqat',
            body: 'Berihram dari miqat dengan mengucapkan:',
            arabicText: 'لَبَّيْكَ عُمْرَةً',
            latinText: 'Labbaik ‘umroh',
            translation: 'Aku memenuhi panggilan-Mu untuk menunaikan ibadah umrah',
          },
          {
            order: 4,
            heading: 'Shalat Ihram',
            body: 'Tidak ada shalat khusus untuk berihram, namun jika bertepatan dengan waktu shalat wajib, maka shalatlah lalu berihram setelah shalat.',
          },
          {
            order: 5,
            heading: 'Syarat Ihram (Jika Khawatir Sakit/Terhalang)',
            body: 'Jika khawatir tidak dapat menyelesaikan umrah karena sakit atau adanya penghalang lain, maka dibolehkan mengucapkan persyaratan setelah mengucapkan kalimat di atas dengan mengatakan:',
            arabicText: 'اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي',
            latinText: 'Allahumma mahilli haitsu habastani',
            translation: 'Ya Allah, tempat tahallul di mana saja Engkau menahanku. Dengan mengucapkan persyaratan ini—baik dalam umrah maupun ketika haji—, jika seseorang terhalang untuk menyempurnakan manasiknya, maka dia diperbolehkan bertahallul dan tidak wajib membayar dam (menyembelih seekor kambing).',
          },
          {
            order: 6,
            heading: 'Membaca & Memperbanyak Talbiah',
            body: 'Setelah mengucapkan “talbiah umrah” (pada poin ketiga), dilanjutkan dengan membaca dan memperbanyak talbiah berikut ini, sambil mengeraskan suara bagi laki-laki dan lirih bagi perempuan hingga tiba di Makkah:',
            arabicText: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لَا شَرِيكَ لَكَ',
            latinText: 'Labbaik Allahumma labbaik. Labbaik laa syariika laka labbaik. Innalhamda wan ni’mata, laka wal mulk, laa syariika lak',
            translation: 'Aku menjawab panggilan-Mu ya Allah, aku menjawab panggilan-Mu, aku menjawab panggilan-Mu, tiada sekutu bagi-Mu, aku menjawab panggilan-Mu. Sesungguhnya segala pujian, kenikmatan dan kekuasaan hanya milik-Mu, tiada sekutu bagi-Mu',
          },
          {
            order: 7,
            heading: 'Mandi Sebelum Masuk Makkah',
            body: 'Jika memungkinkan, seseorang dianjurkan untuk mandi sebelum masuk kota Makkah.',
          },
          {
            order: 8,
            heading: 'Doa Masuk Masjidil Haram',
            body: 'Masuk Masjidil Haram dengan mendahulukan kaki kanan sambil membaca doa masuk masjid:',
            arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            latinText: 'Allahummaf-tahlii abwaaba rohmatik',
            translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu',
          },
          {
            order: 9,
            heading: 'Menuju ke Hajar Aswad',
            body: 'Menuju ke Hajar Aswad, lalu menghadapnya sambil membaca “Allahu akbar” atau “Bismillah Allahu akbar” lalu mengusapnya dengan tangan kanan dan menciumnya. Jika tidak memungkinkan untuk menciumnya, maka cukup dengan mengusapnya, lalu mencium tangan yang mengusap hajar Aswad. Jika tidak memungkinkan untuk mengusapnya, maka cukup dengan memberi isyarat kepadanya dari jauh pada setiap putaran thawaf tanpa mencium tangan.',
          },
          {
            order: 10,
            heading: 'Thawaf Umrah (7 Putaran)',
            body: 'Thawaf dilakukan sebanyak 7 putaran penuh, dimulai dan diakhiri di Hajar Aswad. Bagi laki-laki, disunnahkan idhthiba\' (membuka bahu kanan) dan berlari-lari kecil (raml) pada 3 putaran pertama, lalu berjalan biasa pada 4 putaran terakhir.',
          },
          {
            order: 11,
            heading: 'Mengusap Rukun Yamani',
            body: 'Disunnahkan mengusap Rukun Yamani dengan tangan kanan pada setiap putaran jika memungkinkan. Tidak dianjurkan mencium Rukun Yamani, dan jika tidak memungkinkan mengusapnya, tidak perlu memberi isyarat tangan.',
          },
          {
            order: 12,
            heading: 'Doa di Antara Rukun Yamani dan Hajar Aswad',
            body: 'Ketika berada di antara Rukun Yamani dan Hajar Aswad, disunnahkan membaca:',
            arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            latinText: 'Robbana aatina fid dunya hasanah, wa fil aakhiroti hasanah wa qina ‘adzaban naar',
            translation: 'Ya Rabb kami, karuniakanlah pada kami kebaikan di dunia dan kebaikan di akhirat serta selamatkanlah kami dari siksa neraka. (QS. Al-Baqarah: 201)',
          },
          {
            order: 13,
            heading: 'Dzikir Saat Thawaf',
            body: 'Tidak ada dzikir atau bacaan khusus tertentu pada waktu thawaf selain yang disebutkan pada nomor 12. Seseorang yang thawaf diperbolehkan membaca Al-Qur\'an, doa, atau dzikir yang disukai.',
          },
          {
            order: 14,
            heading: 'Akhir Setiap Putaran Thawaf',
            body: 'Setiap selesai satu putaran, jika memungkinkan kembali ke Hajar Aswad: bertakbir lalu mengusap dan menciumnya, atau mengusapnya saja. Jika tidak memungkinkan, beri isyarat di setiap area permulaan thawaf yang ditandai dengan lampu neon hijau di sebelah kanan.',
          },
          {
            order: 15,
            heading: 'Menuju ke Maqam Ibrahim',
            body: 'Setelah selesai 7 putaran thawaf, tutup kedua pundak (tidak lagi idhthiba\'), lalu berjalan menuju ke belakang Maqam Ibrahim sambil membaca:',
            arabicText: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
            latinText: 'Wattakhidzuu mim maqoomi ibroohiima musholla',
            translation: 'Dan jadikanlah sebahagian Maqam Ibrahim tempat shalat. (QS. Al-Baqarah: 125)',
          },
          {
            order: 16,
            heading: 'Shalat Sunnah Thawaf',
            body: 'Melaksanakan shalat sunnah thawaf sebanyak 2 rakaat di belakang Maqam Ibrahim (jika memungkinkan, atau di tempat lain di dalam masjid):\n• Rakaat Pertama: Membaca Surat Al-Fatihah dilanjutkan Surat Al-Kafirun.\n• Rakaat Kedua: Membaca Surat Al-Fatihah dilanjutkan Surat Al-Ikhlas.',
          },
          {
            order: 17,
            heading: 'Minum Air Zam-Zam',
            body: 'Setelah selesai shalat, disunnahkan untuk meminum air zam-zam dan menyiramkan sedikit ke kepala.',
          },
        ],
      },
      {
        id: 'umrah-2',
        title: 'Manasik Bagian 2',
        category: 'Umrah',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Menuju Bukit Shafa',
            body: 'Kemudian, menuju ke Bukit Shafa untuk melaksanakan sa’i umrah dan jika telah mendekati Shafa, membaca:',
            arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ',
            latinText: 'Innash shafaa wal marwata min sya’airillah',
            translation: 'Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar Allah. (QS. Al Baqarah: 158)',
          },
          {
            order: 2,
            heading: 'Memulai dari Shafa',
            body: 'Lalu mengucapkan:',
            arabicText: 'نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
            latinText: 'Nabda-u bimaa bada-allah bih',
            translation: 'Kami memulai dengan apa yang Allah mulai dengannya.',
          },
          {
            order: 3,
            heading: 'Di Atas Bukit Shafa',
            body: 'Menaiki bukit Shafa, lalu menghadap ke arah Ka’bah hingga melihatnya—jika hal itu memungkinkan—, kemudian bertakbir dan membaca dzikir berikut:',
            repeatNote: '(3x)',
            arabicText: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ (3x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
            latinText: 'Allahu Akbar, Allahu Akbar, Allahu Akbar (3x)\n\nLaa ilaaha illa Allah, wahdahu laa shareeka lah, lahul mulku wa lahul hamdu yuhyee wa yumeetu wa huwa \'ala kulli shay\'in qadeer\n\nLaa ilaaha illa Allah, wahdahu anjaza wa\'dahu, wa nasara \'abdahu, wa hazama al-ahzaaba wahdahu',
            translation: 'Allah Mahabesar, Allah Mahabesar, Allah Mahabesar. (3x) Tiada sesembahan yang berhak disembah kecuali hanya Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya lah segala kerajaan dan segala pujian untuk-Nya. Dia yang menghidupkan dan yang mematikan. Dia Mahakuasa atas segala sesuatu. Tiada sesembahan yang berhak disembah selain Allah semata. Dialah yang menepati janji-Nya, menolong hamba-Nya, dan mengalahkan tentara sekutu sendirian.\n\n(Dzikir ini dibaca 3 kali, dan disunnahkan memanjatkan doa pribadi apa saja di antara pengulangan tersebut).',
          },
          {
            order: 4,
            heading: 'Turun Menuju Marwah',
            body: 'Turun dari bukit Shafa dan berjalan biasa menuju ke bukit Marwah.',
          },
          {
            order: 5,
            heading: 'Lampu Hijau (Khusus Laki-laki)',
            body: 'Bagi laki-laki, disunnahkan berlari-lari kecil dengan cepat dan sungguh-sungguh di antara dua pilar lampu hijau, lalu lanjutkan berjalan biasa menuju Marwah.',
          },
          {
            order: 6,
            heading: 'Doa Ketika Berlari di Sa\'i',
            body: 'Diperbolehkan membaca doa (atsar dari Ibnu Mas\'ud & Ibnu Umar radhiyallahu \'anhuma):',
            arabicText: 'اللَّهُمَّ اغْفِرْ وَارْحَمْ وَأَنْتَ الْأَعَزُّ الْأَكْرَمُ',
            latinText: 'Allaahummaghfir warham wa antal a\'azzul akram',
            translation: 'Ya Rabbku, ampuni dan rahmatilah aku. Sesungguhnya Engkaulah Yang Maha Perkasa dan Maha Pemurah.',
          },
          {
            order: 7,
            heading: 'Setibanya di Bukit Marwah',
            body: 'Ketika sampai di Marwah, lakukan amalan yang sama seperti di bukit Shafa: menghadap kiblat, bertakbir, membaca dzikir (pada poin #3), dan berdoa bebas.\n\nPerjalanan dari Shafa ke Marwah ini dihitung sebagai putaran ke-1.',
          },
          {
            order: 8,
            heading: 'Menuju ke Shafa (Putaran ke-2)',
            body: 'Kemudian turunlah dari Marwah, lalu menuju ke Shafa dengan berjalan di tempat yang ditentukan untuk berjalan dan berlari bagi laki-laki di tempat lampu hijau, lalu naik ke Shafa dan lakukan seperti semula. Dengan demikian terhitung dua putaran.',
          },
          {
            order: 9,
            heading: 'Melengkapi 7 Putaran',
            body: 'Lakukanlah hal ini bolak-balik sampai genap 7 kali putaran, yang berakhir di bukit Marwah.',
          },
          {
            order: 10,
            heading: 'Dzikir Bebas Selama Sa\'i',
            body: 'Tidak ada bacaan dzikir wajib atau doa khusus selama perjalanan sa\'i; dipersilakan memperbanyak dzikir, membaca Al-Qur\'an, atau berdoa sesuai hajat masing-masing.',
          },
          {
            order: 11,
            heading: 'Tahallul (Mencukur / Memendekkan Rambut)',
            body: 'Setelah menyelesaikan 7 putaran sa’i di bukit Marwah, maka bertahallul dengan memendekkan seluruh rambut kepala secara merata atau mencukur gundul, dan yang mencukur gundul itulah yang lebih afdhal bagi laki-laki.\n\nAdapun bagi wanita, cukup dengan memotong ujung rambutnya sepanjang satu ruas jari di tempat yang tertutup.',
          },
          {
            order: 12,
            heading: 'Selesai Ibadah Umrah',
            body: 'Setelah memotong atau mencukur rambut, maka berakhirlah seluruh rangkaian ibadah umrah dan Anda telah dibolehkan untuk mengerjakan hal-hal yang tadinya dilarang ketika dalam keadaan ihram.',
          },
        ],
      },
      {
        id: 'umrah-3',
        title: 'Doa dan Bacaan Umroh',
        category: 'Umrah',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            heading: 'Ucapan Ketika Berpamitan',
            arabicText: 'أَسْتَوْدِعُكُمُ اللَّهَ الَّذِي لَا تَضِيعُ وَدَائِعُهُ',
            latinText: 'Astaudi\'ukumullaahal-ladzii laa tadhi\'u wadā\'i\'uhu',
            translation: '“Aku menitipkan kamu kepada Allah yang tidak akan hilang titipan-Nya.” (HR. Ahmad dan Ibnu Majah, Shahih)',
          },
          {
            order: 2,
            heading: 'Doa Keluar Rumah',
            arabicText: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
            latinText: 'Bismillahi, tawakkaltu \'alallah, wala hawla wala quwwata illa billah',
            translation: '“Dengan nama Allah (aku keluar). Aku bertawakkal kepadaNya, dan tiada daya dan upaya kecuali karena pertolongan Allah” (HR. Abu Dawud dan Tirmidzi)',
          },
          {
            order: 3,
            heading: 'Doa Berangkat Safar',
            arabicText: 'اللهُ أَكْبَرُ اللهُ أَكْبَرُ اللهُ أَكْبَرُ { سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ. وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ } اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَابَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ',
            latinText: 'Allahu Akbar, Allahu Akbar, Allahu Akbar, subhan alladhi sakhkhar lana hadha wa ma kunna lahu muqrinina. Wa inna ila Rabbina la-munqalibun. Allahumma inna nas\'aluka fi safarina hadha al-birra wa al-taqwa, wa min al-\'amali ma tarda. Allahumma hawwin \'alayna safarana hadha wa-twi \'anna bu\'dahu. Allahumma anta as-sahibu fi as-safar, wa al-khalifatu fi al-ahl. Allahumma inni a\'udhu bika min wa\'tha\'i as-safar, wa ka\'abati al-manzar, wa su\'i al-munqalabi fi al-mali wa al-ahl',
            translation: '"Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Maha Suci Tuhan yang menundukkan kendaraan ini untuk kami, sedang sebelumnya kami tidak mampu. Dan sesungguhnya kami akan kembali kepada Tuhan kami (di hari Kiamat). Ya Allah! Sesungguhnya kami memohon kebaikan dan taqwa dalam bepergian ini, kami mohon perbuatan yang meridhan-Mu. Ya Allah! Permudahlah perjalanan kami ini, dan dekatkan jaraknya bagi kami. Ya Allah! Engkaulah teman dalam bepergian dan yang mengurusi keluarga(ku). Ya Allah! Sesungguhnya aku berlindung kepada-Mu dari kelelahan dalam bepergian, pemandangan yang menyedihkan dan perubahan yang jelek dalam harta dan keluarga." (HR. Muslim)',
          },
          {
            order: 4,
            heading: 'Talbiyah Niat Umroh',
            arabicText: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
            latinText: "Labbaika Allahumma 'umratan",
            translation: 'Aku penuhi panggilan-Mu, ya Allah, untuk (melaksanakan) umrah',
            extraArabic: 'لَبَّيْكَ اللَّهُمَّ حَجًّا',
            extraLatin: 'Labbaika Allahumma hajja',
            extraTranslation: 'Aku penuhi panggilan-Mu, ya Allah, untuk (melaksanakan) haji',
          },
          {
            order: 5,
            heading: 'Doa Setelah Talbiyah Niat Umroh dan Haji',
            arabicText: 'اللَّهُمَّ هَذِهِ حَجَّةٌ لَارِيَاءَ فِيهَا وَلَا سُمْعَةَ',
            latinText: 'Allahumma hadzihi hajjatun la riyaa-a fiihaa wa la sum\'atun',
            translation: 'Ya Allah ini adalah haji yang tidak mengandung unsur Riya dan Sum\'ah',
          },
          {
            order: 6,
            heading: 'Bacaan Talbiyah',
            arabicText: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لَا شَرِيكَ لَكَ',
            latinText: 'Labbaikallahumma labbaik, labbaika laa syarika laka labbaik, innal hamda wan-ni\'mata laka wal mulk, laa syarika lak',
            translation: 'Aku datang memenuhi panggilan-Mu ya Allah, Aku datang memenuhi panggilan-Mu, Aku datang memenuhi panggilan-Mu, tiada sekutu bagi-Mu, Aku datang memenuhi panggilan-Mu sesungguhnya segala puji, nikmat dan segenap kekuasaan milik-Mu, tiada sekutu bagi-Mu',
          },
          {
            order: 7,
            heading: 'Doa Masuk Masjid',
            arabicText: 'اللَّهُمَّ صَلِّ وَسَلَّمْ عَلَى مُحَمَّدٍ اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            latinText: 'Allahumma shalli wasallim \'ala Muhammadin, Allahummaf-tahlii abwaaba rahmatik',
            translation: 'Ya Allah berilah shalawat dan salam atas Muhammad, Ya Allah bukakan bagiku pintu-pintu rahmat-Mu',
          },
          {
            order: 8,
            heading: 'Bacaan Masuk Masjid',
            arabicText: 'أَعُوْذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّحِيمِ',
            latinText: 'A\'uudzu billahil \'azhiim wa biwajhihil kariim wa sulthanihil qadiim minas syaithaanir rajiim',
            translation: 'Aku berlindung kepada Allah Yang Maha Agung, dengan wajahNya Yang Mulia dan kekuasaanNya yang abadi, dari setan yang terkutuk',
          },
          {
            order: 9,
            heading: 'Amalan Ketika Melihat Ka\'bah',
            body: '1. Mengangkat Kedua Tangan\n2. Membaca Do\'a',
            arabicText: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ فَحَيِّنَا رَبَّنَا بِالسَّلَامِ',
            latinText: 'Allahumma antas salaam, wa minkas salaam, fahayyinaa rabbana bis salaam',
            translation: 'Ya Allah Engkaulah keselamatan, dari-Mu lah keselamatan, maka hidupkanlah kami dengan penuh kesejahteraan wahai Rabb kami',
          },
          {
            order: 10,
            heading: 'Ucapan Memulai Thawaf',
            arabicText: 'بسم الله والله أكبر',
            latinText: 'Bismillaahi wallahu akbar',
            translation: 'Dengan Nama Allah dan Allah Maha Besar',
          },
          {
            order: 11,
            heading: 'Doa antara Rukun Yamani dan Rukun Hajar Aswad',
            arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            latinText: 'Rabbanaa aatinaa fid-dunya hasanah wa fil-aakhirati hasanah wa qinaa \'adzaaban-naar',
            translation: 'Wahai Tuhan kami! Berilah kami kebaikan di dunia dan kebaikan di akhirat, dan jauhkan kami dari siksaan api Neraka',
          },
          {
            order: 12,
            heading: 'Doa Ketika Thawaf',
            body: 'Tidak ada doa khusus dalam thawaf [kecuali doa antara rukun yamani dan rukun hajar aswad]. Namun dibolehkan membaca Al-Qur\'an atau Berdzikir sesuka hatinya.',
          },
          {
            order: 13,
            heading: 'Doa Ketika Menuju Maqam Ibrahim',
            arabicText: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
            latinText: 'Wattakhizhu min maqami ibrahima musalla',
            translation: '"Dan jadikanlah sebahagian maqam Ibrahim tempat Shalat" (QS: Al-Baqarah[2]: 125)',
          },
          {
            order: 14,
            heading: 'Surat yang dibaca Ketika Shalat di Belakang Makam Ibrahim',
            body: 'Setelah membaca Al-Fatihah pada rakaat pertama membaca surat الكافرون dan rakaat kedua membaca الإخلاص',
          },
          {
            order: 15,
            heading: 'Doa Minum Air Zamzam',
            arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
            latinText: 'Allahumma innī as\'aluka \'ilman nāfi\'an, wa rizqan wāsi\'an, wa syifā\'an min kulli dā\'in',
            translation: 'Ya Allah, sesungguhnya aku mohon kepada-Mu ilmu yang bermanfaat, rizki yang luas dan kesembuhan dari segala penyakit',
          },
          {
            order: 16,
            heading: 'Doa Ketika Menuju Bukit Shafa',
            arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا وَمَن تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ',
            latinText: 'Inn as-Shafaa wal Marwah min sha\'aa\'irillah, faman hajjal baita awi\'tamara fala junaha \'alaihi an yaththawwafa bihima, wa man tatathawwa\'a khairan fa innallaha shakiirun \'aliim',
            translation: '"Sesungguhnya Shafa dan Marwah adalah sebahagian dari syi\'ar (agama) Allah. Maka barangsiapa yang beribadah haji ke Baitullah atau ber-\'umrah, maka tidak ada dosa baginya mengerjakan sa\'i antara keduanya. Dan barangsiapa yang mengerjakan suatu kebajikan dengan kerelaan hati, maka sesungguhnya Allah Maha Mensyukuri kebaikan lagi Maha Mengetahui" [QS Al-Baqarah: 125]',
          },
          {
            order: 17,
            heading: 'Bacaan Ketika Memulai Sa\'i',
            arabicText: 'أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
            latinText: 'Abda\'u bima bada\'allaahu bihi',
            translation: 'Aku memulai dengan apa yang Allah mulai darinya',
          },
          {
            order: 18,
            heading: 'Doa Ketika di Shafa dan Marwa',
            repeatNote: '[dibaca 3x]',
            arabicText: 'الله أكبر الله أكبر الله أكبر. لا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيْتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
            latinText: 'Allahu akbar, Allahu akbar, Allahu akbar. Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul mulku wa lahul ḥamdu, yuḥyī wa yumīt, wa huwa \'alā kulli syai\'in qadīr. Laa ilaaha illallaahu wahdahu laa syariikalah, anjaza wa\'dahu, wa nashara \'abdahu, wa hazamal-ahzaaba wahdah.',
            translation: '"Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Tiada Ilah selain Allah dan tiada sekutu baginya, baginya segenap kerajaan dan segala pujian, Dia yang menghidupkan dan yang mematikan dan Dia maha mampu atas segala sesuatu, tiada Ilah selain Allah semata dan tidak ada sekutu baginya, Dia memenuhi janji-Nya, Dia membela Hamba-Nya dan Ia kalahkan sendiri musuh-musuh-Nya" [dibaca 3 x]\n\nDan disela-sela itu berdoa; jadi caranya ialah berdzikir seperti diatas, kemudian doa, berdzikir lagi, lalu doa dan ditutup dengan dzikir (tiga kali dzikir dan dua kali doa)',
          },
          {
            order: 19,
            heading: 'Doa Ketika Sa\'i',
            arabicText: 'رَبِّ اغْفِرْ وَارْحَمْ إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ',
            latinText: 'Rabbighfir warham, innaka antal a\'azzul akram',
            translation: 'Ya Tuhanku, Ampunilah dan rahmatilah aku, sesungguhnya Engkau Maha Perkasa lagi Maha Mulia',
          },
          {
            order: 20,
            heading: 'Doa Keluar Masjid',
            arabicText: 'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُوْلِ اللَّهِ اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ',
            latinText: 'Bismillahi waṣ-ṣalātu was-salāmu \'alā rasūlillāh, Allāhumma innī as\'aluka min faḍlik, Allāhumma \'aṣimnī minas-syaiṭānir-rajīm',
            translation: 'Dengan nama Allah, semoga sha-lawat dan salam terlimpahkan kepada Rasulullah. Ya Allah, sesungguhnya aku minta kepadaMu dari karuniaMu. Ya Allah, peliharalah aku dari godaan setan yang terkutuk.',
          },
        ],
      },
      {
        id: 'umrah-4',
        title: 'Ziarah Madinah',
        category: 'Umrah',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Adab Masuk Madinah',
            body: '1. Memperbanyak bacaan shalawat sepanjang perjalanan disertai dengan hati yang hudlur.\n2. Mandi, berwudhu, dan membersihkan diri diniatkan untuk memasuki Madinah. Jika tidak memungkinkan dikerjakan sebelum memasuki Madinah, maka boleh dikerjakan sesampainya di hotel.\n3. Memasuki Madinah dengan penuh tawadhu’, ta’dhim, dan berdoa.\n4. Senantiasa menghadirkan keagungan kota Madinah.\n5. Bersedekah ketika di Madinah semampunya.',
          },
          {
            order: 2,
            heading: 'Adab Di Raudah Makam Rasulullah ﷺ',
            body: '1. Bersabar saat berdesakan, menghindari menyakiti orang lain saat berdesakan.\n2. Shalat Tahiyatul Masjid di samping mimbar atau di bagian lain di dalam masjid, rakaat pertama membaca surah Al-Kaafiruun dan rakaat kedua membaca surah Al-Ikhlash.\n3. Panjatkan rasa syukur pada Allah Subhanahu wa ta\'ala atas nikmat yang telah diterima, serta berdoa memohon kesempurnaan tujuan hati juga diterimanya ziarah ini.\n4. Ziarah ke makam Rasulullah ﷺ, Abu Bakar Ash-Shiddiq radhiyallahu \'anhu, dan Umar bin Khattab radhiyallahu \'anhu.\n5. Menjauh dari makam dengan jarak paling sedikit kurang lebih 2 (dua) meter.\n6. Khusyuk dan khidmat penuh pengagungan pada Rasulullah ﷺ yang berada di hadapannya.\n7. Mengucapkan salam dengan suara sedang tanpa mengeraskannya, serta bersikap tenang.\n8. Mengucapkan salam kepada sahabat Abu Bakar Ash-Shiddiq radhiyallahu \'anhu.\n9. Mengucapkan salam pada sahabat Umar bin Khattab radhiyallahu \'anhu.\n10. Kemudian mendatangi Raudhah shalat dua rakaat di dalamnya, dan memperbanyak doa sesuai dengan hajatnya.',
          },
          {
            order: 3,
            heading: 'Bacaan Salam Kepada Rasulullah ﷺ',
            arabicText: 'السَّلَامُ عَلَيْكَ يَا رَسُوْلَ اللهِ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ\n\nاللهم صل على محمد وعلى آل محمد كما صَلَّيْتَ على إِبْرَاهِيمَ وعلى آل إِبْرَاهِيمَ إنك حميد مجيد اللهم بارك على محمد وعلى آل محمد كما باركت على إِبْرَاهِيمَ وعلى آل إِبْرَاهِيمَ إنك حميد مجيد\n\nأَشْهَدُ أَنَّكَ رَسُوْلُ اللهِ حَقّاً وَأَنَّكَ قَدْ بَلَّغْتَ الرِّسَالَةَ وَأَدَّيْتَ الأَمَانَةَ وَنَصَحْتَ الأُمَّةَ وَجَاهَدْتَ فِي اللهِ حَقَّ جِهَادِهِ فَجَزَاكَ اللهُ عَنْ أُمَّتِكَ أَفْضَلُ مَا جَزَى نَبِيَّنَا عَنْ أُمَّتِهِ',
            latinText: 'Assalaamu’alaika ya Rasuulallah wa rahmatullahi wa barakaatuhu. Allahumma shalli ‘ala Muhammad wa ‘ala aali Muhammad kamaa shalayta ‘ala aali Ibrahim, innaka hamiidum majiid. Allahumma baarik ‘ala Muhammad wa ‘ala aali Muhamamd kamaa baarakta ‘ala aali Ibrahim, innaka hamiidum majid. Asyhadu annaka Rasulullahi haqqan, wa annaka qad ballaghtar risaalata, wa addaital amaanata, wa nashahtal ummata, wa jaahadta fil laahi haqqa jihaadihi, fajazaakallahu ‘ala ummatika afdhalu ma jaza nabiyyuna ‘an ummatihi.',
            translation: 'Ya Allah semoga shalawat terlimpah kepada Muhammad dan keluarga Muhammad, sebagaimana shalawat terlimpah kepada Ibrahim dan keluarga Ibrahim, Engkau Maha Terpuji lagi Maha Mulia. Ya Allah semoga keberkahan terlimpah kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau berkahi Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Aku bersaksi bahwa Engkau (Muhammad) adalah Rasulullah yang haq. Aku bersaksi bahwa Engkau (Muhammad) telah menyampaikan risalah kenabian, telah menunaikan amanah, telah menasihati umat ini, dan berjihad di jalan Allah dengan sungguh-sungguh. Semoga Allah membalasmu atas apa yang telah Engkau perbuat untuk umatmu, lebih dari balasan para Nabi atas apa yang telah mereka perbuat untuk umatnya.',
          },
          {
            order: 4,
            heading: 'Bacaan Salam Untuk Umar bin Khattab RA',
            arabicText: 'السَّلَامُ عَلَيْكَ يَا عُمَرُ الْفَارُوْقَ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ\n\nالسَّلَامُ عَلَيْكَ يَا ثَانِي الْخُلَفَاءِ الرَّاشِدِيْنَ\n\nجَزَاكَ اللهُ عَنَّا وَعَنِ الإِسْلَامِ وَالْمُسْلِمِيْنَ خَيْرَ الْجَزَاءِ',
            latinText: 'Assalaamu’alaika ya Umar al-Faaruuq wa rahmatullahi wa barakaatuh. Assalaamu’alaika ya tsaaniyal khulafaa ir roosyidiin jazaakalloohu \'annaa wa \'anil islaami wal muslimiina khoirol jazaa\'',
            translation: 'Keselamatan atasmu wahai Umar al-Faaruuq (sang pembeda antara kebenaran dan kebatilan) dan rahmat Allah serta keberkahan-Nya atasmu. Keselamatan atas mu wahai khalifah yang kedua dari para al-Khulafaa’ ar-Rosyidin. Semoga Allah memberi ganjaran bagimu atas jasamu terhadap kami, terhadap Islam dan kaum muslimin dengan ganjaran yang terbaik.',
          },
          {
            order: 5,
            heading: 'Bacaan Salam Untuk Abu Bakar Ash-Shiddiq RA',
            arabicText: 'السَّلَامُ عَلَيْكَ يَا أَبَا بَكْرِ الصِّدِّيْقِ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ\n\nالسَّلَامُ عَلَيْكَ يَا خَلِيْفَةَ رَسُوْلِ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَثَانِيَهُ فِي الْغَارِ\n\nجَزَاكَ اللهُ عَنَّا وَعَنِ الإِسْلَامِ وَالْمُسْلِمِيْنَ خَيْرَ الْجَزَاءِ',
            latinText: 'Assalaamu’alaika ya Abaa Bakr Ash Shidiiq wa rahmatullahi wa barakaatuh. Assalaamu’alaika ya kholiifata Rasuulillah shollolloohu \'alaihi wasallama wa tsaaniyahu fil ghoor jazaakalloohu \'annaa wa \'anil islaami wal muslimiina khoirol jazaa\'',
            translation: 'Keselamatan atasmu wahai Abu Bakar as-Siddiiq dan rahmat Allah serta keberkahan-Nya atasmu. Keselamatan atas mu wahai khalifah (penerus) Rasulullah shallallahu alaihi wasallam, orang yang kedua bersama Nabi di Gua (Tsaur). Semoga Allah memberi ganjaran bagimu atas jasamu terhadap kami, terhadap Islam dan kaum muslimin dengan ganjaran yang terbaik.',
          },
        ],
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
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'أَسْتَوْدِعُكُمُ اللَّهَ الَّذِي لَا تَضِيعُ وَدَائِعُهُ',
            latinText: "Astawdi'ukumullaahal-ladzii laa tadhii'u wadaa'i'uh",
            translation: '“Aku menitipkan kamu kepada Allah yang tidak akan hilang titipan-Nya.” (HR. Ahmad dan Ibnu Majah, Shahih)',
          },
        ],
      },
      {
        id: 'dzikir-2',
        title: 'Doa Keluar Rumah',
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
            latinText: "Bismillaahi tawakkaltu 'alallaah, wa laa hawla wa laa quwwata illaa billaah",
            translation: '“Dengan nama Allah (aku keluar). Aku bertawakkal kepada-Nya, dan tiada daya dan upaya kecuali karena pertolongan Allah.” (HR. Abu Dawud dan Tirmidzi)',
          },
        ],
      },
      {
        id: 'dzikir-3',
        title: 'Doa Berangkat Safar',
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اللهُ أَكْبَرُ اللهُ أَكْبَرُ اللهُ أَكْبَرُ { سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ. وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ } اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَابَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ',
            latinText: "Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhaanalladzii sakhkhara lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa robbinaa lamunqolibuun. Allahumma innaa nas-aluka fii safarinaa haadzaa al-birra wat taqwaa wa minal 'amali maa tardhaa. Allahumma hawwin 'alaynaa safaranaa haadzaa wathwi 'annaa bu'dahu. Allahumma antash-shoohibu fis-safar, wal kholiifatu fil ahli. Allahumma innii a'uudzu bika min wa'tsaa-is safari wa ka-aabatil manzhari wa suu-il munqolabi fil maali wal ahli",
            translation: '“Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Maha Suci Tuhan yang menundukkan kendaraan ini untuk kami, sedang sebelumnya kami tidak mampu. Dan sesungguhnya kami akan kembali kepada Tuhan kami (di hari Kiamat). Ya Allah! Sesungguhnya kami memohon kebaikan dan taqwa dalam bepergian ini, kami mohon perbuatan yang meridhanMu. Ya Allah! Permudahlah perjalanan kami ini, dan dekatkan jaraknya bagi kami. Ya Allah! Engkaulah teman dalam bepergian dan yang mengurusi keluarga(ku). Ya Allah! Sesungguhnya aku berlindung kepadaMu dari kelelahan dalam bepergian, pemandangan yang menyedihkan dan perubahan yang jelek dalam harta dan keluarga.” (HR. Muslim)',
          },
        ],
      },
      {
        id: 'dzikir-4',
        title: 'Doa Terhindar Wabah Penyakit',
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ',
            latinText: "Allāhumma innī a‘ūdzu bika minal barashi, wal junūni, wal judzāmi, wa sayyi’il asqāmi",
            translation: 'Ya Allah, aku berlindung kepada-Mu dari penyakit kulit belang, penyakit gila, penyakit lepra, dan penyakit yang (berakibat) buruk. (HR. Abu Dawud)',
          },
        ],
      },
      {
        id: 'dzikir-5',
        title: 'Doa Dzikir Petang',
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            heading: 'Membaca (3x)',
            repeatNote: '(3x)',
            arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
            latinText: "Bismillahillazi laa yadhurru ma’as mihi syai'un fil ardhi wala fis samaa’ wahuwas sami’ul ‘aliim",
            translation: '“Dengan menyebut nama Allah, yang dengan nama-Nya tidak ada satu pun yang membahayakan, baik di bumi maupun di langit. Dialah Yang Mahamendengar dan Maha mengetahui.” (HR. Abu Dawud 4/323 dan At-Tirmidzi 5/425)',
          },
          {
            order: 2,
            heading: 'Membaca (3 x)',
            repeatNote: '(3 x)',
            arabicText: 'رَضِيتُ بِاللَّهِ رَبّاً وَبِالإِسْلَامِ دِيناً وَبِمُحَمَّدٍ - صلى الله عليه وسلم - نَبِيّاً',
            latinText: 'Radhitu billahi rabban, wabil islami diinan, wabi muhammadin shallallahu ‘alaihi wasallam nabiyyan',
            translation: '“Aku rida Allah sebagai Rabbku (untukku dan orang lain), Islam sebagai agamaku, dan Muhammad SAW sebagai Nabiku (yang diutus oleh Allah).” (HR Ahmad 4/337)',
          },
          {
            order: 3,
            heading: 'Membaca (1 x)',
            repeatNote: '(1 x)',
            arabicText: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
            latinText: 'Yaa hayyu ya qayyum, birahmatika astaghits, wa ashlih lii sya’nii kullahu, wala takilni ilaa nafsi tharfata ‘ainin',
            translation: '“Wahai Rabb Yang Mahahidup, Wahai Rabb Yang Mahaberdiri sendiri (tidak butuh segala sesuatu), dengan rahmat-Mu aku meminta pertolongan, perbaikilah segala urusanku, dan jangan diserahkan (urusanku) kepada diriku sendiri, meskipun hanya sekejap mata (tanpa mendapat pertolongan dari-Mu).” (HR. Hakim 1/545)',
          },
          {
            order: 4,
            heading: 'Membaca (100 x)',
            repeatNote: '(100 x)',
            arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
            latinText: 'Subhaanallahu wabihamdihi',
            translation: '“Mahasuci Allah dan segala pujian hanya untuk-Nya.” (HR. Muslim 4/2071)',
          },
          {
            order: 5,
            heading: 'An-Nas (3x)',
            repeatNote: '(3x)',
            arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَهِ النَّاسِ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَ النَّاسِ',
            latinText: "Qul a'udhu birabbinnas, Malikinnas, Ilahinnas, min sharril waswāsil-khannās, alladhi yuwaswisu fī sudūrinnas, minal jinnati wannas.",
            translation: 'Katakanlah, ‘Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan (Ilah) manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada-dada manusia. Dari golongan jin dan manusia.’ (QS. An-Nas: 1-6)',
          },
          {
            order: 6,
            heading: 'Al-Ikhlas (3x)',
            repeatNote: '(3x)',
            arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
            latinText: 'Qul huwa Allahu ahad * Allahu assamad * Lam yalid walam yulad * Walam yakun lahu kufuwan ahad.',
            translation: 'Katakanlah, ‘Dialah Allah, Yang Mahaesa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.\' (QS. Al-Ikhlas: 1-4)',
          },
          {
            order: 7,
            heading: 'Membaca (10 atau 1 x)',
            repeatNote: '(10 atau 1 x)',
            arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            latinText: 'Laa ilaaha illallahu wahdahu laa syarika lahu, lahul mulku walahul hamdu wahuwa ‘ala kulli syai inq qadiir',
            translation: '“Tiada ilah yang berhak disembah, kecuali Allah. Tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian. Dia Mahakuasa atas segala sesuatu.” (HR. Abu Dawud 4/319 dan Ahmad 4/60)',
          },
          {
            order: 8,
            heading: 'Membaca (3 x)',
            repeatNote: '(3 x)',
            arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
            latinText: 'A’udzu bikalimaatillahi taammaatim min syarri maa khalaqa',
            translation: '“Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari segala macam keburukan yang diciptakan-Nya.” (HR. Ahmad 2/290)',
          },
          {
            order: 9,
            heading: 'Membaca (10 kali)',
            repeatNote: '(10 kali)',
            arabicText: 'اللَّهُمَّ صَلِّ وَسَلَّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
            latinText: 'Allahumma shalli wa sallim ala nabiyyina muhammadin',
            translation: '“Semoga keselamatan dan rahmat Allah senantiasa tercurah kepada Nabi kita, Muhammad.” (HR. Thabrani, Shahih At-Targhib wat-Tarhib 1/273)',
          },
          {
            order: 10,
            heading: 'Membaca (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
            latinText: 'Allahumma bika amsainana wabika ashbahna wabika nahyaa, wabika namuutu wa ilaikal mashiir',
            translation: '“Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu sore dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali (bagi semua makhluk).” (HR. At Tirmidzi 3/142)',
          },
          {
            order: 11,
            heading: 'Membaca (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَوَاتِ وَالأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءاً أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
            latinText: 'Allahumma ‘aalimal ghaibi wasy syahadah faatiras samaawaati wal ardh, Rabba kulli syai’in wamaliikahu, asyhadu an laa ilaaha illa anta, a’udzubika min syarri nafsii, wamin syarrisy syaithani wa syirkihi, wa an aqtarifa ‘ala nafsii suu’an aw ajurruhu ila muslim',
            translation: '“Ya Allah Yang Mahamengetahui yang gaib dan yang nyata, wahai Rabb Pencipta langit dan bumi, Rabb atas segala sesuatu dan Yang Merajinya. Aku bersaksi bahwa tidak ada Ilah yang berhak diibadahi dengan benar, kecuali Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, setan, dan ajakannya menyekutukan Allah (aku berlindung kepada-Mu) dari berbuat kejelekan atas diriku atau mendorong seorang muslim kepadanya.” (HR. At-Tirmidzi 3/142)',
          },
          {
            order: 12,
            heading: 'Sayyidul Istighfar (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
            latinText: 'Allahumma anta Rabbi laa ilaaha illa anta, khalaqtani wa ana ‘abduka,wa ana ‘ala ‘ahdika wa wa’dika mas tatha’tu, a’udzubika min syarri maa shana’tu, abuu’u laka bini’matika ‘alayya wa abuu’u bizanbi faghfirliy fainnahu laa yaghfirudz dzunuba illa anta',
            translation: '“Ya Allah, Engkau adalah Rabbku, tidak ada Ilah (yang berhak diibadahi dengan benar), kecuali Engkau. Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan (apa) yang kuperbuat. Aku mengakui nikmat-Mu (yang diberikan) kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tidak ada yang dapat mengampuni dosa, kecuali Engkau.” (HR. Bukhari 7/150, An-Nasai 9752, dan At-Tirmidzi 3391)',
          },
          {
            order: 13,
            heading: "Ta'awwudz",
            arabicText: 'أَعُوْذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
            latinText: 'A\'udhu billahi minash shaytanir rajiim',
            translation: 'Aku berlindung kepada Allah yang Maha Mendengar lagi Maha Mengetahui dari godaan syaitan yang terkutuk.',
          },
          {
            order: 14,
            heading: 'Ayat Kursi (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
            latinText: 'Allahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta’khudzuhuu sinatuw walaa naum. Lahuu maa fissamaawaati wa maa fil ardhi man dzal ladzii yasyfa’u ‘indahuu illaa biidznih, ya’lamu maa baina aidiihim wamaa khalfahum wa laa yuhiithuuna bisyai’im min ‘ilmihii illaa bimaa syaa’, wasi’a kursiyyuhus samaawaati wal ardho walaa ya’uuduhuu hifdhuhumaa wahuwal ‘aliyyul ‘adhiim',
            translation: 'Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Mahatinggi lagi Mahabesar. (QS. Al-Baqarah: 255)',
          },
          {
            order: 15,
            heading: 'Al-Falaq (3x)',
            repeatNote: '(3x)',
            arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
            latinText: "Qul a'udhu birabbil-falaq, min sharri ma khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharrin-naffāthāti fil-'uqad, wa min sharri hāsidin idhā hasad",
            translation: 'Katakanlah, ‘Aku berlindung kepada Rabb Yang menguasai (waktu) subuh dari kejahatan makhluk-Nya. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Serta dari kejahatan orang yang dengki apabila dia dengki.’ (QS. Al-Falaq: 1-5)',
          },
          {
            order: 16,
            heading: 'Membaca (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
            latinText: 'Allahumma inni amsaitu usyhiduka wa usyhidu hamalata ‘arsyika, wamalaa’ikataka, wajami’i khalqika, annaka antallahu laa ilaaha illa anta wahdaka laa syariikalaka, wa anna muhammadan ‘abduka warusuuluka',
            translation: '“Ya Allah, sesungguhnya di waktu sore ini aku mempersaksikan Engkau, malaikat yang memikul Arsy-Mu, malaikat lain dan seluruh makhluk-Mu. Bahwa Engkau adalah Allah yang tiada ilah yang berhak disembah, kecuali Engkau, Engkau Mahaesa dan tiada sekutu bagi-Mu. Dan bahwasanya Muhammad adalah hamba dan utusan-Mu.” (HR. Abu Dawud 4/317)',
          },
          {
            order: 17,
            heading: 'Membaca (1x)',
            repeatNote: '(1x)',
            arabicText: 'أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
            latinText: 'Amsaynaa wa amsal mulku lillaahi walhamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qadiir. Robbi as-aluka khoiro maa fii haadzal yaum wa khoiro maa ba’dahu, wa a’uudzu bika min syarri maa fii haadzal yaum wa syarri maa ba’dahu. Robbi a’uudzu bika minal kasali wa suu-il kibar, Robbi a’uudzu bika min ‘adzaabin fin-naari wa ‘adzaabin fil qabr',
            translation: '“Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik-Nya lah kerajaan dan bagi-Nya segala pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabbku, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Dan aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepada-Mu dari rasa malas dan keburukan masa tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksa di neraka dan siksa di kubur.” (HR. Muslim 4/2088)',
          },
          {
            order: 18,
            heading: 'Membaca (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
            latinText: 'Allahumma inni as’alukal ‘afwa wal-‘aafiyata fid dunyaa wal-aakhirah, allahumma as’alukal ‘afwa wa ‘aafiyata fii diini wa dunyaaya wa ahlii wa maali, allahummastur ‘auraati wa aamin rau’aati, allahummahfadzniy min bayni yadayya wa min khalfii wa ‘an yamiinii wa ‘an syimaalii wa min fawqii, wa a’uudzu bi’azhamatika an ughtaala min tahtii',
            translation: '“Ya Allah, sesungguhnya aku memohon ampunan dan keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon ampunan dan keselamatan dalam agamaku, duniaku, keluargaku, dan hartaku. Ya Allah, tutupilah auratku (aib dan aurat) dan amankanlah ketakutanku. Ya Allah, jagalah aku dari arah depanku, dari belakangku, dari kanan dan kiriku, serta dari atasku. Dan aku berlindung dengan keagungan-Mu dari diserang/dibenamkan dari bawahku.” (HR. Abu Dawud dan Ibnu Majah)',
          },
        ],
      },
      {
        id: 'dzikir-6',
        title: 'Doa Dzikir Pagi',
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            heading: 'Dzikir Kecukupan (7x)',
            repeatNote: '(Dibaca 7x)',
            arabicText: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
            latinText: 'Hasbiyallahu la ilaha illa huwa alaihi tawakkaltu wa huwa rabbul-arsyil-azhim.',
            translation: '“Allah-lah yang mencukupi (segala kebutuhanku), tiada Tuhan (yang berhak disembah) kecuali Dia, kepada-Nya aku bertawakal. Dia-lah Tuhan yang menguasai \'Arsy yang agung.” (Dibaca 7x, HR. Abu Dawud)',
          },
          {
            order: 2,
            heading: "Ta'awwudz",
            arabicText: 'أَعُوْذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
            latinText: 'A\'uudzu billaahi minasy-syaithaanir-rajiim.',
            translation: '“Aku berlindung kepada Allah dari godaan syaitan yang terkutuk.”',
          },
          {
            order: 3,
            heading: 'Ayat Kursi (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
            latinText: 'Allahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta’khudzuhuu sinatuw walaa naum. Lahuu maa fissamaawaati wa maa fil ardhi man dzal ladzii yasyfa’u ‘indahuu illaa biidznih, ya’lamu maa baina aidiihim wamaa khalfahum wa laa yuhiithuuna bisyai’im min ‘ilmihii illaa bimaa syaa’, wasi’a kursiyyuhus samaawaati wal ardho walaa ya’uuduhuu hifdhuhumaa wahuwal ‘aliyyul ‘adhiim',
            translation: '“Allah, tidak ada ilah (yang berhak disembah) melainkan Dia, yang hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Mahatinggi lagi Mahabesar.” (QS. Al-Baqarah: 255)\n\nFaedah: Siapa yang membacanya di pagi hari akan dilindungi dari godaan jin hingga petang.',
          },
          {
            order: 4,
            heading: 'Surat Al-Ikhlas (3x)',
            repeatNote: '(3x)',
            arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ  اللَّهُ الصَّمَدُ  لَمْ يَلِدْ وَلَمْ يُولَدْ  وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
            latinText: 'Bismillaahir-rohmaanir-rohiim. Qul huwallaahu ahad. Allaahush-shamad. Lam yalid wa lam yuulad. Wa lam yakul-lahuu kufuwan ahad.',
            translation: '“Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.” (QS. Al-Ikhlas: 1-4)',
          },
          {
            order: 5,
            heading: 'Surat Al-Falaq (3x)',
            repeatNote: '(3x)',
            arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ  مِنْ شَرِّ مَا خَلَقَ  وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ  وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ  وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
            latinText: 'Bismillaahir-rohmaanir-rohiim. Qul a\'uudzu birobbil-falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin-naffaatsaati fil-\'uqad. Wa min syarri haasidin idzaa hasad.',
            translation: '“Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki.” (QS. Al-Falaq: 1-5)',
          },
          {
            order: 6,
            heading: 'Surat An-Naas (3x)',
            repeatNote: '(3x)',
            arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ  مَلِكِ النَّاسِ  إِلَٰهِ النَّاسِ  مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ  الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ  مِنَ الْجِنَّةِ وَالنَّاسِ',
            latinText: 'Bismillaahir-rohmaanir-rohiim. Qul a\'uudzu birobbin-naas. Malikin-naas. Ilaahin-naas. Min syarril-waswaasil-khannaas. Alladzii yuwaswisu fii shuduurin-naas. Minal-jinnati wan-naas.',
            translation: '“Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari golongan jin dan manusia.” (QS. An-Naas: 1-6)',
          },
          {
            order: 7,
            heading: 'Doa Memohon Kebaikan & Perlindungan (3x)',
            repeatNote: '(3x)',
            arabicText: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
            latinText: 'Allahumma ‘aafinii fii badanii, allahumma ‘aafinii fii sam’ii, allahumma ‘aafinii fii bashorii, laa ilaaha illaa anta. Allahumma innii a’uudzu bika minal kufri wal faqri, wa a’uudzu bika min ‘adzaabil qobri, laa ilaaha illaa anta.',
            translation: '“Ya Allah! Selamatkan tubuhku (dari penyakit dan yang tidak aku inginkan). Ya Allah, selamatkan pendengaranku (dari penyakit dan maksiat). Ya Allah, selamatkan penglihatanku, tiada Tuhan (yang berhak disembah) kecuali Engkau. Ya Allah! Sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur, tiada Tuhan (yang berhak disembah) kecuali Engkau.” (HR. Abu Dawud 4/324)',
          },
          {
            order: 8,
            heading: 'Dzikir Perlindungan Segala Arah (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
            latinText: 'Allahumma innii as-alukal ‘afwa wal ‘aafiyata fid-dunyaa wal-aakhirah. Allahumma innii as-alukal ‘afwa wal ‘aafiyata fii diinii wa dunyaaya wa ahlii wa maalii. Allahummastur ‘awrootii wa aamin row’aatii. Allahummahfazhnii mim bayni yadayya, wa min kholfii, wa ‘an yamiinii, wa ‘an syimaalii, wa min fawqii, wa a’uudzu bi ‘azhomatika an ughtaala min tahtii.',
            translation: '“Ya Allah! Sesungguhnya aku memohon ampunan dan keselamatan di dunia dan akhirat. Ya Allah! Sesungguhnya aku memohon ampunan dan keselamatan dalam agamaku, duniaku, keluargaku, dan hartaku. Ya Allah, tutupilah auratku (aib dan aurat) dan amankanlah ketakutanku. Ya Allah, jagalah aku dari arah depanku, dari belakangku, dari kanan dan kiriku, serta dari atasku. Dan aku berlindung dengan keagungan-Mu dari diserang/dibenamkan dari bawahku.” (HR. Abu Dawud dan Ibnu Majah)',
          },
          {
            order: 9,
            heading: 'Dzikir Memasuki Waktu Pagi (1x)',
            repeatNote: '(1x)',
            arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
            latinText: 'Ashbahnaa wa ashbahal mulku lillaah, walhamdulillah, laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir. Robbi as-aluka khoiro maa fii haadzal yaum wa khoiro maa ba’dahu, wa a’uudzu bika min syarri maa fii haadzal yaum wa syarri maa ba’dahu. Robbi a’uudzu bika minal kasali wa suu-il kibar. Robbi a’uudzu bika min ‘adzaabin fin-naari wa ‘adzaabin fil qobr.',
            translation: '“Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabbku, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepada-Mu dari kemalasan dan keburukan masa tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksa di neraka dan siksa di kubur.” (HR. Muslim 4/2088)',
          },
          {
            order: 10,
            heading: 'Dzikir Tawakal Memasuki Pagi (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
            latinText: 'Allahumma bika ashbahnaa wa bika amsaynaa wa bika nahyaa wa bika namuutu wa ilaykan-nusyur.',
            translation: '“Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali (kebangkitan bagi semua makhluk).” (HR. At-Tirmidzi 3/142)',
          },
          {
            order: 11,
            heading: 'Sayyidul Istighfar (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عهدك وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
            latinText: 'Allahumma anta Rabbii laa ilaaha illaa anta, khalaqtanii wa ana ‘abduka, wa ana ‘alaa ‘ahdika wa wa’dika mastatha’tu, a’uudzu bika min syarri maa shana’tu, abuu-u laka bini’matika ‘alayya wa abuu-u bidzanbii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illaa anta.',
            translation: '“Ya Allah, Engkau adalah Rabbku, tidak ada ilah yang berhak disembah kecuali Engkau. Engkaulah yang menciptakanku dan aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Maka ampunilah aku, sesungguhnya tidak ada yang dapat mengampuni dosa selain Engkau.” (HR. Bukhari 7/150)',
          },
          {
            order: 12,
            heading: 'Ikrar Persaksian Pagi (4x)',
            repeatNote: '(4x)',
            arabicText: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
            latinText: 'Allahumma innii ashbahtu usyhiduka wa usyhidu hamalata ‘arsyika, wa malaa-ikataka, wa jamii’a khalqika, annaka antallaahu laa ilaaha illaa anta wahdaka laa syariika laka, wa anna Muhammadan ‘abduka wa rasuuluk.',
            translation: '“Ya Allah, sesungguhnya di waktu pagi ini aku mempersaksikan Engkau, malaikat pemikul \'Arsy-Mu, para malaikat-Mu, dan segenap makhluk-Mu, bahwasanya Engkaulah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu, dan bahwasanya Muhammad adalah hamba dan utusan-Mu.” (HR. Abu Dawud 4/317)',
          },
          {
            order: 13,
            heading: 'Pengakuan atas Nikmat Pagi (1x)',
            repeatNote: '(1x)',
            arabicText: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
            latinText: 'Allahumma maa ashbaha bii min ni\'matin aw bi-ahadin min khalqika faminka wahdaka laa syariika laka, falakal hamdu walakasy-syukr.',
            translation: '“Ya Allah, nikmat apa pun yang ada padaku atau pada salah seorang dari makhluk-Mu di pagi hari ini, adalah semata-mata dari-Mu, tiada sekutu bagi-Mu. Maka bagi-Mu lah segala pujian dan bagi-Mu lah segala rasa syukur.” (HR. Abu Dawud)',
          },
        ],
      },
      {
        id: 'dzikir-7',
        title: 'Doa Masuk Rumah',
        category: 'Doa dan Dzikir',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            heading: 'Doa Masuk Rumah (Setelah Haji/Safar)',
            arabicText: 'بِسْمِ اللَّهِ',
            // (Unused: The full with ejaan indonesia) arabicText: 'بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ، وَالْحَمْدُ لِلَّهِ الَّذِي لَا يَمُوتُ وَلَا يَفُوتُ، نَحْمَدُكَ اللَّهُمَّ بِمَنَاسِكِنَا أَدَاءً وَبِسُنَّةِ نَبِيِّكَ اتِّبَاعًا، تَوْبًا لِرَبِّنَا، أَوْبًا لَا يُغَادِرُ عَلَيْنَا حَوْبًا. اللَّهُمَّ اغْفِرْ لَنَا وَلِمَنِ اسْتَغْفَرْنَا لَهُ مِنْ أَهْلِ بَيْتِنَا وَإِخْوَانِنَا وَجَمِيعِ الْمُسْلِمِينَ وَالْمُسْلِمَاتِ يَا عَزِيزُ يَا غَفَّارُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ',
            latinText: 'Bismillaah.',
            // (Unused: The full with ejaan indonesia) latinText: 'Bismillaahir-rohmaanir-rohiim, wal hamdu lillaahil-ladzii laa yamuutu wa laa yafuutu, nahmadukallaahumma bimanaasikinaa adaa-an wa bisunnati nabiyyikat-tibaa-‘an, tawban lirobbinaa, awban laa yughoodiru ‘alaynaa hawbaa. Allaahummagh-fir lanaa wa limanis-taghfarnaa lahu min ahli baytinaa wa ikhwaaninaa wa jamii-‘il muslimiina wal muslimaat yaa ‘Aziizu yaa Ghaffaaru birohmatika yaa Arhamar-roohimiin.',
            translation: '“Dengan nama Allah (aku mengucapkan salam dan masuk rumah).”',
            // (Unused: The full with ejaan indonesia) translation: '“Dengan nama Allah Yang Mahapengasih dan Mahapenyayang. Segala puji hanya tertuju kepada Allah yang tidak akan pernah mati dan sirna selamanya. (Sesungguhnya) kami bertahmid kepada-Mu Ya Allah dengan ibadah Manasik (haji/umrah) kami yang telah kami selesaikan dan dengan Sunnah Nabi-Mu yang telah kami jalani. Kami bertaubat, kami bertaubat, kami bertaubat kepada Allah, kami mengharap taubat yang diterima, kami tidak akan mengulangi dosa-dosa lagi. Ya Allah ampunilah kami dan orang-orang yang kami mintakan ampunan kepada-Mu dari ahli bait kami, saudara-saudara kami, dan seluruh kaum muslimin dan muslimat, wahai Dzat Yang Mahaperkasa lagi Maha Pengampun, dengan rahmat-Mu wahai Dzat Yang Paling Penyayang di antara para penyayang.”',
          },
        ],
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
        category: 'Puasa',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
            latinText: "Dzahabazh zhoma'u wabtallatil 'uruqu wa tsabatal ajru insya Allah",
            translation: '“Telah hilang dahaga, urat-urat telah basah, dan telah diraih pahala, insya Allah.”',
          },
        ],
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
        category: 'Wudhu',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'بِسْمِ اللَّهِ',
            latinText: 'Bismillah',
            translation: 'Dengan nama Allah (aku berwudhu).',
          },
        ],
      },
      {
        id: 'wudhu-2',
        title: 'Doa Setelah Wudhu',
        category: 'Wudhu',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
            latinText: 'Subhanakallahumma wabihamdika asyhadu an laa ilaaha illa anta astaghfiruka wa atuubu ilaika.',
            translation: '“Maha Suci Engkau, ya Allah, aku memuji kepada-Mu. Aku bersaksi, bahwa tiada Tuhan yang haq untuk disembah selain Engkau, aku minta ampunan dan bertaubat kepada-Mu.”',
          },
          {
            order: 2,
            arabicText: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
            latinText: "Allahummaj'alnii minat-tawwaabiina, waj'alnii minal-mutathahhiriina.",
            translation: '“Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang (yang senang) bersuci.”',
          },
          {
            order: 3,
            arabicText: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
            latinText: "Asyhadu allaa ilaaha illallaah, wahdahu laa syariika lahu, wa asyhadu anna Muhammadan 'abduhu wa Rasuuluh.",
            translation: '“Aku bersaksi, bahwa tiada Tuhan yang haq kecuali Allah, Yang Maha Esa dan tiada sekutu bagi-Nya. Aku bersaksi, bahwa Muhammad adalah hamba dan utusan-Nya.”',
          },
        ],
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
        category: 'Shalat',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
            latinText: 'SUBHAANAKALLOHUMMA WA BI HAMDIKA WA TABAAROKASMUKA WA TA’AALAA JADDUKA WA LAA ILAHA GHOIRUKA',
            translation: 'Maha suci Engkau ya Allah, aku memuji-Mu, Maha berkah Nama-Mu. Maha tinggi kekayaan dan kebesaran-Mu, tidak ada sesembahan yang berhak diibadahi dengan benar selain Engkau.',
          },
          {
            order: 2,
            arabicText: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
            latinText: 'ALLOHUMMA BAA’ID BAYNII WA BAYNA KHOTHOYAAYA KAMAA BAA’ADTA BAYNAL MASYRIQI WAL MAGHRIB. ALLOHUMMA NAQQINII MIN KHOTHOYAAYA KAMAA YUNAQQOTS TSAUBUL ABYADHU MINAD DANAS. ALLOHUMMAGH-SILNII MIN KHOTHOYAAYA BIL MAA-I WATS TSALJI WAL BAROD',
            translation: 'Ya Allah, jauhkanlah antara aku dan kesalahan-kesalahanku, sebagaimana Engkau menjauhkan antara timur dan barat. Ya Allah, bersihkanlah aku dari kesalahan-kesalahanku sebagaimana baju putih dibersihkan dari kotoran. Ya Allah, cucilah aku dari kesalahan-kesalahanku dengan air, salju dan embun.',
          },
          {
            order: 3,
            arabicText: 'اللَّهُمَّ رَبَّ جَبْرَائِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ فَاطِرَ السَّمَوَاتِ وَالأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيمَا كَانُوا فِيهِ يَخْتَلِفُونَ اِهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ إِنَّكَ تَهْدِي مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيمٍ',
            latinText: 'ALLOHUMMA ROBBA JIBROO-IILA WA MII-KA-IILA WA ISROOFIILA, FAATHIROS SAMAAWAATI WAL ARDHI ‘ALIIMAL GHOIBI WASY SYAHAADAH ANTA TAHKUMU BAYNA ‘IBAADIKA FIIMAA KAANUU FIIHI YAKHTALIFUUN, IHDINII LIMAKHTULIFA FIIHI MINAL HAQQI BI-IDZNIK, INNAKA TAHDI MAN TASYAA-U ILAA SHIROOTIM MUSTAQIIM',
            translation: 'Ya Allah, Rabbnya Jibril, Mikail dan Israfil. Wahai Pencipta langit dan bumi. Wahai Rabb yang mengetahui yang ghaib dan nyata. Engkau yang menjatuhkan hukum untuk memutuskan apa yang mereka pertentangkan. Tunjukkanlah aku pada kebenaran apa yang dipertentangkan dengan seizin dari-Mu. Sesungguhnya Engkau menunjukkan pada jalan yang lurus bagi orang yang Engkau kehendaki.',
          },
        ],
      },
      {
        id: 'shalat-2',
        title: 'Dzikir Setelah Shalat',
        category: 'Shalat',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            heading: 'An-Nas',
            arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَهِ النَّاسِ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَ النَّاسِ',
            latinText: 'Qul a\'udhu birabbinnas, Malikinnas, Ilahinnas, min sharril waswāsil-khannās, alladhi yuwaswisu fī sudūrinnas, minal jinnati wannas.',
            translation: 'Katakanlah, ‘Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan (Ilah) manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada-dada manusia. Dari golongan jin dan manusia.’ (QS. An-Nas: 1-6)',
          },
          {
            order: 2,
            repeatNote: '(3x)',
            arabicText: '(3x) أَسْتَغْفِرُ اللَّهَ\n\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
            latinText: 'Astaghfirullah (3x). Allahumma antas salaam wa minkas salaam tabaarokta yaa dzal jalaali wal ikrom.',
            translation: '“Aku minta ampun kepada Allah,” (3x). Lantas membaca: “Ya Allah, Engkau pemberi keselamatan, dan dariMu keselamatan, Maha Suci Engkau, wahai Tuhan Yang Pemilik Keagungan dan Kemuliaan” (HR. Muslim no. 591).',
          },
          {
            order: 3,
            arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
            latinText: 'Laa ilaha illallah wahdahu laa syarika lah, lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir. Allahumma laa maani’a lima a’thoita wa laa mu’thiya limaa mana’ta wa laa yanfau dzal jaddi minkal jaddu.',
            translation: '“Tiada Rabb yang berhak disembah selain Allah Yang Maha Esa, tidak ada sekutu bagiNya. BagiNya puji dan bagiNya kerajaan. Dia Maha Kuasa atas segala sesuatu. Ya Allah, tidak ada yang mencegah apa yang Engkau berikan dan tidak ada yang memberi apa yang Engkau cegah. Tidak berguna kekayaan dan kemuliaan itu bagi pemiliknya (selain iman dan amal shalihnya yang menyelamatkan dari siksaan). Hanya dari-Mu kekayaan dan kemuliaan” (HR. Bukhari no. 6615, Muslim no. 593).',
          },
          {
            order: 4,
            arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَلَا نَعْبُدُ إِلَّا إِيَّاهُ لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ',
            latinText: 'Laa ilaha illallah wahdahu laa syarika lah. Lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir. Laa hawla wa laa quwwata illa billah. Laa ilaha illallah wa laa na’budu illa iyyah. Lahun ni’mah wa lahul fadhl wa lahuts tsanaaul hasan. Laa ilaha illallah mukhlishiina lahud diin wa law karihal kaafiruun.',
            translation: '“Tiada Rabb (yang berhak disembah) kecuali Allah, Yang Maha Esa, tidak ada sekutu bagiNya. BagiNya kerajaan dan pujaan. Dia Mahakuasa atas segala sesuatu. Tidak ada daya dan kekuatan kecuali (dengan pertolongan) Allah. Tiada Rabb (yang hak disembah) kecuali Allah. Kami tidak menyembah kecuali kepadaNya. Bagi-Nya nikmat, anugerah dan pujaan yang baik. Tiada Rabb (yang hak disembah) kecuali Allah, dengan memurnikan ibadah kepadaNya, sekalipun orang-orang kafir sama benci” (HR. Muslim no. 594).',
          },
          {
            order: 5,
            repeatNote: '(33x)',
            arabicText: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ (33 ×)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            latinText: 'Subhanallah wal hamdulillah wallahu akbar (33 x). Laa ilaha illallah wahda, laa syarika lah. Lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir.',
            translation: '“Maha Suci Allah, segala puji bagi Allah, dan Allah Maha Besar (33 x). Tidak ada Rabb (yang berhak disembah) kecuali Allah Yang Maha Esa, tidak ada sekutu bagiNya. BagiNya kerajaan. BagiNya pujaan. Dia-lah Yang Mahakuasa atas segala sesuatu” (HR. Muslim no. 597).',
          },
          {
            order: 6,
            heading: 'Al-Ikhlas',
            arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
            latinText: 'Qul huwa Allahu ahad * Allahu assamad * Lam yalid walam yulad * Walam yakun lahu kufuwan ahad.',
            translation: 'Katakanlah, ‘Dialah Allah, Yang Mahaesa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.\' (QS. Al-Ikhlas: 1-4)',
          },
          {
            order: 7,
            heading: 'Al-Falaq',
            arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
            latinText: 'Qul a\'udhu birabbil-falaq, min sharri ma khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharrin-naffāthāti fil-\'uqad, wa min sharri hāsidin idhā hasad',
            translation: 'Katakanlah, ‘Aku berlindung kepada Rabb Yang menguasai (waktu) subuh dari kejahatan makhluk-Nya. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Serta dari kejahatan orang yang dengki apabila dia dengki.\' (QS. Al-Falaq: 1-5)',
          },
          {
            order: 8,
            heading: 'Ayat Kursi',
            arabicText: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
            latinText: 'Allahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta’khudzuhuu sinatuw walaa naum. Lahuu maa fissamaawaati wa maa fil ardhi man dzal ladzii yasyfa’u ‘indahuu illaa biidznih, ya’lamu maa baina aidiihim wamaa khalfahum wa laa yuhiithuuna bisyai’im min ‘ilmihii illaa bimaa syaa’, wasi’a kursiyyuhus samaawaati wal ardho walaa ya’uuduhuu hifdhuhumaa wahuwal ‘aliyyul ‘adhiim',
            translation: 'Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Mahatinggi lagi Mahabesar. (QS. Al-Baqarah: 255)',
          },
          {
            order: 9,
            repeatNote: '(10x Maghrib & Subuh)',
            arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. 10× بعد صلاة المغرب والصبح',
            latinText: 'Laa ilaha illallah wahdahu laa syarika lah. Lahul mulku wa lahul hamdu yuhyi wa yumiit wa huwa ‘ala kulli syai-in qodiir.',
            translation: '“Tiada Rabb yang berhak disembah kecuali Allah Yang Maha Esa, tiada sekutu bagiNya, bagiNya kerajaan, bagi-Nya segala puja. Dia-lah yang menghidupkan (orang yang sudah mati atau memberi roh janin yang akan dilahirkan) dan yang mematikan. Dia-lah Yang Mahakuasa atas segala sesuatu.” (Dibaca 10 x setiap sesudah shalat Maghrib dan Subuh).',
          },
          {
            order: 10,
            arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
            latinText: 'Allahumma inni as-aluka ‘ilman naafi’a, wa rizqon thoyyiba, wa ‘amalan mutaqobbala.',
            translation: '“Ya Allah, sesungguhnya aku mohon kepadaMu ilmu yang bermanfaat, rezeki yang halal dan amal yang diterima.” (Dibaca setelah salam shalat Shubuh) (HR. Ibnu Majah no. 762, dishahihkan Al Albani dalam Shahih Ibni Majah).',
          },
        ],
      },
      {
        id: 'shalat-3',
        title: "Doa I'tidal",
        category: 'Shalat',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'مِلْءَ السَّمَوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ أَهْلَ الثَّنَاءِ وَالْمَجْدِ أَحَقُّ مَا قَالَ الْعَبْدُ وَكُلُّنَا لَكَ عَبْدٌ اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
            latinText: 'Allahumma rabbanaa lakal hamdu mil’as samaawaati wamil al-ardli wa mil a maa syi’ta min syai in ba’du ahlats tsanaa’i wal majdi ahaqqu ma qaalal ‘abdu wa kullunaa laka ‘abdun. Allahumma laa maani’a limaa a’thaita walaa mu’thia limaa mana’ta walaa yanfa’u dzal jaddi minkal jaddu',
            translation: '(Aku memujiMu dengan) pujian sepenuh langit dan sepenuh bumi, sepenuh apa yang di antara keduanya, sepenuh apa yang Engkau kehendaki setelah itu. Wahai Tuhan yang layak dipuji dan diagungkan, Yang paling berhak dikatakan oleh seorang hamba dan kami seluruhnya adalah hamba-Mu. Ya Allah tidak ada yang dapat menghalangi apa yang Engkau berikan dan tidak ada pula yang dapat memberi apa yang Engkau halangi, tidak bermanfaat kekayaan bagi orang yang memilikinya (kecuali iman dan amal shalihnya), hanya dariMu kekayaan itu.',
          },
          {
            order: 2,
            arabicText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
            latinText: 'SAMI’ALLOOHU LIMAN HAMIDAH',
            translation: 'Allah mendengar orang yang memuji-Nya.',
          },
          {
            order: 3,
            arabicText: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
            latinText: 'Hamdan Katsīran Thayyiban Mubārakan Fīhi',
            translation: 'Ya Allah ya Tuhan kami, segala puji bagi Allah, pujian yang banyak, lagi baik, dan penuh keberkahan.',
          },
        ],
      },
      {
        id: 'shalat-4',
        title: "Doa Ruku'",
        category: 'Shalat',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            repeatNote: '(3x)',
            arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ (3x)',
            latinText: 'Subhaana robbiy al ‘azhim (3x)',
            translation: '“Maha suci Allah yang Maha Agung dan segala puji bagiMu”',
          },
          {
            order: 2,
            arabicText: 'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي',
            latinText: 'Subhaanakallahumma rabbanaa wa bihamdika, allahummaghfirli',
            translation: '“Maha Suci Engkau, ya Allah! Rabb kami, dan dengan memuji-Mu, Ya Allah! Ampunilah dosaku.”',
          },
          {
            order: 3,
            arabicText: 'سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ',
            latinText: 'Subbuhun qudduus, rabbul malaa-ikati war ruuh',
            translation: '“Engkau, Tuhan Yang Maha Suci (dari kekurangan), Maha Suci dari (hal yang tidak layak bagi kebesaranMu), Rabb para malaikat dan Jibril.”',
          },
          {
            order: 4,
            arabicText: 'اللَّهُمَّ لَكَ رَكَعْتُ وَبِكَ آمَنْتُ وَلَكَ أَسْلَمْتُ خَشَعَ لَكَ سَمْعِي وَبَصَرِي وَمُخِّي وَعَظْمِي وَعَصَبِي وَمَا اسْتَقَلَّ بِهِ قَدَمِي',
            latinText: 'Allaahumma laka roka’tu, wa bika aamantu, wa laka aslamtu, khosya’a laka sam’ii, wa bashorii, wa mukh-khii, wa ‘adzhmii, wa ‘ashobii, wa mastaqolla bihi qodamii',
            translation: '“Ya Allah, untuk-Mu aku ruku’. kepada-Mu aku beriman, kepada-Mu aku berislam. Pendengaranku, penglihatanku, sumsum tulangku, tulangku, sarafku dan apa yang berdiri di atas dua tapak kakiku, telah merunduk dengan khusyuk kepada-Mu.”',
          },
          {
            order: 5,
            arabicText: 'سُبْحَانَ ذِي الْجَبَرُوتِ وَالْمَلَكُوتِ وَالْكِبْرِيَاءِ وَالْعَظَمَةِ',
            latinText: 'Subhaana dzil jabaruuti wal malakuuti wal kibriyaa’i wa ‘azhamati',
            translation: '“Maha Suci (Allah) Yang memiliki Keperkasaan, Kerajaan, Kebesaran dan Keagungan.”',
          },
        ],
      },
      {
        id: 'shalat-5',
        title: 'Doa Sujud',
        category: 'Shalat',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            repeatNote: '(3x)',
            arabicText: 'سُبْحَانَ رَبِّيَ الْأَعْلَى (3x)',
            latinText: 'SUBHAANA ROBBIYAL A’LAA (3x)',
            translation: '“Mahasuci Rabbku Yang Mahatinggi”',
          },
        ],
      },
      {
        id: 'shalat-6',
        title: 'Doa Bacaan Duduk di antara Dua Sujud',
        category: 'Shalat',
        contentType: 'doa',
        sections: [
          {
            order: 1,
            arabicText: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
            latinText: "Robbighfirlii warhamnii wajburnii warfa'nii warzuqnii wahdinii wa'aafinii wa'fu 'annii.",
            translation: 'Ya Allah ampunilah aku, rahmatilah aku, perbaikilah keadaanku, tinggikanlah derajatku, berilah rezeki, dan petunjuk untukku.',
          },
        ],
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
        category: 'Shalat Jenazah',
        contentType: 'artikel',
        sections: [
          {
            order: 1,
            heading: 'Niat',
            body: 'Niat sholat jenazah. Dan niat adalah amalan hati tidak perlu dilafalkan.',
          },
          {
            order: 2,
            heading: 'Takbir Pertama (Membaca Al-Fatihah)',
            body: 'Takbir yang pertama, membaca ta’awwudz kemudian Al Fatihah. Dan tidak perlu membaca do’a istiftah / iftitah sebelum Al Fatihah.\n\nBerdasarkan keumuman hadits:',
            arabicText: 'لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ',
            translation: '“Tidak ada shalat yang tidak membaca Al Fatihah” (HR. Bukhari no. 756, Muslim no. 394).',
            extraArabic: 'صَلَّيْتُ خَلْفَ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا عَلَى جَنَازَةٍ، فَقَرَأَ بِفَاتِحَةِ الْكِتَابِ، قَالَ: لِيَعْلَمُوا أَنَّهَا سُنَّةٌ',
            extraTranslation: 'Kemudian riwayat dari Thalhah bin Abdillah bin Auf, ia berkata: “Aku shalat bermakmum kepada Ibnu Abbas radhiallahu’anhu dalam shalat jenazah. Beliau membaca Al Fatihah. Beliau lalu berkata: agar mereka tahu bahwa ini adalah sunnah (Nabi)” (HR. Bukhari no. 1335).',
          },
          {
            order: 3,
            heading: 'Takbir Kedua (Membaca Shalawat)',
            body: 'Takbir yang kedua, kemudian membaca shalawat kepada Nabi Shallallahu ‘alaihi wa sallam.\n\nBerdasarkan hadits dari Abu Umamah Al Bahili radhiallahu’anhu:',
            arabicText: 'أَنَّ السُّنَّةَ فِي الصَّلَاةِ عَلَى الْجِنَازَةِ أَنْ يُكَبِّرَ الْإِمَامُ، ثُمَّ يَقْرَأَ بِفَاتِحَةِ الْكِتَابِ - بَعْدَ التَّكْبِيرَةِ الْأُولَى - سِرًّا فِي نَفْسِهِ، ثُمَّ يُصَلِّيَ عَلَى النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَيُخْلِصَ الدُّعَاءَ لِلْمَيِّتِ فِي التَّكْبِيرَاتِ، لَا يَقْرَأُ فِي شَيْءٍ مِنْهُنَّ، ثُمَّ يُسَلِّمَ',
            translation: '“Bahwa sunnah dalam shalat jenazah adalah imam bertakbir kemudian membaca Al Fatihah (setelah takbir pertama) secara sirr (lirih), kemudian bershalawat kepada Nabi Shallallahu’alaihi Wasallam, kemudian berdoa untuk mayit setelah beberapa takbir. Kemudian setelah itu tidak membaca apa-apa lagi setelah itu. Kemudian salam” (HR. Asy Syafi’i dalam Musnad-nya [no. 588], Al Baihaqi dalam Sunan Al Kubra [7209], dishahihkan Al Albani dalam Ahkamul Janaiz [155]).',
          },
          {
            order: 4,
            heading: 'Takbir Ketiga (Mendoakan Mayit)',
            body: 'Takbir yang ketiga, kemudian membaca doa untuk mayit. Berdasarkan hadits Abu Umamah di atas, di antara doa yang bisa dibaca adalah:',
            arabicText: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ وَأَدْخِلْهُ الْجَنَّةَ وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ النَّارِ',
            translation: '“Ya Allah, berilah ampunan baginya dan rahmatilah dia. Selamatkanlah dan maafkanlah ia. Berilah kehormatan untuknya, luaskanlah tempat masuknya, mandikanlah ia dengan air, es dan salju. Bersihkanlah dia dari kesalahannya sebagaimana Engkau bersihkan baju yang putih dari kotoran. Gantikanlah baginya rumah yang lebih baik dari rumahnya, keluarga yang lebih baik dari keluarganya semula, istri yang lebih baik dari istrinya semula. Masukkanlah ia ke dalam surga, lindungilah ia dari adzab kubur dan adzab neraka” (HR Muslim no. 963).',
            extraArabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا وَذَكَرِنَا وَأُنْثَانَا',
            extraTranslation: '“Ya Allah, ampunilah orang yang hidup di antara kami dan orang yang telah mati, yang hadir dan yang tidak hadir, (juga) anak kecil dan orang dewasa, lelaki dan wanita di antara kami” (HR At Tirmidzi no. 1024, ia berkata: “hasan shahih”).',
          },
          {
            order: 5,
            heading: 'Takbir Keempat (Diam Sejenak / Doa)',
            body: 'Takbir keempat. Kemudian diam sejenak atau boleh juga membaca doa untuk mayit menurut sebagian ulama. Yang lebih utama adalah diam sejenak dan tidak membaca apa-apa sebagaimana zhahir dalam hadits Abu Umamah radhiallahu’anhu.',
          },
          {
            order: 6,
            heading: 'Salam',
            body: 'Dan sifat salamnya sebagaimana salam dalam shalat yang lain. Sebagaimana dalam hadits Ibnu Mas’ud radhiallahu’anhu:',
            arabicText: 'ثَلَاثُ خِلَالٍ كَانَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَفْعَلُهُنَّ، تَرَكَهُنَّ النَّاسُ؛ إِحْدَاهُنَّ: التَّسْلِيمُ عَلَى الْجِنَازَةِ مِثْلَ التَّسْلِيمِ فِي الصَّلَاةِ',
            translation: '“Ada 3 perkara yang dahulu Rasulullah Shallallahu ‘alaihi wa sallam benar-benar melakukannya dan kemudian banyak ditinggalkan orang: salah satunya salam di shalat jenazah semisal dengan salam dalam shalat yang lain..” (HR. Ath Thabrani no. 10022, dihasankan Al Albani dalam Ahkamul Janaiz [162]).\n\nYaitu salam dilakukan dua kali ke kanan dan ke kiri dan yang merupakan rukun hanya salam ke kanan saja.',
          },
        ],
      },
    ],
  },
];
