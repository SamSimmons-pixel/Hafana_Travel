<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hafana Travel — Teman Ibadah di Tanah Suci</title>
    <meta name="description" content="Aplikasi resmi Hafana Tour & Travel. Pantau paket Umrah & Haji, cek data visa, jadwal sholat, arah kiblat, khutbah Jumat live, doa & dzikir, Al-Quran — semuanya dalam satu aplikasi.">
    <meta name="theme-color" content="#254091">

    <!-- Open Graph -->
    <meta property="og:title" content="Hafana Travel — Teman Ibadah di Tanah Suci">
    <meta property="og:description" content="Aplikasi resmi Hafana Tour & Travel untuk jemaah Umrah & Haji.">
    <meta property="og:image" content="{{ asset('images/logo.png') }}">
    <meta property="og:type" content="website">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <link rel="shortcut icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

    <style>
        /* ── CSS Variables (exact hex from React Native theme.ts) ─────────── */
        :root {
            --primary:        #254091;
            --primary-dark:   #172757;
            --primary-light:  #f7f7f7;
            --bg:             #f2f6fa;
            --surface:        #ffffff;
            --text-primary:   #1a2a3a;
            --text-secondary: #6b7f91;
            --text-muted:     #9eb3c8;
            --border:         #dde8f0;
            --success:        #1a7a4e;
            --danger:         #c0392b;
            --warning:        #856404;

            /* Dark layer accents */
            --dark-bg:      #0f172a;
            --dark-surface: #1e293b;
            --dark-surface2:#334155;
            --dark-text:    #f8fafc;
            --dark-muted:   #94a3b8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text-primary);
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* ── Utility ─────────────────────────────────────────────────── */
        .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .section    { padding: 80px 0; }
        .section-sm { padding: 56px 0; }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 14px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .badge-primary {
            background: rgba(37, 64, 145, 0.1);
            color: var(--primary);
            border: 1px solid rgba(37, 64, 145, 0.2);
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: var(--primary);
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(37, 64, 145, 0.35);
        }
        .btn-primary:hover {
            background: var(--primary-dark);
            box-shadow: 0 8px 28px rgba(37, 64, 145, 0.45);
            transform: translateY(-1px);
        }

        .btn-outline {
            background: transparent;
            color: var(--primary);
            border: 2px solid var(--primary);
        }
        .btn-outline:hover {
            background: var(--primary);
            color: #ffffff;
        }

        .btn-dark {
            background: var(--dark-surface);
            color: var(--dark-text);
            border: 1px solid var(--dark-surface2);
        }
        .btn-dark:hover {
            background: var(--dark-surface2);
        }

        .section-label {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--primary);
            margin-bottom: 10px;
            display: block;
        }

        .section-title {
            font-size: clamp(26px, 4vw, 40px);
            font-weight: 800;
            color: var(--text-primary);
            line-height: 1.25;
        }

        .section-desc {
            font-size: 16px;
            color: var(--text-secondary);
            margin-top: 14px;
            max-width: 560px;
        }

        /* ── NAVBAR ─────────────────────────────────────────────────────── */
        .navbar {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            padding: 0 20px;
        }

        .navbar-inner {
            max-width: 1100px;
            margin: 0 auto;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }

        .navbar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }

        .navbar-logo {
            height: 36px;
            width: auto;
            object-fit: contain;
        }

        .navbar-brand-text {
            font-size: 16px;
            font-weight: 800;
            color: var(--text-primary);
        }

        .navbar-brand-sub {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-muted);
        }

        .navbar-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .navbar-link {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-secondary);
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 8px;
            transition: color 0.2s;
        }
        .navbar-link:hover { color: var(--primary); }

        /* ── HERO ───────────────────────────────────────────────────────── */
        .hero {
            background: linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 55%, #2d5fd4 100%);
            color: #ffffff;
            padding: 100px 20px 80px;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 55%),
                radial-gradient(ellipse at 10% 90%, rgba(255,255,255,0.04) 0%, transparent 50%);
            pointer-events: none;
        }

        /* Mosque silhouette decoration */
        .hero-deco {
            position: absolute;
            bottom: 0;
            right: -40px;
            width: 420px;
            height: 300px;
            opacity: 0.06;
            pointer-events: none;
        }

        .hero-inner {
            max-width: 1100px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 60px;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .hero-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 14px;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.9);
            margin-bottom: 20px;
        }

        .hero-title {
            font-size: clamp(32px, 5.5vw, 58px);
            font-weight: 800;
            line-height: 1.15;
            letter-spacing: -0.01em;
            color: #ffffff;
        }

        .hero-title em {
            font-style: normal;
            color: #fde68a;
        }

        .hero-tagline {
            margin-top: 14px;
            font-size: 18px;
            font-weight: 600;
            color: rgba(255,255,255,0.75);
            font-style: italic;
        }

        .hero-desc {
            margin-top: 16px;
            font-size: 15px;
            color: rgba(255,255,255,0.65);
            max-width: 480px;
            line-height: 1.7;
        }

        .hero-actions {
            margin-top: 36px;
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
        }

        .btn-hero-dl {
            background: #ffffff;
            color: var(--primary);
            font-weight: 800;
            padding: 14px 28px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            text-decoration: none;
            box-shadow: 0 4px 24px rgba(0,0,0,0.25);
            transition: all 0.2s;
        }
        .btn-hero-dl:hover {
            background: #f0f8ff;
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .btn-hero-dl .dl-icon {
            width: 32px;
            height: 32px;
            background: var(--primary);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .android-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 999px;
            font-size: 12px;
            color: rgba(255,255,255,0.8);
            font-weight: 600;
        }

        .hero-phone {
            position: relative;
            display: flex;
            justify-content: center;
        }

        .phone-frame {
            width: 240px;
            background: var(--dark-bg);
            border-radius: 40px;
            border: 6px solid rgba(255,255,255,0.15);
            box-shadow:
                0 0 0 1px rgba(255,255,255,0.06),
                0 40px 80px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.1);
            overflow: hidden;
            padding: 14px 10px;
            height: 480px;
        }

        .phone-notch {
            width: 80px;
            height: 22px;
            background: var(--dark-bg);
            border-radius: 0 0 16px 16px;
            margin: 0 auto 8px;
        }

        .phone-screen {
            width: 100%;
            height: 100%;
            background: linear-gradient(160deg, var(--primary-dark), var(--dark-bg));
            border-radius: 28px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        .phone-logo {
            width: 64px;
            height: 64px;
            object-fit: contain;
            border-radius: 16px;
            background: rgba(255,255,255,0.05);
            padding: 8px;
        }

        .phone-app-name {
            font-size: 14px;
            font-weight: 800;
            color: #ffffff;
        }

        .phone-app-sub {
            font-size: 11px;
            color: rgba(255,255,255,0.5);
            font-weight: 500;
        }

        /* ── STATS BAR ──────────────────────────────────────────────────── */
        .stats-bar {
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 28px 20px;
        }

        .stats-inner {
            max-width: 1100px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            flex-wrap: wrap;
        }

        .stat-item {
            flex: 1;
            min-width: 160px;
            text-align: center;
            padding: 12px 24px;
            border-right: 1px solid var(--border);
        }
        .stat-item:last-child { border-right: none; }

        .stat-value {
            font-size: 28px;
            font-weight: 800;
            color: var(--primary);
            display: block;
        }

        .stat-label {
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
            margin-top: 2px;
        }

        /* ── SCREENSHOT SLIDER ──────────────────────────────────────────── */
        .slider-section {
            background: var(--dark-bg);
            padding: 80px 0;
            overflow: hidden;
        }

        .slider-header {
            text-align: center;
            margin-bottom: 48px;
            padding: 0 20px;
        }

        .slider-header .section-title { color: var(--dark-text); }
        .slider-header .section-desc { color: var(--dark-muted); margin: 14px auto 0; }

        .slider-container {
            position: relative;
            width: 100%;
            max-width: 960px;
            margin: 0 auto;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            user-select: none;
        }

        .slider-track {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            cursor: grab;
            will-change: transform;
        }

        .slider-track:active { cursor: grabbing; }

        .slide {
            position: relative;
            flex: 0 0 33.3333%;
            height: 280px;
            padding: 0 16px;
            transform: scale(0.85);
            opacity: 0.35;
            will-change: transform, opacity;
        }

        .slide .slide-inner {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 18px;
            overflow: hidden;
        }

        .slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 18px;
            border: 2px solid #334155;
            pointer-events: none;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
            display: block;
        }

        .slide-placeholder {
            width: 100%;
            height: 100%;
            background: var(--dark-surface);
            border-radius: 18px;
            border: 2px dashed #334155;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: var(--dark-muted);
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            padding: 20px;
        }

        .slide-placeholder svg {
            width: 40px;
            height: 40px;
            opacity: 0.4;
        }

        .slide .slide-inner::before,
        .slide .slide-inner::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: 18px;
            opacity: 0;
            will-change: opacity;
        }
        .slide .slide-inner::before { background: linear-gradient(to right, #0f172a 15%, rgba(15,23,42,0) 100%); }
        .slide .slide-inner::after  { background: linear-gradient(to left,  #0f172a 15%, rgba(15,23,42,0) 100%); }

        .slide.is-left  .slide-inner::before { opacity: 0.85; }
        .slide.is-right .slide-inner::after  { opacity: 0.85; }
        .slide.is-center {
            opacity: 1;
            transform: scale(1.2);
            z-index: 2;
        }
        .slide.is-center .slide-inner::before,
        .slide.is-center .slide-inner::after { opacity: 0; }

        .animating { transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) !important; }
        .animating .slide {
            transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1),
                        opacity   0.5s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
        }
        .animating .slide .slide-inner::before,
        .animating .slide .slide-inner::after {
            transition: opacity 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
        }

        .slider-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            margin-top: 32px;
        }

        .slider-btn {
            width: 44px;
            height: 44px;
            background: var(--dark-surface);
            color: var(--dark-text);
            border: 1px solid var(--dark-surface2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            transition: background 0.2s, border-color 0.2s;
        }
        .slider-btn:hover {
            background: var(--dark-surface2);
            border-color: #64748b;
        }

        /* ── FEATURES GRID ──────────────────────────────────────────────── */
        .features-section {
            background: var(--bg);
            padding: 80px 0;
        }

        .features-header {
            text-align: center;
            margin-bottom: 52px;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
        }

        .feature-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 28px 24px;
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(37,64,145,0.1);
            border-color: rgba(37,64,145,0.2);
        }

        .feature-icon {
            width: 52px;
            height: 52px;
            background: rgba(37,64,145,0.08);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin-bottom: 18px;
        }

        .feature-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
        }

        .feature-desc {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.65;
        }

        /* ── DOWNLOAD CTA ───────────────────────────────────────────────── */
        .cta-section {
            background: linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 60%, #2d5fd4 100%);
            padding: 80px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .cta-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 65%);
            pointer-events: none;
        }

        .cta-inner {
            position: relative;
            z-index: 1;
            max-width: 560px;
            margin: 0 auto;
        }

        .cta-title {
            font-size: clamp(26px, 4vw, 40px);
            font-weight: 800;
            color: #ffffff;
            line-height: 1.25;
        }

        .cta-subtitle {
            font-size: 16px;
            color: rgba(255,255,255,0.7);
            margin-top: 14px;
        }

        .cta-actions {
            margin-top: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
        }

        .apk-download-btn {
            background: #ffffff;
            color: var(--primary);
            font-weight: 800;
            font-size: 15px;
            padding: 16px 32px;
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            box-shadow: 0 4px 24px rgba(0,0,0,0.3);
            transition: all 0.2s;
            font-family: inherit;
        }
        .apk-download-btn:hover {
            background: #f0f8ff;
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }

        .cta-android-note {
            margin-top: 20px;
            font-size: 13px;
            color: rgba(255,255,255,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        /* ── FOOTER ─────────────────────────────────────────────────────── */
        .footer {
            background: var(--dark-bg);
            padding: 40px 20px;
            text-align: center;
            border-top: 1px solid #1e293b;
        }

        .footer-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 16px;
        }

        .footer-logo img {
            height: 32px;
            object-fit: contain;
        }

        .footer-logo-text {
            font-size: 15px;
            font-weight: 800;
            color: var(--dark-text);
        }

        .footer-tagline {
            font-size: 13px;
            color: var(--dark-muted);
            font-style: italic;
            margin-bottom: 20px;
        }

        .footer-links {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            flex-wrap: wrap;
            margin-bottom: 24px;
        }

        .footer-link {
            font-size: 13px;
            color: #64748b;
            text-decoration: none;
            transition: color 0.2s;
        }
        .footer-link:hover { color: var(--dark-text); }

        .footer-copy {
            font-size: 12px;
            color: #475569;
        }

        /* ── RESPONSIVE ─────────────────────────────────────────────────── */
        @media (max-width: 768px) {
            .hero-inner {
                grid-template-columns: 1fr;
                gap: 40px;
                text-align: center;
            }
            .hero-actions { justify-content: center; }
            .hero-desc { margin: 14px auto 0; }
            .hero-phone { display: none; }

            .stat-item { border-right: none; border-bottom: 1px solid var(--border); }
            .stat-item:last-child { border-bottom: none; }

            .slide { flex: 0 0 80%; }
            .slider-container { height: 320px; }
            .slide { height: 240px; }

            .features-grid { grid-template-columns: 1fr 1fr; }

            .navbar-link { display: none; }
        }

        @media (max-width: 480px) {
            .features-grid { grid-template-columns: 1fr; }
            .hero { padding: 72px 20px 60px; }
        }
    </style>
</head>
<body>

    {{-- ── NAVBAR ──────────────────────────────────────────────────────────── --}}
    <nav class="navbar">
        <div class="navbar-inner">
            <a href="#" class="navbar-brand">
                <img src="{{ asset('images/logo.png') }}" alt="Logo Hafana Travel" class="navbar-logo">
                <div>
                    <div class="navbar-brand-text">Hafana Travel</div>
                    <div class="navbar-brand-sub">Umrah & Haji</div>
                </div>
            </a>

            <div class="navbar-actions">
                <a href="#fitur" class="navbar-link">Fitur</a>
                <a href="#aplikasi" class="navbar-link">Tampilan</a>
                <a href="{{ $apkDownloadUrl }}" class="btn btn-primary" style="padding: 10px 20px; font-size: 14px;" id="nav-dl-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download APK
                </a>
            </div>
        </div>
    </nav>

    {{-- ── HERO ─────────────────────────────────────────────────────────────── --}}
    <section class="hero">
        {{-- Mosque SVG Decoration --}}
        <svg class="hero-deco" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="280" rx="200" ry="20" fill="white" opacity="0.3"/>
            <rect x="60" y="140" width="280" height="140" fill="white"/>
            <rect x="100" y="80" width="200" height="80" fill="white"/>
            <path d="M200 20 C200 20 160 60 160 90 C160 110 178 120 200 120 C222 120 240 110 240 90 C240 60 200 20 200 20Z" fill="white"/>
            <rect x="88" y="40" width="20" height="100" fill="white"/>
            <path d="M98 40 C98 40 85 30 98 15 C111 30 108 40 108 40Z" fill="white"/>
            <rect x="292" y="40" width="20" height="100" fill="white"/>
            <path d="M302 40 C302 40 289 30 302 15 C315 30 312 40 312 40Z" fill="white"/>
        </svg>

        <div class="hero-inner container">
            <div>
                <div class="hero-eyebrow">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4zm0 3a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 0111 12V8a1 1 0 011-1z"/></svg>
                    Aplikasi Resmi Hafana Tour & Travel
                </div>

                <h1 class="hero-title">
                    Perjalanan Umrah &<br>
                    Haji Anda,<br>
                    <em>Lebih Tenang.</em>
                </h1>

                <p class="hero-tagline">"Teman ibadah di Tanah Suci."</p>

                <p class="hero-desc">
                    Satu aplikasi untuk semua kebutuhan jemaah — dari pantau paket, cek visa & paspor, jadwal sholat, arah kiblat, hingga khutbah Jumat live dari Masjidil Haram & Masjid Nabawi.
                </p>

                <div class="hero-actions">
                    <a href="{{ $apkDownloadUrl }}" class="btn-hero-dl" id="hero-dl-btn">
                        <div class="dl-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </div>
                        Download APK Android
                    </a>

                    <div class="android-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/></svg>
                        Android Only
                    </div>
                </div>
            </div>

            {{-- Phone mockup --}}
            <div class="hero-phone">
                <div class="phone-frame">
                    <div class="phone-notch"></div>
                    <div class="phone-screen">
                        <img src="{{ asset('images/logo.png') }}" alt="Hafana Travel" class="phone-logo">
                        <div style="text-align: center;">
                            <div class="phone-app-name">Hafana Travel</div>
                            <div class="phone-app-sub">Umrah & Haji</div>
                        </div>
                        <div style="width: 60%; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.4); font-style: italic;">Assalamu'alaikum 🌙</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- ── STATS BAR ────────────────────────────────────────────────────────── --}}
    <div class="stats-bar">
        <div class="stats-inner">
            <div class="stat-item">
                <span class="stat-value">8+</span>
                <div class="stat-label">Fitur Lengkap</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">Live</span>
                <div class="stat-label">Khutbah Jumat Streaming</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">GPS</span>
                <div class="stat-label">Jadwal Sholat & Kiblat Otomatis</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">Gratis</span>
                <div class="stat-label">Untuk Semua Jemaah Hafana</div>
            </div>
        </div>
    </div>

    {{-- ── APP SCREENSHOTS ──────────────────────────────────────────────────── --}}
    <section class="slider-section" id="aplikasi">
        <div class="slider-header">
            <span class="badge" style="background: rgba(255,255,255,0.08); color: #94a3b8; border-color: rgba(255,255,255,0.1);">📱 Tampilan Aplikasi</span>
            <h2 class="section-title" style="margin-top: 12px;">Dirancang untuk<br>kenyamanan jemaah</h2>
            <p class="section-desc">Antarmuka bersih, mudah dipakai, dan mendukung mode gelap sesuai selera.</p>
        </div>

        @if(count($screenshots) > 0)
        <div class="slider-container" id="sliderContainer">
            <div class="slider-track" id="sliderTrack">
                @foreach($screenshots as $img)
                <div class="slide">
                    <div class="slide-inner">
                        <img src="{{ asset(ltrim($img, '/')) }}" alt="Screenshot Hafana Travel">
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <div class="slider-controls">
            <button class="slider-btn" id="prevBtn">&#8592;</button>
            <button class="slider-btn" id="nextBtn">&#8594;</button>
        </div>
        @else
        {{-- Placeholder when no screenshots yet --}}
        <div style="max-width: 960px; margin: 0 auto; padding: 0 20px; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            @foreach(['Beranda', 'Paket', 'Profil Jemaah', 'Khutbah Live'] as $label)
            <div style="width: 180px; height: 280px; background: #1e293b; border-radius: 18px; border: 2px dashed #334155; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #64748b; font-size: 12px; font-weight: 600; text-align: center; padding: 16px;">
                <svg width="32" height="32" fill="none" stroke="#475569" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
                {{ $label }}
                <span style="font-size: 11px; font-weight: 400; color: #475569; line-height: 1.5;">Screenshot<br>akan ditambahkan</span>
            </div>
            @endforeach
        </div>
        @endif
    </section>

    {{-- ── FEATURES ─────────────────────────────────────────────────────────── --}}
    <section class="features-section" id="fitur">
        <div class="container">
            <div class="features-header">
                <span class="badge badge-primary">✨ Fitur Aplikasi</span>
                <h2 class="section-title" style="margin-top: 12px;">Semua yang dibutuhkan<br>jemaah, dalam satu aplikasi</h2>
                <p class="section-desc" style="margin: 14px auto 0;">Fitur-fitur berikut tersedia langsung di aplikasi Hafana Travel — bukan rencana, bukan aspirasi.</p>
            </div>

            <div class="features-grid">
                {{-- 1. Paket Umrah & Haji --}}
                <div class="feature-card">
                    <div class="feature-icon">📦</div>
                    <div class="feature-title">Semua Paket Umrah & Haji</div>
                    <p class="feature-desc">Lihat dan bandingkan paket keberangkatan, lengkap dengan tanggal, kota, maskapai, dan harga secara real-time dari sistem Hafana Travel.</p>
                </div>

                {{-- 2. Doa & Dzikir --}}
                <div class="feature-card">
                    <div class="feature-icon">🤲</div>
                    <div class="feature-title">Doa & Dzikir</div>
                    <p class="feature-desc">Koleksi doa harian dan dzikir ibadah yang dapat diakses kapan saja, bahkan tanpa koneksi internet.</p>
                </div>

                {{-- 3. Gallery --}}
                <div class="feature-card">
                    <div class="feature-icon">🖼️</div>
                    <div class="feature-title">Gallery Keberangkatan</div>
                    <p class="feature-desc">Dokumentasi foto perjalanan jemaah Hafana Travel langsung dari sistem admin — kenangan yang tersimpan rapi.</p>
                </div>

                {{-- 4. Khutbah Jumat Live --}}
                <div class="feature-card">
                    <div class="feature-icon">🕌</div>
                    <div class="feature-title">Khutbah Jumat Live</div>
                    <p class="feature-desc">Pantau status siaran langsung khutbah Jumat dari Masjidil Haram (Makkah) dan Masjid Nabawi (Madinah) dengan terjemahan Bahasa Indonesia — langsung dari saluran resmi Al-Haramain Sermons.</p>
                </div>

                {{-- 5. Waktu Sholat --}}
                <div class="feature-card">
                    <div class="feature-icon">⏰</div>
                    <div class="feature-title">Waktu Sholat Otomatis</div>
                    <p class="feature-desc">Jadwal sholat 5 waktu akurat berdasarkan lokasi GPS perangkat jemaah secara otomatis, di mana pun berada.</p>
                </div>

                {{-- 6. Konversi Mata Uang --}}
                <div class="feature-card">
                    <div class="feature-icon">💱</div>
                    <div class="feature-title">Konversi Mata Uang</div>
                    <p class="feature-desc">Hitung konversi Riyal Saudi (SAR) ke Rupiah (IDR) dan mata uang lainnya dengan mudah — praktis saat berbelanja di Tanah Suci.</p>
                </div>

                {{-- 7. Kiblat --}}
                <div class="feature-card">
                    <div class="feature-icon">🧭</div>
                    <div class="feature-title">Kompas Arah Kiblat</div>
                    <p class="feature-desc">Temukan arah kiblat yang tepat dari mana saja menggunakan kompas digital berbasis GPS secara langsung di dalam aplikasi.</p>
                </div>

                {{-- 8. Al-Quran --}}
                <div class="feature-card">
                    <div class="feature-icon">📖</div>
                    <div class="feature-title">Al-Quran Digital</div>
                    <p class="feature-desc">Baca dan telusuri Al-Quran 30 juz langsung di aplikasi, lengkap dengan teks Arab — menemani ibadah sepanjang perjalanan.</p>
                </div>

                {{-- Bonus: Live Rodja TV --}}
                <div class="feature-card">
                    <div class="feature-icon">📡</div>
                    <div class="feature-title">Live Rodja TV</div>
                    <p class="feature-desc">Tonton siaran live Rodja TV langsung dari tab utama aplikasi — kajian Islam yang menemani hari-hari jemaah.</p>
                </div>

                {{-- Bonus: Profil Jemaah --}}
                <div class="feature-card">
                    <div class="feature-icon">🪪</div>
                    <div class="feature-title">Profil & Data Visa Jemaah</div>
                    <p class="feature-desc">Cek nomor visa, nomor paspor, dan data rombongan keberangkatan — lengkap dengan fitur salin satu ketukan untuk kemudahan administrasi.</p>
                </div>
            </div>
        </div>
    </section>

    {{-- ── DOWNLOAD CTA ─────────────────────────────────────────────────────── --}}
    <section class="cta-section">
        <div class="cta-inner">
            <div style="font-size: 48px; margin-bottom: 16px;">🕋</div>
            <h2 class="cta-title">Siap Menemani<br>Perjalanan Suci Anda</h2>
            <p class="cta-subtitle">"Teman ibadah di Tanah Suci." — Download sekarang, gratis untuk seluruh jemaah Hafana Travel.</p>

            <div class="cta-actions">
                <a href="{{ $apkDownloadUrl }}" class="apk-download-btn" id="cta-dl-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/></svg>
                    Download APK Android
                </a>
            </div>

            <p class="cta-android-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                Tersedia untuk Android. Dukungan iOS sedang dalam proses.
            </p>
        </div>
    </section>

    {{-- ── FOOTER ───────────────────────────────────────────────────────────── --}}
    <footer class="footer">
        <div class="footer-logo">
            <img src="{{ asset('images/logo.png') }}" alt="Hafana Travel">
            <span class="footer-logo-text">Hafana Tour & Travel</span>
        </div>
        <p class="footer-tagline">"Teman ibadah di Tanah Suci."</p>
        <div class="footer-links">
            <a href="https://hafanatravel.com" class="footer-link" target="_blank" rel="noopener">hafanatravel.com</a>
            <a href="https://hafanatravel.com/tentang/" class="footer-link" target="_blank" rel="noopener">Tentang Kami</a>
            <a href="{{ $apkDownloadUrl }}" class="footer-link" id="footer-dl-link">Download APK</a>
        </div>
        <p class="footer-copy">&copy; {{ date('Y') }} PT. Haramain Safarindo Hasanah (Hafana Travel). Seluruh hak dilindungi.</p>
    </footer>

    {{-- ── SLIDER SCRIPT ────────────────────────────────────────────────────── --}}
    @if(count($screenshots) > 0)
    <script>
        const track = document.getElementById('sliderTrack');
        const container = document.getElementById('sliderContainer');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        const rawSlides = Array.from(track.children);
        const totalRaw = rawSlides.length;

        if (totalRaw > 0) {
            const clonesBefore = rawSlides.map(n => n.cloneNode(true));
            const clonesAfter  = rawSlides.map(n => n.cloneNode(true));

            track.innerHTML = '';
            [...clonesBefore, ...rawSlides, ...clonesAfter].forEach(s => track.appendChild(s));

            const allSlides = Array.from(track.children);
            let currentIndex = totalRaw;
            let isTransitioning = false;

            function getSlideWidth() { return container.offsetWidth / 3; }

            function setClasses() {
                allSlides.forEach((slide, idx) => {
                    slide.classList.remove('is-left', 'is-center', 'is-right');
                    if (idx === currentIndex)     slide.classList.add('is-center');
                    else if (idx === currentIndex - 1) slide.classList.add('is-left');
                    else if (idx === currentIndex + 1) slide.classList.add('is-right');
                });
            }

            function updateSlider(animate = true) {
                if (animate) track.classList.add('animating');
                else         track.classList.remove('animating');
                setClasses();
                const offset = (currentIndex - 1) * getSlideWidth();
                track.style.transform = `translateX(-${offset}px)`;
            }

            function moveNext() {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex++;
                updateSlider(true);
            }

            function movePrev() {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex--;
                updateSlider(true);
            }

            track.addEventListener('transitionend', (e) => {
                if (e.target !== track) return;
                isTransitioning = false;
                track.classList.remove('animating');
                if (currentIndex >= totalRaw * 2) {
                    currentIndex = totalRaw;
                    updateSlider(false);
                    void track.offsetWidth;
                } else if (currentIndex < totalRaw) {
                    currentIndex = currentIndex + totalRaw;
                    updateSlider(false);
                    void track.offsetWidth;
                }
            });

            nextBtn.addEventListener('click', moveNext);
            prevBtn.addEventListener('click', movePrev);

            allSlides.forEach((slide, idx) => {
                slide.addEventListener('click', () => {
                    if (isTransitioning || idx === currentIndex) return;
                    isTransitioning = true;
                    currentIndex = idx;
                    updateSlider(true);
                });
            });

            // Touch & Drag
            let startX = 0, isDragging = false;
            function startDrag(x) { if (isTransitioning) return; isDragging = true; startX = x; track.classList.remove('animating'); }
            function dragMove(x) { if (!isDragging) return; const d = x - startX; const base = (currentIndex - 1) * getSlideWidth(); track.style.transform = `translateX(-${base - d}px)`; }
            function endDrag(x) { if (!isDragging) return; isDragging = false; const d = x - startX; if (d < -40) moveNext(); else if (d > 40) movePrev(); else updateSlider(true); }

            container.addEventListener('mousedown', e => startDrag(e.clientX));
            window.addEventListener('mousemove', e => dragMove(e.clientX));
            window.addEventListener('mouseup', e => isDragging && endDrag(e.clientX));
            container.addEventListener('touchstart', e => startDrag(e.touches[0].clientX), { passive: true });
            window.addEventListener('touchmove', e => dragMove(e.touches[0].clientX), { passive: true });
            window.addEventListener('touchend', e => isDragging && endDrag(e.changedTouches[0].clientX));
            window.addEventListener('resize', () => updateSlider(false));

            // Auto-play
            let autoPlay = setInterval(moveNext, 3500);
            container.addEventListener('mouseenter', () => clearInterval(autoPlay));
            container.addEventListener('mouseleave', () => { autoPlay = setInterval(moveNext, 3500); });

            setClasses();
            updateSlider(false);
            void track.offsetWidth;
        }
    </script>
    @endif

</body>
</html>
