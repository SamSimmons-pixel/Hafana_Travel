<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Login using Nama Lengkap (uppercase) + Tanggal Lahir.
     * Only users whose group is active can log in.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'name'          => 'required|string',
            'tanggal_lahir' => 'required|string',
        ]);

        // Force uppercase — all names stored as uppercase
        $name = strtoupper(trim($credentials['name']));

        $user = User::with('group')
            ->whereRaw('UPPER(name) = ?', [$name])
            ->where('tanggal_lahir', $credentials['tanggal_lahir'])
            ->whereHas('group', fn($q) => $q->where('is_active', true))
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Nama atau Tanggal Lahir tidak ditemukan, atau akun grup tidak aktif.',
            ], 401);
        }

        $token = $user->createToken('mobile_app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('group'));
    }

    /**
     * Search user names for login autocomplete dropdown.
     * Only returns names from active groups.
     */
    public function searchNames(Request $request)
    {
        $query = strtoupper(trim($request->get('query', '')));

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::with('group')
            ->whereRaw('UPPER(name) LIKE ?', ["%{$query}%"])
            ->whereHas('group', fn($q) => $q->where('is_active', true))
            ->select('id', 'name', 'group_id')
            ->limit(10)
            ->get()
            ->map(fn($u) => [
                'name'       => $u->name,
                'group_name' => $u->group?->nama_group ?? '',
            ]);

        return response()->json($users);
    }
}

