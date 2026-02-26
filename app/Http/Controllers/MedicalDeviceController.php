<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MedicalDeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $devices = \App\Models\MedicalDevice::query()
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            })
            ->withCount('sensors')
            ->latest()
            ->paginate(10);

        return response()->json($devices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:medical_devices',
            'model' => 'required|string',
            'manufacturer' => 'required|string',
            'serial_number' => 'required|string|unique:medical_devices',
            'installation_date' => 'required|date',
            'location' => 'required|string',
            'status' => 'required|in:active,inactive,maintenance,faulty',
            'description' => 'nullable|string',
            'esp32_device_id' => 'nullable|string|unique:medical_devices',
        ]);

        $device = \App\Models\MedicalDevice::create($validated);

        return response()->json($device, 201);
    }

    public function show($id)
    {
        $device = \App\Models\MedicalDevice::with(['sensors.readings' => function ($query) {
            $query->latest()->limit(1);
        }])->findOrFail($id);

        return response()->json($device);
    }

    public function update(Request $request, $id)
    {
        $device = \App\Models\MedicalDevice::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:medical_devices,name,'.$device->id,
            'model' => 'sometimes|string',
            'manufacturer' => 'sometimes|string',
            'serial_number' => 'sometimes|string|unique:medical_devices,serial_number,'.$device->id,
            'installation_date' => 'sometimes|date',
            'location' => 'sometimes|string',
            'status' => 'sometimes|in:active,inactive,maintenance,faulty',
            'description' => 'nullable|string',
            'esp32_device_id' => 'nullable|string|unique:medical_devices,esp32_device_id,'.$device->id,
        ]);

        $device->update($validated);

        return response()->json($device);
    }

    public function destroy($id)
    {
        $device = \App\Models\MedicalDevice::findOrFail($id);
        $device->delete();

        return response()->json(null, 204);
    }
}
