<?php

namespace App\Services\Prediction\Providers;

use App\Models\MedicalDevice;
use App\Services\Prediction\PredictionPromptBuilder;
use App\Services\Prediction\PredictionProviderInterface;
use App\Services\Prediction\Traits\JSONResponseParserTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OllamaAdapter implements PredictionProviderInterface
{
    use JSONResponseParserTrait;

    protected PredictionPromptBuilder $promptBuilder;

    public function __construct()
    {
        $this->promptBuilder = new PredictionPromptBuilder;
    }

    public function predict(MedicalDevice $device, Carbon $start, Carbon $end, array $config): array
    {
        $endpoint = $config['endpoint'] ?? 'http://localhost:11434';
        $model = $config['model'] ?? 'llama3';

        // Ensure endpoint has no trailing slash and correctly targets chat API
        // If user provided a full URL, trust it, otherwise append /api/chat
        if (! str_contains($endpoint, '/api/')) {
            $url = rtrim($endpoint, '/').'/api/chat';
        } else {
            $url = $endpoint;
        }

        $prompt = $this->promptBuilder->build($device, $start, $end);

        Log::info('Sending request to Ollama', ['url' => $url, 'model' => $model]);

        try {
            $response = Http::timeout(120)->post($url, [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a predictive maintenance expert. You analyze sensor data to predict machine failures. Always return pure JSON.',
                    ],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'stream' => false,
                'format' => 'json',
                'options' => [
                    'temperature' => 0.2, // Low temperature for deterministic/analytical results
                ],
            ]);

            if ($response->failed()) {
                Log::error('Ollama API Error', ['status' => $response->status(), 'body' => $response->body()]);
                throw new \Exception('Ollama API request failed: '.$response->status());
            }

            $data = $response->json();
            $content = $data['message']['content'] ?? null;

            if (! $content) {
                // Initial fallback for older Ollama versions that might return different structure
                // But /api/chat usually returns 'message' -> 'content'
                throw new \Exception('Empty response from Ollama');
            }

            return $this->parseResponse($content);

        } catch (\Exception $e) {
            Log::error('Ollama Adapter Exception: '.$e->getMessage());
            throw $e;
        }
    }

    public function test(array $config): bool
    {
        try {
            $endpoint = $config['endpoint'] ?? 'http://localhost:11434';
            // Use /api/tags to check connection
            $url = rtrim($endpoint, '/').'/api/tags';
            $response = Http::timeout(5)->get($url);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Ollama Test Failed: '.$e->getMessage());

            return false;
        }
    }
}
