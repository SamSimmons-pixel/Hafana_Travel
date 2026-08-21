<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Jemaah {{ $group->nama_group }}</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 11px; color: #222; }
    .header { text-align: center; padding: 18px 0 10px; border-bottom: 2px solid #1a6b3c; margin-bottom: 14px; }
    .header h1 { font-size: 16px; color: #1a6b3c; font-weight: 700; }
    .header p { font-size: 11px; color: #555; margin-top: 3px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 10px; color: #666; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1a6b3c; color: #fff; }
    th { padding: 7px 8px; text-align: left; font-size: 10px; font-weight: 700; }
    tbody tr:nth-child(even) { background: #f5f9f6; }
    td { padding: 6px 8px; border-bottom: 1px solid #e0e0e0; font-size: 10px; vertical-align: middle; }
    .no-hp { color: #1a6b3c; font-weight: 600; }
    .wa-link { color: #1a6b3c; text-decoration: none; font-weight: 700; }
    .footer { margin-top: 18px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
</style>
</head>
<body>

<div class="header">
    <h1>📋 Data Jemaah — {{ $group->nama_group }}</h1>
    @if($group->keterangan)
    <p>{{ $group->keterangan }}</p>
    @endif
</div>

<div class="info-row">
    <span>Total Jemaah: <strong>{{ $users->count() }}</strong></span>
    <span>Dicetak: {{ now()->isoFormat('D MMMM YYYY, HH:mm') }} WIB</span>
    <span>Status Group: <strong>{{ $group->is_active ? 'Aktif' : 'Non-aktif' }}</strong></span>
</div>

<table>
    <thead>
        <tr>
            <th width="4%">#</th>
            <th width="28%">Nama Lengkap</th>
            <th width="16%">Nomor Visa</th>
            <th width="17%">Nomor Paspor</th>
            <th width="19%">Nomor HP</th>
            <th width="16%">Tgl Lahir</th>
        </tr>
    </thead>
    <tbody>
        @forelse($users as $i => $user)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $user->name }}</td>
            <td>{{ $user->nomor_visa ?? '-' }}</td>
            <td>{{ $user->nomor_paspor ?? '-' }}</td>
            <td class="no-hp">
                @if($user->no_hp)
                    {{-- Format: wa.me/62XXX — strip leading 0, replace with 62 --}}
                    @php
                        $hp = preg_replace('/^0/', '62', $user->no_hp);
                        $waMsg = urlencode("Halo, saya ingin menyimpan kontak: {$user->name} ({$user->no_hp})");
                        $waUrl = "https://wa.me/{$hp}?text={$waMsg}";
                    @endphp
                    <a href="{{ $waUrl }}" class="wa-link">{{ $user->no_hp }} 💬</a>
                @else
                    <span style="color:#bbb;">-</span>
                @endif
            </td>
            <td>
                @if($user->tanggal_lahir)
                    {{ \Carbon\Carbon::parse($user->tanggal_lahir)->isoFormat('D MMM YYYY') }}
                @else
                    -
                @endif
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="6" style="text-align:center; color:#999; padding:20px;">Belum ada data jemaah.</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="footer">
    <p>Dokumen ini digenerate otomatis oleh sistem HAFANA. Tekan nomor HP untuk membuka WhatsApp.</p>
</div>

</body>
</html>
