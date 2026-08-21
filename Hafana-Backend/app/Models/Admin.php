<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // 'admin' | 'sub_admin'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /** Full admin — can do everything */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /** Sub-admin — cannot delete group/user/logo */
    public function isSubAdmin(): bool
    {
        return $this->role === 'sub_admin';
    }
}

