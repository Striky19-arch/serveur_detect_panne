<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alert>
 */
class AlertFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['sensor_critical', 'sensor_warning', 'prediction_high_risk']),
            'severity' => $this->faker->randomElement(['info', 'warning', 'critical']),
            'title' => $this->faker->sentence(3),
            'message' => $this->faker->paragraph(),
            'is_read' => $this->faker->boolean(20),
            'created_at' => $this->faker->dateTimeBetween('-1 month'),
        ];
    }
}
