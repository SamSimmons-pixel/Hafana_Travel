@extends('admin.layout')

@section('title', 'Detail Group — ' . $group->nama_group)

@section('content')
<div class="page-header">
    <div>
        <h1>👥 Group: {{ $group->nama_group }}</h1>
        <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">
            {{ $group->keterangan ?? 'Tidak ada keterangan' }} · Dibuat {{ $group->created_at->format('d M Y, H:i') }}
        </p>
    </div>
    <div style="display:flex; gap:10px;">
        <a href="{{ route('admin.groups.index') }}" class="btn-secondary">← Daftar Group</a>
        <a href="{{ route('admin.users.create', ['group_id' => $group->id]) }}" class="btn-primary">+ Tambah Jemaah Manual</a>
    </div>
</div>

{{-- Append JSON Collapse / Card --}}
<div class="card" style="margin-bottom: 24px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
            <strong style="font-size:15px;">📋 Tempel JSON Tambahan ke Group Ini</strong>
            <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Tambahkan lebih banyak jemaah ke rombongan ini tanpa membuat group baru.</p>
        </div>
        <button type="button" class="btn-secondary" onclick="document.getElementById('append-json-form').style.display = (document.getElementById('append-json-form').style.display === 'none' ? 'block' : 'none')">
            ➕ Buka Form JSON
        </button>
    </div>

    <div id="append-json-form" style="display:none; margin-top:16px; border-top:1px solid var(--border); padding-top:16px;">
        
        {{-- AI Prompt Box inside Append Form --}}
        <div style="background: linear-gradient(135deg, #e6f7fd 0%, #ffffff 100%); border: 1.5px solid var(--primary); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 18px;">🤖</span>
                    <strong style="color: var(--primary-dark); font-size: 14px;">Prompt AI (Ekstrak PDF/Gambar Visa)</strong>
                </div>
                <button type="button" class="btn-primary" id="copy-prompt-btn-show" onclick="copyAiPromptShow('copy-prompt-btn-show', 'ai-prompt-text-show')" style="font-size: 12px; padding: 6px 12px;">
                    📋 Salin Prompt AI
                </button>
            </div>

            <textarea id="ai-prompt-text-show" readonly style="width: 100%; background: #ffffff; border: 1px solid var(--border); border-radius: 6px; padding: 10px; font-family: monospace; font-size: 11px; color: var(--text-primary); min-height: 160px; resize: vertical;" onclick="this.select()">Tolong ekstrak SELURUH data jemaah dari dokumen/PDF/gambar ini secara langsung menjadi format JSON murni.

ATURAN UTAMA & TOLERANSI DATA:
1. Jika ada data/kolom yang tidak terbaca, kosong, atau teks Arab yang tidak bisa diurai, TETAP MASUKKAN jemaah tersebut dan isi field yang tidak diketahui dengan nilai "-" (tanda strip). JANGAN MENOLAK atau menghentikan ekstraksi hanya karena ada data yang tidak lengkap/kurang jelas!
2. Ekstrak SEMUA jemaah dari halaman pertama hingga halaman terakhir (halaman 1 s/d selesai). DILARANG membatasi jumlah baris atau merangkum output.
3. HANYA keluarkan format array JSON murni valid tanpa teks pengantar, penutup, atau penjelasan lainnya.

Format JSON array per jemaah:
[
  {
    "name": "NAMA LENGKAP (atau '-' jika tidak terbaca)",
    "nomor_visa": "NOMOR VISA (atau '-' jika tidak terbaca)",
    "tanggal_lahir": "YYYY-MM-DD (atau '-' jika tidak terbaca)",
    "nomor_paspor": "NOMOR PASPOR (atau '-' jika tidak ada)",
    "no_hp": "NOMOR HP (atau '-' jika tidak ada)"
  }
]

Petunjuk Tambahan:
- Format tanggal lahir usahakan YYYY-MM-DD (contoh: 1995-08-15). Jika tidak ada atau sulit diurai, isi dengan "-".
- Utamakan agar SELURUH baris jemaah di dalam PDF berhasil diekstrak ke dalam array JSON.</textarea>
        </div>

        <form method="POST" action="{{ route('admin.groups.append-json', $group) }}">
            @csrf
            <div class="form-group">
                <label>Teks JSON Jemaah Tambahan</label>
                <textarea name="json_data" style="font-family:monospace; font-size:13px; min-height:120px;" placeholder='[{"name": "Budi", "nomor_visa": "V-998877", "tanggal_lahir": "1990-01-01"}]' required></textarea>
            </div>
            <button type="submit" class="btn-primary">⚡ Impor ke Group Ini</button>
        </form>
    </div>
</div>

{{-- Search Bar --}}
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <form method="GET" action="{{ route('admin.groups.show', $group) }}" style="display:flex; gap:10px; flex:1; max-width:400px;">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama, visa, atau paspor..." style="padding:8px 12px; font-size:13px;">
        <button type="submit" class="btn-secondary" style="padding:8px 16px;">Cari</button>
        @if(request('search'))
            <a href="{{ route('admin.groups.show', $group) }}" class="btn-secondary" style="padding:8px 12px; text-decoration:none;">Reset</a>
        @endif
    </form>

    <div class="actions">
        <a href="{{ route('admin.groups.edit', $group) }}" class="btn-action btn-edit">✏️ Edit Nama Group</a>

        {{-- Double Confirm Delete Button --}}
        <form id="delete-group-show-form" method="POST" action="{{ route('admin.groups.destroy', $group) }}" style="margin:0">
            @csrf
            @method('DELETE')
            <button type="button" class="btn-action btn-delete" onclick="confirmDeleteGroupShow('{{ addslashes($group->nama_group) }}', {{ $users->total() }})">
                🚨 Hapus Data Group Ini
            </button>
        </form>
    </div>
</div>

{{-- Jemaah Users Table --}}
<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nama Lengkap Jemaah</th>
                <th>Nomor Visa (Username)</th>
                <th>Tanggal Lahir (Password)</th>
                <th>Nomor Paspor</th>
                <th>No HP</th>
                <th>Status Pelacakan</th>
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
                <td>{{ $user->no_hp ?? '-' }}</td>
                <td>
                    @if($user->last_located_at)
                        <span class="badge badge-on">📍 Aktif ({{ $user->last_located_at->diffForHumans() }})</span>
                    @else
                        <span class="badge badge-off">Belum Ada Lokasi</span>
                    @endif
                </td>
                <td>
                    <div class="actions">
                        <a href="{{ route('admin.users.edit', ['user' => $user->id, 'return_to_group' => 1]) }}" class="btn-action btn-edit">✏️ Edit</a>
                        <form method="POST" action="{{ route('admin.users.destroy', ['user' => $user->id, 'return_to_group' => 1]) }}" style="margin:0" onsubmit="return confirm('Hapus akun jemaah {{ addslashes($user->name) }}?')">
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
                    Belum ada data Jemaah di group ini.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div style="margin-top:20px;">
    {{ $users->links() }}
</div>

<script>
function copyAiPromptShow(btnId, textId) {
    const textElement = document.getElementById(textId);
    const btnElement = document.getElementById(btnId);
    
    textElement.select();
    navigator.clipboard.writeText(textElement.value).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '✓ Prompt Tersalin!';
        btnElement.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.backgroundColor = 'var(--primary)';
        }, 2500);
    });
}

function confirmDeleteGroupShow(groupName, userCount) {
    const step1 = confirm(`⚠️ KONFIRMASI 1 DARI 2:\n\nApakah Anda YAKIN ingin menghapus Group "${groupName}"?`);
    if (!step1) return;

    const step2 = confirm(`🚨 KONFIRMASI PERINGATAN KEDUA (2 DARI 2):\n\nPerhatian! Menghapus Group "${groupName}" akan PERMANEN MENGHAPUS SELURUH ${userCount} AKUN JEMAAH di dalamnya beserta seluruh data pelacakan lokasinya!\n\nKlik OK untuk MEMPROSES PENGHAPUSAN.`);
    if (!step2) return;

    document.getElementById('delete-group-show-form').submit();
}
</script>
@endsection
