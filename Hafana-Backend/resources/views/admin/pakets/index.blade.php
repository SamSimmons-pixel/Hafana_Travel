@extends('admin.layout')

@section('title', 'Manajemen Paket')

@section('content')
<div class="page-header">
    <h1>📦 Manajemen Paket Umrah</h1>
    <a href="{{ route('admin.pakets.create') }}" class="btn-primary">+ Tambah Paket</a>
</div>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nama Paket</th>
                <th>Kota Asal</th>
                <th>Berangkat</th>
                <th>Durasi</th>
                <th>Harga</th>
                <th>Kuota</th>
                <th>Status App</th>
                <th>Tampil di App</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pakets as $paket)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td><strong>{{ $paket->nama_paket }}</strong></td>
                <td>{{ $paket->kota_keberangkatan }}</td>
                <td>{{ $paket->tanggal_berangkat->format('d M Y') }}</td>
                <td>{{ $paket->durasi_hari }} Hari</td>
                <td>Rp {{ number_format($paket->harga, 0, ',', '.') }}</td>
                <td>{{ $paket->kuota }}</td>

                {{-- Status Badge --}}
                <td>
                    <span class="badge {{ $paket->is_visible ? 'badge-on' : 'badge-off' }}">
                        {{ $paket->is_visible ? '✓ Tampil' : '✗ Sembunyikan' }}
                    </span>
                </td>

                {{-- Toggle Switch --}}
                <td>
                    <form method="POST" action="{{ route('admin.pakets.toggle', $paket) }}" style="margin:0">
                        @csrf
                        <div class="switch-wrap">
                            <label class="switch" title="{{ $paket->is_visible ? 'Sembunyikan dari app' : 'Tampilkan di app' }}">
                                <input
                                    type="checkbox"
                                    {{ $paket->is_visible ? 'checked' : '' }}
                                    onchange="this.form.submit()"
                                >
                                <span class="slider round"></span>
                            </label>
                            <span class="switch-label">
                                {{ $paket->is_visible ? 'Tampil' : 'Sembunyikan' }}
                            </span>
                        </div>
                    </form>
                </td>

                {{-- Action Buttons --}}
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.pakets.edit', $paket) }}" class="btn-action btn-edit">✏️ Edit</a>
                        <form method="POST" action="{{ route('admin.pakets.destroy', $paket) }}"
                              style="margin:0" onsubmit="return confirm('Hapus paket ini?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn-action btn-delete">🗑️ Hapus</button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="10" class="empty">
                    🕌 Belum ada paket. <a href="{{ route('admin.pakets.create') }}" style="color:var(--primary)">Tambahkan paket pertama!</a>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
