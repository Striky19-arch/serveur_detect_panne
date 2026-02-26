<?php

namespace App\Services\Prediction\Providers;

use App\Models\MedicalDevice;
use App\Services\Prediction\PredictionPromptBuilder;
use App\Services\Prediction\PredictionProviderInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterAdapter implements PredictionProviderInterface
{
    use \App\Services\Prediction\Traits\JSONResponseParserTrait;

    protected PredictionPromptBuilder $promptBuilder;

    public function __construct()
    {
        $this->promptBuilder = new PredictionPromptBuilder;
    }

    public function predict(MedicalDevice $device, Carbon $start, Carbon $end, array $config): array
    {
        $apiKey = $config['api_key'] ?? null;
        $model = $config['model'] ?? 'openai/gpt-3.5-turbo';

        if (empty($apiKey)) {
            Log::error('OpenRouter config missing API Key');
            throw new \Exception('Configuration error: OpenRouter API Key is missing.');
        }

        $prompt = $this->promptBuilder->build($device, $start, $end);

        Log::info('Sending request to OpenRouter', ['model' => $model]);

        try {
            $response = Http::timeout(60)->withHeaders([
                'Authorization' => 'Bearer '.$apiKey,
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
                'Content-Type' => 'application/json',
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a predictive maintenance expert. You analyze sensor data to predict machine failures. Always return pure JSON.',
                    ],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'response_format' => ['type' => 'json_object'],
            ]);

            if ($response->failed()) {
                Log::error('OpenRouter API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'request_url' => 'https://openrouter.ai/api/v1/chat/completions',
                    'model' => $model,
                ]);
                throw new \Exception('OpenRouter API request failed: '.$response->status().' - '.$response->body());
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? null;

            if (! $content) {
                throw new \Exception('Empty response from OpenRouter');
            }

            return $this->parseResponse($content);

        } catch (\Exception $e) {
            Log::error('OpenRouter Adapter Exception: '.$e->getMessage());
            // Return a fallback error structure or rethrow?
            // Better to rethrow so the service can handle it (try next provider)
            throw $e;
        }
    }

    // parseResponse is provided by JSONResponseParserTrait

    public function test(array $config): bool
    {
        $apiKey = $config['api_key'] ?? null;
        if (empty($apiKey)) {
            return false;
        }

        try {
            // Simple model list check
            $response = Http::timeout(10)->withHeaders([
                'Authorization' => 'Bearer '.$apiKey,
            ])->get('https://openrouter.ai/api/v1/models');

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('OpenRouter Test Failed: '.$e->getMessage());

            return false;
        }
    }
}
