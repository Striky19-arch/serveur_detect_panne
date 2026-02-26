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
        Schema::create('prediction_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('type', ['cloud_api', 'local_llm', 'python_model']);
            $table->string('provider'); // openrouter, huggingface, ollama, etc.
            $table->boolean('is_active')->default(false);
            $table->boolean('is_default')->default(false);
            $table->integer('priority')->default(0);
            $table->text('config')->nullable();
            $table->timestamp('last_tested_at')->nullable();
            $table->enum('last_test_status', ['success', 'failed'])->nullable();
            $table->integer('last_test_response_time')->nullable(); // ms
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prediction_providers');
    }
};
