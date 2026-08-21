<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * Display all Jemaah users across groups
     */
    public function index(Request $request): View
    {
        $groups = Group::orderBy('nama_group')->get();

        $query = User::with('group');

        if ($request->filled('group_id')) {
            $query->where('group_id', $request->input('group_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nomor_visa', 'like', "%{$search}%")
                  ->orWhere('nomor_paspor', 'like', "%{$search}%")
                  ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(25);

        return view('admin.users.index', compact('users', 'groups'));
    }

    /**
     * Show create jemaah form
     */
    public function create(Request $request): View
    {
        $groups = Group::orderBy('nama_group')->get();
        $selectedGroupId = $request->input('group_id');
        return view('admin.users.create', compact('groups', 'selectedGroupId'));
    }

    /**
     * Store new Jemaah user
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'nomor_visa'    => 'required|string|max:100|unique:users,nomor_visa',
            'tanggal_lahir' => 'required|date',
            'nomor_paspor'  => 'nullable|string|max:100',
            'no_hp'         => 'nullable|string|regex:/^[0-9]+$/|max:50',
            'group_id'      => 'nullable|exists:groups,id',
        ]);

        $validated['name'] = strtoupper(trim($validated['name']));

        $user = User::create($validated);

        if ($user->group_id) {
            return redirect()->route('admin.groups.show', $user->group_id)
                ->with('success', "Jemaah '{$user->name}' berhasil ditambahkan.");
        }

        return redirect()->route('admin.users.index')
            ->with('success', "Jemaah '{$user->name}' berhasil ditambahkan.");
    }

    /**
     * Show edit jemaah form
     */
    public function edit(User $user): View
    {
        $groups = Group::orderBy('nama_group')->get();
        return view('admin.users.edit', compact('user', 'groups'));
    }

    /**
     * Update Jemaah details
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'nomor_visa'    => 'required|string|max:100|unique:users,nomor_visa,' . $user->id,
            'tanggal_lahir' => 'required|date',
            'nomor_paspor'  => 'nullable|string|max:100',
            'no_hp'         => 'nullable|string|regex:/^[0-9]+$/|max:50',
            'group_id'      => 'nullable|exists:groups,id',
        ]);

        $validated['name'] = strtoupper(trim($validated['name']));

        $user->update($validated);

        if ($request->has('return_to_group') && $user->group_id) {
            return redirect()->route('admin.groups.show', $user->group_id)
                ->with('success', "Data Jemaah '{$user->name}' berhasil diperbarui.");
        }

        return redirect()->route('admin.users.index')
            ->with('success', "Data Jemaah '{$user->name}' berhasil diperbarui.");
    }

    /**
     * Delete individual Jemaah user
     */
    public function destroy(User $user, Request $request): RedirectResponse
    {
        if (auth('admin')->user()->isSubAdmin()) {
            return back()->with('error', 'Sub Admin tidak memiliki akses untuk menghapus akun Jemaah.');
        }

        $name = $user->name;
        $groupId = $user->group_id;

        $user->delete();

        if ($request->has('return_to_group') && $groupId) {
            return redirect()->route('admin.groups.show', $groupId)
                ->with('success', "Akun Jemaah '{$name}' berhasil dihapus.");
        }

        return redirect()->route('admin.users.index')
            ->with('success', "Akun Jemaah '{$name}' berhasil dihapus.");
    }
}
