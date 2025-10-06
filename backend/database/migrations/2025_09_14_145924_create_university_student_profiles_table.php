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
        Schema::create('university_student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic Information
            $table->string('faculty');
            $table->text('goal');
            $table->string('university')->nullable();
            $table->integer('year_of_study')->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->text('bio')->nullable();

            // Skills and Achievements (JSON)
            $table->json('skills')->nullable();
            $table->json('achievements')->nullable();
            $table->json('languages')->nullable();

            // Experience and Projects (JSON)
            $table->json('experience')->nullable();
            $table->json('projects')->nullable();
            $table->json('certifications')->nullable();

            // CV/Resume
            $table->string('cv_path')->nullable();
            $table->string('cv_filename')->nullable();

            // Social Links
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('portfolio_url')->nullable();

            // Job Seeking
            $table->boolean('is_public')->default(false);
            $table->boolean('looking_for_opportunities')->default(false);
            $table->json('preferred_job_types')->nullable();
            $table->date('available_from')->nullable();

            // Stats (for tracking)
            $table->integer('profile_views')->default(0);
            $table->integer('cv_downloads')->default(0);

            $table->timestamps();

            // Indexes for better query performance
            $table->index('is_public');
            $table->index('looking_for_opportunities');
            $table->index('university');
            $table->index('gpa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_student_profiles');
    }
};
