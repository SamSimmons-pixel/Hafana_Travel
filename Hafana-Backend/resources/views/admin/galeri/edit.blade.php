@extends('admin.layout')

@section('title', 'Edit Galeri / Testimoni')

@section('content')
<div class="page-header">
    <h1>✏️ Edit Item Galeri / Testimoni</h1>
    <a href="{{ route('admin.galeri.index') }}" class="btn-secondary">← Kembali</a>
</div>

<div class="form-card">
    <form method="POST" action="{{ route('admin.galeri.update', $galeri) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label>Tipe Konten <span style="color:var(--danger)">*</span></label>
            <select name="type" required>
                <option value="galeri" {{ old('type', $galeri->type) == 'galeri' ? 'selected' : '' }}>📸 Galeri Perjalanan</option>
                <option value="testimoni" {{ old('type', $galeri->type) == 'testimoni' ? 'selected' : '' }}>📌 Testimoni Jamaah (Desain Card/Asset)</option>
            </select>
            @error('type') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <label>Ganti Gambar (Biarkan kosong jika tidak diubah)</label>
            <input type="file" name="gambar" accept="image/*">
            @if($galeri->gambar)
                <div class="current-img">
                    <p style="font-size:12px; color:var(--text-muted);">Gambar saat ini:</p>
                    <img src="{{ asset('storage/' . $galeri->gambar) }}" alt="Current">
                </div>
            @endif
            @error('gambar') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <label>Caption / Alt-Text</label>
            <input type="text" name="caption" value="{{ old('caption', $galeri->caption) }}" placeholder="Contoh: Jamaah di depan Ka'bah">
            @error('caption') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <label>Urutan Tampil</label>
            <input type="number" name="urutan" value="{{ old('urutan', $galeri->urutan) }}" min="0">
            @error('urutan') <p class="error-msg">{{ $message }}</p> @enderror
        </div>

        <div class="form-group">
            <div class="toggle-row">
                <input type="checkbox" name="is_visible" id="is_visible" value="1" {{ old('is_visible', $galeri->is_visible) ? 'checked' : '' }}>
                <label for="is_visible">Tampilkan di Aplikasi Mobile</label>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn-primary">Update Item</button>
            <a href="{{ route('admin.galeri.index') }}" class="btn-secondary">Batal</a>
        </div>
    </form>
</div>
@endsection
