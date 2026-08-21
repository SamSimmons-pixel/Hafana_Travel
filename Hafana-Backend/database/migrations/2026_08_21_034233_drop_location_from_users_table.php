<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop location tracking columns — feature removed
            $table->dropColumn(['latitude', 'longitude', 'last_located_at']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('no_hp');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->timestamp('last_located_at')->nullable()->after('longitude');
        });
    }
};

