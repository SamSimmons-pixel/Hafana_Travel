@extends('admin.layout')

@section('title', 'Edit Paket')

@section('content')
<div style="max-width: 700px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>✏️ Edit Paket</h1>
        <a href="{{ route('admin.pakets.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.pakets.update', $paket) }}" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label>Nama Paket *</label>
                <input type="text" name="nama_paket"
                    value="{{ old('nama_paket', $paket->nama_paket) }}" required>
                @error('nama_paket')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Kota Keberangkatan *</label>
                    <input type="text" name="kota_keberangkatan"
                        value="{{ old('kota_keberangkatan', $paket->kota_keberangkatan) }}" required>
                </div>
                <div class="form-group">
                    <label>Maskapai</label>
                    <input type="text" name="maskapai"
                        value="{{ old('maskapai', $paket->maskapai) }}">
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Tanggal Berangkat *</label>
                    <input type="date" name="tanggal_berangkat"
                        value="{{ old('tanggal_berangkat', $paket->tanggal_berangkat->format('Y-m-d')) }}" required>
                </div>
                <div class="form-group">
                    <label>Durasi (Hari) *</label>
                    <input type="number" name="durasi_hari"
                        value="{{ old('durasi_hari', $paket->durasi_hari) }}" min="1" required>
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Harga (Rp) *</label>
                    <input type="number" name="harga"
                        value="{{ old('harga', $paket->harga) }}" min="0" step="100000" required>
                </div>
                <div class="form-group">
                    <label>Kuota Peserta *</label>
                    <input type="number" name="kuota"
                        value="{{ old('kuota', $paket->kuota) }}" min="1" required>
                </div>
            </div>

            <div class="form-group">
                <label>Deskripsi</label>
                <textarea name="deskripsi">{{ old('deskripsi', $paket->deskripsi) }}</textarea>
            </div>

            <div class="form-group">
                <label>Gambar Paket</label>
                @if($paket->gambar)
                    <div class="current-img">
                        <img src="{{ asset('storage/' . $paket->gambar) }}" alt="Gambar saat ini">
                        <p class="hint">Gambar saat ini. Upload baru untuk mengganti.</p>
                    </div>
                @endif
                <input type="file" name="gambar" accept="image/*" style="margin-top: 8px;">
                @error('gambar')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Status Tampil di Aplikasi</label>
                <div class="toggle-row">
                    <input type="checkbox" name="is_visible" id="is_visible"
                        {{ old('is_visible', $paket->is_visible) ? 'checked' : '' }}>
                    <label for="is_visible" style="font-weight: 400; cursor: pointer;">
                        Tampilkan paket ini di aplikasi mobile
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Perubahan</button>
                <a href="{{ route('admin.pakets.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
