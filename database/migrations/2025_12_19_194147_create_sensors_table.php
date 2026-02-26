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
        Schema::create('sensors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_device_id')->constrained('medical_devices')->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // temperature, pressure, etc.
            $table->string('unit'); // °C, Pa, etc.
            $table->decimal('min_normal_value', 10, 2)->nullable();
            $table->decimal('max_normal_value', 10, 2)->nullable();
            $table->decimal('critical_min_value', 10, 2)->nullable();
            $table->decimal('critical_max_value', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('pin_number')->nullable();
            $table->integer('polling_interval')->default(60); // seconds
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensors');
    }
};
