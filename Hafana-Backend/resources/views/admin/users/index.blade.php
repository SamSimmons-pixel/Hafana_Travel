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
                        {{ $g->nama_group }} {{ !$g->is_active ? '(Non-aktif)' : '' }}
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
                <th>Nomor Visa</th>
                <th>Tanggal Lahir</th>
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
                        @if(!$user->group->is_active)
                            <span class="badge badge-danger" style="font-size:10px; margin-left:4px;">Non-aktif</span>
                        @endif
                    @else
                        <span style="color:var(--text-muted);">- Tanpa Group -</span>
                    @endif
                </td>
                <td>
                    @if($user->no_hp)
                        @php
                            $hp = preg_replace('/^0/', '62', $user->no_hp);
                            $waMsg = urlencode("Halo, saya ingin menyimpan kontak: {$user->name} ({$user->no_hp})");
                            $waUrl = "https://wa.me/{$hp}?text={$waMsg}";
                        @endphp
                        <span style="display:flex; align-items:center; gap:6px;">
                            {{ $user->no_hp }}
                            <button type="button" onclick="copyText('{{ $user->no_hp }}', this)" style="background:none; border:none; cursor:pointer; font-size:14px;" title="Copy Nomor HP">📋</button>
                            <a href="{{ $waUrl }}" target="_blank" style="font-size:14px;" title="Buka WhatsApp">💬</a>
                        </span>
                    @else
                        <span style="color:var(--text-muted);">-</span>
                    @endif
                </td>
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.users.edit', $user) }}" class="btn-action btn-edit">✏️ Edit</a>
                        @if(auth('admin')->user()->isAdmin())
                        <form method="POST" action="{{ route('admin.users.destroy', $user) }}" style="margin:0" onsubmit="return confirm('Hapus akun jemaah {{ addslashes($user->name) }}?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn-action btn-delete">🗑️ Hapus</button>
                        </form>
                        @endif
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

<div class="pagination-wrap">
    {{ $users->links() }}
</div>

<script>
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '✅';
        setTimeout(() => { btn.innerHTML = orig; }, 1800);
    });
}
</script>
@endsection

