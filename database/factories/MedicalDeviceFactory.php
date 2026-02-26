<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalDevice>
 */
class MedicalDeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $devices = [
            'MRI Scanner' => 'Siemens',
            'CT Scanner' => 'GE Healthcare',
            'Infusion Pump' => 'B. Braun',
            'Patient Monitor' => 'Philips',
            'Ventilator' => 'Dräger',
            'X-Ray System' => 'Canon Medical',
            'Ultrasound' => 'Samsung Medison',
            'Defibrillator' => 'Zoll',
            'ECG Machine' => 'Nihon Kohden',
            'Anesthesia Machine' => 'Mindray',
        ];

        $nameKey = $this->faker->randomElement(array_keys($devices));

        return [
            'name' => $nameKey.' '.$this->faker->bothify('##00'),
            'model' => $this->faker->bothify('Mod-###??'),
            'manufacturer' => $devices[$nameKey],
            'serial_number' => $this->faker->unique()->bothify('SN-########'),
            'installation_date' => $this->faker->dateTimeBetween('-5 years', '-1 month'),
            'location' => $this->faker->randomElement(['ICU', 'ER', 'OR', 'Radiology', 'Ward 3', 'Clinic B']),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'inactive', 'maintenance', 'faulty']),
            'description' => $this->faker->sentence(),
            'last_sync_at' => $this->faker->dateTimeBetween('-1 day'),
        ];
    }
}
