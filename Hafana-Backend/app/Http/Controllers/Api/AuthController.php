<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) 
    {
        $validated = $request->validate([
            'tanggal_lahir' => 'required|date',
            'nomor_visa' => 'required|string|max:255',
        ]);

        $user = User::create([
            'tanggal_lahir' => $validated['tanggal_lahir'],
            'nomor_visa' => $validated['nomor_visa'],
        ]);

        $token = $user->createToken('mobile_app')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }
    
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'nomor_visa' => 'required',
            'tanggal_lahir' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('nomor_visa', $request->nomor_visa)->firstOrFail();
        $token = $user->createToken('mobile_app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
