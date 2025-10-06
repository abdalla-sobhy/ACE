<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_lessons', function (Blueprint $table) {
    $table->id();
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('video_url')->nullable();
    $table->string('thumbnail')->nullable();  // Add this line
    $table->enum('video_type', ['youtube', 'vimeo', 'upload', 'embed'])->default('youtube');
    $table->string('video_file_path')->nullable();
    $table->string('duration');
    $table->integer('order_index')->default(0);
    $table->boolean('is_preview')->default(false);
    $table->json('attachments')->nullable();
    $table->timestamps();

    $table->index(['course_id', 'order_index']);
});
    }

    public function down()
    {
        Schema::dropIfExists('course_lessons');
    }
};
