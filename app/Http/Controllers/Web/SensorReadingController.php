<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\MedicalDevice;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SensorReadingController extends Controller
{
    public function index(Request $request)
    {
        $query = SensorReading::query()
            ->with(['sensor.medicalDevice']);

        if ($request->filled('device_id')) {
            $query->whereHas('sensor', function ($q) use ($request) {
                $q->where('medical_device_id', $request->device_id);
            });
        }

        if ($request->filled('sensor_type')) {
            $query->whereHas('sensor', function ($q) use ($request) {
                $q->where('type', $request->sensor_type);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('recorded_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('recorded_at', '<=', $request->date_to);
        }

        $readings = $query->latest('recorded_at')
            ->paginate(20)
            ->withQueryString();

        $devices = MedicalDevice::select('id', 'name')->get();
        // Get unique sensor types for filter
        $sensorTypes = \App\Models\Sensor::distinct()->pluck('type')->filter()->values();

        return Inertia::render('readings/index', [
            'readings' => $readings,
            'devices' => $devices,
            'sensorTypes' => $sensorTypes,
            'filters' => $request->only(['device_id', 'sensor_type', 'status', 'date_from', 'date_to']),
        ]);
    }
}
