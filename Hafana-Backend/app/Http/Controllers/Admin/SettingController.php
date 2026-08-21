<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class SettingController extends Controller
{
    public function index(): View
    {
        $appLogo = Setting::get('app_logo');
        return view('admin.settings.index', compact('appLogo'));
    }

    public function update(Request $request): RedirectResponse
    {
        if (auth('admin')->user()->isSubAdmin()) {
            return back()->with('error', 'Sub Admin tidak memiliki akses untuk mengubah logo atau pengaturan sistem.');
        }

        $request->validate([
            'app_logo' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($request->hasFile('app_logo')) {
            $oldLogo = Setting::get('app_logo');
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }

            // Ensure only 1 setting image file exists in storage/settings
            $existingFiles = Storage::disk('public')->files('settings');
            if (!empty($existingFiles)) {
                Storage::disk('public')->delete($existingFiles);
            }

            $path = $request->file('app_logo')->store('settings', 'public');
            Setting::set('app_logo', $path);
        }

        return redirect()->back()->with('success', 'Pengaturan logo aplikasi berhasil diperbarui!');
    }
}
