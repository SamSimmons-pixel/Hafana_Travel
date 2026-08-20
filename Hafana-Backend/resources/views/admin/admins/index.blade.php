@extends('admin.layout')

@section('title', 'Kelola Admin Crew')

@section('content')
<div class="page-header">
    <div>
        <h1>🛡️ Kelola Akun Admin / Crew</h1>
        <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">
            Tambah atau hapus akses akun Admin/Crew yang dapat login ke dashboard web backend.
        </p>
    </div>
    <a href="{{ route('admin.admins.create') }}" class="btn-primary">+ Tambah Admin Baru</a>
</div>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nama Admin</th>
                <th>Email Admin</th>
                <th>Tanggal Dibuat</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($admins as $adm)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td><strong>{{ $adm->name }}</strong></td>
                <td><code>{{ $adm->email }}</code></td>
                <td>{{ $adm->created_at->format('d M Y, H:i') }}</td>
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.admins.edit', $adm) }}" class="btn-action btn-edit">✏️ Edit</a>
                        @if(Auth::guard('admin')->id() !== $adm->id)
                            <form method="POST" action="{{ route('admin.admins.destroy', $adm) }}" style="margin:0" onsubmit="return confirm('Hapus akun admin {{ addslashes($adm->name) }}?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn-action btn-delete">🗑️ Hapus</button>
                            </form>
                        @else
                            <span class="badge badge-info">Anda (Sedang Login)</span>
                        @endif
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="empty">Belum ada data Admin.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
