<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paket extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_paket',
        'deskripsi',
        'maskapai',
        'kota_keberangkatan',
        'tanggal_berangkat',
        'durasi_hari',
        'harga',
        'kuota',
        'gambar',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'tanggal_berangkat' => 'date',
            'harga' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (Paket $paket) {
            if ($paket->gambar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($paket->gambar);
            }
        });
    }
}
