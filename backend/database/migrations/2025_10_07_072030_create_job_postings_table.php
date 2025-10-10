<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->json('requirements');
            $table->json('responsibilities');
            $table->json('skills_required');
            $table->json('skills_preferred')->nullable();
            $table->string('job_type'); // full_time, part_time, internship, contract
            $table->string('work_location'); // onsite, remote, hybrid
            $table->string('location')->nullable();
            $table->string('salary_range')->nullable();
            $table->string('experience_level'); // entry, junior, mid, senior
            $table->string('education_requirement')->nullable();
            $table->json('faculties_preferred')->nullable();
            $table->integer('positions_available')->default(1);
            $table->date('application_deadline')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('views_count')->default(0);
            $table->integer('applications_count')->default(0);
            $table->timestamps();

            $table->index('is_active');
            $table->index('job_type');
            $table->index('experience_level');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
