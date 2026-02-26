<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sensor>
 */
class SensorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['temperature', 'pressure', 'humidity', 'vibration', 'voltage', 'current']);
        $unit = match ($type) {
            'temperature' => '°C',
            'pressure' => 'Bar',
            'humidity' => '%',
            'vibration' => 'mm/s',
            'voltage' => 'V',
            'current' => 'A',
        };

        return [
            'name' => ucfirst($type).' Sensor '.$this->faker->randomDigit(),
            'type' => $type,
            'unit' => $unit,
            'min_normal_value' => 20,
            'max_normal_value' => 80,
            'critical_min_value' => 5,
            'critical_max_value' => 95,
            'is_active' => true,
            'polling_interval' => 60,
        ];
    }
}
