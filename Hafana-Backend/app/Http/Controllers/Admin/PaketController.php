<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Paket;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PaketController extends Controller
{
    public function index(): View
    {
        $pakets = Paket::orderBy('tanggal_berangkat', 'asc')->get();
        return view('admin.pakets.index', compact('pakets'));
    }

    public function create(): View
    {
        return view('admin.pakets.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_paket'          => 'required|string|max:255',
            'deskripsi'           => 'nullable|string',
            'maskapai'            => 'nullable|string|max:100',
            'kota_keberangkatan'  => 'required|string|max:100',
            'tanggal_berangkat'   => 'required|date',
            'durasi_hari'         => 'required|integer|min:1',
            'harga'               => 'required|numeric|min:0',
            'kuota'               => 'required|integer|min:1',
            'gambar'              => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $request->file('gambar')->store('pakets', 'public');
        }

        $validated['is_visible'] = $request->has('is_visible');

        Paket::create($validated);

        return redirect()->route('admin.pakets.index')
            ->with('success', 'Paket berhasil ditambahkan!');
    }

    public function edit(Paket $paket): View
    {
        return view('admin.pakets.edit', compact('paket'));
    }

    public function update(Request $request, Paket $paket): RedirectResponse
    {
        $validated = $request->validate([
            'nama_paket'          => 'required|string|max:255',
            'deskripsi'           => 'nullable|string',
            'maskapai'            => 'nullable|string|max:100',
            'kota_keberangkatan'  => 'required|string|max:100',
            'tanggal_berangkat'   => 'required|date',
            'durasi_hari'         => 'required|integer|min:1',
            'harga'               => 'required|numeric|min:0',
            'kuota'               => 'required|integer|min:1',
            'gambar'              => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $request->file('gambar')->store('pakets', 'public');
        }

        $validated['is_visible'] = $request->has('is_visible');

        $paket->update($validated);

        return redirect()->route('admin.pakets.index')
            ->with('success', 'Paket berhasil diperbarui!');
    }

    public function destroy(Paket $paket): RedirectResponse
    {
        $paket->delete();
        return redirect()->route('admin.pakets.index')
            ->with('success', 'Paket berhasil dihapus!');
    }

    /**
     * Toggle is_visible via AJAX/form POST
     */
    public function toggleVisibility(Paket $paket): RedirectResponse
    {
        $paket->update(['is_visible' => !$paket->is_visible]);

        return redirect()->back()
            ->with('success', $paket->is_visible ? 'Paket ditampilkan di aplikasi.' : 'Paket disembunyikan dari aplikasi.');
    }
}
