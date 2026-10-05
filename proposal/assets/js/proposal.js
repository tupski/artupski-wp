/* ==========================================================================
   PT RAJA TUA x ARTUPSKI - Website Redesign Proposal
   Vanilla JS only. Progressive enhancement: the page is fully readable
   without this file (it shows the Indonesian defaults). Every block guards
   for missing elements.

   Adds on top of the original behaviours:
     - a two-language layer (Indonesian default, English) driven by data-i18n
     - a light/dark theme toggle
     - persistence via localStorage keys "proposal-language" / "proposal-theme"
   The original behaviours (mobile nav, smooth scroll, active-section
   highlighting, scroll progress, reveals, print) are preserved.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supportsIO = "IntersectionObserver" in window;

  var root = document.documentElement;
  var LANG_KEY = "proposal-language";
  var THEME_KEY = "proposal-theme";

  /* ---------- 0. Storage helpers (non-sensitive values only) ---------- */
  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* ========================================================================
     1. TRANSLATIONS
     Both dictionaries share the exact same keys. Indonesian is written as a
     native studio would write it; English is genuine agency English.
     ======================================================================== */
  var translations = {
    id: {
      doc_title: "Proposal Redesain Website | PT Raja Tua x Artupski",
      meta_desc:
        "Proposal redesain website untuk PT Raja Tua: kehadiran digital yang modern untuk perusahaan konstruksi dan engineering Indonesia, disusun oleh Artupski.",
      skip_link: "Lewati ke konten",

      nav_label: "Proposal",
      nav_aria: "Bagian proposal",
      nav_toggle: "Bagian",
      nav_toggle_open: "Buka navigasi proposal",
      nav_toggle_close: "Tutup navigasi proposal",
      nav_overview: "Gambaran",
      nav_concept: "Konsep",
      nav_website: "Website",
      nav_scope: "Scope",
      nav_timeline: "Timeline",
      nav_investment: "Investasi",
      nav_next: "Selanjutnya",
      lang_group_label: "Language / Bahasa",
      theme_toggle_aria: "Ganti tema warna",
      theme_light: "Terang",
      theme_dark: "Gelap",

      cover_eyebrow: "Proposal Redesain Website",
      cover_title: "PT Raja Tua",
      cover_subtitle:
        "Kehadiran digital yang modern untuk perusahaan konstruksi dan engineering yang terus bertumbuh.",
      cover_meta_prepared: "Disiapkan oleh",
      cover_meta_by: "Angga Dwy Saputra",
      cover_meta_date: "Tanggal",
      cover_date: "Oktober 2026",
      cover_meta_doc: "Dokumen",
      cover_doc: "Proposal Redesain Website",
      cover_cta_primary: "Lihat Proposal",
      cover_cta_secondary: "Lihat Konsep Website",
      cover_caption_meta: "Gambar konsep",
      cover_caption_text: "Gambar ilustrasi, bukan foto proyek tertentu.",
      cover_img_alt:
        "Fasad bangunan bersudut berlapis panel batu pucat, dengan latar langit cerah",

      s02_num: "02 \u2014 Gambaran Proyek",
      s02_title:
        "Membangun kehadiran digital yang sekuat 30 tahun pengalaman perusahaan.",
      s02_lede:
        "PT Raja Tua telah berkiprah di bidang konstruksi, engineering, dan interior sejak 1992. Lebih dari tiga dekade pengalaman tersebut layak ditampilkan melalui website yang mampu mencerminkan profesionalisme, kapabilitas, dan rekam jejak perusahaan.",
      s02_p1:
        "Proposal Redesain ini menghadirkan website korporat modern yang menyampaikan kredibilitas perusahaan secara lebih jelas, sekaligus memberikan struktur yang lebih kuat untuk menampilkan portofolio, layanan, pengalaman proyek, dan informasi perusahaan.",
      s02_p2:
        "Fokusnya bukan mengubah identitas PT Raja Tua, melainkan memperkuat cara pengalaman tersebut disajikan secara digital: melalui sistem visual yang lebih modern, struktur informasi yang lebih terarah, portofolio yang lebih meyakinkan, serta jalur komunikasi yang membuat langkah berikutnya mudah ditemukan oleh calon klien.",
      s02_facts_aria: "Fakta perusahaan",
      s02_fact1: "Didirikan di Jakarta, Indonesia",
      s02_fact2: "Rentang rekam proyek",
      s02_fact3: "Proyek terdaftar selama 17 tahun",
      s02_meta:
        "Catatan: angka proyek di atas merujuk pada proyek yang saat ini terdokumentasi pada halaman Portofolio website, bukan keseluruhan proyek yang pernah dikerjakan PT Raja Tua.",

      s03_num: "03 \u2014 Saat Ini \u2192 Konsep yang Diusulkan",
      s03_title: "Apa yang berubah, dan mengapa itu penting.",
      s03_muted:
        "Evaluasi kondisi situs saat ini dan arah yang diusulkan untuk membangun pengalaman digital yang lebih sesuai dengan posisi PT Raja Tua.",
      s03_current_tag: "Saat ini",
      s03_current_h: "Kondisi situs hari ini",
      s03_current_li1:
        "Tampilan saat ini belum sepenuhnya merepresentasikan pengalaman dan skala perusahaan.",
      s03_current_li2:
        "Hierarki informasi belum tertata secara optimal, sehingga informasi penting tidak selalu mudah ditemukan.",
      s03_current_li3:
        "Portofolio belum memberikan pengalaman penelusuran yang maksimal.",
      s03_current_li4:
        "Dokumentasi visual proyek belum dimanfaatkan secara maksimal untuk membangun persepsi profesional.",
      s03_proposed_tag: "Diusulkan",
      s03_proposed_h: "Arah redesain ini",
      s03_proposed_li1:
        "Sistem desain korporat modern yang diterapkan secara konsisten di seluruh halaman.",
      s03_proposed_li2: "Struktur informasi yang lebih jelas dengan empat halaman utama.",
      s03_proposed_li3:
        "Penyajian portofolio yang lebih kuat, terstruktur berdasarkan tahun dan kategori.",
      s03_proposed_li4:
        "Tata letak responsif yang dirancang untuk memberikan pengalaman optimal di ponsel hingga desktop.",
      s03_proposed_li5:
        "Penelusuran proyek yang lebih mudah sekaligus memperkuat persepsi profesional terhadap perusahaan.",
      s03_proposed_li6: "Ajakan untuk menghubungi perusahaan yang jelas dan konsisten di berbagai titik penting.",
      s03_statement:
        "Redesain ini berfokus pada satu hal: menyajikan pengalaman, kapabilitas, dan rekam jejak PT Raja Tua melalui pengalaman digital yang lebih jelas, modern, dan meyakinkan.",

      s04_num: "04 \u2014 Konsep Desain",
      s04_title: "Editorial, terstruktur, dan dibangun untuk dipercaya.",
      s04_meta: "Lima prinsip",
      s04_p1_h: "Profesional",
      s04_p1_p:
        "Bahasa visual dan suara korporat yang tenang dan meyakinkan, tanpa ornamen berlebihan maupun kesan template.",
      s04_p2_h: "Tertata",
      s04_p2_p:
        "Grid yang konsisten, bagian bernomor, garis tipis, dan ritme ruang yang terukur menciptakan pengalaman membaca yang jelas dan terarah.",
      s04_p3_h: "Percaya Diri",
      s04_p3_p:
        "Tipografi serif berukuran besar dan ruang putih yang lapang digunakan secara terukur untuk membangun karakter yang kuat tanpa terasa berlebihan.",
      s04_p4_h: "Humanis",
      s04_p4_p:
        "Nuansa material yang hangat dan fotografi proyek nyata memberikan sisi manusia pada perusahaan, sehingga website terasa lebih dekat dan autentik.",
      s04_p5_h: "Responsif",
      s04_p5_p:
        "Sistem layout yang dirancang sejak awal untuk tetap utuh dan nyaman digunakan di berbagai ukuran layar, dari ponsel hingga desktop.",
      s04_note_meta: "Arah visual",
      s04_note_text:
        "Fotografi konstruksi, engineering, dan interior menjadi bagian utama dari identitas visual. Citra proyek ditampilkan dalam skala besar dan digunakan secara autentik untuk menunjukkan keluasan kapabilitas PT Raja Tua—tanpa bergantung pada dinding teks untuk menjelaskan semuanya.",
      concept_img1_alt:
        "Besi tulangan yang diikat menjadi kawat kandang di lokasi konstruksi",
      concept_img2_alt:
        "Ruang rapat kantor dengan plafon beton ekspos dan lampu gantung",

      s05_num: "05 \u2014 Preview Website",
      s05_title: "Website yang diusulkan, halaman per halaman.",
      s05_meta: "Empat halaman",
      s05_note:
        "Pratinjau berikut memberikan gambaran visual dari arah website yang diusulkan, menggunakan citra asli perusahaan sebagai bagian dari komposisinya.",
      s05_home_url: "Beranda",
      s05_home_eyebrow: "Est. 1992 \u00b7 Jakarta \u00b7 Indonesia",
      s05_home_title: "PT. RAJA TUA",
      s05_home_sub: "Terdepan, Unik, dan Andalan.",
      s05_home_img_alt:
        "Seseorang menggambar tampak bangunan secara teknis dengan penggaris dan gulungan gambar di atas meja kayu",
      s05_home_h: "Beranda",
      s05_home_p:
        "Kesan pertama: siapa perusahaan ini, disiplin yang ditekuninya, serta jalur yang jelas menuju portofolio dan kontak.",
      s05_about_eyebrow: "Tentang perusahaan",
      s05_about_title:
        "Tiga puluh tahun membangun, merekayasa, dan menyelesaikan.",
      s05_about_img_alt:
        "Meja perancangan dan perencanaan dengan gambar kerja dan alat gambar tertata",
      s05_about_h: "Tentang Kami",
      s05_about_p: "Kisah sejak 1992, empat disiplin, serta visi dan misi.",
      s05_port_eyebrow: "Portofolio",
      s05_port_title: "Proyek Kami",
      s05_port_sub: "45 proyek \u00b7 2003 hingga 2024",
      s05_port_img_alt:
        "Derek menara di atas gedung bertingkat yang sedang dibangun",
      s05_port_h: "Portofolio",
      s05_port_p:
        "Pengalaman proyek menurut tahun, plus galeri kategori dengan lightbox layar penuh.",
      s05_contact_eyebrow: "Kontak",
      s05_contact_title: "Hubungi Kami",
      s05_contact_img_alt:
        "Ruang rapat kantor dengan plafon beton ekspos dan lampu gantung",
      s05_contact_h: "Kontak",
      s05_contact_p:
        "Telepon, email, dan alamat, dengan peta perkiraan serta aksi panggilan dan email langsung.",
      s05_cta: "Buka Website Concept",
      s05_cta_note: "Membuka konsep website langsung di proyek ini.",

      s06_num: "06 \u2014 Struktur Website",
      s06_title: "Empat halaman, satu alur yang jelas.",
      s06_muted:
        "Setiap halaman memikul satu tugas, dan semuanya mengarah ke langkah yang berguna.",
      s06_home_label: "Beranda",
      s06_home_p:
        "Memperkenalkan perusahaan, disiplin yang ditekuninya, dan standar pekerjaannya, lalu mengarahkan pengunjung ke kisah, portofolio, atau kontak.",
      s06_about_label: "Tentang Kami",
      s06_about_p:
        "Menjelaskan siapa PT Raja Tua: kisah sejak 1992, empat disiplin, serta visi dan misi.",
      s06_port_label: "Portofolio",
      s06_port_p:
        "Membuktikan pengalaman: rekam proyek kronologis dan galeri kategori dengan lightbox.",
      s06_pe_label: "Pengalaman Proyek",
      s06_pe_text: "Riwayat proyek tahun demi tahun, 2003 hingga 2024.",
      s06_pg_label: "Galeri Proyek",
      s06_pg_text:
        "Citra perwakilan menurut kategori, dibuka dalam lightbox.",
      s06_contact_label: "Kontak",
      s06_contact_p:
        "Memudahkan kontak: telepon, email, alamat, dan peta perkiraan.",
      s06_future_tag: "Disarankan, di luar lingkup",
      s06_future_text:
        "Halaman layanan atau karier dapat ditambahkan nanti. Ini bukan bagian dari proposal ini dan hanya ditampilkan untuk menandai arah yang dituju.",

      s07_num: "07 \u2014 Ruang Lingkup Pekerjaan",
      s07_title: "Apa saja yang dicakup proyek ini.",
      s07_meta: "Hasil kerja",
      s07_caption: "Ruang lingkup pekerjaan menurut area",
      table_scroll_hint: "\u2190 Geser untuk melihat lebih \u2192",
      s07_th_area: "Area",
      s07_th_included: "Termasuk dalam lingkup ini",
      s07_rg_design: "UI/UX & Desain",
      s07_design_1:
        "Sistem tata letak responsif untuk ponsel, tablet, dan desktop.",
      s07_design_2:
        "Sistem desain visual yang dapat dipakai ulang: tipografi, warna, spasi, dan komponen.",
      s07_design_3:
        "Desain empat halaman: Beranda, Tentang Kami, Portofolio, Kontak.",
      s07_design_4:
        "Detail antarmuka yang aksesibel: status fokus, target sentuh, dan dukungan reduced-motion.",
      s07_rg_dev: "Pengembangan Website",
      s07_dev_1:
        "Pembuatan empat halaman dengan HTML statis, CSS, dan JavaScript vanilla.",
      s07_dev_2:
        "Navigasi ramah seluler dan navigasi dalam halaman yang mulus.",
      s07_dev_3: "Ajakan bertindak yang jelas di setiap halaman.",
      s07_rg_port: "Portofolio",
      s07_port_1: "Riwayat proyek yang disajikan menurut tahun.",
      s07_port_2:
        "Galeri kategori: Apartemen, Masjid & Gereja, Gudang, Kantor / Gedung.",
      s07_port_3: "Tampilan lightbox untuk citra galeri.",
      s07_rg_contact: "Kontak",
      s07_contact_1: "Informasi kontak: telepon, email, dan alamat.",
      s07_contact_2:
        "Peta perkiraan serta aksi panggilan dan email langsung.",
      s07_contact_3: "Ajakan menghubungi yang diulang di seluruh situs.",
      s07_note_meta: "Tidak termasuk",
      s07_note_text:
        "Lingkup ini tidak mencakup CMS, backend atau basis data, autentikasi, penyediaan hosting atau domain, pemeliharaan, kampanye SEO, maupun integrasi pihak ketiga. Semuanya dicatat dalam Syarat & Ketentuan agar tidak ada kerancuan.",

      s08_num: "08 \u2014 Fitur & Penyempurnaan",
      s08_title: "Dibangun sesuai cara orang menjelajah.",
      s08_meta: "Sepuluh fitur",
      s08_f1_h: "Desain responsif",
      s08_f1_p:
        "Satu tata letak yang tetap utuh dari ponsel 390px hingga desktop lebar.",
      s08_f2_h: "Sistem visual korporat modern",
      s08_f2_p:
        "Bahasa tipografi, warna, dan spasi yang konsisten di setiap halaman.",
      s08_f3_h: "Galeri portofolio interaktif",
      s08_f3_p: "Kategori yang mudah ditelusuri dan nyaman dijelajahi.",
      s08_f4_h: "Riwayat proyek menurut tahun",
      s08_f4_p:
        "Rekam kronologis yang membuat dua dekade pekerjaan mudah dibaca.",
      s08_f5_h: "Tampilan lightbox",
      s08_f5_p:
        "Gambar terbuka penuh layar dengan kendali papan ketik dan tombol tutup yang jelas.",
      s08_f6_h: "Navigasi halaman yang mulus",
      s08_f6_p:
        "Header bersama yang menjaga orientasi tetap konsisten antar halaman.",
      s08_f7_h: "Navigasi ramah seluler",
      s08_f7_p:
        "Menu yang aksesibel, dapat dibuka, ditutup, dan mengembalikan fokus dengan benar.",
      s08_f8_h: "Ajakan kontak yang jelas",
      s08_f8_p:
        "Langkah berikutnya terlihat jelas di setiap halaman, tidak terkubur di bagian bawah.",
      s08_f9_h: "Aset lokal yang optimal",
      s08_f9_p:
        "Gambar disajikan secara lokal, dimuat bertahap, dan berukuran tepat agar tata letak tidak bergeser.",
      s08_f10_h: "Antarmuka yang aksesibel",
      s08_f10_p:
        "Struktur semantik, cincin fokus yang terlihat, dan dukungan reduced-motion.",

      s09_num: "09 \u2014 Tahapan Pengerjaan",
      s09_title: "Enam tahap, dari awal hingga selesai.",
      s09_meta: "Durasi akan dikonfirmasi",
      s09_intro:
        "Setiap tahap di bawah ini mencerminkan cara pekerjaan benar-benar dijalankan. Durasi sengaja dibiarkan terbuka agar dapat disepakati bersama, bukan diasumsikan.",
      s09_t1_h: "Diskusi & Penentuan Arah",
      s09_t1_p:
        "Meninjau situs saat ini, memastikan tujuan, serta menyepakati struktur dan arah.",
      s09_t2_h: "UI/UX & Visual Design",
      s09_t2_p:
        "Merancang tata letak halaman, sistem visual, dan perilaku responsif.",
      s09_t3_h: "Development",
      s09_t3_p:
        "Membangun empat halaman dengan HTML, CSS, dan JavaScript vanilla.",
      s09_t4_h: "Integrasi Konten & Asset",
      s09_t4_p:
        "Menempatkan konten dan citra perusahaan, dengan pelabelan jujur untuk gambar ilustrasi.",
      s09_t5_h: "Testing & Responsive QA",
      s09_t5_p:
        "Memeriksa tata letak pada ukuran ponsel, tablet, dan desktop, serta memastikan dasar aksesibilitas.",
      s09_t6_h: "Final Delivery",
      s09_t6_p:
        "Menyerahkan website yang selesai beserta penjelasan atas apa yang dibangun.",
      s09_dur: "[ X hari kerja ]",

      s10_num: "10 \u2014 Investasi",
      s10_title: "Investasi Proyek",
      s10_amount_ph: "XX.XXX.XXX",
      s10_term: "Biaya proyek sekali bayar",
      s10_note:
        "Satu biaya yang mencakup desain, pengembangan, dan QA responsif sesuai ruang lingkup pekerjaan.",
      s10_caption: "Rincian investasi",
      s10_th_component: "Komponen",
      s10_th_amount: "Jumlah",
      s10_row_design: "UI/UX & Desain Visual",
      s10_row_dev: "Pengembangan Website",
      s10_row_qa: "Responsive & QA",
      s10_row_total: "Total",
      s10_price_ph: "XX.XXX.XXX",
      s10_total_ph: "XX.XXX.XXX",
      s10_disclaimer:
        "Angka di atas masih placeholder. Ganti setiap nilai sebelum proposal ini dikirim.",

      s11_num: "11 \u2014 Syarat & Ketentuan",
      s11_title: "Ketentuan praktis, disampaikan dengan jelas.",
      s11_muted:
        "Placeholder dalam tanda kurung dapat disunting dan wajib dikonfirmasi sebelum proposal dikirim.",
      s11_t1_dt: "Jadwal pembayaran",
      s11_t1_dd: "[ Isi ketentuan pembayaran ]",
      s11_t2_dt: "Batasan lingkup",
      s11_t2_dd:
        "Pekerjaan dibatasi pada ruang lingkup di bagian 07. Apa pun di luarnya ditangani sebagai pekerjaan tambahan.",
      s11_t3_dt: "Putaran revisi",
      s11_t3_dd: "[ Isi jumlah revisi ]",
      s11_t4_dt: "Tanggung jawab konten",
      s11_t4_dd:
        "Klien menyediakan naskah final, gambar, dan detail proyek. Citra ilustrasi dilabeli secara jujur di situs.",
      s11_t5_dt: "Hosting & domain",
      s11_t5_hosting: "Hosting:",
      s11_t5_ph1: "[ Termasuk / Tidak Termasuk ]",
      s11_t5_domain: "Domain:",
      s11_t5_ph2: "[ Termasuk / Tidak Termasuk ]",
      s11_t6_dt: "Pemeliharaan",
      s11_t6_label: "Pemeliharaan:",
      s11_t6_ph: "[ Termasuk / Tidak Termasuk ]",
      s11_t7_dt: "Layanan pihak ketiga",
      s11_t7_dd:
        "Setiap layanan pihak ketiga berbayar, seperti penyedia font atau peta, dicatat terpisah bila digunakan.",
      s11_t8_dt: "Timeline",
      s11_t8_dd:
        "Durasi tiap tahap dikonfirmasi di awal dan bergantung pada umpan balik serta konten yang tiba tepat waktu.",
      s11_t9_dt: "Pekerjaan tambahan",
      s11_t9_dd:
        "Halaman, fitur, atau integrasi baru akan dihitung dan disepakati sebelum dikerjakan.",
      s11_t10_dt: "Serah terima akhir",
      s11_t10_dd:
        "Berkas website yang selesai diserahkan setelah lingkup yang disepakati dan pembayaran tuntas.",
      s11_t11_dt: "Masa berlaku",
      s11_t11_dd: "[ Isi masa berlaku proposal ]",

      s12_num: "12 \u2014 Langkah Selanjutnya",
      s12_title: "Dari persetujuan hingga tayang.",
      s12_step1_h: "Persetujuan Proposal",
      s12_step1_p:
        "Anda meninjau proposal ini dan mengonfirmasi arah serta lingkupnya.",
      s12_step2_h: "Konfirmasi Proyek",
      s12_step2_p: "Kami menyepakati timeline, ketentuan, dan konten awal.",
      s12_step3_h: "Desain & Pengembangan",
      s12_step3_p: "Tata letak dirancang dan website dibangun.",
      s12_step4_h: "Tinjauan & Penyempurnaan",
      s12_step4_p:
        "Anda meninjau hasilnya dan kami menyempurnakannya sesuai jumlah revisi yang disepakati.",
      s12_step5_h: "Serah Terima Akhir",
      s12_step5_p:
        "Website yang selesai diserahkan dan siap dipublikasikan.",
      s12_cta_title: "Mari Bangun Website Baru PT Raja Tua",
      s12_btn_contact: "Hubungi Artupski",
      s12_btn_website: "Buka Website Concept",
      s12_btn_export: "Simpan sebagai PDF",
      s12_export_note:
        "Tombol ini membuka dialog cetak browser. Pilih \u201cSimpan sebagai PDF\u201d untuk menyimpan salinan.",

      s13_eyebrow: "Penutup",
      s13_title:
        "Kehadiran digital yang lebih kuat dimulai dari cerita yang lebih jelas.",
      closing_pair: "PT Raja Tua \u00d7 Artupski",
      closing_doc: "Proposal Redesain Website",
      footer_doc: "Proposal Redesain Website",
      footer_meta: "PT Raja Tua \u00d7 Artupski \u00b7 Oktober 2026"
    },

    en: {
      doc_title: "Website Redesign Proposal | PT Raja Tua x Artupski",
      meta_desc:
        "A website redesign proposal for PT Raja Tua: a modern digital presence for an Indonesian construction and engineering company, prepared by Artupski.",
      skip_link: "Skip to content",

      nav_label: "Proposal",
      nav_aria: "Proposal sections",
      nav_toggle: "Sections",
      nav_toggle_open: "Open proposal navigation",
      nav_toggle_close: "Close proposal navigation",
      nav_overview: "Overview",
      nav_concept: "Concept",
      nav_website: "Website",
      nav_scope: "Scope",
      nav_timeline: "Timeline",
      nav_investment: "Investment",
      nav_next: "Next Steps",
      lang_group_label: "Language / Bahasa",
      theme_toggle_aria: "Toggle colour theme",
      theme_light: "Light",
      theme_dark: "Dark",

      cover_eyebrow: "Website Redesign Proposal",
      cover_title: "PT Raja Tua",
      cover_subtitle:
        "A modern digital presence for a growing construction & engineering company.",
      cover_meta_prepared: "Prepared by",
      cover_meta_by: "Angga Dwy Saputra",
      cover_meta_date: "Date",
      cover_date: "October 2026",
      cover_meta_doc: "Document",
      cover_doc: "Website Redesign Proposal",
      cover_cta_primary: "Explore Proposal",
      cover_cta_secondary: "View Website Concept",
      cover_caption_meta: "Concept imagery",
      cover_caption_text:
        "Illustrative image, not a photograph of a specific named project.",
      cover_img_alt:
        "Angular building facade clad in pale stone panels, seen against a bright sky",

      s02_num: "02 \u2014 Executive Summary",
      s02_title:
        "A clearer, more credible digital home for a 30-year firm.",
      s02_lede:
        "PT Raja Tua has built construction, engineering and interior work since 1992. The website should say so as clearly as the work does.",
      s02_p1:
        "This proposal turns the current online presence into a modern corporate website that communicates credibility, project experience, capabilities and a professional image at a glance. The redesign gives the firm a structured home for its portfolio and a direct route for new clients to make contact.",
      s02_p2:
        "Nothing about the company changes. What changes is how the company is presented: a contemporary visual system, a clear information architecture, a stronger portfolio, and calls to action that make the next step obvious on every page.",
      s02_facts_aria: "Company facts",
      s02_fact1: "Founded in Jakarta, Indonesia",
      s02_fact2: "Project record span",
      s02_fact3: "Listed projects across 17 years",
      s02_meta:
        "Figures describe only the projects listed on the current Portfolio page.",

      s03_num: "03 \u2014 Current \u2192 Proposed Direction",
      s03_title: "What changes, and why it matters.",
      s03_muted:
        "A respectful reading of where the site is today, and the direction this redesign takes it.",
      s03_current_tag: "Current",
      s03_current_h: "Where the site is today",
      s03_current_li1:
        "An older visual presentation that no longer reflects the scale of the firm.",
      s03_current_li2:
        "A less structured hierarchy, so key information takes longer to find.",
      s03_current_li3: "A portfolio that is harder to explore than it should be.",
      s03_current_li4:
        "Limited visual storytelling to carry the depth of the work.",
      s03_proposed_tag: "Proposed",
      s03_proposed_h: "Where the redesign takes it",
      s03_proposed_li1:
        "A modern corporate design system, applied consistently.",
      s03_proposed_li2: "A clear information architecture across four pages.",
      s03_proposed_li3:
        "A strong portfolio presentation, grouped by year and category.",
      s03_proposed_li4:
        "Fully responsive layouts, from phone to desktop.",
      s03_proposed_li5:
        "Better project discovery and a stronger brand perception.",
      s03_proposed_li6: "Clear, repeated calls to action for contact.",
      s03_statement:
        "The proposed redesign focuses on presenting PT Raja Tua's experience and capabilities through a clearer, more contemporary digital experience.",

      s04_num: "04 \u2014 Design Concept",
      s04_title: "Editorial, measured, and built to be trusted.",
      s04_meta: "Five principles",
      s04_p1_h: "Professional",
      s04_p1_p:
        "A composed corporate voice, with no noise and nothing that reads as a template.",
      s04_p2_h: "Structured",
      s04_p2_p:
        "Numbered sections, hairline rules and a steady rhythm that make the page easy to read.",
      s04_p3_h: "Confident",
      s04_p3_p:
        "Large serif display type and generous whitespace, used with restraint and purpose.",
      s04_p4_h: "Human",
      s04_p4_p:
        "Warm paper tones and real photography, so the firm feels like people, not a brochure.",
      s04_p5_h: "Responsive",
      s04_p5_p:
        "One considered layout that holds together on a phone, a tablet and a wide screen.",
      s04_note_meta: "Visual direction",
      s04_note_text:
        "Construction, engineering and interior imagery, composed large and used honestly, carries the firm's range without a wall of text.",
      concept_img1_alt:
        "Steel reinforcement bars tied into a cage on a construction site",
      concept_img2_alt:
        "Office meeting room with an exposed concrete ceiling and pendant lights",

      s05_num: "05 \u2014 Website Preview",
      s05_title: "The proposed website, page by page.",
      s05_meta: "Four pages",
      s05_note:
        "Previews below are representative layouts built with the firm's real imagery. They show composition and hierarchy, not final copy or the specific named projects.",
      s05_home_url: "Home",
      s05_home_eyebrow: "Est. 1992 \u00b7 Jakarta \u00b7 Indonesia",
      s05_home_title: "PT. RAJA TUA",
      s05_home_sub: "Leading, Distinctive, and Reliable.",
      s05_home_img_alt:
        "A person drafting a technical building elevation by hand with a ruler and a rolled plan on a wooden table",
      s05_home_h: "Home",
      s05_home_p:
        "The first impression: who the firm is, the disciplines it covers, and a clear route into the portfolio and contact.",
      s05_about_eyebrow: "About the firm",
      s05_about_title:
        "Thirty years of building, engineering and finishing.",
      s05_about_img_alt:
        "A drafting and planning desk with drawings and drawing tools laid out",
      s05_about_h: "About Us",
      s05_about_p:
        "The story since 1992, the four disciplines, and the vision and mission.",
      s05_port_eyebrow: "Portfolio",
      s05_port_title: "Our Projects",
      s05_port_sub: "45 projects \u00b7 2003 to 2024",
      s05_port_img_alt:
        "Tower cranes above high-rise buildings under construction",
      s05_port_h: "Portfolio",
      s05_port_p:
        "Project experience by year, plus a category gallery with a full-screen lightbox.",
      s05_contact_eyebrow: "Contact",
      s05_contact_title: "Contact Us Now",
      s05_contact_img_alt:
        "Office meeting room with an exposed concrete ceiling and pendant lights",
      s05_contact_h: "Contact Us",
      s05_contact_p:
        "Phone, email and address, with an approximate map and direct call and email actions.",
      s05_cta: "Open Website Concept",
      s05_cta_note: "Opens the live website concept in this project.",

      s06_num: "06 \u2014 Proposed Website Structure",
      s06_title: "Four pages, one clear path.",
      s06_muted:
        "Each page carries one job, and every page leads somewhere useful.",
      s06_home_label: "Home",
      s06_home_p:
        "Introduces the firm, its disciplines and its standard of work, then routes visitors to the story, the portfolio or contact.",
      s06_about_label: "About Us",
      s06_about_p:
        "Explains who PT Raja Tua is: the story since 1992, the four disciplines, and the vision and mission.",
      s06_port_label: "Portfolio",
      s06_port_p:
        "Proves the experience: a chronological project record and a category gallery with a lightbox.",
      s06_pe_label: "Project Experience",
      s06_pe_text: "The year-by-year project history, 2003 to 2024.",
      s06_pg_label: "Project Gallery",
      s06_pg_text:
        "Representative imagery by category, opened in a lightbox.",
      s06_contact_label: "Contact Us",
      s06_contact_p:
        "Makes contact easy: phone, email, address and an approximate map.",
      s06_future_tag: "Recommended, not in scope",
      s06_future_text:
        "A future services or careers page could be added later. It is not part of this proposal and is shown here only to mark the intended direction.",

      s07_num: "07 \u2014 Scope of Work",
      s07_title: "What this project covers.",
      s07_meta: "Deliverables",
      s07_caption: "Scope of work grouped by area",
      table_scroll_hint: "\u2190 Swipe to see more \u2192",
      s07_th_area: "Area",
      s07_th_included: "Included in this scope",
      s07_rg_design: "UI/UX & Design",
      s07_design_1:
        "Responsive layout system for phone, tablet and desktop.",
      s07_design_2:
        "A reusable visual design system: type, colour, spacing and components.",
      s07_design_3:
        "Four page designs: Home, About Us, Portfolio, Contact Us.",
      s07_design_4:
        "Accessible interface details: focus states, tap targets and reduced-motion support.",
      s07_rg_dev: "Website Development",
      s07_dev_1:
        "Static HTML, CSS and vanilla JavaScript build of the four pages.",
      s07_dev_2: "Mobile-friendly navigation and smooth in-page navigation.",
      s07_dev_3: "Clear calls to action on each page.",
      s07_rg_port: "Portfolio",
      s07_port_1: "Project history presented by year.",
      s07_port_2:
        "Category gallery: Apartment, Mosque & Church, Warehouse, Office / Building.",
      s07_port_3: "Lightbox viewing of gallery imagery.",
      s07_rg_contact: "Contact",
      s07_contact_1: "Contact information: phone, email and address.",
      s07_contact_2:
        "An approximate map and direct call and email actions.",
      s07_contact_3: "Contact calls to action repeated across the site.",
      s07_note_meta: "Not included",
      s07_note_text:
        "This scope does not include a CMS, a backend or database, authentication, hosting or domain provision, maintenance, SEO campaigns, or third-party integrations. Those are noted in the Terms so there is no ambiguity.",

      s08_num: "08 \u2014 Key Features",
      s08_title: "Built for how people actually browse.",
      s08_meta: "Ten features",
      s08_f1_h: "Responsive design",
      s08_f1_p:
        "One layout that holds together from a 390px phone to a wide desktop.",
      s08_f2_h: "Modern corporate visual system",
      s08_f2_p:
        "A consistent type, colour and spacing language across every page.",
      s08_f3_h: "Interactive portfolio gallery",
      s08_f3_p:
        "Categories that are easy to browse and pleasant to move through.",
      s08_f4_h: "Project history by year",
      s08_f4_p:
        "A chronological record that makes two decades of work legible.",
      s08_f5_h: "Lightbox viewing",
      s08_f5_p:
        "Images open full-screen with keyboard controls and a clear close.",
      s08_f6_h: "Smooth page navigation",
      s08_f6_p:
        "A shared header that keeps orientation consistent page to page.",
      s08_f7_h: "Mobile-friendly navigation",
      s08_f7_p:
        "An accessible menu that opens, closes and returns focus correctly.",
      s08_f8_h: "Clear contact CTA",
      s08_f8_p:
        "An obvious next step on every page, never buried at the bottom.",
      s08_f9_h: "Optimized local assets",
      s08_f9_p:
        "Images served locally, lazy-loaded and sized to avoid layout shift.",
      s08_f10_h: "Accessible interface",
      s08_f10_p:
        "Semantic structure, visible focus rings and reduced-motion support.",

      s09_num: "09 \u2014 Project Timeline",
      s09_title: "Six phases, start to finish.",
      s09_meta: "Durations to confirm",
      s09_intro:
        "Each phase below is real to the way the work is delivered. Durations are left open so they can be agreed together rather than assumed.",
      s09_t1_h: "Discovery & Direction",
      s09_t1_p:
        "Review the current site, confirm the goals and agree the structure and direction.",
      s09_t2_h: "UI/UX & Visual Design",
      s09_t2_p:
        "Design the page layouts, the visual system and the responsive behaviour.",
      s09_t3_h: "Development",
      s09_t3_p: "Build the four pages in HTML, CSS and vanilla JavaScript.",
      s09_t4_h: "Content & Asset Integration",
      s09_t4_p:
        "Place the firm's content and imagery, with honest labelling for illustrative images.",
      s09_t5_h: "Testing & Responsive QA",
      s09_t5_p:
        "Check the layout at phone, tablet and desktop sizes, and confirm accessibility basics.",
      s09_t6_h: "Final Delivery",
      s09_t6_p:
        "Hand over the finished website and walk through what was built.",
      s09_dur: "[ X business days ]",

      s10_num: "10 \u2014 Investment",
      s10_title: "Project Investment",
      s10_amount_ph: "XX.XXX.XXX",
      s10_term: "One-time project fee",
      s10_note:
        "A single fee covering design, development and responsive QA as set out in the scope of work.",
      s10_caption: "Investment breakdown",
      s10_th_component: "Component",
      s10_th_amount: "Amount",
      s10_row_design: "UI/UX & Visual Design",
      s10_row_dev: "Website Development",
      s10_row_qa: "Responsive & QA",
      s10_row_total: "Total",
      s10_price_ph: "XX.XXX.XXX",
      s10_total_ph: "XX.XXX.XXX",
      s10_disclaimer:
        "Figures are placeholders. Replace every value before sending this proposal.",

      s11_num: "11 \u2014 Terms & Conditions",
      s11_title: "The practical terms, stated plainly.",
      s11_muted:
        "Placeholders in brackets are editable and must be confirmed before the proposal is sent.",
      s11_t1_dt: "Payment schedule",
      s11_t1_dd: "[ Insert payment terms ]",
      s11_t2_dt: "Scope limitations",
      s11_t2_dd:
        "Work is limited to the scope of work set out in section 07. Anything outside it is handled as additional work.",
      s11_t3_dt: "Revision rounds",
      s11_t3_dd: "[ Insert revision allowance ]",
      s11_t4_dt: "Content responsibility",
      s11_t4_dd:
        "The client provides final text, images and any project details. Illustrative imagery is labelled honestly on the site.",
      s11_t5_dt: "Hosting & domain",
      s11_t5_hosting: "Hosting:",
      s11_t5_ph1: "[ Included / Not Included ]",
      s11_t5_domain: "Domain:",
      s11_t5_ph2: "[ Included / Not Included ]",
      s11_t6_dt: "Maintenance",
      s11_t6_label: "Maintenance:",
      s11_t6_ph: "[ Included / Not Included ]",
      s11_t7_dt: "Third-party services",
      s11_t7_dd:
        "Any paid third-party service, such as a font or map provider, is listed separately if it is used.",
      s11_t8_dt: "Timeline",
      s11_t8_dd:
        "Phase durations are confirmed at the start and depend on feedback and content arriving on time.",
      s11_t9_dt: "Additional work",
      s11_t9_dd:
        "New pages, features or integrations are quoted and agreed before they begin.",
      s11_t10_dt: "Final delivery",
      s11_t10_dd:
        "The finished website files are handed over on completion of the agreed scope and payment.",
      s11_t11_dt: "Validity",
      s11_t11_dd: "[ Insert proposal validity ]",

      s12_num: "12 \u2014 Next Steps",
      s12_title: "From approval to launch.",
      s12_step1_h: "Proposal Approval",
      s12_step1_p:
        "You review this proposal and confirm the direction and scope.",
      s12_step2_h: "Project Confirmation",
      s12_step2_p:
        "We agree the timeline, the terms and the starting content.",
      s12_step3_h: "Design & Development",
      s12_step3_p: "The layouts are designed and the website is built.",
      s12_step4_h: "Review & Refinement",
      s12_step4_p:
        "You review the build and we refine it within the agreed rounds.",
      s12_step5_h: "Final Delivery",
      s12_step5_p:
        "The finished website is handed over and ready to publish.",
      s12_cta_title: "Let's Build the New PT Raja Tua Website",
      s12_btn_contact: "Contact Artupski",
      s12_btn_website: "Open Website Concept",
      s12_btn_export: "Export PDF",
      s12_export_note:
        "Export opens your browser print dialog. Choose \u201cSave as PDF\u201d to keep a copy.",

      s13_eyebrow: "Closing",
      s13_title:
        "A stronger digital presence starts with a clearer story.",
      closing_pair: "PT Raja Tua \u00d7 Artupski",
      closing_doc: "Website Redesign Proposal",
      footer_doc: "Website Redesign Proposal",
      footer_meta: "PT Raja Tua \u00d7 Artupski \u00b7 October 2026"
    }
  };

  /* ========================================================================
     2. LANGUAGE LAYER
     ======================================================================== */
  var langButtons = document.querySelectorAll("[data-lang-btn]");
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var themeLabel = document.querySelector("[data-theme-label]");
  var navToggleEl = document.querySelector("[data-nav-toggle]");

  var currentLang = root.getAttribute("data-lang") === "en" ? "en" : "id";

  function t(key) {
    var dict = translations[currentLang] || translations.id;
    return dict[key];
  }

  function applyLanguage(lang) {
    if (lang !== "en") lang = "id";
    currentLang = lang;
    var dict = translations[lang];

    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);
    if (dict.doc_title) document.title = dict.doc_title;

    // Plain text nodes
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-i18n]"),
      function (el) {
        var key = el.getAttribute("data-i18n");
        if (key && dict[key] != null) el.textContent = dict[key];
      }
    );

    // Attribute hooks, e.g. data-i18n-attr="aria-label:key" (semicolon-separated)
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-i18n-attr]"),
      function (el) {
        var spec = el.getAttribute("data-i18n-attr");
        if (!spec) return;
        spec.split(";").forEach(function (pair) {
          var bits = pair.split(":");
          if (bits.length < 2) return;
          var attr = bits[0].trim();
          var key = bits[1].trim();
          if (attr && dict[key] != null) el.setAttribute(attr, dict[key]);
        });
      }
    );

    // Language switcher state (aria-pressed + native lang per button)
    Array.prototype.forEach.call(langButtons, function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // Keep the nav toggle label in the active language.
    if (navToggleEl) {
      var navEl = document.querySelector("[data-proposal-nav]");
      var open = navEl && navEl.classList.contains("is-open");
      navToggleEl.setAttribute(
        "aria-label",
        dict[open ? "nav_toggle_close" : "nav_toggle_open"]
      );
    }

    updateThemeLabel();
  }

  Array.prototype.forEach.call(langButtons, function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang-btn");
      if (lang === currentLang) return;
      writeStore(LANG_KEY, lang);
      applyLanguage(lang);
    });
  });

  /* ========================================================================
     3. THEME LAYER
     ======================================================================== */
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeLabel) return;
    themeLabel.textContent =
      currentTheme() === "dark" ? t("theme_dark") : t("theme_light");
  }

  function setTheme(theme, persist) {
    if (theme !== "dark") theme = "light";
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
    updateThemeLabel();
    if (persist) writeStore(THEME_KEY, theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  /* ========================================================================
     4. Mobile proposal navigation  (original behaviour, localised labels)
     ======================================================================== */
  var nav = document.querySelector("[data-proposal-nav]");

  function closeNav(returnFocus) {
    if (!nav || !navToggleEl) return;
    nav.classList.remove("is-open");
    navToggleEl.setAttribute("aria-expanded", "false");
    navToggleEl.setAttribute("aria-label", t("nav_toggle_open"));
    if (returnFocus) navToggleEl.focus();
  }

  function openNav() {
    if (!nav || !navToggleEl) return;
    nav.classList.add("is-open");
    navToggleEl.setAttribute("aria-expanded", "true");
    navToggleEl.setAttribute("aria-label", t("nav_toggle_close"));
  }

  if (nav && navToggleEl) {
    navToggleEl.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav(false);
      } else {
        openNav();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav(true);
      }
    });

    // Close the menu after choosing a section (so the target is visible).
    var navList = document.querySelector("[data-nav-list]");
    if (navList) {
      navList.addEventListener("click", function (e) {
        var link = e.target.closest ? e.target.closest("a") : null;
        if (link && nav.classList.contains("is-open")) closeNav(false);
      });
    }

    // Close the menu if the viewport grows past the mobile breakpoint.
    var mq = window.matchMedia("(min-width: 901px)");
    var onChange = function (ev) {
      if (ev.matches) closeNav(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);

    // Close the menu on outside click.
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target)) closeNav(false);
    });
  }

  /* ---------- 5. Smooth scroll for in-page links ---------- */
  var scrollLinks = document.querySelectorAll('a[href^="#"]');
  Array.prototype.forEach.call(scrollLinks, function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = nav ? nav.getBoundingClientRect().height : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduceMotion ? "auto" : "smooth" });

      // Move focus for keyboard users without an extra scroll jump.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      // Keep the URL shareable without a second jump.
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ---------- 6. Active section highlighting ---------- */
  var sections = document.querySelectorAll("[data-nav-section]");
  var navLinks = document.querySelectorAll("[data-nav-link]");

  function setActive(id) {
    Array.prototype.forEach.call(navLinks, function (link) {
      var isActive = link.getAttribute("data-nav-link") === id;
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if (sections.length && navLinks.length && supportsIO) {
    var visible = new Map();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute("id");
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        });

        // Choose the section nearest the top of the viewport among visible ones.
        var bestId = null;
        var bestTop = Infinity;
        visible.forEach(function (_ratio, id) {
          var el = document.getElementById(id);
          if (!el) return;
          var top = Math.abs(el.getBoundingClientRect().top - 120);
          if (top < bestTop) { bestTop = top; bestId = id; }
        });
        if (bestId) setActive(bestId);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75] }
    );
    Array.prototype.forEach.call(sections, function (s) { observer.observe(s); });
  }

  /* ---------- 7. Scroll progress bar ---------- */
  var progressBar = document.querySelector("[data-progress-bar]");
  var ticking = false;

  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.pageYOffset / max : 0;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    progressBar.style.transform = "scaleX(" + ratio + ")";
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      ticking = false;
    });
  }

  if (progressBar) {
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ---------- 8. Scroll reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length) {
    if (reduceMotion || !supportsIO) {
      // No animation: make everything visible immediately.
      Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      Array.prototype.forEach.call(revealEls, function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- 8b. Horizontal table scroll affordance ---------- */
  /* The edge shadows are pure CSS (the "scrolling shadows" technique), which
     self-hide when the table fits. JS only adds the honest signal: the
     .is-scrollable class (reveals the hint + lets CSS know it overflows) and
     the at-start / at-end classes used for optional edge states. This keeps the
     affordance off desktop, where the table is not scrollable. */
  var scrollWraps = document.querySelectorAll("[data-scroll-container]");

  function updateScrollAffordance() {
    Array.prototype.forEach.call(scrollWraps, function (el) {
      var overflow = el.scrollWidth - el.clientWidth;
      var isScrollable = overflow > 2;
      var wrap = el.closest(".table-wrap, .investment__table-wrap");
      if (wrap) wrap.classList.toggle("is-scrollable", isScrollable);
      el.classList.toggle("is-scrollable", isScrollable);
      if (!isScrollable) {
        el.classList.remove("at-start", "at-end");
        return;
      }
      var x = el.scrollLeft;
      el.classList.toggle("at-start", x <= 1);
      el.classList.toggle("at-end", x >= overflow - 1);
    });
  }

  if (scrollWraps.length) {
    Array.prototype.forEach.call(scrollWraps, function (el) {
      el.addEventListener("scroll", updateScrollAffordance, { passive: true });
    });
    window.addEventListener("resize", updateScrollAffordance, { passive: true });
    window.addEventListener("load", updateScrollAffordance);
    updateScrollAffordance();
  }

  /* ---------- 9. Print / Export ---------- */
  var printBtn = document.querySelector("[data-print]");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      // The DOM already reflects the active language, so the printed document
      // matches what is on screen. The print stylesheet forces a light theme.
      window.print();
    });
  }

  // Ctrl/Cmd + P already opens the browser dialog; nothing to intercept.

  /* ========================================================================
     10. INIT - apply the persisted language + sync the theme controls
     ======================================================================== */
  var storedLang = readStore(LANG_KEY);
  if (storedLang !== "id" && storedLang !== "en") storedLang = currentLang;
  applyLanguage(storedLang);

  // The inline <head> script already set data-theme to avoid a flash; here we
  // only sync the toggle's accessible state and label.
  setTheme(currentTheme(), false);
})();
