<?php

namespace App\Services\Prediction;

use App\Models\MedicalDevice;
use App\Models\Prediction;
use App\Models\PredictionProvider;
use App\Services\Prediction\Providers\MockLocalProvider;
use App\Services\Prediction\Providers\OllamaAdapter;
use App\Services\Prediction\Providers\OpenRouterAdapter;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PredictionService
{
    public function generatePrediction(MedicalDevice $device, ?PredictionProvider $provider, Carbon $start, Carbon $end): Prediction
    {
        // 1. Determine Provider
        if (! $provider) {
            $provider = PredictionProvider::where('is_default', true)->where('is_active', true)->first();
        }

        $adapter = null;

        if (! $provider) {
            Log::warning("No prediction provider found for device {$device->id}, using Mock.");
            $adapter = new MockLocalProvider;
        } else {
            $adapter = $this->getAdapter($provider);
        }

        // 2. Call Provider
        try {
            // Ensure config is an array
            $config = $provider ? ($provider->config ?? []) : [];
            // If the config assumes encrypted casting but it's not set up yet, it might be an issue.
            // But we assume standard array access for now.

            $result = $adapter->predict($device, $start, $end, $config);

            // Update provider stats
            if ($provider) {
                $provider->update(['last_tested_at' => now(), 'last_test_status' => 'success']);
            }

        } catch (\Exception $e) {
            Log::error("Prediction failed with provider {$provider?->name}: ".$e->getMessage());

            if ($provider) {
                $provider->update(['last_tested_at' => now(), 'last_test_status' => 'failed']);
            }

            // Fallback? For now, rethrow or return error prediction
            throw $e;
        }

        // 3. Save Prediction
        $prediction = Prediction::create([
            'medical_device_id' => $device->id,
            'provider_id' => $provider?->id,
            'analysis_period_start' => $start,
            'analysis_period_end' => $end,
            'prediction_result' => $result['prediction_result'],
            'failure_probability' => $result['failure_probability'],
            'predicted_failure_date' => $result['risk_level'] === 'high' ? Carbon::now()->addDays(rand(1, 14)) : null, // This logic should ideally come from LLM too
            'risk_level' => $result['risk_level'],
            'recommendations' => json_encode($result['recommendations']),
            'confidence_score' => $result['confidence_score'],
            'generation_time' => 0, // Should measure this
        ]);

        return $prediction;
    }

    public function testConnection(string $providerName, string $type, array $config): bool
    {
        // Create a temporary provider instance to resolve the adapter
        // We use a dummy ID and the provided config
        $dummyProvider = new PredictionProvider([
            'provider' => $providerName,
            'type' => $type,
            'config' => $config,
        ]);

        $adapter = $this->getAdapter($dummyProvider);

        return $adapter->test($config);
    }

    public function testProvider(PredictionProvider $provider): bool
    {
        $adapter = $this->getAdapter($provider);

        return $adapter->test($provider->config ?? []);
    }

    protected function getAdapter(PredictionProvider $provider): PredictionProviderInterface
    {
        return match ($provider->type) {
            'cloud_api' => new OpenRouterAdapter,
            'local_llm' => new OllamaAdapter,
            'python_model' => new MockLocalProvider,
            default => new MockLocalProvider,
        };
    }
}
