<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMedicalDeviceRequest;
use App\Http\Requests\UpdateMedicalDeviceRequest;
use App\Models\MedicalDevice;
use Inertia\Inertia;

class MedicalDeviceController extends Controller
{
    public function index()
    {
        $devices = MedicalDevice::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('medical-devices/index', [
            'devices' => $devices,
            'filters' => request()->all(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('medical-devices/create');
    }

    public function store(StoreMedicalDeviceRequest $request)
    {
        $data = $request->validated();
        $sensorsData = $data['sensors'] ?? [];
        unset($data['sensors']);

        $device = MedicalDevice::create($data);

        foreach ($sensorsData as $sensorData) {
            $device->sensors()->create($sensorData);
        }

        return redirect()->route('medical-devices.index')->with('success', 'Device created successfully.');
    }

    public function show(MedicalDevice $medicalDevice)
    {
        $medicalDevice->load(['sensors.readings' => function ($q) {
            $q->latest('recorded_at')->limit(50);
        }, 'predictions' => function ($q) {
            $q->latest()->limit(5);
        }, 'alerts' => function ($q) {
            $q->latest()->limit(5);
        }]);

        return Inertia::render('medical-devices/show', [
            'device' => $medicalDevice,
        ]);
    }

    public function edit(MedicalDevice $medicalDevice)
    {
        $medicalDevice->load('sensors');

        return Inertia::render('medical-devices/edit', [
            'device' => $medicalDevice,
        ]);
    }

    public function update(UpdateMedicalDeviceRequest $request, MedicalDevice $medicalDevice)
    {
        $data = $request->validated();
        $sensorsData = $data['sensors'] ?? [];
        unset($data['sensors']);

        $medicalDevice->update($data);

        $keptSensorIds = [];

        foreach ($sensorsData as $sensorData) {
            if (isset($sensorData['id'])) {
                // Update existing sensor
                $medicalDevice->sensors()->where('id', $sensorData['id'])->update($sensorData);
                $keptSensorIds[] = $sensorData['id'];
            } else {
                // Create new sensor
                $newSensor = $medicalDevice->sensors()->create($sensorData);
                $keptSensorIds[] = $newSensor->id;
            }
        }

        // Delete removed sensors
        $medicalDevice->sensors()->whereNotIn('id', $keptSensorIds)->delete();

        return redirect()->route('medical-devices.index')->with('success', 'Device updated successfully.');
    }

    public function destroy(MedicalDevice $medicalDevice)
    {
        $medicalDevice->delete();

        return redirect()->route('medical-devices.index')->with('success', 'Device deleted successfully.');
    }
}
