<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->timestamp('last_login_at')->nullable();
        $table->string('last_login_ip')->nullable();
        $table->text('last_login_user_agent')->nullable();
        $table->timestamp('email_verified_at')->nullable();

        // Add indexes for performance
        $table->index('email');
        $table->index('user_type');
        $table->index('status');
        $table->index('is_approved');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
