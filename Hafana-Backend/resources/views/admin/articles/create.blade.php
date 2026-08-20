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
                <label style="font-weight: 700; margin-bottom: 8px; display: block; color: var(--text-primary);">Gambar Thumbnail Utama (Pilih Salah Satu Mode)</label>

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

            {{-- Rich Text Editor with Draggable Images --}}
            <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="margin-bottom: 0;">Isi Artikel (Content) *</label>
                    <span style="font-size: 11px; color: var(--text-muted);">💡 Format teks langsung & seret (drag & drop) gambar ke posisi yang diinginkan</span>
                </div>

                <div class="editor-container">
                    <!-- Toolbar -->
                    <div class="editor-toolbar">
                        <button type="button" onclick="formatDoc('bold')" title="Tebal (Ctrl+B)"><b>B</b></button>
                        <button type="button" onclick="formatDoc('italic')" title="Miring (Ctrl+I)"><i>I</i></button>
                        <button type="button" onclick="formatDoc('underline')" title="Garis Bawah (Ctrl+U)"><u>U</u></button>
                        <button type="button" onclick="formatDoc('strikeThrough')" title="Coret"><s>S</s></button>

                        <span style="color: var(--border); margin: 0 2px;">|</span>

                        <select onchange="formatDoc('fontSize', this.value); this.selectedIndex=0;" title="Ukuran Font">
                            <option value="" class="hidden" selected disabled>Font Size</option>
                            <option value="1">Very Small</option>
                            <option value="3">Normal</option>
                            <option value="5">Large</option>
                            <option value="7">Huge</option>
                        </select>

                        <select onchange="formatDoc('formatBlock', this.value); this.selectedIndex=0;" title="Format Heading">
                            <option value="" class="hidden" selected disabled>Heading</option>
                            <option value="p">Paragraph</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                            <option value="h4">Heading 4</option>
                            <option value="blockquote">Kutipan / Quote</option>
                        </select>

                        <button type="button" onclick="formatDoc('insertUnorderedList')" title="Bullet List">• List</button>
                        <button type="button" onclick="formatDoc('insertOrderedList')" title="Numbered List">1. List</button>

                        <span style="color: var(--border); margin: 0 2px;">|</span>

                        <!-- Custom Image Input Button -->
                        <label for="image-input" class="image-upload-btn" style="background:#e0e7ff; color:#3730a3; border-color:#c7d2fe; font-weight:700;">📷 Insert Image</label>
                        <input type="file" id="image-input" accept="image/*" style="display: none;">

                        <button type="button" onclick="promptInsertImageUrl()" title="Sisipkan Gambar dari Link / URL">🔗 Image URL</button>

                        <span id="upload_status_text" style="font-size: 12px; color: var(--primary); font-weight: 700; margin-left: auto; display: none;">⏳ Mengunggah...</span>
                    </div>

                    <!-- Editor Field -->
                    <div id="editor" contenteditable="true" placeholder="Mulai tulis isi lengkap artikel di sini..."></div>
                </div>

                <textarea id="article_content_textarea" name="content" style="display: none;" required>{{ old('content') }}</textarea>
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
                        <input type="checkbox" name="is_published" id="is_published" value="1" {{ old('is_published', true) ? 'checked' : '' }}>
                        <label for="is_published" style="font-weight: 500; cursor: pointer;">Terbitkan Langsung (Publish)</label>
                    </div>

                    <div class="toggle-row">
                        <input type="checkbox" name="is_pinned" id="is_pinned" value="1" {{ old('is_pinned') ? 'checked' : '' }}>
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
const editor = document.getElementById('editor');
const imageInput = document.getElementById('image-input');
const textarea = document.getElementById('article_content_textarea');
const form = document.querySelector('form');

// 1. Text Formatting Functions
function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus(); // Keep focus on editor after action
}

// 2. Handle Image Upload & Real-Time Preview
imageInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

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
        if (data.success && (data.full_url || data.url)) {
            const imgSrc = data.full_url || data.url;
            insertImageNode(imgSrc);
            statusText.innerText = '✓ Gambar berhasil disisipkan!';
            setTimeout(() => { statusText.style.display = 'none'; }, 3000);
        } else {
            // Fallback to FileReader DataURL if upload failed
            const reader = new FileReader();
            reader.onload = function(event) {
                insertImageNode(event.target.result);
            };
            reader.readAsDataURL(file);
            statusText.style.display = 'none';
        }
    } catch (err) {
        // Fallback to FileReader DataURL
        const reader = new FileReader();
        reader.onload = function(event) {
            insertImageNode(event.target.result);
        };
        reader.readAsDataURL(file);
        statusText.style.display = 'none';
    } finally {
        imageInput.value = '';
    }
});

function insertImageNode(src) {
    const img = document.createElement('img');
    img.src = src;
    img.setAttribute('draggable', 'true');
    img.id = 'img-' + Date.now();

    editor.focus();
    const selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);

        // Add a blank paragraph after image for easier typing
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        img.after(p);

        // Move cursor after the image
        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    } else {
        editor.appendChild(img);
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        editor.appendChild(p);
    }

    setupImageDragEvents(img);
    syncContent();
}

function promptInsertImageUrl() {
    const url = prompt("Masukkan URL Gambar yang ingin disisipkan:", "https://");
    if (url && url.trim() !== "https://" && url.trim() !== "") {
        insertImageNode(url.trim());
    }
}

// 3. Drag and Drop Tracking Strategy
let draggedImgId = null;

function setupImageDragEvents(img) {
    img.setAttribute('draggable', 'true');
    if (!img.id) {
        img.id = 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }

    img.addEventListener('dragstart', (e) => {
        draggedImgId = e.target.id;
        e.dataTransfer.setData('text/plain', e.target.id);
        // Slight delay to prevent dragging a blank ghost image
        setTimeout(() => e.target.style.opacity = '0.5', 0);
    });

    img.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
}

// 4. Editor Container Drag-Over & Drop Rules
editor.addEventListener('dragover', (e) => {
    e.preventDefault(); // Required to allow dropping

    // Find the closest text node or element under the mouse cursor
    const target = document.elementFromPoint(e.clientX, e.clientY);

    if (target && target.closest('#editor') && target !== editor) {
        // Clear previous drag indicators
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        // Highlight the element we are hovering over
        target.classList.add('drag-over');
    }
});

editor.addEventListener('dragleave', (e) => {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target || !target.closest('#editor')) {
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    }
});

editor.addEventListener('drop', (e) => {
    e.preventDefault();
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    const imgId = e.dataTransfer.getData('text/plain') || draggedImgId;
    const imgToMove = document.getElementById(imgId);

    if (imgToMove) {
        // Find exact cursor/drop coordinates inside text
        let range;
        if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
            if (pos && pos.offsetNode) {
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
        } else if (document.caretRangeFromPoint) { // Webkit/Blink backup
            range = document.caretRangeFromPoint(e.clientX, e.clientY);
        }

        if (range) {
            // Remove image from its old location and insert into new range
            imgToMove.parentNode.removeChild(imgToMove);
            range.insertNode(imgToMove);
        } else {
            editor.appendChild(imgToMove);
        }
        syncContent();
    }
    draggedImgId = null;
});

// 5. Synchronize content to textarea
function syncContent() {
    textarea.value = editor.innerHTML.trim();
}

editor.addEventListener('input', syncContent);
editor.addEventListener('blur', syncContent);

form.addEventListener('submit', function() {
    syncContent();
});

// 6. Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (textarea.value) {
        editor.innerHTML = textarea.value;
        editor.querySelectorAll('img').forEach(img => setupImageDragEvents(img));
    }
});
</script>
@endsection
