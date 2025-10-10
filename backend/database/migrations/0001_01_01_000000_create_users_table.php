<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('user_type', ['university_student', 'student', 'teacher', 'parent', 'company', 'admin']);
            $table->enum('status', ['pending', 'active', 'suspended'])->default('active');
            $table->boolean('is_approved')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
            $table->index('user_type');
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
