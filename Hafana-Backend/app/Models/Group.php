<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_group',
        'keterangan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /** Scope: only active groups */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}

