<?php

namespace App\Services\Prediction\Traits;

trait JSONResponseParserTrait
{
    protected function parseResponse(string $jsonContent): array
    {
        // Try to locate JSON block if wrapped in markdown
        if (preg_match('/```json\s*(.*?)\s*```/s', $jsonContent, $matches)) {
            $jsonContent = $matches[1];
        }

        $data = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            // Last ditch effort: Try to cleanup potentially invalid chars or structure
            // But for now, just fail if invalid
            throw new \Exception('Invalid JSON response from LLM: '.json_last_error_msg());
        }

        if (! $data || ! isset($data['failure_probability'])) {
            throw new \Exception('JSON response missing required fields (failure_probability)');
        }

        return [
            'prediction_result' => $data['prediction_result'] ?? 'Analysis completed',
            'failure_probability' => (float) ($data['failure_probability'] ?? 0),
            'risk_level' => $data['risk_level'] ?? 'low',
            'recommendations' => $data['recommendations'] ?? [],
            'confidence_score' => (float) ($data['confidence_score'] ?? 0),
        ];
    }
}
