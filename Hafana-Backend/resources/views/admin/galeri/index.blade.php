@extends('admin.layout')

@section('title', 'Manajemen Galeri & Testimoni')

@section('content')
<div class="page-header">
    <h1>🖼️ Manajemen Galeri & Testimoni</h1>
    <a href="{{ route('admin.galeri.create') }}" class="btn-primary">+ Tambah Foto / Testimoni</a>
</div>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Preview</th>
                <th>Tipe</th>
                <th>Caption / Alt Text</th>
                <th>Urutan</th>
                <th>Status App</th>
                <th>Tampilkan</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $item)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>
                    @if($item->gambar)
                        <img src="{{ asset('storage/' . $item->gambar) }}" alt="Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);">
                    @else
                        <span style="color: var(--text-muted); font-size: 12px;">Tanpa Gambar</span>
                    @endif
                </td>
                <td>
                    <span class="badge {{ $item->type === 'galeri' ? 'badge-on' : 'badge-off' }}" style="{{ $item->type === 'testimoni' ? 'background: #fef3c7; color: #92400e;' : '' }}">
                        {{ strtoupper($item->type) }}
                    </span>
                </td>
                <td>
                    <strong>{{ $item->caption ?? '-' }}</strong>
                </td>
                <td>{{ $item->urutan }}</td>
                <td>
                    <span class="badge {{ $item->is_visible ? 'badge-on' : 'badge-off' }}">
                        {{ $item->is_visible ? '✓ Tampil' : '✗ Sembunyi' }}
                    </span>
                </td>
                <td>
                    <form method="POST" action="{{ route('admin.galeri.toggle', $item) }}" style="margin:0">
                        @csrf
                        <div class="switch-wrap">
                            <label class="switch" title="{{ $item->is_visible ? 'Sembunyikan dari app' : 'Tampilkan di app' }}">
                                <input type="checkbox" {{ $item->is_visible ? 'checked' : '' }} onchange="this.form.submit()">
                                <span class="slider round"></span>
                            </label>
                            <span class="switch-label">
                                {{ $item->is_visible ? 'Tampil' : 'Sembunyi' }}
                            </span>
                        </div>
                    </form>
                </td>
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.galeri.edit', $item) }}" class="btn-action btn-edit">✏️ Edit</a>
                        <form method="POST" action="{{ route('admin.galeri.destroy', $item) }}" style="margin:0" onsubmit="return confirm('Yakin ingin menghapus item ini?')">
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
                    🖼️ Belum ada foto galeri atau testimoni yang diunggah. <a href="{{ route('admin.galeri.create') }}" style="color:var(--primary)">Tambahkan yang pertama!</a>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
