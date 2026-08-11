<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galeri', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['galeri', 'testimoni'])->default('galeri');
            $table->string('gambar');              // Storage path (public disk)
            $table->string('caption')->nullable(); // Alt-text / accessibility label
            $table->integer('urutan')->default(0); // Sort order
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galeri');
    }
};
