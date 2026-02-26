<?php

namespace Tests\Feature\Api;

use App\Models\MedicalDevice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicalDeviceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user for authentication if needed (currently API global auth might be off or loose for dev,
        // but let's assume public or simple auth for now as per routes/api.php which uses apiResource without middleware group except 'user')
        // Actually routes are public based on my api.php implementation.
    }

    public function test_can_list_medical_devices()
    {
        MedicalDevice::factory()->count(3)->create();

        $response = $this->getJson('/api/medical-devices');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_medical_device()
    {
        $data = [
            'name' => 'Test Device',
            'model' => 'Model X',
            'manufacturer' => 'Company Y',
            'serial_number' => 'SN123456',
            'installation_date' => '2023-01-01',
            'location' => 'Room 101',
            'status' => 'active',
            'esp32_device_id' => 'esp_001',
        ];

        $response = $this->postJson('/api/medical-devices', $data);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Device']);

        $this->assertDatabaseHas('medical_devices', ['serial_number' => 'SN123456']);
    }

    public function test_can_show_medical_device()
    {
        $device = MedicalDevice::factory()->create();

        $response = $this->getJson("/api/medical-devices/{$device->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $device->id]);
    }

    public function test_can_update_medical_device()
    {
        $device = MedicalDevice::factory()->create();

        $data = ['status' => 'maintenance'];

        $response = $this->putJson("/api/medical-devices/{$device->id}", $data);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'maintenance']);

        $this->assertDatabaseHas('medical_devices', ['id' => $device->id, 'status' => 'maintenance']);
    }

    public function test_can_delete_medical_device()
    {
        $device = MedicalDevice::factory()->create();

        $response = $this->deleteJson("/api/medical-devices/{$device->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('medical_devices', ['id' => $device->id]);
    }
}
