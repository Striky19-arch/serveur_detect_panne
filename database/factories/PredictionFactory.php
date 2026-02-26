<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prediction>
 */
class PredictionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'analysis_period_start' => $this->faker->dateTimeBetween('-2 months', '-1 month'),
            'analysis_period_end' => $this->faker->dateTimeBetween('-1 month'),
            'prediction_result' => ['summary' => $this->faker->sentence()],
            'failure_probability' => $this->faker->randomFloat(2, 0, 100),
            'risk_level' => $this->faker->randomElement(['low', 'medium', 'high', 'critical']),
            'recommendations' => [['action' => 'Check sensor', 'priority' => 'high']],
            'confidence_score' => $this->faker->randomFloat(2, 50, 100),
            'generation_time' => $this->faker->numberBetween(500, 5000),
        ];
    }
}
