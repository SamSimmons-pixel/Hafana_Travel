<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') — Hafana Admin</title>

    {{-- =====================================================================
         🎨 THEME — Edit variables here to retheme the ENTIRE admin panel.
         Like editing :root CSS variables = your single source of truth.
    ====================================================================== --}}
    <style>
        :root {
            /* ── Brand Colors ── */
            --primary:        #00AEEF;
            --primary-dark:   #0099d4;
            --primary-light:  #e6f7fd;

            /* ── Backgrounds ── */
            --bg:             #f0f4f8;
            --surface:        #ffffff;

            /* ── Text ── */
            --text-primary:   #1a2a3a;
            --text-muted:     #6b7f91;

            /* ── Borders ── */
            --border:         #dde8f0;

            /* ── Semantic States ── */
            --success:        #0e6b41;
            --success-bg:     #d1fae5;
            --danger:         #b91c1c;
            --danger-bg:      #fee2e2;
            --warning:        #92400e;
            --warning-bg:     #fef3c7;

            /* ── Action Button Colors (High Contrast) ── */
            --btn-edit-bg:    #f59e0b;
            --btn-edit-fg:    #ffffff;
            --btn-delete-bg:  #ef4444;
            --btn-delete-fg:  #ffffff;
            --btn-info-bg:    #00AEEF;
            --btn-info-fg:    #ffffff;
        }

        /* ── Reset ── */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text-primary); }

        /* ── Navbar ── */
        nav {
            background: var(--primary);
            padding: 14px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .nav-left { display: flex; align-items: center; gap: 24px; }
        .nav-brand { color: #fff; font-size: 18px; font-weight: 800; letter-spacing: 0.2px; text-decoration: none; }
        .nav-links { display: flex; align-items: center; gap: 12px; }
        .nav-link {
            color: rgba(255,255,255,0.85);
            font-size: 13px;
            text-decoration: none;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 8px;
            transition: background .15s;
        }
        .nav-link:hover, .nav-link.active {
            background: rgba(255,255,255,0.2);
            color: #ffffff;
        }
        .nav-logout {
            background: rgba(255,255,255,0.15);
            border: none;
            padding: 7px 14px;
            border-radius: 8px;
            cursor: pointer;
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            transition: background .15s;
        }
        .nav-logout:hover { background: rgba(255,255,255,0.3); }

        /* ── Main Container ── */
        main { padding: 28px; max-width: 1200px; margin: 0 auto; }

        /* ── Page Header ── */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .page-header h1 { font-size: 22px; color: var(--text-primary); font-weight: 800; }

        /* ── Alerts ── */
        .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 14px; font-weight: 500; }
        .alert-success { background: var(--success-bg); color: var(--success); border-left: 4px solid var(--success); }
        .alert-error   { background: var(--danger-bg);  color: var(--danger);  border-left: 4px solid var(--danger); }

        /* ── Buttons ── */
        .btn-primary {
            background: var(--primary);
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background .18s;
        }
        .btn-primary:hover { background: var(--primary-dark); }

        /* ── Table ── */
        .table-wrap { overflow-x: auto; }
        table {
            width: 100%;
            background: var(--surface);
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            border-collapse: collapse;
        }
        th {
            background: var(--primary);
            color: #fff;
            padding: 13px 16px;
            text-align: left;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
        }
        td {
            padding: 13px 16px;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
            color: var(--text-primary);
            vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8fafc; }

        /* ── Status Badge ── */
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
        }
        .badge-on  { background: var(--success-bg); color: var(--success); }
        .badge-off { background: var(--danger-bg);  color: var(--danger); }
        .badge-info{ background: var(--primary-light); color: var(--primary-dark); }

        /* ── Action Buttons (HIGH CONTRAST) ── */
        .actions { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
        .btn-action {
            padding: 7px 14px;
            border-radius: 7px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            text-decoration: none;
            display: inline-block;
            transition: filter .15s, transform .1s;
            white-space: nowrap;
        }
        .btn-action:hover { filter: brightness(0.9); transform: translateY(-1px); }
        .btn-action:active { transform: translateY(0); }
        .btn-edit   { background: var(--btn-edit-bg);   color: var(--btn-edit-fg); }
        .btn-delete { background: var(--btn-delete-bg); color: var(--btn-delete-fg); }
        .btn-info   { background: var(--btn-info-bg);   color: var(--btn-info-fg); }

        /* ── Toggle Switch (Sembunyikan / Tampilkan) ── */
        .switch-wrap { display: flex; align-items: center; gap: 8px; }
        .switch-label { font-size: 11px; color: var(--text-muted); font-weight: 500; min-width: 70px; }
        .switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
            flex-shrink: 0;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #cbd5e1;
            transition: .35s;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
            background: white;
            transition: .35s;
            box-shadow: 0 1px 4px rgba(0,0,0,0.18);
        }
        input:checked + .slider { background: var(--primary); }
        input:focus  + .slider  { box-shadow: 0 0 0 3px rgba(0,174,239,0.25); }
        input:checked + .slider:before { transform: translateX(24px); }
        .slider.round        { border-radius: 28px; }
        .slider.round:before { border-radius: 50%; }

        /* ── Empty State ── */
        .empty { text-align: center; padding: 56px; color: var(--text-muted); font-size: 15px; }

        /* ── Form Styles ── */
        .card, .form-card { background: var(--surface); border-radius: 14px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
        .form-group { margin-bottom: 18px; }
        label { display: block; font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
        input[type="text"], input[type="email"], input[type="password"],
        input[type="date"], input[type="number"], input[type="file"],
        textarea, select {
            width: 100%;
            padding: 11px 14px;
            border: 1.5px solid var(--border);
            border-radius: 9px;
            font-size: 14px;
            outline: none;
            font-family: inherit;
            color: var(--text-primary);
            background: var(--surface);
            transition: border-color .18s;
        }
        input:focus, textarea:focus, select:focus { border-color: var(--primary); }
        textarea { resize: vertical; min-height: 80px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .toggle-row { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
        .toggle-row input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary); }
        .form-actions { display: flex; gap: 12px; margin-top: 24px; }
        .btn-secondary {
            background: var(--bg);
            color: var(--text-primary);
            border: 1.5px solid var(--border);
            padding: 11px 22px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn-secondary:hover { background: var(--border); }
        .error-msg { color: var(--danger); font-size: 12px; margin-top: 4px; }
        .current-img img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid var(--border); margin-top: 8px; }
        .hint { color: var(--text-muted); font-size: 12px; margin-top: 4px; }

        /* ── Pagination Styling (Laravel Links Override) ── */
        .pagination-wrap {
            margin-top: 20px;
            background: var(--surface);
            border-radius: 12px;
            padding: 14px 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            border: 1px solid var(--border);
        }
        nav[role="navigation"] {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
        }
        nav[role="navigation"] svg {
            width: 14px !important;
            height: 14px !important;
            max-width: 14px !important;
            max-height: 14px !important;
            fill: currentColor;
            display: inline-block !important;
            vertical-align: middle;
        }
        nav[role="navigation"] p {
            font-size: 13px !important;
            color: var(--text-muted) !important;
            margin: 0 !important;
        }
        nav[role="navigation"] p .font-medium,
        nav[role="navigation"] p span {
            font-weight: 700 !important;
            color: var(--text-primary) !important;
        }
        nav[role="navigation"] a,
        nav[role="navigation"] span.relative {
            font-size: 13px !important;
            font-weight: 600 !important;
            color: var(--text-primary) !important;
            text-decoration: none !important;
            padding: 6px 12px !important;
            border-radius: 8px !important;
            border: 1px solid var(--border) !important;
            background: var(--surface) !important;
            transition: all .15s ease;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1.2 !important;
            box-shadow: none !important;
        }
        nav[role="navigation"] a:hover {
            background: var(--primary-light) !important;
            color: var(--primary-dark) !important;
            border-color: var(--primary) !important;
        }
        nav[role="navigation"] span[aria-current="page"] span,
        nav[role="navigation"] span[aria-current="page"] {
            background: var(--primary) !important;
            color: #ffffff !important;
            border-color: var(--primary) !important;
            font-weight: 800 !important;
        }
        nav[role="navigation"] span[aria-disabled="true"] {
            opacity: 0.45 !important;
            cursor: not-allowed !important;
            background: var(--bg) !important;
        }
        nav[role="navigation"] > div {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        nav[role="navigation"] .inline-flex,
        nav[role="navigation"] span.z-0 {
            display: flex !important;
            gap: 4px !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
        }
        nav[role="navigation"] .sm\:hidden {
            display: none !important;
        }
        nav[role="navigation"] .sm\:flex-1 {
            display: flex !important;
            width: 100% !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        /* ── Rich Text Editor (with Draggable Images) ── */
        .editor-container {
            width: 100%;
            background: var(--surface);
            border: 1.5px solid var(--border);
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            overflow: hidden;
            transition: border-color .18s;
        }
        .editor-container:focus-within {
            border-color: var(--primary);
        }
        .editor-toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--bg);
            border-bottom: 1.5px solid var(--border);
            flex-wrap: wrap;
        }
        .editor-toolbar button, .editor-toolbar .image-upload-btn, .editor-toolbar select {
            padding: 6px 12px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text-primary);
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: background .15s, border-color .15s;
        }
        .editor-toolbar select {
            width: auto;
            padding: 5px 10px;
        }
        .editor-toolbar button:hover, .editor-toolbar .image-upload-btn:hover, .editor-toolbar select:hover {
            background: #e2e8f0;
            border-color: #cbd5e1;
        }
        .editor-toolbar .btn-active {
            background: var(--primary-light);
            color: var(--primary-dark);
            border-color: var(--primary);
        }
        #editor {
            min-height: 380px;
            max-height: 650px;
            padding: 16px 20px;
            outline: none;
            font-size: 15px;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--surface);
            overflow-y: auto;
        }
        #editor[placeholder]:empty:before {
            content: attr(placeholder);
            color: var(--text-muted);
            pointer-events: none;
            display: block;
        }
        /* Draggable image inside editor */
        #editor img {
            max-width: 100%;
            height: auto;
            cursor: grab;
            border: 2px dashed transparent;
            border-radius: 8px;
            transition: border-color 0.2s, opacity 0.2s, box-shadow 0.2s;
            display: block;
            margin: 12px 0;
            user-select: none;
        }
        #editor img:hover {
            border: 2px dashed var(--primary);
            box-shadow: 0 4px 12px rgba(0,174,239,0.15);
        }
        #editor img:active {
            cursor: grabbing;
        }
        /* Drag over visual effect for paragraphs or drop targets */
        .drag-over {
            border-top: 3px solid var(--primary) !important;
        }
    </style>
</head>
<body>

    {{-- ── Navbar ── --}}
    <nav>
        <div class="nav-left">
            <a href="{{ route('admin.pakets.index') }}" class="nav-brand">🕌 Hafana Travel Admin</a>
            <div class="nav-links">
                <a href="{{ route('admin.pakets.index') }}" class="nav-link {{ request()->routeIs('admin.pakets.*') ? 'active' : '' }}">📦 Paket Umrah</a>
                <a href="{{ route('admin.articles.index') }}" class="nav-link {{ request()->routeIs('admin.articles.*') ? 'active' : '' }}">📰 Artikel</a>
                <a href="{{ route('admin.galeri.index') }}" class="nav-link {{ request()->routeIs('admin.galeri.*') ? 'active' : '' }}">🖼️ Galeri & Testimoni</a>
                <a href="{{ route('admin.settings.index') }}" class="nav-link {{ request()->routeIs('admin.settings.*') ? 'active' : '' }}">⚙️ Logo & Pengaturan</a>
                <a href="{{ route('admin.groups.index') }}" class="nav-link {{ request()->routeIs('admin.groups.*') ? 'active' : '' }}">👥 Group & Import JSON</a>
                <a href="{{ route('admin.users.index') }}" class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}">🧕 Data Jemaah</a>
                <a href="{{ route('admin.admins.index') }}" class="nav-link {{ request()->routeIs('admin.admins.*') ? 'active' : '' }}">🛡️ Kelola Admin</a>
            </div>
        </div>
        <form method="POST" action="{{ route('admin.logout') }}" style="margin:0">
            @csrf
            <button type="submit" class="nav-logout">
                Logout ({{ Auth::guard('admin')->user()->name }})
            </button>
        </form>
    </nav>

    {{-- ── Main Content ── --}}
    <main>
        @if(session('success'))
            <div class="alert alert-success">✅ {{ session('success') }}</div>
        @endif
        @if(session('error'))
            <div class="alert alert-error">❌ {{ session('error') }}</div>
        @endif

        @yield('content')
    </main>

</body>
</html>
