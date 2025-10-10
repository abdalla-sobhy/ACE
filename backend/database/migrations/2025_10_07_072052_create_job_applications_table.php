<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('cover_letter');
            $table->string('status')->default('pending'); // pending, reviewing, shortlisted, interviewed, accepted, rejected
            $table->json('status_history')->nullable();
            $table->text('company_notes')->nullable();
            $table->datetime('viewed_at')->nullable();
            $table->datetime('interview_date')->nullable();
            $table->string('interview_location')->nullable();
            $table->text('interview_notes')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->timestamps();

            $table->index(['student_id', 'status']);
            $table->index(['job_posting_id', 'status']);
            $table->unique(['job_posting_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
