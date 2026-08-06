@extends('admin.layout')

@section('title', 'Data Jemaah')

@section('content')
<div class="page-header">
    <div>
        <h1>🧕 Data Seluruh Jemaah</h1>
        <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">
            Daftar seluruh akun Jemaah yang terdaftar di aplikasi Hafana Travel.
        </p>
    </div>
    <a href="{{ route('admin.users.create') }}" class="btn-primary">+ Tambah Jemaah Manual</a>
</div>

{{-- Search & Filter Bar --}}
<div style="background:var(--surface); border-radius:12px; padding:16px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <form method="GET" action="{{ route('admin.users.index') }}" style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
        <div style="flex:1; min-width:240px;">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama, nomor visa, paspor, atau hp..." style="padding:9px 12px; font-size:13px; margin:0;">
        </div>
        <div style="min-width:200px;">
            <select name="group_id" style="padding:9px 12px; font-size:13px; margin:0;">
                <option value="">-- Semua Group Rombongan --</option>
                @foreach($groups as $g)
                    <option value="{{ $g->id }}" {{ request('group_id') == $g->id ? 'selected' : '' }}>
                        {{ $g->nama_group }}
                    </option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn-primary" style="padding:9px 18px;">Filter & Cari</button>
        @if(request('search') || request('group_id'))
            <a href="{{ route('admin.users.index') }}" class="btn-secondary" style="padding:9px 14px;">Reset Filter</a>
        @endif
    </form>
</div>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nama Jemaah</th>
                <th>Nomor Visa (Login)</th>
                <th>Tanggal Lahir (Password)</th>
                <th>Nomor Paspor</th>
                <th>Group Rombongan</th>
                <th>No HP</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $user)
            <tr>
                <td>{{ ($users->currentPage() - 1) * $users->perPage() + $loop->iteration }}</td>
                <td><strong>{{ $user->name }}</strong></td>
                <td><code style="background:var(--bg); padding:3px 8px; border-radius:4px;">{{ $user->nomor_visa }}</code></td>
                <td><code>{{ $user->tanggal_lahir ? date('Y-m-d', strtotime($user->tanggal_lahir)) : '-' }}</code></td>
                <td>{{ $user->nomor_paspor ?? '-' }}</td>
                <td>
                    @if($user->group)
                        <a href="{{ route('admin.groups.show', $user->group) }}" style="color:var(--primary); font-weight:600; text-decoration:none;">
                            👥 {{ $user->group->nama_group }}
                        </a>
                    @else
                        <span style="color:var(--text-muted);">- Tanpa Group -</span>
                    @endif
                </td>
                <td>{{ $user->no_hp ?? '-' }}</td>
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.users.edit', $user) }}" class="btn-action btn-edit">✏️ Edit</a>
                        <form method="POST" action="{{ route('admin.users.destroy', $user) }}" style="margin:0" onsubmit="return confirm('Hapus akun jemaah {{ addslashes($user->name) }}?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn-action btn-delete">🗑️ Hapus</button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="empty">
                    Belum ada data Jemaah. <a href="{{ route('admin.groups.create') }}" style="color:var(--primary)">Impor dari JSON Group</a> atau <a href="{{ route('admin.users.create') }}" style="color:var(--primary)">tambah manual</a>.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div style="margin-top:20px;">
    {{ $users->links() }}
</div>
@endsection
