<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::orderBy('published_at', 'desc')->paginate(15);
        return view('admin.articles.index', compact('articles'));
    }

    public function create()
    {
        return view('admin.articles.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'author'        => 'required|string|max:255',
            'thumbnail_url' => 'nullable|string|max:1000',
            'summary'       => 'nullable|string',
            'content'       => 'required|string',
            'published_at'  => 'nullable|date',
            'is_published'  => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['is_published'] = $request->has('is_published');
        $validated['published_at'] = $request->published_at ?? now();

        Article::create($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dibuat');
    }

    public function edit(Article $article)
    {
        return view('admin.articles.edit', compact('article'));
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'author'        => 'required|string|max:255',
            'thumbnail_url' => 'nullable|string|max:1000',
            'summary'       => 'nullable|string',
            'content'       => 'required|string',
            'published_at'  => 'nullable|date',
            'is_published'  => 'boolean',
        ]);

        $validated['is_published'] = $request->has('is_published');

        $article->update($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dihapus');
    }
}
