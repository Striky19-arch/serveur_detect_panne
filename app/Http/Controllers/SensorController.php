<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SensorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($deviceId)
    {
        $sensors = \App\Models\Sensor::where('medical_device_id', $deviceId)->get();

        return response()->json($sensors);
    }

    public function store(Request $request, $deviceId)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'unit' => 'required|string',
            'min_normal_value' => 'nullable|numeric',
            'max_normal_value' => 'nullable|numeric',
            'critical_min_value' => 'nullable|numeric',
            'critical_max_value' => 'nullable|numeric',
            'is_active' => 'boolean',
            'pin_number' => 'required|integer',
            'polling_interval' => 'integer|min:1',
            'description' => 'nullable|string',
        ]);

        $device = \App\Models\MedicalDevice::findOrFail($deviceId);
        $sensor = $device->sensors()->create($validated);

        return response()->json($sensor, 201);
    }

    public function show($id)
    {
        $sensor = \App\Models\Sensor::findOrFail($id);

        return response()->json($sensor);
    }

    public function update(Request $request, $id)
    {
        $sensor = \App\Models\Sensor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|string',
            'unit' => 'sometimes|string',
            'min_normal_value' => 'nullable|numeric',
            'max_normal_value' => 'nullable|numeric',
            'critical_min_value' => 'nullable|numeric',
            'critical_max_value' => 'nullable|numeric',
            'is_active' => 'boolean',
            'pin_number' => 'sometimes|integer',
            'polling_interval' => 'integer|min:1',
            'description' => 'nullable|string',
        ]);

        $sensor->update($validated);

        return response()->json($sensor);
    }

    public function destroy($id)
    {
        $sensor = \App\Models\Sensor::findOrFail($id);
        $sensor->delete();

        return response()->json(null, 204);
    }

    public function activate($id)
    {
        $sensor = \App\Models\Sensor::findOrFail($id);
        $sensor->update(['is_active' => ! $sensor->is_active]);

        return response()->json($sensor);
    }

    public function testReading($id)
    {
        return response()->json(['message' => 'Not implemented yet'], 501);
    }
}
