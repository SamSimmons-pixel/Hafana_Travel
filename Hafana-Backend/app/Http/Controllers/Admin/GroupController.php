<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class GroupController extends Controller
{
    /**
     * Display list of groups
     */
    public function index(): View
    {
        $groups = Group::withCount('users')->latest()->get();
        return view('admin.groups.index', compact('groups'));
    }

    /**
     * Show form to create group / import JSON
     */
    public function create(): View
    {
        return view('admin.groups.create');
    }

    /**
     * Store group and batch import users from JSON text
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_group' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'json_data'  => 'required|string',
        ]);

        $rawJson = trim($request->input('json_data'));
        $data = json_decode($rawJson, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return back()->withInput()->with('error', 'Format JSON tidak valid! Pastikan sintaks JSON benar: ' . json_last_error_msg());
        }

        // If JSON is wrapped in an object like {"data": [...]} or {"jemaah": [...]}
        if (isset($data['data']) && is_array($data['data'])) {
            $data = $data['data'];
        } elseif (isset($data['jemaah']) && is_array($data['jemaah'])) {
            $data = $data['jemaah'];
        } elseif (isset($data['users']) && is_array($data['users'])) {
            $data = $data['users'];
        }

        if (empty($data) || !is_array($data)) {
            return back()->withInput()->with('error', 'Data JSON kosong atau tidak berisi array Jemaah.');
        }

        $group = Group::create([
            'nama_group' => $request->input('nama_group'),
            'keterangan' => $request->input('keterangan'),
        ]);

        $createdCount = 0;
        $updatedCount = 0;
        $failedCount = 0;

        foreach ($data as $index => $item) {
            if (!is_array($item)) continue;

            // Flexible key mapping
            $name = $item['name'] ?? $item['nama'] ?? $item['nama_lengkap'] ?? $item['full_name'] ?? null;
            $visa = $item['nomor_visa'] ?? $item['visa'] ?? $item['no_visa'] ?? $item['visa_number'] ?? null;
            $dob  = $item['tanggal_lahir'] ?? $item['birth_date'] ?? $item['dob'] ?? $item['tgl_lahir'] ?? null;
            $paspor = $item['nomor_paspor'] ?? $item['paspor'] ?? $item['passport'] ?? $item['no_paspor'] ?? null;
            $phone = $item['no_hp'] ?? $item['phone'] ?? $item['hp'] ?? $item['telepon'] ?? null;

            if (!$name || !$visa || !$dob) {
                $failedCount++;
                continue;
            }

            // Standardize YYYY-MM-DD date if needed
            try {
                $dobFormatted = date('Y-m-d', strtotime($dob));
            } catch (\Exception $e) {
                $dobFormatted = $dob;
            }

            $user = User::where('nomor_visa', $visa)->first();

            if ($user) {
                $user->update([
                    'group_id' => $group->id,
                    'name' => $name,
                    'tanggal_lahir' => $dobFormatted,
                    'nomor_paspor' => $paspor ?? $user->nomor_paspor,
                    'no_hp' => $phone ?? $user->no_hp,
                ]);
                $updatedCount++;
            } else {
                User::create([
                    'group_id' => $group->id,
                    'name' => $name,
                    'nomor_visa' => $visa,
                    'tanggal_lahir' => $dobFormatted,
                    'nomor_paspor' => $paspor,
                    'no_hp' => $phone,
                ]);
                $createdCount++;
            }
        }

        $msg = "Group '{$group->nama_group}' berhasil dibuat. ";
        $msg .= "{$createdCount} akun jemaah dibuat";
        if ($updatedCount > 0) $msg .= ", {$updatedCount} akun diperbarui";
        if ($failedCount > 0) $msg .= ", {$failedCount} data dilewati (kurang Nama/Visa/Tgl Lahir)";

        return redirect()->route('admin.groups.show', $group)->with('success', $msg);
    }

    /**
     * Show group details and members list
     */
    public function show(Group $group, Request $request): View
    {
        $query = $group->users();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nomor_visa', 'like', "%{$search}%")
                  ->orWhere('nomor_paspor', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(25);

        return view('admin.groups.show', compact('group', 'users'));
    }

    /**
     * Show edit group details form
     */
    public function edit(Group $group): View
    {
        return view('admin.groups.edit', compact('group'));
    }

    /**
     * Update group metadata
     */
    public function update(Request $request, Group $group): RedirectResponse
    {
        $validated = $request->validate([
            'nama_group' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('admin.groups.show', $group)->with('success', 'Detail Group berhasil diperbarui.');
    }

    /**
     * Append extra JSON data to an existing group
     */
    public function appendJson(Request $request, Group $group): RedirectResponse
    {
        $request->validate([
            'json_data' => 'required|string',
        ]);

        $rawJson = trim($request->input('json_data'));
        $data = json_decode($rawJson, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return back()->with('error', 'Format JSON tidak valid: ' . json_last_error_msg());
        }

        if (isset($data['data'])) $data = $data['data'];
        elseif (isset($data['jemaah'])) $data = $data['jemaah'];
        elseif (isset($data['users'])) $data = $data['users'];

        $createdCount = 0;
        $updatedCount = 0;

        foreach ($data as $item) {
            if (!is_array($item)) continue;

            $name = $item['name'] ?? $item['nama'] ?? $item['nama_lengkap'] ?? null;
            $visa = $item['nomor_visa'] ?? $item['visa'] ?? $item['no_visa'] ?? null;
            $dob  = $item['tanggal_lahir'] ?? $item['birth_date'] ?? $item['dob'] ?? null;
            $paspor = $item['nomor_paspor'] ?? $item['paspor'] ?? null;
            $phone = $item['no_hp'] ?? $item['phone'] ?? null;

            if (!$name || !$visa || !$dob) continue;

            $dobFormatted = date('Y-m-d', strtotime($dob));

            $user = User::where('nomor_visa', $visa)->first();

            if ($user) {
                $user->update([
                    'group_id' => $group->id,
                    'name' => $name,
                    'tanggal_lahir' => $dobFormatted,
                    'nomor_paspor' => $paspor ?? $user->nomor_paspor,
                    'no_hp' => $phone ?? $user->no_hp,
                ]);
                $updatedCount++;
            } else {
                User::create([
                    'group_id' => $group->id,
                    'name' => $name,
                    'nomor_visa' => $visa,
                    'tanggal_lahir' => $dobFormatted,
                    'nomor_paspor' => $paspor,
                    'no_hp' => $phone,
                ]);
                $createdCount++;
            }
        }

        return redirect()->route('admin.groups.show', $group)
            ->with('success', "Berhasil menambahkan data ke Group. {$createdCount} akun baru dibuat, {$updatedCount} akun diperbarui.");
    }

    /**
     * Delete entire group and all associated users
     */
    public function destroy(Group $group): RedirectResponse
    {
        $nama = $group->nama_group;
        $count = $group->users()->count();

        // Cascade delete is handled by database foreign key constraint
        $group->delete();

        return redirect()->route('admin.groups.index')
            ->with('success', "Group '{$nama}' beserta {$count} akun Jemaah di dalamnya berhasil dihapus.");
    }
}
