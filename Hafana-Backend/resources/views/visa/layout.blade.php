<!DOCTYPE html>
<html lang="id" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>@yield('title', 'Verifikasi & Cek Visa Jemaah') — Hafana Tour & Travel</title>
    <meta name="description" content="Portal Resmi Pengecekan Visa & Data Keberangkatan Jemaah Umrah PT. Haramain Safarindo Hasanah (Hafana Travel)">
    <meta name="theme-color" content="#254091">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0f4ff',
                            100: '#e0eaff',
                            200: '#c7d8fe',
                            500: '#4976ff',
                            700: '#254091',
                            800: '#172757',
                            900: '#0f172a',
                        },
                        hafana: {
                            primary: '#254091',
                            primaryDark: '#172757',
                            primaryLight: '#f7f7f7',
                            bg: '#f2f6fa',
                            surface: '#ffffff',
                            surfaceAlt: '#f8fafc',
                            textPrimary: '#1a2a3a',
                            textSecondary: '#6b7f91',
                            textMuted: '#9eb3c8',
                            border: '#dde8f0',
                            // Dark mode
                            darkBg: '#0f172a',
                            darkSurface: '#1e293b',
                            darkSurfaceAlt: '#334155',
                            darkTextPrimary: '#f8fafc',
                            darkTextSecondary: '#94a3b8',
                            darkBorder: '#334155',
                            darkPrimary: '#4976ff',
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                    },
                    boxShadow: {
                        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
                        'card-hover': '0 8px 24px rgba(37, 64, 145, 0.08)',
                        'button': '0 4px 14px rgba(37, 64, 145, 0.25)',
                    }
                }
            }
        }
    </script>

    <!-- Custom CSS Variables for Theme Consistency -->
    <style>
        :root {
            --bg-color: #f2f6fa;
            --surface-color: #ffffff;
            --surface-alt: #f8fafc;
            --text-primary: #1a2a3a;
            --text-secondary: #6b7f91;
            --border-color: #dde8f0;
            --primary-color: #254091;
            --primary-light: #f0f4ff;
        }

        .dark {
            --bg-color: #0f172a;
            --surface-color: #1e293b;
            --surface-alt: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --border-color: #334155;
            --primary-color: #4976ff;
            --primary-light: #233044;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            transition: background-color 0.25s ease, color 0.25s ease;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #475569;
        }
    </style>
</head>
<body class="h-full flex flex-col antialiased selection:bg-blue-600 selection:text-white">

    <!-- Top Floating Toast Notification -->
    <div id="toast" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none opacity-0 translate-y-[-20px]">
        <div id="toast-inner" class="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-300">
            <svg class="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
            <span id="toast-message">Berhasil disalin!</span>
        </div>
    </div>

    <!-- Main Mobile-First Wrapper -->
    <div class="w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl relative bg-hafana-bg dark:bg-hafana-darkBg transition-colors duration-200">
        
        <!-- Header Bar -->
        <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-hafana-border dark:border-hafana-darkBorder px-4 py-3.5 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-3">
                <img src="{{ !empty($appLogo) ? asset('storage/' . $appLogo) : asset('images/logo.png') }}" alt="Hafana Travel Logo" class="h-8 w-auto object-contain">
                <div>
                    <h1 class="text-sm font-extrabold text-hafana-textPrimary dark:text-hafana-darkTextPrimary tracking-tight leading-tight">
                        Hafana Travel
                    </h1>
                    <p class="text-[11px] font-medium text-hafana-textSecondary dark:text-hafana-darkTextSecondary">
                        Portal Verifikasi & Visa
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <!-- Dark / Light Theme Toggle -->
                <button type="button" id="theme-toggle" onclick="toggleDarkMode()" aria-label="Ganti Tema" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm">
                    <!-- Sun Icon (shown in dark mode) -->
                    <svg id="theme-icon-sun" class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <!-- Moon Icon (shown in light mode) -->
                    <svg id="theme-icon-moon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                </button>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 flex flex-col justify-start">
            @yield('content')
        </main>

        <!-- Footer -->
        <footer class="mt-auto px-4 py-6 text-center border-t border-hafana-border dark:border-hafana-darkBorder text-hafana-textSecondary dark:text-hafana-darkTextSecondary">
            <p class="text-xs font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary tracking-wider uppercase">
                Hafana Tour & Travel
            </p>
            <p class="text-[11px] text-hafana-primary dark:text-brand-500 font-semibold mt-0.5">
                PT. Haramain Safarindo Hasanah • PPIU SK No. 26052300381750003
            </p>
            <p class="text-[11px] text-hafana-textMuted dark:text-slate-400 mt-2 leading-relaxed">
                Penyelenggara perjalanan umrah resmi di bawah bimbingan Ustadz Badru Salam, Lc (Pembina Radio Rodja & Rodja TV).
            </p>
            <p class="text-[10px] text-hafana-textMuted dark:text-slate-500 mt-3 font-medium">
                &copy; 2024–{{ date('Y') }} PT. Haramain Safarindo Hasanah. All rights reserved.
            </p>
        </footer>

    </div>

    <!-- Theme & Global JavaScript Utilities -->
    <script>
        // Check theme on page load
        if (localStorage.getItem('visa_theme') === 'dark' || (!('visa_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            document.getElementById('theme-icon-sun').classList.remove('hidden');
            document.getElementById('theme-icon-moon').classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            document.getElementById('theme-icon-sun').classList.add('hidden');
            document.getElementById('theme-icon-moon').classList.remove('hidden');
        }

        function toggleDarkMode() {
            const isDark = document.documentElement.classList.toggle('dark');
            if (isDark) {
                localStorage.setItem('visa_theme', 'dark');
                document.getElementById('theme-icon-sun').classList.remove('hidden');
                document.getElementById('theme-icon-moon').classList.add('hidden');
            } else {
                localStorage.setItem('visa_theme', 'light');
                document.getElementById('theme-icon-sun').classList.add('hidden');
                document.getElementById('theme-icon-moon').classList.remove('hidden');
            }
        }

        // Global Copy to Clipboard Helper with Toast Feedback
        function copyToClipboard(text, label) {
            if (!text || text.trim() === '' || text === '-') {
                showToast(label + ' belum tersedia', 'error');
                return;
            }

            navigator.clipboard.writeText(text).then(() => {
                showToast(label + ' berhasil disalin!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast(label + ' berhasil disalin!');
            });
        }

        let toastTimeout;
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-message');
            
            toastMsg.textContent = message;
            toast.classList.remove('opacity-0', 'translate-y-[-20px]');
            toast.classList.add('opacity-100', 'translate-y-0');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'translate-y-[-20px]');
            }, 2500);
        }
    </script>
    @yield('scripts')
</body>
</html>
