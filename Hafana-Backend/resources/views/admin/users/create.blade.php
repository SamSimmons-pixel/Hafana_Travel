@extends('admin.layout')

@section('title', 'Tambah Jemaah Manual')

@section('content')
<div style="max-width: 650px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>➕ Tambah Jemaah Manual</h1>
        <a href="{{ route('admin.users.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.users.store') }}">
            @csrf

            <div class="form-group">
                <label>Group Rombongan (Opsional)</label>
                <select name="group_id">
                    <option value="">-- Tanpa Group / Pilih Group --</option>
                    @foreach($groups as $g)
                        <option value="{{ $g->id }}" {{ old('group_id', $selectedGroupId) == $g->id ? 'selected' : '' }}>
                            {{ $g->nama_group }}
                        </option>
                    @endforeach
                </select>
                @error('group_id')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Nama Lengkap Jemaah (Login Akun) *</label>
                <input type="text" name="name" value="{{ old('name') }}" placeholder="Contoh: AHMAD SYAHPUTRA" style="text-transform:uppercase;" oninput="this.value = this.value.toUpperCase()" required>
                @error('name')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Nomor Visa *</label>
                    <input type="text" name="nomor_visa" value="{{ old('nomor_visa') }}" placeholder="Contoh: V-123456" required>
                    @error('nomor_visa')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>Tanggal Lahir (Password Login) *</label>
                    <input type="date" name="tanggal_lahir" value="{{ old('tanggal_lahir') }}" required>
                    @error('tanggal_lahir')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Nomor Paspor (Opsional)</label>
                    <input type="text" name="nomor_paspor" value="{{ old('nomor_paspor') }}" placeholder="Contoh: A9876543">
                    @error('nomor_paspor')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>No. HP / WhatsApp (Hanya Angka)</label>
                    <input type="tel" inputmode="numeric" pattern="[0-9]+" name="no_hp" value="{{ old('no_hp') }}" placeholder="Contoh: 08123456789" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    @error('no_hp')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>


            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Akun Jemaah</button>
                <a href="{{ route('admin.users.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
