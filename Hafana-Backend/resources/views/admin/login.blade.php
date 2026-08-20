<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Hafana Travel</title>
    <style>
        /* Login page uses the same CSS variables as layout.blade.php */
        :root {
            --primary:       #00AEEF;
            --primary-dark:  #0099d4;
            --primary-light: #e6f7fd;
            --bg:            #f0f4f8;
            --surface:       #ffffff;
            --text-primary:  #1a2a3a;
            --text-muted:    #6b7f91;
            --border:        #dde8f0;
            --danger:        #b91c1c;
            --danger-bg:     #fee2e2;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: var(--primary);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .login-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 24px;
        }
        .card {
            background: var(--surface);
            border-radius: 18px;
            padding: 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .logo { text-align: center; margin-bottom: 28px; }
        .logo-icon {
            width: 72px; height: 72px;
            border-radius: 36px;
            background: var(--primary-light);
            display: flex; align-items: center; justify-content: center;
            font-size: 32px;
            margin: 0 auto 14px;
        }
        .logo h1 { color: var(--primary); font-size: 22px; font-weight: 800; }
        .logo p  { color: var(--text-muted); font-size: 13px; margin-top: 4px; }

        .form-group { margin-bottom: 18px; }
        label { display: block; font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            border: 1.5px solid var(--border);
            border-radius: 10px;
            font-size: 14px;
            outline: none;
            font-family: inherit;
            color: var(--text-primary);
            transition: border-color .18s;
        }
        input:focus { border-color: var(--primary); }
        .btn {
            width: 100%;
            background: var(--primary);
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 14px;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            margin-top: 8px;
            transition: background .18s;
        }
        .btn:hover { background: var(--primary-dark); }
        .alert-error {
            background: var(--danger-bg);
            color: var(--danger);
            border-left: 4px solid var(--danger);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            margin-bottom: 18px;
        }
        footer { text-align: center; color: rgba(255,255,255,0.5); font-size: 11px; padding: 16px; }
    </style>
</head>
<body>
    <div class="login-wrap">
        <div class="card">
            <div class="logo">
                <div class="logo-icon">🕌</div>
                <h1>Hafana Travel</h1>
                <p>Admin Panel — Manajemen Paket Umrah</p>
            </div>

            @if($errors->any())
                <div class="alert-error">{{ $errors->first() }}</div>
            @endif

            <form method="POST" action="{{ route('admin.login.submit') }}">
                @csrf
                <div class="form-group">
                    <label>Email Admin</label>
                    <input type="email" name="email" value="{{ old('email') }}"
                        placeholder="admin@hafana.com" required autofocus>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="••••••••" required>
                </div>
                <button class="btn" type="submit">Masuk ke Panel Admin</button>
            </form>
        </div>
    </div>
    <footer>© 2026 Hafana Travel. All rights reserved.</footer>
</body>
</html>
