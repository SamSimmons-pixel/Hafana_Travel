@extends('admin.layout')

@section('title', 'Manajemen Artikel')

@section('content')
<div class="page-header">
    <h1>📰 Manajemen Artikel & Informasi</h1>
    <a href="{{ route('admin.articles.create') }}" class="btn-primary">+ Tambah Artikel Baru</a>
</div>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Thumbnail</th>
                <th>Judul Artikel</th>
                <th>Penulis</th>
                <th>Tanggal Publish</th>
                <th>Pin Home</th>
                <th>Status</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($articles as $art)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>
                    @if($art->thumbnail_url)
                        <img src="{{ $art->thumbnail_url }}" alt="Thumb" style="width: 56px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);">
                    @else
                        <span style="color: var(--text-muted); font-size: 11px;">No Img</span>
                    @endif
                </td>
                <td>
                    <strong>{{ $art->title }}</strong>
                    @if($art->summary)
                        <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px; line-height: 1.3;">{{ Str::limit($art->summary, 70) }}</p>
                    @endif
                </td>
                <td style="font-size: 13px; color: var(--text-secondary);">{{ $art->author }}</td>
                <td style="font-size: 12px; color: var(--text-muted);">{{ \Carbon\Carbon::parse($art->published_at)->format('d M Y') }}</td>

                {{-- Toggle Pin Switch --}}
                <td>
                    <form method="POST" action="{{ route('admin.articles.toggle-pin', $art->id) }}" style="margin:0">
                        @csrf
                        <div class="switch-wrap">
                            <label class="switch" title="{{ $art->is_pinned ? 'Lepaskan dari Halaman Utama' : 'Pin ke Halaman Utama' }}">
                                <input type="checkbox" {{ $art->is_pinned ? 'checked' : '' }} onchange="this.form.submit()">
                                <span class="slider round"></span>
                            </label>
                            <span class="switch-label">
                                {{ $art->is_pinned ? '📌 Pinned' : 'Normal' }}
                            </span>
                        </div>
                    </form>
                </td>

                {{-- Status Badge --}}
                <td>
                    <span class="badge {{ $art->is_published ? 'badge-on' : 'badge-off' }}">
                        {{ $art->is_published ? '✓ Terbit' : '✗ Draft' }}
                    </span>
                </td>

                {{-- Action Buttons --}}
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.articles.edit', $art->id) }}" class="btn-action btn-edit">✏️ Edit</a>
                        <form method="POST" action="{{ route('admin.articles.destroy', $art->id) }}" style="margin:0" onsubmit="return confirm('Apakah Anda yakin ingin menghapus artikel ini?')">
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
                    📰 Belum ada artikel. <a href="{{ route('admin.articles.create') }}" style="color:var(--primary)">Tambahkan artikel pertama!</a>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

@if($articles->hasPages())
<div class="pagination-wrap">
    {{ $articles->links() }}
</div>
@endif
@endsection
