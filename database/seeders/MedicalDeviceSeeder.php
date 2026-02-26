<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MedicalDeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create realistic Providers
        $providers = collect([
            [
                'name' => 'OpenAI GPT-4o Analyzer',
                'type' => 'cloud_api',
                'provider' => 'openrouter',
                'is_active' => true,
                'priority' => 1,
            ],
            [
                'name' => 'Local Llama 3.2 Medical',
                'type' => 'local_llm',
                'provider' => 'ollama',
                'is_active' => true,
                'priority' => 5,
            ],
            [
                'name' => 'Maintenance Predictor (RF)',
                'type' => 'python_model',
                'provider' => 'python',
                'is_active' => true,
                'priority' => 10,
            ],
        ])->map(function ($data) {
            return \App\Models\PredictionProvider::create($data);
        });

        // 2. Define realistic Devices and their specific Sensors
        $devicesData = [
            [
                'name' => 'MRI Scanner Magnetom Vida',
                'model' => 'Magnetom Vida 3T',
                'manufacturer' => 'Siemens Healthineers',
                'location' => 'Radiology - Room 101',
                'status' => 'active',
                'sensors' => [
                    ['name' => 'Helium Level', 'type' => 'level', 'unit' => '%', 'min' => 40, 'max' => 100, 'c_min' => 20, 'c_max' => 100],
                    ['name' => 'Magnet Pressure', 'type' => 'pressure', 'unit' => 'Bar', 'min' => 1.2, 'max' => 1.5, 'c_min' => 1.0, 'c_max' => 1.8],
                    ['name' => 'Gradient Coil Temp', 'type' => 'temperature', 'unit' => '°C', 'min' => 18, 'max' => 24, 'c_min' => 15, 'c_max' => 30],
                ],
            ],
            [
                'name' => 'IntelliVue MX800 Monitor',
                'model' => 'MX800',
                'manufacturer' => 'Philips Healthcare',
                'location' => 'ICU - Bed 4',
                'status' => 'active',
                'sensors' => [
                    ['name' => 'CPU Temperature', 'type' => 'temperature', 'unit' => '°C', 'min' => 35, 'max' => 65, 'c_min' => 10, 'c_max' => 85],
                    ['name' => 'Battery Health', 'type' => 'battery', 'unit' => '%', 'min' => 80, 'max' => 100, 'c_min' => 40, 'c_max' => 100],
                    ['name' => 'Network Latency', 'type' => 'network', 'unit' => 'ms', 'min' => 0, 'max' => 50, 'c_min' => 0, 'c_max' => 200],
                ],
            ],
            [
                'name' => 'Alaris System Infusion Pump',
                'model' => '8015 PC Unit',
                'manufacturer' => 'BD Medical',
                'location' => 'Oncology - Ward 3',
                'status' => 'maintenance',
                'sensors' => [
                    ['name' => 'Motor Voltage', 'type' => 'voltage', 'unit' => 'V', 'min' => 11.5, 'max' => 12.5, 'c_min' => 10, 'c_max' => 14],
                    ['name' => 'Line Back-Pressure', 'type' => 'pressure', 'unit' => 'psi', 'min' => 0, 'max' => 10, 'c_min' => 0, 'c_max' => 15],
                    ['name' => 'Battery Charge', 'type' => 'battery', 'unit' => '%', 'min' => 20, 'max' => 100, 'c_min' => 5, 'c_max' => 100],
                ],
            ],
            [
                'name' => 'Carestation 650 Anesthesia',
                'model' => 'CS650',
                'manufacturer' => 'GE Healthcare',
                'location' => 'OR - Suite A',
                'status' => 'active',
                'sensors' => [
                    ['name' => 'Gas Flow Rate', 'type' => 'flow', 'unit' => 'L/min', 'min' => 0.5, 'max' => 10, 'c_min' => 0, 'c_max' => 15],
                    ['name' => 'Vaporizer Pressure', 'type' => 'pressure', 'unit' => 'kPa', 'min' => 95, 'max' => 105, 'c_min' => 80, 'c_max' => 120],
                    ['name' => 'O2 Cell Voltage', 'type' => 'voltage', 'unit' => 'mV', 'min' => 10, 'max' => 60, 'c_min' => 5, 'c_max' => 70],
                ],
            ],
            [
                'name' => 'Defibrillator LifePak 15',
                'model' => 'LP15',
                'manufacturer' => 'Stryker',
                'location' => 'Emergency Room',
                'status' => 'active',
                'sensors' => [
                    ['name' => 'Capacitor Charge Time', 'type' => 'time', 'unit' => 'ms', 'min' => 100, 'max' => 5000, 'c_min' => 50, 'c_max' => 8000],
                    ['name' => 'Battery Voltage', 'type' => 'voltage', 'unit' => 'V', 'min' => 12, 'max' => 14.4, 'c_min' => 10, 'c_max' => 15],
                    ['name' => 'Electrode Impedance', 'type' => 'impedance', 'unit' => 'Ohm', 'min' => 20, 'max' => 200, 'c_min' => 0, 'c_max' => 300],
                ],
            ],
        ];

        foreach ($devicesData as $layout) {
            $device = \App\Models\MedicalDevice::create([
                'name' => $layout['name'],
                'model' => $layout['model'],
                'manufacturer' => $layout['manufacturer'],
                'serial_number' => 'SN-'.strtoupper(\Illuminate\Support\Str::random(8)),
                'installation_date' => now()->subMonths(rand(1, 60)),
                'location' => $layout['location'],
                'status' => $layout['status'],
                'description' => "Critical medical equipment located in {$layout['location']}.",
                'last_sync_at' => now(),
            ]);

            foreach ($layout['sensors'] as $sensorConfig) {
                $sensor = \App\Models\Sensor::create([
                    'medical_device_id' => $device->id,
                    'name' => $sensorConfig['name'],
                    'type' => $sensorConfig['type'],
                    'unit' => $sensorConfig['unit'],
                    'min_normal_value' => $sensorConfig['min'],
                    'max_normal_value' => $sensorConfig['max'],
                    'critical_min_value' => $sensorConfig['c_min'],
                    'critical_max_value' => $sensorConfig['c_max'],
                    'is_active' => true,
                    'polling_interval' => 30,
                    'pin_number' => rand(1, 40),
                ]);

                // Create realistic readings
                for ($i = 0; $i < 20; $i++) {
                    // Generate a slightly random walk value around normal range
                    $base = ($sensorConfig['min'] + $sensorConfig['max']) / 2;
                    $variance = ($sensorConfig['max'] - $sensorConfig['min']) * 0.2;
                    $value = $base + ((rand(0, 100) / 50) - 1) * $variance;

                    \App\Models\SensorReading::create([
                        'sensor_id' => $sensor->id,
                        'value' => $value,
                        'status' => 'normal',
                        'recorded_at' => now()->subHours($i * 4),
                    ]);
                }
            }

            // Create some predictions
            if ($layout['status'] !== 'active') {
                \App\Models\Prediction::create([
                    'medical_device_id' => $device->id,
                    'provider_id' => $providers->random()->id,
                    'analysis_period_start' => now()->subMonth(),
                    'analysis_period_end' => now(),
                    'prediction_result' => ['summary' => 'Detected potential recurring voltage spike.'],
                    'failure_probability' => rand(60, 95),
                    'risk_level' => 'high',
                    'recommendations' => ['Check power supply unit', 'Inspect capacitor banks', 'Schedule maintenance'],
                    'confidence_score' => rand(80, 99),
                    'generation_time' => rand(1200, 5000), // ms
                ]);
            }
        }
    }
}
