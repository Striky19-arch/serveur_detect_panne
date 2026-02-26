<?php

namespace App\Http\Controllers;

use App\Models\PredictionProvider;
use Illuminate\Http\Request;

class PredictionProviderController extends Controller
{
    public function index()
    {
        $providers = PredictionProvider::orderBy('priority')->get();

        return response()->json($providers);
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

        $provider = PredictionProvider::create($validated);

        return response()->json($provider, 201);
    }

    public function show($id)
    {
        $provider = PredictionProvider::findOrFail($id);

        return response()->json($provider);
    }

    public function update(Request $request, $id)
    {
        $provider = PredictionProvider::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:prediction_providers,name,'.$provider->id,
            'type' => 'sometimes|in:cloud_api,local_llm,python_model',
            'provider' => 'sometimes|string',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'priority' => 'integer',
            'config' => 'nullable|array',
        ]);

        $provider->update($validated);

        return response()->json($provider);
    }

    public function destroy($id)
    {
        $provider = PredictionProvider::findOrFail($id);
        $provider->delete();

        return response()->json(null, 204);
    }

    public function test($id)
    {
        $provider = PredictionProvider::findOrFail($id);

        // Mock connection test for now
        $success = rand(0, 1) === 1;

        $provider->update([
            'last_tested_at' => now(),
            'last_test_status' => $success ? 'success' : 'failed',
            'last_test_response_time' => rand(50, 500),
        ]);

        return response()->json([
            'status' => $provider->last_test_status,
            'response_time' => $provider->last_test_response_time,
        ]);
    }

    public function setDefault($id)
    {
        $provider = PredictionProvider::findOrFail($id);

        // Reset old default
        PredictionProvider::where('is_default', true)->update(['is_default' => false]);

        $provider->update(['is_default' => true]);

        return response()->json($provider);
    }
}
