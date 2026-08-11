<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class GaleriController extends Controller
{
    public function index(): View
    {
        $items = Galeri::orderBy('type')->orderBy('urutan')->orderBy('created_at', 'desc')->get();
        return view('admin.galeri.index', compact('items'));
    }

    public function create(): View
    {
        return view('admin.galeri.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type'       => 'required|in:galeri,testimoni',
            'gambar'     => 'required|image|max:5120', // 5MB
            'caption'    => 'nullable|string|max:255',
            'urutan'     => 'nullable|integer|min:0',
        ]);

        $validated['gambar']     = $request->file('gambar')->store('galeri', 'public');
        $validated['is_visible'] = $request->has('is_visible');
        $validated['urutan']     = $validated['urutan'] ?? 0;

        Galeri::create($validated);

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Item galeri berhasil ditambahkan!');
    }

    public function edit(Galeri $galeri): View
    {
        return view('admin.galeri.edit', compact('galeri'));
    }

    public function update(Request $request, Galeri $galeri): RedirectResponse
    {
        $validated = $request->validate([
            'type'    => 'required|in:galeri,testimoni',
            'gambar'  => 'nullable|image|max:5120',
            'caption' => 'nullable|string|max:255',
            'urutan'  => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('gambar')) {
            // Delete old file
            if ($galeri->gambar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($galeri->gambar);
            }
            $validated['gambar'] = $request->file('gambar')->store('galeri', 'public');
        } else {
            unset($validated['gambar']);
        }

        $validated['is_visible'] = $request->has('is_visible');
        $validated['urutan']     = $validated['urutan'] ?? 0;

        $galeri->update($validated);

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Item galeri berhasil diperbarui!');
    }

    public function destroy(Galeri $galeri): RedirectResponse
    {
        if ($galeri->gambar) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($galeri->gambar);
        }
        $galeri->delete();

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Item galeri berhasil dihapus!');
    }

    public function toggleVisibility(Galeri $galeri): RedirectResponse
    {
        $galeri->update(['is_visible' => !$galeri->is_visible]);
        return redirect()->back()->with('success', 'Status visibilitas diperbarui!');
    }
}
