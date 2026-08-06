@extends('admin.layout')

@section('title', 'Tambah Admin Baru')

@section('content')
<div style="max-width: 550px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>🛡️ Tambah Admin / Crew Baru</h1>
        <a href="{{ route('admin.admins.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.admins.store') }}">
            @csrf

            <div class="form-group">
                <label>Nama Lengkap Admin *</label>
                <input type="text" name="name" value="{{ old('name') }}" placeholder="Contoh: Budi Gunawan" required>
                @error('name')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Email Admin (Untuk Login Web) *</label>
                <input type="email" name="email" value="{{ old('email') }}" placeholder="budi@hafana.com" required>
                @error('email')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Password Login *</label>
                <input type="password" name="password" placeholder="Minimal 6 karakter" required>
                @error('password')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Akun Admin</button>
                <a href="{{ route('admin.admins.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
