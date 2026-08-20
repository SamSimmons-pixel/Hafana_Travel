<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'thumbnail_url',
        'author',
        'summary',
        'content',
        'is_published',
        'is_pinned',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_pinned'    => 'boolean',
        'published_at' => 'datetime',
    ];

    /** Helper to delete local storage file from public disk */
    public static function deleteStorageFile(?string $path): void
    {
        if (!$path) return;

        if (str_contains($path, '/storage/')) {
            $path = substr($path, strpos($path, '/storage/') + 9);
        } else if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }

        $cleanPath = ltrim($path, '/');
        if ($cleanPath && Storage::disk('public')->exists($cleanPath)) {
            Storage::disk('public')->delete($cleanPath);
        }
    }

    /** Model deletion observer */
    protected static function booted(): void
    {
        static::deleting(function (Article $article) {
            // 1. Delete thumbnail file from storage if stored locally
            $thumb = $article->getRawOriginal('thumbnail_url');
            if ($thumb) {
                static::deleteStorageFile($thumb);
            }

            // 2. Extract and delete inline content images
            if ($article->content) {
                preg_match_all('/!\[[^\]]*\]\s*\(\s*([^\s)]+)\s*\)/', $article->content, $matches);
                if (!empty($matches[1])) {
                    foreach ($matches[1] as $imgUrl) {
                        static::deleteStorageFile($imgUrl);
                    }
                }
            }
        });
    }

    /** Accessor for thumbnail_url with fallback to settings logo */
    public function getThumbnailUrlAttribute($value)
    {
        if ($value) {
            if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
                return $value;
            }
            return asset($value);
        }

        // Fallback: Check setting image from Setting model or storage/settings
        $appLogo = Setting::get('app_logo');
        if ($appLogo && Storage::disk('public')->exists($appLogo)) {
            return asset('storage/' . ltrim($appLogo, '/'));
        }

        $files = Storage::disk('public')->files('settings');
        if (!empty($files)) {
            $imageFiles = array_values(array_filter($files, function ($f) {
                return preg_match('/\.(jpg|jpeg|png|webp|svg)$/i', $f);
            }));
            if (!empty($imageFiles)) {
                // Pick 1 randomly if multiple exist
                $randomFile = $imageFiles[array_rand($imageFiles)];
                return asset('storage/' . ltrim($randomFile, '/'));
            }
        }

        return null;
    }
}
