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
        Schema::create('medical_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('model');
            $table->string('manufacturer');
            $table->string('serial_number')->unique();
            $table->date('installation_date');
            $table->string('location');
            $table->enum('status', ['active', 'inactive', 'maintenance', 'faulty'])->default('active');
            $table->text('description')->nullable();
            $table->string('esp32_device_id')->unique()->nullable();
            $table->timestamp('last_sync_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_devices');
    }
};
