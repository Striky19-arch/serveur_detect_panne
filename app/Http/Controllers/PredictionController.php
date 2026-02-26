<?php

namespace App\Http\Controllers;

use App\Models\MedicalDevice;
use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    public function index($deviceId)
    {
        $predictions = Prediction::where('medical_device_id', $deviceId)
            ->with('provider')
            ->latest()
            ->paginate(10);

        return response()->json($predictions);
    }

    public function generate(Request $request, $deviceId, \App\Services\Prediction\PredictionService $service)
    {
        $validated = $request->validate([
            'provider_id' => 'nullable|exists:prediction_providers,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after:period_start',
        ]);

        $device = MedicalDevice::findOrFail($deviceId);
        $provider = $validated['provider_id'] ? \App\Models\PredictionProvider::find($validated['provider_id']) : null;
        $start = \Carbon\Carbon::parse($validated['period_start']);
        $end = \Carbon\Carbon::parse($validated['period_end']);

        $prediction = $service->generatePrediction($device, $provider, $start, $end);

        return response()->json($prediction, 201);
    }

    public function show($id)
    {
        $prediction = Prediction::with(['device', 'provider'])->findOrFail($id);

        return response()->json($prediction);
    }
}
