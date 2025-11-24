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
        // Add profile_picture to users table (for admins)
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('email');
        });

        // Add profile_picture to university_student_profiles table
        Schema::table('university_student_profiles', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('user_id');
        });

        // Add profile_picture to student_profiles table
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('user_id');
        });

        // Add profile_picture to teacher_profiles table
        Schema::table('teacher_profiles', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('user_id');
        });

        // Add profile_picture to parent_profiles table
        Schema::table('parent_profiles', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('user_id');
        });

        // Add profile_picture to companies table (in addition to logo_path)
        Schema::table('companies', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('logo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });

        Schema::table('university_student_profiles', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });

        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });

        Schema::table('teacher_profiles', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });

        Schema::table('parent_profiles', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });
    }
};
