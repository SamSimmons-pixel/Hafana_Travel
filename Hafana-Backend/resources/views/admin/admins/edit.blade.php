@extends('admin.layout')

@section('title', 'Edit Admin — ' . $admin->name)

@section('content')
<div style="max-width: 550px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>✏️ Edit Admin: {{ $admin->name }}</h1>
        <a href="{{ route('admin.admins.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.admins.update', $admin) }}">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label>Nama Lengkap Admin *</label>
                <input type="text" name="name" value="{{ old('name', $admin->name) }}" required>
                @error('name')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Email Admin *</label>
                <input type="email" name="email" value="{{ old('email', $admin->email) }}" required>
                @error('email')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Password Baru (Kosongkan jika tidak ingin mengubah password)</label>
                <input type="password" name="password" placeholder="••••••••">
                @error('password')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Role / Hak Akses *</label>
                <select name="role" required {{ auth('admin')->user()->isSubAdmin() ? 'disabled' : '' }}>
                    <option value="admin" {{ old('role', $admin->role) === 'admin' ? 'selected' : '' }}>👑 Full Admin (Semua Akses & Hapus Data)</option>
                    <option value="sub_admin" {{ old('role', $admin->role) === 'sub_admin' ? 'selected' : '' }}>🛡️ Sub Admin (Hanya Lihat & Edit, Tidak Bisa Hapus Data)</option>
                </select>
                @if(auth('admin')->user()->isSubAdmin())
                    <input type="hidden" name="role" value="{{ $admin->role }}">
                @endif
                @error('role')<p class="error-msg">{{ $message }}</p>@enderror
            </div>


            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Perubahan</button>
                <a href="{{ route('admin.admins.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
