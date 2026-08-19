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
                <label style="font-weight: 700; margin-bottom: 8px; display: block; color: var(--text-primary);">Gambar Thumbnail Utama (Pilih Salah Satu Mode)</label>

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
                        <img src="{{ Str::startsWith($article->thumbnail_url, 'http') ? $article->thumbnail_url : asset($article->thumbnail_url) }}" alt="Thumb">
                    </div>
                @endif
            </div>

            <div class="form-group">
                <label>Ringkasan Singkat (Summary)</label>
                <textarea name="summary" rows="2">{{ old('summary', $article->summary) }}</textarea>
                @error('summary')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            {{-- Rich Content Editor with Inline Image Toolbar --}}
            <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="margin-bottom: 0;">Isi Artikel (Content - Format Markdown / Text) *</label>
                    <span style="font-size: 11px; color: var(--text-muted);">💡 Tambahkan gambar di tengah paragraf dengan gampang</span>
                </div>

                <!-- Toolbar Sisipkan Gambar & Format -->
                <div style="background: var(--bg); padding: 8px 12px; border: 1px solid var(--border); border-bottom: none; border-radius: 8px 8px 0 0; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                    <input type="file" id="inline_img_file" accept="image/*" style="display: none;" onchange="handleInlineImageUpload(this)">
                    <button type="button" class="btn-secondary" style="padding: 4px 10px; font-size: 12px; border-radius: 6px; display: flex; align-items: center; gap: 4px; background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;" onclick="document.getElementById('inline_img_file').click()">
                        🖼️ <strong>+ Upload & Sisipkan Gambar</strong>
                    </button>
                    <button type="button" class="btn-secondary" style="padding: 4px 10px; font-size: 12px; border-radius: 6px;" onclick="promptInsertImageUrl()">
                        🔗 <strong>+ Sisipkan URL Gambar</strong>
                    </button>

                    <span style="color: var(--border); margin: 0 4px;">|</span>

                    <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 11px; border-radius: 4px;" onclick="insertMarkdownTag('### Judul Bagian\n')">
                        ### Judul
                    </button>
                    <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 11px; border-radius: 4px;" onclick="insertMarkdownTag('**Teks Tebal**')">
                        **B** Tebal
                    </button>
                    <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 11px; border-radius: 4px;" onclick="insertMarkdownTag('*Teks Miring*')">
                        *I* Miring
                    </button>
                    <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 11px; border-radius: 4px;" onclick="insertMarkdownTag('> Kutipan / Doa\n')">
                        &gt; Kutipan
                    </button>
                    <span id="upload_status_text" style="font-size: 12px; color: var(--primary); font-weight: 600; margin-left: auto; display: none;">⏳ Mengunggah...</span>
                </div>

                <textarea id="article_content_textarea" name="content" rows="12" style="border-radius: 0 0 8px 8px;" required>{{ old('content', $article->content) }}</textarea>
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
                        <input type="checkbox" name="is_published" id="is_published" value="1" {{ old('is_published', $article->is_published) ? 'checked' : '' }}>
                        <label for="is_published" style="font-weight: 500; cursor: pointer;">Terbitkan Langsung (Publish)</label>
                    </div>

                    <div class="toggle-row">
                        <input type="checkbox" name="is_pinned" id="is_pinned" value="1" {{ old('is_pinned', $article->is_pinned) ? 'checked' : '' }}>
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
function insertMarkdownTag(tag) {
    const textarea = document.getElementById('article_content_textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.substring(0, start) + "\n\n" + tag + "\n\n" + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + tag.length + 4;
    textarea.focus();
}

function promptInsertImageUrl() {
    const url = prompt("Masukkan URL Gambar yang ingin disisipkan:", "https://");
    if (url && url.trim() !== "https://") {
        insertMarkdownTag(`![Gambar](${url.trim()})`);
    }
}

async function handleInlineImageUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const statusText = document.getElementById('upload_status_text');
    statusText.style.display = 'inline';
    statusText.innerText = '⏳ Mengunggah gambar...';

    const formData = new FormData();
    formData.append('image', file);
    formData.append('_token', '{{ csrf_token() }}');

    try {
        const response = await fetch('{{ route("admin.articles.upload-image") }}', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success && data.url) {
            const markdownTag = `![Gambar](${data.url})`;
            insertMarkdownTag(markdownTag);
            statusText.innerText = '✓ Gambar berhasil disisipkan!';
            setTimeout(() => { statusText.style.display = 'none'; }, 3000);
        } else {
            alert('Gagal mengunggah gambar: ' + (data.message || 'Terjadi kesalahan'));
            statusText.style.display = 'none';
        }
    } catch (err) {
        alert('Gagal mengunggah gambar ke server.');
        statusText.style.display = 'none';
    } finally {
        input.value = '';
    }
}
</script>
@endsection
