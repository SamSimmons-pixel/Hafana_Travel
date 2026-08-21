<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Update current user's phone number.
     * Called from mobile app when user fills in the phone prompt modal.
     */
    public function updatePhone(Request $request)
    {
        $request->validate([
            'no_hp' => 'required|string|regex:/^[0-9]+$/|min:8|max:15',
        ]);

        $user = $request->user();
        $user->update(['no_hp' => $request->input('no_hp')]);

        return response()->json([
            'message' => 'Nomor telepon berhasil disimpan.',
            'user'    => $user->fresh()->load('group'),
        ]);
    }
}

