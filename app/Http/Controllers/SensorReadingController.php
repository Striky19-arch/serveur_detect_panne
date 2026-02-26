<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use App\Models\SensorReading;
use Illuminate\Http\Request;

class SensorReadingController extends Controller
{
    public function index($sensorId)
    {
        $readings = SensorReading::where('sensor_id', $sensorId)
            ->latest('recorded_at')
            ->paginate(50);

        return response()->json($readings);
    }

    protected $alertService;

    public function __construct(\App\Services\AlertService $alertService)
    {
        $this->alertService = $alertService;
    }

    public function store(Request $request)
    {
        // Check if batch

        if ($request->has('readings') && is_array($request->input('readings'))) {
            // Validate top-level device_uuid if present
            $validatedData = $request->validate([
                'device_uuid' => 'sometimes|exists:medical_devices,uuid',
                'readings' => 'required|array',
                'readings.*.sensor_id' => 'sometimes|exists:sensors,id',
                'readings.*.sensor_type' => 'required_without:readings.*.sensor_id|string', // e.g., 'temperature', 'vibration'
                'readings.*.sensor_index' => 'sometimes|integer', // 0 for primary, 1 for secondary... default 0
                'readings.*.value' => 'required|numeric',
                'readings.*.status' => 'required|in:normal,warning,critical',
                'readings.*.recorded_at' => 'required|date',
            ]);

            $device = null;
            if (isset($validatedData['device_uuid'])) {
                $device = \App\Models\MedicalDevice::where('uuid', $validatedData['device_uuid'])->first();
            }

            $created = [];
            foreach ($validatedData['readings'] as $data) {
                $sensorId = $data['sensor_id'] ?? null;

                // Resolve Sensor ID from Type/Index if device is known
                if (! $sensorId && $device) {
                    $type = $data['sensor_type'] ?? null;
                    $index = $data['sensor_index'] ?? 0; // Default to first sensor of this type

                    // Try to find sensor by type/name.
                    // This assumes 'name' or 'type' column matches.
                    // Since 'type' column exists in sensors table, we use it.
                    // But wait, the sensors table has 'type' column? Let's check schema/model.
                    // Migration 2025_12_19_194147_create_sensors_table.php says: $table->string('type');

                    if ($type) {
                        $sensor = $device->sensors()
                            ->where('type', $type)
                            ->skip($index) // If multiple sensors of same type, use index
                            ->first();

                        if ($sensor) {
                            $sensorId = $sensor->id;
                        } else {
                            // Auto-create sensor? Maybe not for now, just skip or error.
                            continue;
                        }
                    }
                }

                if (! $sensorId) {
                    continue; // Skip readings we can't associate
                }

                $readingData = [
                    'sensor_id' => $sensorId,
                    'value' => $data['value'],
                    'status' => $data['status'],
                    'recorded_at' => $data['recorded_at'],
                ];

                $reading = SensorReading::create($readingData);
                $this->alertService->checkThresholds($reading);
                $created[] = $reading;
            }

            // Update device sync
            if ($device) {
                $device->update(['last_sync_at' => now()]);
            } elseif (! empty($created)) {
                // Legacy fallback
                $sensor = Sensor::find($created[0]->sensor_id);
                if ($sensor && $sensor->medicalDevice) {
                    $sensor->medicalDevice->update(['last_sync_at' => now()]);
                }
            }

            return response()->json($created, 201);
        }

        // Single reading (legacy support)
        // TODO: Validate ESP32 token here or via middleware

        $validated = $request->validate([
            'sensor_id' => 'required|exists:sensors,id',
            'value' => 'required|numeric',
            'status' => 'required|in:normal,warning,critical',
            'recorded_at' => 'required|date',
        ]);

        $reading = SensorReading::create($validated);

        // Check for alerts
        $this->alertService->checkThresholds($reading);

        // Update device sync
        $sensor = Sensor::find($reading->sensor_id);
        if ($sensor && $sensor->medicalDevice) {
            $sensor->medicalDevice->update(['last_sync_at' => now()]);
        }

        return response()->json($reading, 201);
    }

    public function stats($sensorId)
    {
        $stats = SensorReading::where('sensor_id', $sensorId)
            ->selectRaw('MIN(value) as min_value, MAX(value) as max_value, AVG(value) as avg_value, STDDEV(value) as std_dev')
            ->first();

        return response()->json($stats);
    }

    public function chart($sensorId)
    {
        // Return data format suitable for charts (e.g., [timestamp, value])
        $readings = SensorReading::where('sensor_id', $sensorId)
            ->latest('recorded_at')
            ->limit(100) // Limit data points
            ->get(['recorded_at', 'value'])
            ->map(function ($reading) {
                return [
                    'x' => $reading->recorded_at->toISOString(),
                    'y' => $reading->value,
                ];
            });

        return response()->json($readings);
    }
}
