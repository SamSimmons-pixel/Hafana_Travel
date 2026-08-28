<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class VisaPortalController extends Controller
{
    /**
     * Display the Visa Portal (Profile page if verified in session, else verification form).
     */
    public function index(Request $request): View
    {
        $appLogo = Setting::get('app_logo');
        $visaUserId = session('visa_user_id');

        if ($visaUserId) {
            $user = User::with('group')
                ->where('id', $visaUserId)
                ->whereHas('group', fn($q) => $q->where('is_active', true))
                ->first();

            if ($user) {
                return view('visa.profile', compact('user', 'appLogo'));
            }

            // Group might have been deactivated or user deleted
            session()->forget('visa_user_id');
        }

        return view('visa.verify', compact('appLogo'));
    }

    /**
     * Search registered names for live autocomplete dropdown.
     */
    public function searchNames(Request $request): JsonResponse
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

    /**
     * Verify Nama Lengkap and Tanggal Lahir.
     */
    public function verify(Request $request)
    {
        $credentials = $request->validate([
            'name'          => 'required|string|min:2',
            'tanggal_lahir' => 'required|date_format:Y-m-d',
        ], [
            'name.required'          => 'Nama lengkap wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib dipilih.',
            'tanggal_lahir.date_format' => 'Format tanggal lahir tidak valid (YYYY-MM-DD).',
        ]);

        $name = strtoupper(trim($credentials['name']));

        $user = User::with('group')
            ->whereRaw('UPPER(name) = ?', [$name])
            ->where('tanggal_lahir', $credentials['tanggal_lahir'])
            ->whereHas('group', fn($q) => $q->where('is_active', true))
            ->first();

        if (!$user) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data jemaah tidak ditemukan atau rombongan belum aktif. Pastikan nama lengkap dan tanggal lahir sesuai paspor.',
                ], 422);
            }

            return redirect()->back()
                ->withInput()
                ->with('error', 'Data jemaah tidak ditemukan atau rombongan belum aktif. Pastikan nama lengkap dan tanggal lahir sesuai paspor.');
        }

        // Store user in session
        session(['visa_user_id' => $user->id]);

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success'  => true,
                'redirect' => route('visa.index'),
            ]);
        }

        return redirect()->route('visa.index');
    }

    /**
     * Update WhatsApp phone number for verified jemaah.
     */
    public function updatePhone(Request $request): RedirectResponse|JsonResponse
    {
        $visaUserId = session('visa_user_id');
        if (!$visaUserId) {
            return redirect()->route('visa.index');
        }

        $request->validate([
            'no_hp' => ['required', 'regex:/^[0-9+]{8,20}$/'],
        ], [
            'no_hp.required' => 'Nomor WhatsApp wajib diisi.',
            'no_hp.regex'    => 'Nomor WhatsApp hanya boleh berupa angka (nomor telepon valid).',
        ]);

        $user = User::find($visaUserId);
        if ($user) {
            $user->update(['no_hp' => $request->no_hp]);
        }

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'message' => 'Nomor WhatsApp berhasil diperbarui']);
        }

        return redirect()->route('visa.index')->with('success', 'Nomor WhatsApp berhasil disimpan!');
    }

    /**
     * Clear verification session.
     */
    public function logout(): RedirectResponse
    {
        session()->forget('visa_user_id');
        return redirect()->route('visa.index');
    }
}
