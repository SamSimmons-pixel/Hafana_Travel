@extends('admin.layout')

@section('title', 'Edit Jemaah — ' . $user->name)

@section('content')
<div style="max-width: 650px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <h1>✏️ Edit Jemaah: {{ $user->name }}</h1>
        <a href="{{ request('return_to_group') && $user->group_id ? route('admin.groups.show', $user->group_id) : route('admin.users.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    <div class="card">
        <form method="POST" action="{{ route('admin.users.update', $user) }}">
            @csrf
            @method('PUT')

            @if(request('return_to_group'))
                <input type="hidden" name="return_to_group" value="1">
            @endif

            <div class="form-group">
                <label>Group Rombongan</label>
                <select name="group_id">
                    <option value="">-- Tanpa Group / Pilih Group --</option>
                    @foreach($groups as $g)
                        <option value="{{ $g->id }}" {{ old('group_id', $user->group_id) == $g->id ? 'selected' : '' }}>
                            {{ $g->nama_group }}
                        </option>
                    @endforeach
                </select>
                @error('group_id')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Nama Lengkap Jemaah (Login Akun) *</label>
                <input type="text" name="name" value="{{ old('name', $user->name) }}" style="text-transform:uppercase;" oninput="this.value = this.value.toUpperCase()" required>
                @error('name')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Nomor Visa *</label>
                    <input type="text" name="nomor_visa" value="{{ old('nomor_visa', $user->nomor_visa) }}" required>
                    @error('nomor_visa')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>Tanggal Lahir (Password Login) *</label>
                    <input type="date" name="tanggal_lahir" value="{{ old('tanggal_lahir', $user->tanggal_lahir ? date('Y-m-d', strtotime($user->tanggal_lahir)) : '') }}" required>
                    @error('tanggal_lahir')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Nomor Paspor</label>
                    <input type="text" name="nomor_paspor" value="{{ old('nomor_paspor', $user->nomor_paspor) }}">
                    @error('nomor_paspor')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
                <div class="form-group">
                    <label>No. HP / WhatsApp (Hanya Angka)</label>
                    <input type="tel" name="no_hp" value="{{ old('no_hp', $user->no_hp) }}" placeholder="Contoh: 08123456789" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    @error('no_hp')<p class="error-msg">{{ $message }}</p>@enderror
                </div>
            </div>


            <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Perubahan</button>
                <a href="{{ request('return_to_group') && $user->group_id ? route('admin.groups.show', $user->group_id) : route('admin.users.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
