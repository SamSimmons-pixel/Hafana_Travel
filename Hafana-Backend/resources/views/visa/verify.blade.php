@extends('visa.layout')

@section('title', 'Verifikasi & Cek Visa Jemaah')

@section('content')
<div class="flex flex-col gap-5 py-2">

    <!-- Top Greeting Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-br from-hafana-primary to-hafana-primaryDark text-white shadow-lg relative overflow-hidden">
        <div class="relative z-10">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-sm mb-2">
                <svg class="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Pusat Data Jemaah
            </span>
            <h2 class="text-xl font-extrabold tracking-tight text-white leading-tight">
                Cek Data Visa & Paspor
            </h2>
            <p class="text-xs text-blue-100 mt-1.5 leading-relaxed">
                Silakan masukkan Nama Lengkap dan Tanggal Lahir sesuai paspor untuk memverifikasi dokumen keberangkatan.
            </p>
        </div>
        <!-- Background Mosque/Abstract Shape -->
        <div class="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
    </div>

    <!-- Verification Card -->
    <div class="bg-hafana-surface dark:bg-hafana-darkSurface border border-hafana-border dark:border-hafana-darkBorder rounded-2xl p-5 shadow-card">
        
        @if(session('error'))
            <div class="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
                <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ session('error') }}</span>
            </div>
        @endif

        <form id="verify-form" action="{{ route('visa.verify') }}" method="POST" class="flex flex-col gap-4">
            @csrf

            <!-- Field 1: Nama Lengkap with Autocomplete Dropdown -->
            <div class="relative">
                <label for="name" class="block text-xs font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary mb-1.5">
                    Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value="{{ old('name') }}"
                        placeholder="Contoh: ABDUL BASITH" 
                        autocomplete="off"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-hafana-border dark:border-hafana-darkBorder bg-hafana-surfaceAlt dark:bg-hafana-darkSurfaceAlt text-hafana-textPrimary dark:text-hafana-darkTextPrimary text-sm font-semibold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-hafana-primary focus:border-transparent transition-all placeholder:text-hafana-textMuted placeholder:font-normal"
                    >
                    <div id="name-spinner" class="absolute right-3.5 top-1/2 -translate-y-1/2 hidden">
                        <svg class="animate-spin h-4 w-4 text-hafana-primary dark:text-brand-500" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>

                <!-- Autocomplete Dropdown Menu -->
                <div id="autocomplete-dropdown" class="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 border border-hafana-border dark:border-slate-700 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto hidden divide-y divide-slate-100 dark:divide-slate-700/60">
                    <!-- Dynamic suggestions rendered via JS -->
                </div>
            </div>

            <!-- Field 2: Tanggal Lahir -->
            <div>
                <label for="tanggal_lahir" class="block text-xs font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary mb-1.5">
                    Tanggal Lahir <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <input 
                        type="date" 
                        id="tanggal_lahir" 
                        name="tanggal_lahir" 
                        value="{{ old('tanggal_lahir') }}"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-hafana-border dark:border-hafana-darkBorder bg-hafana-surfaceAlt dark:bg-hafana-darkSurfaceAlt text-hafana-textPrimary dark:text-hafana-darkTextPrimary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-hafana-primary focus:border-transparent transition-all"
                    >
                </div>
                <p class="text-[11px] text-hafana-textMuted dark:text-slate-400 mt-1">
                    Pilih tanggal lahir persis seperti di paspor.
                </p>
            </div>

            <!-- Submit Button -->
            <button 
                type="submit" 
                id="submit-btn"
                class="w-full mt-2 py-3.5 px-4 rounded-xl bg-hafana-primary hover:bg-hafana-primaryDark active:scale-[0.98] text-white text-sm font-bold tracking-wide shadow-button transition-all flex items-center justify-center gap-2"
            >
                <span>Verifikasi & Tampilkan Visa</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
            </button>
        </form>
    </div>

    <!-- Quick Help & Privacy Card -->
    <div class="p-4 rounded-2xl bg-hafana-surfaceAlt dark:bg-hafana-darkSurfaceAlt border border-hafana-border dark:border-hafana-darkBorder flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
        </div>
        <div class="text-xs">
            <h4 class="font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary">
                Keamanan & Kerahasiaan Data
            </h4>
            <p class="text-hafana-textSecondary dark:text-hafana-darkTextSecondary mt-0.5 leading-relaxed">
                Data Visa dan Paspor hanya dapat diakses oleh jemaah terdaftar yang terverifikasi dalam sistem resmi Hafana Travel.
            </p>
        </div>
    </div>

    <!-- WhatsApp Support Link -->
    <div class="text-center py-1">
        <a 
            href="https://api.whatsapp.com/send?phone=6281222322360&text=Assalamualaikum%20Admin%20Hafana%20Travel,%20saya%20butuh%20bantuan%20pengecekan%20Visa%20Umrah" 
            target="_blank"
            class="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.572 4.187 1.571 5.941l-1.664 6.079 6.242-1.637c1.705.941 3.668 1.477 5.851 1.477 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
            </svg>
            <span>Butuh bantuan? Chat Admin WhatsApp</span>
        </a>
    </div>

</div>
@endsection

@section('scripts')
<script>
    const nameInput = document.getElementById('name');
    const spinner = document.getElementById('name-spinner');
    const dropdown = document.getElementById('autocomplete-dropdown');
    let debounceTimer;

    // Search names as user types (debounced 250ms)
    nameInput.addEventListener('input', function() {
        const query = this.value.toUpperCase().trim();
        this.value = this.value.toUpperCase(); // Force uppercase like app

        clearTimeout(debounceTimer);

        if (query.length < 2) {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            return;
        }

        spinner.classList.remove('hidden');

        debounceTimer = setTimeout(() => {
            fetch(`{{ route('visa.search-names') }}?query=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    spinner.classList.add('hidden');
                    if (Array.isArray(data) && data.length > 0) {
                        dropdown.innerHTML = data.map(item => `
                            <button type="button" class="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between group" onclick="selectName('${item.name}')">
                                <div>
                                    <div class="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-hafana-primary dark:group-hover:text-brand-500">
                                        ${item.name}
                                    </div>
                                    ${item.group_name ? `<div class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Rombongan: ${item.group_name}</div>` : ''}
                                </div>
                                <svg class="w-4 h-4 text-slate-400 group-hover:text-hafana-primary dark:group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        `).join('');
                        dropdown.classList.remove('hidden');
                    } else {
                        dropdown.innerHTML = `
                            <div class="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic text-center">
                                Nama tidak ditemukan dalam rombongan aktif
                            </div>
                        `;
                        dropdown.classList.remove('hidden');
                    }
                })
                .catch(() => {
                    spinner.classList.add('hidden');
                    dropdown.classList.add('hidden');
                });
        }, 250);
    });

    function selectName(name) {
        nameInput.value = name;
        dropdown.classList.add('hidden');
        document.getElementById('tanggal_lahir').focus();
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!nameInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
</script>
@endsection
