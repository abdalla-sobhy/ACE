<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->enum('course_type', ['recorded', 'live'])->default('recorded')->after('grade');
            $table->integer('max_seats')->nullable()->after('course_type');
            $table->integer('enrolled_seats')->default(0)->after('max_seats');
            $table->date('start_date')->nullable()->after('enrolled_seats');
            $table->date('end_date')->nullable()->after('start_date');
            $table->integer('sessions_per_week')->nullable()->after('end_date');
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['course_type', 'max_seats', 'enrolled_seats', 'start_date', 'end_date', 'sessions_per_week']);
        });
    }
};
