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
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('conversation_type')->default('general'); // general, cv_analysis, learning_path, job_recommendations, skills_gap
            $table->text('user_message');
            $table->longText('ai_response');
            $table->json('context')->nullable(); // Store additional context like user profile snapshot
            $table->json('metadata')->nullable(); // Store any metadata like model used, tokens, etc.
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('conversation_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_conversations');
    }
};
