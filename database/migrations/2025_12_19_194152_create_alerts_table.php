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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_device_id')->constrained('medical_devices')->onDelete('cascade');
            $table->foreignId('sensor_id')->nullable()->constrained('sensors')->onDelete('set null');
            $table->foreignId('prediction_id')->nullable()->constrained('predictions')->onDelete('set null');
            $table->enum('type', ['sensor_critical', 'sensor_warning', 'prediction_high_risk', 'device_offline']);
            $table->enum('severity', ['info', 'warning', 'critical']);
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->foreignId('acknowledged_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
