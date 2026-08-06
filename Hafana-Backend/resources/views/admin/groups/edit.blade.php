@extends('admin.layout')

@section('title', 'Edit Group — ' . $group->nama_group)

@section('content')
<div style="max-width: 600px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>✏️ Edit Group: {{ $group->nama_group }}</h1>
        <a href="{{ route('admin.groups.show', $group) }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.groups.update', $group) }}">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label>Nama Group / Rombongan Keberangkatan *</label>
                <input type="text" name="nama_group" value="{{ old('nama_group', $group->nama_group) }}" required>
                @error('nama_group')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Keterangan / Catatan Tambahan</label>
                <textarea name="keterangan">{{ old('keterangan', $group->keterangan) }}</textarea>
                @error('keterangan')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Perubahan</button>
                <a href="{{ route('admin.groups.show', $group) }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
