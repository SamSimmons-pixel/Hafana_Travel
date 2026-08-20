<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('group_id')->nullable()->after('id')->constrained('groups')->onDelete('cascade');
            $table->string('nomor_paspor')->nullable()->after('tanggal_lahir');
            $table->string('no_hp')->nullable()->after('nomor_paspor');
            $table->decimal('latitude', 10, 7)->nullable()->after('no_hp');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->timestamp('last_located_at')->nullable()->after('longitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropColumn([
                'group_id',
                'nomor_paspor',
                'no_hp',
                'latitude',
                'longitude',
                'last_located_at',
            ]);
        });
    }
};
