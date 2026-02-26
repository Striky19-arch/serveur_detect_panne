<?php

namespace App\Services\Prediction;

use App\Models\MedicalDevice;
use Carbon\Carbon;

interface PredictionProviderInterface
{
    /**
     * Generate a prediction for the given device and time range.
     *
     * @return array Result structure: [prediction_result, failure_probability, risk_level, recommendations, confidence_score]
     */
    public function predict(MedicalDevice $device, Carbon $start, Carbon $end, array $config): array;

    /**
     * Test the provider connection with the given config.
     */
    public function test(array $config): bool;
}
