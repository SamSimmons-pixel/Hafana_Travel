@extends('admin.layout')

@section('title', 'Tambah Artikel')

@section('content')
<div style="max-width: 750px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>➕ Tambah Artikel Baru</h1>
        <a href="{{ route('admin.articles.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.articles.store') }}" enctype="multipart/form-data">
            @csrf

            <div class="form-group">
                <label>Judul Artikel *</label>
                <input type="text" name="title" value="{{ old('title') }}" placeholder="Contoh: Tips Memilih Travel Umrah Sunnah Berizin Resmi" required>
                @error('title')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Penulis (Author) *</label>
                <input type="text" name="author" value="{{ old('author', 'Tim Syariah Hafana') }}" placeholder="Nama Penulis / Redaksi" required>
                @error('author')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group" style="background: var(--bg); padding: 16px; border-radius: 10px; border: 1px solid var(--border);">
                <label style="font-weight: 700; margin-bottom: 8px; display: block; color: var(--text-primary);">Gambar Thumbnail (Pilih Salah Satu Mode)</label>

                <div style="margin-bottom: 12px;">
                    <label style="font-size: 12px; color: var(--text-secondary);">1. Upload File Gambar (PNG, JPG, JPEG, WEBP - Max 5MB):</label>
                    <input type="file" name="thumbnail_file" accept="image/png, image/jpeg, image/jpg, image/webp" style="margin-top: 4px;">
                    @error('thumbnail_file')<p class="error-msg">{{ $message }}</p>@enderror
                </div>

                <div style="text-align: center; color: var(--text-muted); font-size: 11px; font-weight: 700; margin: 8px 0;">— ATAU —</div>

                <div>
                    <label style="font-size: 12px; color: var(--text-secondary);">2. External Link / URL Gambar:</label>
                    <input type="url" name="thumbnail_url" value="{{ old('thumbnail_url') }}" placeholder="https://images.unsplash.com/... atau URL gambar publik" style="margin-top: 4px;">
                    @error('thumbnail_url')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>

            <div class="form-group">
                <label>Ringkasan Singkat (Summary)</label>
                <textarea name="summary" rows="2" placeholder="Ringkasan singkat artikel yang tampil pada preview...">{{ old('summary') }}</textarea>
                @error('summary')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Isi Artikel (Content - Format Markdown / Text) *</label>
                <textarea name="content" rows="10" placeholder="Tulis isi lengkap artikel di sini. Gunakan ### untuk Judul Bagian, * atau - untuk poin bullet, dan **teks tebal**." required>{{ old('content') }}</textarea>
                @error('content')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Tanggal & Waktu Dipublikasikan</label>
                <input type="datetime-local" name="published_at" value="{{ old('published_at', date('Y-m-d\TH:i')) }}">
            </div>

            <div class="form-group">
                <label style="display: block; margin-bottom: 8px;">Pengaturan Tampilan Aplikasi</label>
                <div style="display: flex; gap: 24px; flex-wrap: wrap;">
                    <div class="toggle-row">
                        <input type="checkbox" name="is_published" id="is_published" {{ old('is_published', true) ? 'checked' : '' }}>
                        <label for="is_published" style="font-weight: 500; cursor: pointer;">Terbitkan Langsung (Publish)</label>
                    </div>

                    <div class="toggle-row">
                        <input type="checkbox" name="is_pinned" id="is_pinned" {{ old('is_pinned') ? 'checked' : '' }}>
                        <label for="is_pinned" style="font-weight: 700; color: var(--primary); cursor: pointer;">📌 Pin ke Halaman Utama Mobile App</label>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Artikel</button>
                <a href="{{ route('admin.articles.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

<script>
document.getElementById("is_published").value = document.getElementById("is_published").checked ? 1 : 0;
document.getElementById("is_pinned").value = document.getElementById("is_pinned").checked ? 1 : 0;
</script>
@endsection
