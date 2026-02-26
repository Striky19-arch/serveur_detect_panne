<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SensorReading>
 */
class SensorReadingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'value' => $this->faker->randomFloat(2, 0, 100),
            'status' => $this->faker->randomElement(['normal', 'normal', 'normal', 'warning']),
            'recorded_at' => $this->faker->dateTimeBetween('-1 month'),
        ];
    }
}
