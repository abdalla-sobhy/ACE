<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();
            $table->string('duration');
            $table->integer('lessons_count')->default(0);
            $table->integer('students_count')->default(0);
            $table->decimal('rating', 2, 1)->default(0);
            $table->string('thumbnail')->nullable();
            $table->string('category');
            $table->string('grade')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('stream_url')->nullable();
            $table->string('stream_key')->nullable();
            $table->enum('stream_provider', ['agora', 'jitsi', 'daily', 'custom'])->default('agora');
            $table->boolean('recording_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
};
