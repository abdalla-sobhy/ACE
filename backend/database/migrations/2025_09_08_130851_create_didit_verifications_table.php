<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('didit_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->unique();
            $table->integer('session_number');
            $table->string('status');
            $table->string('vendor_data')->nullable();
            $table->json('metadata')->nullable();
            $table->json('personal_info')->nullable();
            $table->json('checks')->nullable();
            $table->timestamps();

            $table->index('session_id');
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('didit_verifications');
    }
};
