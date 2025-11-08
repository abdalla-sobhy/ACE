<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change cache value column to longText to accommodate large API responses
        // Using raw SQL for better MySQL compatibility
        DB::statement('ALTER TABLE cache MODIFY value LONGTEXT NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE cache MODIFY value MEDIUMTEXT NOT NULL');
    }
};
