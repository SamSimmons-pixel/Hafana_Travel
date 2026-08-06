@extends('admin.layout')

@section('title', 'Manajemen Group Jemaah')

@section('content')
<div class="page-header">
    <div>
        <h1>👥 Management Group & Import JSON</h1>
        <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">
            Kelola rombongan Jemaah. Buat akun otomatis dalam 1 kali tempel teks JSON.
        </p>
    </div>
    <a href="{{ route('admin.groups.create') }}" class="btn-primary">📋 + Import Group (JSON)</a>
</div>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nama Group / Rombongan</th>
                <th>Keterangan</th>
                <th>Jumlah Jemaah</th>
                <th>Tanggal Dibuat</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($groups as $group)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>
                    <a href="{{ route('admin.groups.show', $group) }}" style="color:var(--primary); font-weight:700; text-decoration:none;">
                        {{ $group->nama_group }}
                    </a>
                </td>
                <td>{{ $group->keterangan ?? '-' }}</td>
                <td>
                    <span class="badge badge-info">
                        👥 {{ $group->users_count }} Jemaah
                    </span>
                </td>
                <td>{{ $group->created_at->format('d M Y, H:i') }}</td>
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.groups.show', $group) }}" class="btn-action btn-info">👁️ Lihat / Edit Jemaah</a>
                        <a href="{{ route('admin.groups.edit', $group) }}" class="btn-action btn-edit">✏️ Edit Group</a>
                        
                        {{-- Hapus Group Button with Double Confirmation --}}
                        <form id="delete-group-form-{{ $group->id }}" method="POST" action="{{ route('admin.groups.destroy', $group) }}" style="margin:0">
                            @csrf
                            @method('DELETE')
                            <button type="button" class="btn-action btn-delete" onclick="confirmDeleteGroup({{ $group->id }}, '{{ addslashes($group->nama_group) }}', {{ $group->users_count }})">
                                🗑️ Hapus Group
                            </button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="empty">
                    👥 Belum ada Group Jemaah. <a href="{{ route('admin.groups.create') }}" style="color:var(--primary)">Impor data JSON pertama!</a>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

{{-- Double Confirmation Script for Hapus Data Group --}}
<script>
function confirmDeleteGroup(groupId, groupName, userCount) {
    // Confirmation 1
    const step1 = confirm(`⚠️ KONFIRMASI 1 DARI 2:\n\nApakah Anda yakin ingin menghapus Group "${groupName}"?`);
    if (!step1) return;

    // Confirmation 2
    const step2 = confirm(`🚨 KONFIRMASI PERINGATAN KEDUA (2 DARI 2):\n\nPerhatian! Menghapus Group "${groupName}" juga akan PERMANEN MENGHAPUS SELURUH ${userCount} AKUN JEMAAH di dalamnya beserta pelacakan lokasinya!\n\nKlik OK untuk melanjutkan penghapusan.`);
    if (!step2) return;

    document.getElementById(`delete-group-form-${groupId}`).submit();
}
</script>
@endsection
