<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('industry');
            $table->string('company_size');
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('location');
            $table->string('founded_year')->nullable();
            $table->json('benefits')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('registration_number')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->index('is_verified');
            $table->index('industry');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
