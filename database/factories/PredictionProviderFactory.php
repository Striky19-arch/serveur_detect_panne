<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PredictionProvider>
 */
class PredictionProviderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(),
            'type' => $this->faker->randomElement(['cloud_api', 'local_llm', 'python_model']),
            'provider' => $this->faker->word(),
            'is_active' => true,
            'is_default' => false,
            'priority' => $this->faker->numberBetween(0, 10),
            'config' => ['api_key' => 'secret'],
        ];
    }
}
