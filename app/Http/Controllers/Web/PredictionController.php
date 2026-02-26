<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\MedicalDevice;
use App\Models\Prediction;
use App\Models\PredictionProvider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PredictionController extends Controller
{
    protected $predictionService;

    protected $promptBuilder;

    public function __construct(\App\Services\Prediction\PredictionService $predictionService, \App\Services\Prediction\PredictionPromptBuilder $promptBuilder)
    {
        $this->predictionService = $predictionService;
        $this->promptBuilder = $promptBuilder;
    }

    public function index()
    {
        $predictions = Prediction::with(['medicalDevice', 'provider'])
            ->latest()
            ->paginate(15);

        return Inertia::render('predictions/index', [
            'predictions' => $predictions,
        ]);
    }

    public function show(Prediction $prediction)
    {
        $prediction->load(['medicalDevice', 'provider']);

        return Inertia::render('predictions/show', [
            'prediction' => $prediction,
        ]);
    }

    // Show generation form
    public function create()
    {
        $devices = MedicalDevice::all(['id', 'name']);
        $providers = PredictionProvider::where('is_active', true)->get(['id', 'name', 'type']);

        return Inertia::render('predictions/generate', [
            'devices' => $devices,
            'providers' => $providers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medical_device_id' => 'required|exists:medical_devices,id',
            'provider_id' => 'required|exists:prediction_providers,id',
            'analysis_period_days' => 'required|integer|min:1|max:365',
        ]);

        $device = MedicalDevice::with('sensors.readings')->findOrFail($validated['medical_device_id']);
        $provider = PredictionProvider::findOrFail($validated['provider_id']);

        $start = now()->subDays($validated['analysis_period_days']);
        $end = now();

        // Generate the prompt to show in the processing view
        $prompt = $this->promptBuilder->build($device, $start, $end);

        return Inertia::render('predictions/processing', [
            'prompt' => $prompt,
            'payload' => [
                'medical_device_id' => $validated['medical_device_id'],
                'provider_id' => $validated['provider_id'],
                'analysis_period_days' => $validated['analysis_period_days'],
            ],
        ]);
    }

    public function execute(Request $request)
    {
        set_time_limit(300); // 5 minutes timeout for LLM generation

        $validated = $request->validate([
            'medical_device_id' => 'required|exists:medical_devices,id',
            'provider_id' => 'required|exists:prediction_providers,id',
            'analysis_period_days' => 'required|integer|min:1|max:365',
        ]);

        try {
            $device = MedicalDevice::findOrFail($validated['medical_device_id']);
            $provider = PredictionProvider::findOrFail($validated['provider_id']);

            $start = now()->subDays($validated['analysis_period_days']);
            $end = now();

            $prediction = $this->predictionService->generatePrediction($device, $provider, $start, $end);

            return response()->json([
                'success' => true,
                'redirect_url' => route('predictions.show', $prediction),
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Prediction execution failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Prediction $prediction)
    {
        $prediction->delete();

        return to_route('predictions.index')->with('success', 'Prediction deleted successfully.');
    }
}
