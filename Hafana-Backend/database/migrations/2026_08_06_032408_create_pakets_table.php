<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pakets', function (Blueprint $table) {
            $table->id();
            $table->string('nama_paket');
            $table->text('deskripsi')->nullable();
            $table->string('maskapai')->nullable();
            $table->string('kota_keberangkatan');
            $table->date('tanggal_berangkat');
            $table->integer('durasi_hari');
            $table->decimal('harga', 15, 2);
            $table->integer('kuota');
            $table->string('gambar')->nullable();
            $table->boolean('is_visible')->default(true);  // Admin toggle on/off
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pakets');
    }
};
