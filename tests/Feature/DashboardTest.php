<?php

namespace Tests\Feature;

use App\Models\MedicalDevice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->actingAs($user = User::factory()->create());

        $this->get(route('dashboard'))->assertOk();
    }

    public function test_dashboard_returns_devices_with_connection_status(): void
    {
        $this->actingAs(User::factory()->create());

        $connectedDevice = MedicalDevice::factory()->create([
            'name' => 'Connected Device',
            'last_sync_at' => now()->subSeconds(30),
        ]);

        $disconnectedDevice = MedicalDevice::factory()->create([
            'name' => 'Disconnected Device',
            'last_sync_at' => now()->subMinutes(10),
        ]);

        $neverSyncedDevice = MedicalDevice::factory()->create([
            'name' => 'Never Synced Device',
            'last_sync_at' => null,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('devices', 3)
            ->has('stats')
            ->where('devices.0.name', 'Connected Device')
            ->where('devices.0.is_connected', true)
            ->where('devices.1.name', 'Disconnected Device')
            ->where('devices.1.is_connected', false)
            ->where('devices.2.name', 'Never Synced Device')
            ->where('devices.2.is_connected', false)
        );
    }
}
