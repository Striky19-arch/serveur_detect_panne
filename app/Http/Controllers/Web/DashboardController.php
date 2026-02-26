<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\MedicalDevice;
use App\Models\Prediction;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $stats = [
            'total_devices' => MedicalDevice::count(),
            'active_devices' => MedicalDevice::where('status', 'active')->count(),
            'critical_alerts' => Alert::where('severity', 'critical')->where('is_read', false)->count(),
            'predictions_today' => Prediction::whereDate('created_at', today())->count(),
        ];

        $devices = MedicalDevice::withCount('sensors')
            ->orderByDesc('last_sync_at')
            ->get()
            ->map(fn ($device) => [
                'id' => $device->id,
                'name' => $device->name,
                'model' => $device->model,
                'location' => $device->location,
                'status' => $device->status,
                'serial_number' => $device->serial_number,
                'esp32_device_id' => $device->esp32_device_id,
                'sensors_count' => $device->sensors_count,
                'last_sync_at' => $device->last_sync_at?->toISOString(),
                'is_connected' => $device->last_sync_at
                    && $device->last_sync_at->gt(now()->subMinutes(2)),
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'devices' => $devices,
        ]);
    }
}
