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
        Schema::table('farmers', function (Blueprint $table) {
            // Add phone_number field
            $table->string('phone_number')->after('user_id');
            
            // Make location fields nullable
            $table->foreignId('municipalitiy_id')->nullable()->change();
            $table->foreignId('barangay_id')->nullable()->change();
            $table->foreignId('sitio_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmers', function (Blueprint $table) {
            $table->dropColumn('phone_number');
            
            // Revert to not nullable
            $table->foreignId('municipalitiy_id')->nullable(false)->change();
            $table->foreignId('barangay_id')->nullable(false)->change();
            $table->foreignId('sitio_id')->nullable(false)->change();
        });
    }
};
