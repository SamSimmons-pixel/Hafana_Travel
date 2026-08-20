<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    use HasFactory;

    protected $table = 'galeri';

    protected $fillable = [
        'type',
        'gambar',
        'caption',
        'urutan',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'urutan'     => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (Galeri $galeri) {
            if ($galeri->gambar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($galeri->gambar);
            }
        });
    }
}
