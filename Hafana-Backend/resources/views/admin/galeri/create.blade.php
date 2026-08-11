@extends('admin.layout')

@section('title', 'Tambah Galeri / Testimoni')

@section('content')
<div class="page-header">
    <h1>🖼️ Tambah Item Galeri / Testimoni</h1>
    <a href="{{ route('admin.galeri.index') }}" class="btn-secondary">← Kembali</a>
</div>

<div class="form-card">
    <form method="POST" action="{{ route('admin.galeri.store') }}" enctype="multipart/form-data">
        @csrf

        <div class="form-group">
            <label>Tipe Konten <span style="color:var(--danger)">*</span></label>
            <select name="type" required>
                <option value="galeri" {{ old('type') == 'galeri' ? 'selected' : '' }}>📸 Galeri Perjalanan</option>
                <option value="testimoni" {{ old('type') == 'testimoni' ? 'selected' : '' }}>📌 Testimoni Jamaah (Desain Card/Asset)</option>
            </select>
            <p class="hint">Pilih "Testimoni Jamaah" jika gambar yang diunggah adalah card desain testimoni (robek kertas, review Google Maps, dll).</p>
            @error('type') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <label>File Gambar <span style="color:var(--danger)">*</span></label>
            <input type="file" name="gambar" accept="image/*" required>
            <p class="hint">Format JPG/PNG/WebP, maksimal 5MB.</p>
            @error('gambar') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <label>Caption / Alt-Text (Opsional)</label>
            <input type="text" name="caption" value="{{ old('caption') }}" placeholder="Contoh: Jamaah di depan Ka'bah / Review Google Maps">
            @error('caption') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <label>Urutan Tampil (Opsional)</label>
            <input type="number" name="urutan" value="{{ old('urutan', 0) }}" min="0">
            <p class="hint">Angka lebih kecil tampil lebih awal (0, 1, 2...)</p>
            @error('urutan') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <div class="toggle-row">
                <input type="checkbox" name="is_visible" id="is_visible" value="1" {{ old('is_visible', true) ? 'checked' : '' }}>
                <label for="is_visible">Tampilkan di Aplikasi Mobile</label>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn-primary">Simpan Item</button>
            <a href="{{ route('admin.galeri.index') }}" class="btn-secondary">Batal</a>
        </div>
    </form>
</div>
@endsection
