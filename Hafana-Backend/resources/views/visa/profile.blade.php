@extends('visa.layout')

@section('title', 'Data Visa & Profil Jemaah — ' . $user->name)

@section('content')
<div class="flex flex-col gap-4 py-2">

    <!-- Profile Header Card (Identik dengan Mobile App Header) -->
    <div class="p-5 rounded-2xl bg-gradient-to-br from-hafana-primary to-hafana-primaryDark text-white shadow-lg relative overflow-hidden">
        <div class="flex items-center gap-4 relative z-10">
            <!-- Initial Avatar -->
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-black text-xl shadow-inner flex-shrink-0">
                {{ strtoupper(substr($user->name, 0, 2)) }}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 backdrop-blur-sm">
                        <svg class="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Terverifikasi
                    </span>
                </div>
                <h2 class="text-base font-extrabold text-white tracking-tight truncate mt-1">
                    {{ $user->name }}
                </h2>
                <p class="text-xs text-blue-200 truncate font-medium mt-0.5">
                    {{ $user->group?->nama_group ?? 'Jemaah Umrah Hafana' }}
                </p>
            </div>
        </div>

        <!-- Background ambient shape -->
        <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
    </div>

    <!-- Rombongan & Keberangkatan Card -->
    <div class="bg-hafana-surface dark:bg-hafana-darkSurface border border-hafana-border dark:border-hafana-darkBorder rounded-2xl p-4 shadow-card">
        <div class="flex items-center justify-between border-b border-hafana-border dark:border-hafana-darkBorder pb-2.5 mb-3">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-hafana-primary dark:text-brand-500 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <h3 class="text-xs font-extrabold text-hafana-textPrimary dark:text-hafana-darkTextPrimary uppercase tracking-wider">
                    Grup Keberangkatan
                </h3>
            </div>
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Status Aktif
            </span>
        </div>

        <div class="flex flex-col gap-1.5">
            <div class="text-sm font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary">
                {{ $user->group?->nama_group ?? 'Rombongan Umrah Hafana Travel' }}
            </div>
            @if($user->group?->keterangan)
                <p class="text-xs text-hafana-textSecondary dark:text-hafana-darkTextSecondary leading-relaxed">
                    {{ $user->group->keterangan }}
                </p>
            @endif
        </div>
    </div>

    <!-- Data Dokumen & Visa (Dengan Tombol Copy 1-Click) -->
    <div class="bg-hafana-surface dark:bg-hafana-darkSurface border border-hafana-border dark:border-hafana-darkBorder rounded-2xl p-4 shadow-card">
        <div class="flex items-center gap-2 border-b border-hafana-border dark:border-hafana-darkBorder pb-2.5 mb-3">
            <div class="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            <h3 class="text-xs font-extrabold text-hafana-textPrimary dark:text-hafana-darkTextPrimary uppercase tracking-wider">
                Dokumen Resmi Jemaah
            </h3>
        </div>

        <div class="divide-y divide-slate-100 dark:divide-slate-700/60">
            
            <!-- 1. Nomor Visa (Highlight Utama) -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <span class="text-[11px] font-semibold text-hafana-textMuted dark:text-slate-400 block uppercase tracking-wider">
                        Nomor Visa Umrah
                    </span>
                    <span class="text-sm font-extrabold text-hafana-primary dark:text-brand-500 font-mono tracking-wider block truncate mt-0.5">
                        {{ $user->nomor_visa ?: '-' }}
                    </span>
                </div>
                <button 
                    type="button" 
                    onclick="copyToClipboard('{{ $user->nomor_visa }}', 'Nomor Visa')"
                    class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-hafana-primary dark:text-brand-500 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Salin</span>
                </button>
            </div>

            <!-- 2. Nomor Paspor -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <span class="text-[11px] font-semibold text-hafana-textMuted dark:text-slate-400 block uppercase tracking-wider">
                        Nomor Paspor
                    </span>
                    <span class="text-sm font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary font-mono tracking-wider block truncate mt-0.5">
                        {{ $user->nomor_paspor ?: '-' }}
                    </span>
                </div>
                <button 
                    type="button" 
                    onclick="copyToClipboard('{{ $user->nomor_paspor }}', 'Nomor Paspor')"
                    class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Salin</span>
                </button>
            </div>

            <!-- 3. Nama Lengkap Sesuai Paspor -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <span class="text-[11px] font-semibold text-hafana-textMuted dark:text-slate-400 block uppercase tracking-wider">
                        Nama Lengkap
                    </span>
                    <span class="text-sm font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary block truncate mt-0.5">
                        {{ $user->name }}
                    </span>
                </div>
                <button 
                    type="button" 
                    onclick="copyToClipboard('{{ $user->name }}', 'Nama Lengkap')"
                    class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Salin</span>
                </button>
            </div>

            <!-- 4. Tanggal Lahir -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <span class="text-[11px] font-semibold text-hafana-textMuted dark:text-slate-400 block uppercase tracking-wider">
                        Tanggal Lahir
                    </span>
                    <span class="text-sm font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary block truncate mt-0.5">
                        @if($user->tanggal_lahir)
                            {{ \Carbon\Carbon::parse($user->tanggal_lahir)->locale('id')->translatedFormat('d F Y') }}
                        @else
                            -
                        @endif
                    </span>
                </div>
                <button 
                    type="button" 
                    onclick="copyToClipboard('{{ $user->tanggal_lahir }}', 'Tanggal Lahir')"
                    class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Salin</span>
                </button>
            </div>

            <!-- 5. Nomor WhatsApp -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <span class="text-[11px] font-semibold text-hafana-textMuted dark:text-slate-400 block uppercase tracking-wider">
                        Nomor WhatsApp
                    </span>
                    <span class="text-sm font-bold text-hafana-textPrimary dark:text-hafana-darkTextPrimary font-mono block truncate mt-0.5">
                        {{ $user->no_hp ?: 'Belum diisi' }}
                    </span>
                </div>
                <button 
                    type="button" 
                    onclick="openPhoneModal()"
                    class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Ubah</span>
                </button>
            </div>

        </div>
    </div>

    <!-- Selesai / Keluar Button -->
    <form action="{{ route('visa.logout') }}" method="POST" class="mt-2" onsubmit="return confirm('Apakah Anda yakin ingin keluar dari halaman verifikasi ini?')">
        @csrf
        <button 
            type="submit" 
            class="w-full py-3 px-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Keluar / Selesai</span>
        </button>
    </form>

</div>

<!-- Modal Edit Nomor WhatsApp -->
<div id="phone-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 dark:border-slate-700">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">
            Perbarui Nomor WhatsApp
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Masukkan nomor WhatsApp aktif jemaah untuk memudahkan komunikasi tim di Tanah Suci.
        </p>

        <form action="{{ route('visa.update-phone') }}" method="POST" class="flex flex-col gap-3">
            @csrf
            <div>
                <input 
                    type="tel" 
                    name="no_hp" 
                    id="no_hp_input"
                    value="{{ $user->no_hp }}"
                    placeholder="Contoh: 081234567890" 
                    inputmode="numeric"
                    pattern="[0-9]*"
                    maxlength="16"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-hafana-primary"
                >
            </div>
            <div class="flex items-center gap-2 mt-2">
                <button 
                    type="button" 
                    onclick="closePhoneModal()"
                    class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    class="flex-1 py-2 rounded-xl bg-hafana-primary hover:bg-hafana-primaryDark text-white text-xs font-bold shadow-md"
                >
                    Simpan
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function openPhoneModal() {
        document.getElementById('phone-modal').classList.remove('hidden');
    }
    function closePhoneModal() {
        document.getElementById('phone-modal').classList.add('hidden');
    }
</script>
@endsection
