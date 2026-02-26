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
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_device_id')->constrained('medical_devices')->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('prediction_providers')->onDelete('cascade');
            $table->timestamp('analysis_period_start');
            $table->timestamp('analysis_period_end');
            $table->json('prediction_result');
            $table->decimal('failure_probability', 5, 2); // 0-100
            $table->timestamp('predicted_failure_date')->nullable();
            $table->enum('risk_level', ['low', 'medium', 'high', 'critical']);
            $table->json('recommendations');
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->integer('generation_time'); // ms
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
