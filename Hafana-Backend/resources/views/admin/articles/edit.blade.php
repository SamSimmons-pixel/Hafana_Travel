@extends('admin.layout')

@section('title', 'Edit Artikel')

@section('content')
<div style="max-width: 750px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>✏️ Edit Artikel</h1>
        <a href="{{ route('admin.articles.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.articles.update', $article->id) }}" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label>Judul Artikel *</label>
                <input type="text" name="title" value="{{ old('title', $article->title) }}" required>
                @error('title')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Penulis (Author) *</label>
                <input type="text" name="author" value="{{ old('author', $article->author) }}" required>
                @error('author')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group" style="background: var(--bg); padding: 16px; border-radius: 10px; border: 1px solid var(--border);">
                <label style="font-weight: 700; margin-bottom: 8px; display: block; color: var(--text-primary);">Gambar Thumbnail (Pilih Salah Satu Mode)</label>

                <div style="margin-bottom: 12px;">
                    <label style="font-size: 12px; color: var(--text-secondary);">1. Upload File Gambar Baru (PNG, JPG, JPEG, WEBP - Max 5MB):</label>
                    <input type="file" name="thumbnail_file" accept="image/png, image/jpeg, image/jpg, image/webp" style="margin-top: 4px;">
                    @error('thumbnail_file')<p class="error-msg">{{ $message }}</p>@enderror
                </div>

                <div style="text-align: center; color: var(--text-muted); font-size: 11px; font-weight: 700; margin: 8px 0;">— ATAU —</div>

                <div>
                    <label style="font-size: 12px; color: var(--text-secondary);">2. External Link / URL Gambar Saat Ini:</label>
                    <input type="url" name="thumbnail_url" value="{{ old('thumbnail_url', $article->thumbnail_url) }}" placeholder="https://..." style="margin-top: 4px;">
                    @error('thumbnail_url')<p class="error-msg">{{ $message }}</p>@enderror
                </div>

                @if($article->thumbnail_url)
                    <div class="current-img" style="margin-top: 12px;">
                        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Preview Gambar Saat Ini:</div>
                        <img src="{{ $article->thumbnail_url }}" alt="Thumb">
                    </div>
                @endif
            </div>

            <div class="form-group">
                <label>Ringkasan Singkat (Summary)</label>
                <textarea name="summary" rows="2">{{ old('summary', $article->summary) }}</textarea>
                @error('summary')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Isi Artikel (Content - Format Markdown / Text) *</label>
                <textarea name="content" rows="10" required>{{ old('content', $article->content) }}</textarea>
                @error('content')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Tanggal & Waktu Dipublikasikan</label>
                <input type="datetime-local" name="published_at" value="{{ old('published_at', \Carbon\Carbon::parse($article->published_at)->format('Y-m-d\TH:i')) }}">
            </div>

            <div class="form-group">
                <label style="display: block; margin-bottom: 8px;">Pengaturan Tampilan Aplikasi</label>
                <div style="display: flex; gap: 24px; flex-wrap: wrap;">
                    <div class="toggle-row">
                        <input type="checkbox" name="is_published" id="is_published" {{ old('is_published', $article->is_published) ? 'checked' : '' }}>
                        <label for="is_published" style="font-weight: 500; cursor: pointer;">Terbitkan Langsung (Publish)</label>
                    </div>

                    <div class="toggle-row">
                        <input type="checkbox" name="is_pinned" id="is_pinned" {{ old('is_pinned', $article->is_pinned) ? 'checked' : '' }}>
                        <label for="is_pinned" style="font-weight: 700; color: var(--primary); cursor: pointer;">📌 Pin ke Halaman Utama Mobile App</label>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">Perbarui Artikel</button>
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
