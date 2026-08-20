@extends('admin.layout')

@section('title', 'Tambah Paket')

@section('content')
<div style="max-width: 700px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>➕ Tambah Paket Umrah</h1>
        <a href="{{ route('admin.pakets.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.pakets.store') }}" enctype="multipart/form-data">
            @csrf

            <div class="form-group">
                <label>Nama Paket *</label>
                <input type="text" name="nama_paket" value="{{ old('nama_paket') }}"
                    placeholder="Contoh: Umroh Heart 16 September 2026" required>
                @error('nama_paket')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Kota Keberangkatan *</label>
                    <input type="text" name="kota_keberangkatan" value="{{ old('kota_keberangkatan') }}"
                        placeholder="Jakarta" required>
                    @error('kota_keberangkatan')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>Maskapai</label>
                    <input type="text" name="maskapai" value="{{ old('maskapai') }}"
                        placeholder="Garuda Indonesia">
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Tanggal Berangkat *</label>
                    <input type="date" name="tanggal_berangkat" value="{{ old('tanggal_berangkat') }}" required>
                    @error('tanggal_berangkat')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>Durasi (Hari) *</label>
                    <input type="number" name="durasi_hari" value="{{ old('durasi_hari') }}"
                        placeholder="9" min="1" required>
                    @error('durasi_hari')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Harga (Rp) *</label>
                    <input type="number" name="harga" value="{{ old('harga') }}"
                        placeholder="25000000" min="0" step="100000" required>
                    @error('harga')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>Kuota Peserta *</label>
                    <input type="number" name="kuota" value="{{ old('kuota') }}"
                        placeholder="40" min="1" required>
                    @error('kuota')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>

            <div class="form-group">
                <label>Deskripsi</label>
                <textarea name="deskripsi" placeholder="Deskripsi lengkap paket umrah...">{{ old('deskripsi') }}</textarea>
            </div>

            <div class="form-group">
                <label>Gambar Paket</label>
                <input type="file" name="gambar" accept="image/*">
                @error('gambar')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Status Tampil di Aplikasi</label>
                <div class="toggle-row">
                    <input type="checkbox" name="is_visible" id="is_visible"
                        {{ old('is_visible', true) ? 'checked' : '' }}>
                    <label for="is_visible" style="font-weight: 400; cursor: pointer;">
                        Tampilkan paket ini di aplikasi mobile
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Paket</button>
                <a href="{{ route('admin.pakets.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
