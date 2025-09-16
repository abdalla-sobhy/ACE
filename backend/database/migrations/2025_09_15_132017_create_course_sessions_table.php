<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->enum('day_of_week', ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes')->virtualAs('TIMESTAMPDIFF(MINUTE, start_time, end_time)');
            $table->timestamps();

            // Ensure unique day per course ****CAN BE COMMENTED IF I FACED ANY ISSUES BECAUSE OF IT
            $table->unique(['course_id', 'day_of_week']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_sessions');
    }
};
