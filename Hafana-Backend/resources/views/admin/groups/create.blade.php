@extends('admin.layout')

@section('title', 'Import Group (JSON)')

@section('content')
<div style="max-width: 850px;">
    <div class="page-header" style="margin-bottom: 20px;">
        <div>
            <h1>📋 Impor Group & Akun Jemaah dari JSON</h1>
            <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">
                Tempel data JSON teks yang diberikan untuk membuat Group dan seluruh akun Jemaah secara otomatis.
            </p>
        </div>
        <a href="{{ route('admin.groups.index') }}" class="btn-secondary">← Kembali</a>
    </div>

    {{-- AI Prompt Box --}}
    <div style="background: linear-gradient(135deg, #e6f7fd 0%, #ffffff 100%); border: 1.5px solid var(--primary); border-radius: 14px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(0, 174, 239, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">🤖</span>
                <div>
                    <strong style="color: var(--primary-dark); font-size: 15px;">Prompt AI Siap Pakai (Ekstrak PDF / Dokumen Visa)</strong>
                    <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Salin prompt ini, lalu kirimkan bersama file PDF/Gambar Visa ke ChatGPT, Claude, atau Gemini.</p>
                </div>
            </div>
            <button type="button" class="btn-primary" id="copy-prompt-btn-create" onclick="copyAiPrompt('copy-prompt-btn-create', 'ai-prompt-text-create')" style="font-size: 13px; padding: 8px 16px;">
                📋 Salin Prompt AI
            </button>
        </div>

        <textarea id="ai-prompt-text-create" readonly style="width: 100%; background: #ffffff; border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: var(--text-primary); min-height: 190px; resize: vertical;" onclick="this.select()">Tolong ekstrak SELURUH data jemaah dari dokumen/PDF/gambar ini secara langsung menjadi format JSON murni.

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

    <div class="card">
        <form method="POST" action="{{ route('admin.groups.store') }}">
            @csrf

            <div class="form-group">
                <label>Nama Group / Rombongan Keberangkatan *</label>
                <input type="text" name="nama_group" value="{{ old('nama_group') }}"
                    placeholder="Contoh: Keberangkatan 16 Sep 2026 - Rombongan 1" required>
                @error('nama_group')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            <div class="form-group">
                <label>Keterangan / Catatan Tambahan (Opsional)</label>
                <input type="text" name="keterangan" value="{{ old('keterangan') }}"
                    placeholder="Contoh: Pembimbing Ust. Yusuf As Sidawy, Hotel Makkah Tower">
            </div>

            <div class="form-group">
                <label>Teks JSON Data Jemaah *</label>
                <textarea name="json_data" style="font-family: monospace; font-size:13px; min-height: 220px;"
                    placeholder='[&#10;  {&#10;    "name": "Ahmad Syahputra",&#10;    "nomor_visa": "V-123456",&#10;    "tanggal_lahir": "1998-05-20",&#10;    "nomor_paspor": "A9876543",&#10;    "no_hp": "08123456789"&#10;  }&#10;]' required>{{ old('json_data') }}</textarea>
                @error('json_data')<p class="error-msg">{{ $message }}</p>@enderror
            </div>

            {{-- Supported Keys Info --}}
            <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:14px; margin-bottom:20px; font-size:12px; color:var(--text-primary);">
                <strong style="color:var(--text-primary);">💡 Nama Kunci (Key) JSON yang Didukung Otomatis:</strong>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:8px; color:var(--text-muted);">
                    <div>• <strong>Nama:</strong> <code>name</code>, <code>nama</code>, <code>nama_lengkap</code>, <code>full_name</code></div>
                    <div>• <strong>Visa (Username Login):</strong> <code>nomor_visa</code>, <code>visa</code>, <code>no_visa</code></div>
                    <div>• <strong>Tgl Lahir (Password Login):</strong> <code>tanggal_lahir</code>, <code>dob</code>, <code>birth_date</code></div>
                    <div>• <strong>Paspor:</strong> <code>nomor_paspor</code>, <code>paspor</code>, <code>passport</code></div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">⚡ Impor & Buat Akun Group</button>
                <a href="{{ route('admin.groups.index') }}" class="btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

<script>
function copyAiPrompt(btnId, textId) {
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
</script>
@endsection
