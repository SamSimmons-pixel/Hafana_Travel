<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class AdminUserController extends Controller
{
    /**
     * List all Admin crew members
     */
    public function index(): View
    {
        $admins = Admin::orderBy('name')->get();
        return view('admin.admins.index', compact('admins'));
    }

    /**
     * Show form to add new Admin
     */
    public function create(): View
    {
        return view('admin.admins.create');
    }

    /**
     * Store new Admin
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:admins,email',
            'password' => 'required|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        Admin::create($validated);

        return redirect()->route('admin.admins.index')
            ->with('success', "Akun Admin '{$validated['name']}' berhasil ditambahkan.");
    }

    /**
     * Show form to edit Admin
     */
    public function edit(Admin $admin): View
    {
        return view('admin.admins.edit', compact('admin'));
    }

    /**
     * Update Admin details
     */
    public function update(Request $request, Admin $admin): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:admins,email,' . $admin->id,
            'password' => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $admin->update($validated);

        return redirect()->route('admin.admins.index')
            ->with('success', "Akun Admin '{$admin->name}' berhasil diperbarui.");
    }

    /**
     * Delete Admin account
     */
    public function destroy(Admin $admin): RedirectResponse
    {
        if (Admin::count() <= 1) {
            return back()->with('error', 'Tidak dapat menghapus admin terakhir!');
        }

        $name = $admin->name;
        $admin->delete();

        return redirect()->route('admin.admins.index')
            ->with('success', "Akun Admin '{$name}' berhasil dihapus.");
    }
}
