@extends('admin.layout')

@section('title', 'Logo & Pengaturan Aplikasi')

@section('content')
<div class="page-header">
    <h1>⚙️ Pengaturan Logo Aplikasi</h1>
</div>

<div class="form-card" style="max-width: 650px;">
    <form method="POST" action="{{ route('admin.settings.update') }}" enctype="multipart/form-data">
        @csrf

        <div class="form-group">
            <label>Logo Utama Aplikasi Mobile (Top Bar)</label>
            <input type="file" name="app_logo" accept="image/*">
            <p class="hint">Upload file logo aplikasi (PNG/WebP/JPG transparan direkomendasikan). Ukuran ideal: 120x120px atau rasio 1:1.</p>
            @error('app_logo') <p class="error-msg">{{ $message }}</p> @enderror

            @if($appLogo)
                <div class="current-img" style="margin-top: 16px;">
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom: 6px;">Logo saat ini:</p>
                    <img src="{{ asset('storage/' . $appLogo) }}" alt="Logo App" style="width: 72px; height: 72px; object-fit: contain; background: #e6f7fd; border-radius: 16px; padding: 6px; border: 1px solid var(--border);">
                </div>
            @else
                <div style="margin-top: 16px; padding: 12px; background: var(--bg); border-radius: 8px; font-size: 13px; color: var(--text-muted);">
                    ℹ️ Belum ada logo yang diunggah. Tampilan default awal akan menggunakan logo teks "HF".
                </div>
            @endif
        </div>

        <div class="form-actions" style="margin-top: 24px;">
            <button type="submit" class="btn-primary">Simpan Pengaturan Logo</button>
        </div>
    </form>
</div>
@endsection
