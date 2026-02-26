<?php

namespace Tests\Feature\Api;

use App\Models\MedicalDevice;
use App\Models\Sensor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SensorReadingTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_reading_and_compiles_stats_and_alerts()
    {
        $device = MedicalDevice::factory()->create();
        $sensor = Sensor::factory()->create([
            'medical_device_id' => $device->id,
            'max_normal_value' => 100,
            'critical_max_value' => 150,
        ]);

        // 1. Normal Reading
        $response = $this->postJson('/api/esp32/readings', [
            'sensor_id' => $sensor->id,
            'value' => 50, // Normal
            'status' => 'normal', // Default/Initial status from ESP32
            'recorded_at' => now()->toIso8601String(),
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseMissing('alerts', ['sensor_id' => $sensor->id]);

        // 2. Warning Reading
        $response = $this->postJson('/api/esp32/readings', [
            'sensor_id' => $sensor->id,
            'value' => 120, // > 100 but < 150
            'status' => 'normal',
            'recorded_at' => now()->addMinute()->toIso8601String(),
        ]);

        $response->assertStatus(201);
        // AlertService should have created a warning alert
        $this->assertDatabaseHas('alerts', [
            'sensor_id' => $sensor->id,
            'severity' => 'warning',
            'title' => 'Abnormal High Value',
        ]);

        // 3. Critical Reading
        $response = $this->postJson('/api/esp32/readings', [
            'sensor_id' => $sensor->id,
            'value' => 160, // > 150
            'status' => 'normal', // Sent as normal but backend should change it or alert
            'recorded_at' => now()->addMinutes(2)->toIso8601String(),
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('alerts', [
            'sensor_id' => $sensor->id,
            'severity' => 'critical',
            'title' => 'Critical Max Value Exceeded',
        ]);

        // Also check if reading status was updated by service
        $this->assertDatabaseHas('sensor_readings', [
            'value' => 160,
            'status' => 'critical',
        ]);
    }
}
