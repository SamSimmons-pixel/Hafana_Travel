<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy — Hafana Travel</title>
    <meta name="description" content="Privacy Policy for the Hafana Tour &amp; Travel app: information we collect, how we use it, storage, and your rights.">
    <meta name="theme-color" content="#254091">
    <meta name="robots" content="index, follow">

    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <link rel="shortcut icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary:        #254091;
            --primary-dark:   #172757;
            --bg:             #f2f6fa;
            --surface:        #ffffff;
            --text-primary:   #1a2a3a;
            --text-secondary: #6b7f91;
            --text-muted:     #9eb3c8;
            --border:         #dde8f0;
            --dark-bg:        #0f172a;
            --dark-surface:   #1e293b;
            --dark-text:      #f8fafc;
            --dark-muted:     #94a3b8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text-primary);
            line-height: 1.7;
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
            max-width: 820px;
            margin: 0 auto;
            height: 64px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .navbar-logo { height: 32px; width: auto; object-fit: contain; }
        .navbar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }
        .navbar-brand-text { font-size: 15px; font-weight: 800; color: var(--text-primary); }
        .navbar-brand-sub { font-size: 11px; font-weight: 500; color: var(--text-muted); }

        /* ── CONTENT ────────────────────────────────────────────────────── */
        .wrap {
            max-width: 820px;
            margin: 0 auto;
            padding: 48px 20px 80px;
        }

        .page-header {
            padding-bottom: 28px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 32px;
        }

        h1 {
            font-size: clamp(24px, 4vw, 32px);
            font-weight: 800;
            color: var(--text-primary);
        }

        .updated {
            color: var(--text-muted);
            font-size: 13px;
            margin-top: 8px;
        }

        h2 {
            font-size: 19px;
            font-weight: 700;
            color: var(--primary);
            margin-top: 36px;
            margin-bottom: 12px;
        }

        p, li {
            font-size: 15px;
            color: var(--text-secondary);
        }

        ul { margin: 10px 0 10px 20px; }
        li { margin-bottom: 6px; }

        strong { color: var(--text-primary); }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 14px 0;
            font-size: 14px;
        }
        th, td {
            border: 1px solid var(--border);
            padding: 10px 12px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: var(--surface);
            color: var(--text-primary);
            font-weight: 700;
        }
        td { color: var(--text-secondary); }

        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 20px 22px;
            margin-top: 14px;
        }
        .card p { margin-bottom: 6px; }
        .card p:last-child { margin-bottom: 0; }

        a { color: var(--primary); text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* ── FOOTER ─────────────────────────────────────────────────────── */
        .footer {
            background: var(--dark-bg);
            border-top: 1px solid #1e293b;
            padding: 32px 20px;
            text-align: center;
        }
        .footer-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 12px;
        }
        .footer-logo img { height: 28px; object-fit: contain; }
        .footer-logo-text { font-size: 14px; font-weight: 800; color: var(--dark-text); }
        .footer-links {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin: 12px 0;
        }
        .footer-link { font-size: 13px; color: #64748b; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--dark-text); }
        .footer-copy { font-size: 12px; color: #475569; margin-top: 12px; }

        /* ── RESPONSIVE ─────────────────────────────────────────────────── */
        @media (max-width: 600px) {
            table { font-size: 13px; }
            th, td { padding: 8px 10px; }
        }
    </style>
</head>
<body>

    <nav class="navbar">
        <div class="navbar-inner">
            <a href="{{ url('/app') }}" class="navbar-brand">
                <img src="{{ asset('images/logo.png') }}" alt="Hafana Travel Logo" class="navbar-logo">
                <div>
                    <div class="navbar-brand-text">Hafana Tour &amp; Travel</div>
                    <div class="navbar-brand-sub">Umrah &amp; Haji</div>
                </div>
            </a>
        </div>
    </nav>

    <div class="wrap">
        <div class="page-header">
            <h1>Privacy Policy</h1>
            <p class="updated">Effective &amp; last updated: {{ date('F d, Y') }}</p>
        </div>

        <p>
            This Privacy Policy explains how <strong>Hafana Tour &amp; Travel</strong>
            ("we", "us") collects, uses, stores, and protects your data when you use the
            <strong>Hafana Travel</strong> mobile application ("App") available on the
            Google Play Store. By using the App, you agree to the practices described in
            this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following information to operate the App's features:</p>

        <table>
            <tr>
                <th>Data Type</th>
                <th>Purpose of Collection</th>
            </tr>
            <tr>
                <td>Full name &amp; date of birth</td>
                <td>Verifying the identity of pilgrims to sign in to the App, matched against the Umrah/Hajj package registration records held by the Hafana Travel office.</td>
            </tr>
            <tr>
                <td>Phone number (optional, self-entered)</td>
                <td>Connecting you with our admin team via WhatsApp and keeping pilgrim contact information up to date.</td>
            </tr>
            <tr>
                <td>GPS location (device)</td>
                <td>Calculating prayer times based on your current coordinates. Location is processed directly in real time and is <strong>not stored</strong> on our servers.</td>
            </tr>
            <tr>
                <td>Technical device data (logs, OS version, device type)</td>
                <td>General diagnostics and bug fixing.</td>
            </tr>
        </table>

        <h2>2. How We Use Information</h2>
        <ul>
            <li>Authenticating pilgrim accounts so that only registered pilgrims in an active group can access the App.</li>
            <li>Displaying relevant Umrah/Hajj package information, articles, and gallery content.</li>
            <li>Providing worship features: prayer times, Qibla direction, the Qur'an, and daily prayers &amp; remembrance (doa &amp; dzikir).</li>
            <li>Connecting you with our admin team via WhatsApp when you choose to contact us.</li>
        </ul>

        <h2>3. Sharing Data with Third Parties</h2>
        <p>
            We <strong>do not sell</strong> your personal data. The App calls several
            third-party services to power specific features, as follows:
        </p>
        <ul>
            <li><strong>Aladhan API</strong> — calculates prayer times based on GPS coordinates sent directly from your device.</li>
            <li><strong>EQuran.id</strong> — provides Qur'an text and translations (does not receive your personal data).</li>
            <li><strong>open.er-api.com</strong> — provides currency exchange rates for the conversion feature (does not receive your personal data).</li>
            <li><strong>Google Qibla Finder</strong> — opened via an in-app browser to determine the Qibla direction using device sensors.</li>
            <li><strong>YouTube</strong> — plays gallery videos and the live Friday sermon (khutbah) broadcast.</li>
            <li><strong>WhatsApp</strong> — opens a conversation with the Hafana Travel admin at your own request.</li>
        </ul>
        <p>
            The third-party services listed above have their own privacy policies and are
            responsible for the data processed through their respective platforms.
        </p>

        <h2>4. Data Storage &amp; Security</h2>
        <p>
            Account data (name, date of birth, phone number) is stored on Hafana Travel's
            own servers over an encrypted connection (HTTPS). Your sign-in session is
            stored securely on your device using the operating system's built-in encrypted
            storage (Android Keystore / iOS Keychain), never as plain text.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
            <li>Request access to, or a copy of, the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and personal data from our systems.</li>
        </ul>
        <p>
            To exercise any of these rights, please contact us using the details at the
            bottom of this page.
        </p>

        <h2>6. Children</h2>
        <p>
            This App is intended for general pilgrims registered for Umrah/Hajj packages
            and is not specifically directed at children under the age of 13 without
            parental or guardian supervision.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Any changes will be
            published on this page along with an updated revision date.
        </p>

        <h2>8. Contact Us</h2>
        <div class="card">
            <p><strong>Hafana Tour &amp; Travel</strong></p>
            <p>Official website: <a href="https://hafanatravel.com" target="_blank" rel="noopener">hafanatravel.com</a></p>
            <p>WhatsApp Admin: <a href="https://api.whatsapp.com/send?phone=6281222322360" target="_blank" rel="noopener">+62 812-2232-2360</a></p>
        </div>
    </div>

    <footer class="footer">
        <div class="footer-logo">
            <img src="{{ asset('images/logo.png') }}" alt="Hafana Travel">
            <span class="footer-logo-text">Hafana Tour &amp; Travel</span>
        </div>
        <div class="footer-links">
            <a href="{{ url('/app') }}" class="footer-link">Hafana Travel App</a>
            <a href="https://hafanatravel.com" class="footer-link" target="_blank" rel="noopener">hafanatravel.com</a>
        </div>
        <p class="footer-copy">&copy; {{ date('Y') }} PT. Haramain Safarindo Hasanah (Hafana Travel). All rights reserved.</p>
    </footer>

</body>
</html>
