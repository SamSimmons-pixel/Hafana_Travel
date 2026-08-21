<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'group_id',
        'name',
        'nomor_visa',
        'tanggal_lahir',
        'nomor_paspor',
        'no_hp',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }
}
