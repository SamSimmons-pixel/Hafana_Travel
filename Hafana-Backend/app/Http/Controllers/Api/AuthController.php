<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'nomor_visa'    => 'required|string',
            'tanggal_lahir' => 'required|string',
        ]);

        $user = User::with('group')
            ->where('nomor_visa', $credentials['nomor_visa'])
            ->where('tanggal_lahir', $credentials['tanggal_lahir'])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Nomor Visa atau Tanggal Lahir tidak ditemukan'], 401);
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
}
