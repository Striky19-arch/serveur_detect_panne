<?php

use App\Models\MedicalDevice;
use Illuminate\Support\Str;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Backfilling UUIDs...\n";

$devices = MedicalDevice::whereNull('uuid')->get();
$count = 0;

foreach ($devices as $device) {
    // Check if UUID is empty/null
    if (empty($device->uuid)) {
        $device->uuid = (string) Str::uuid();
        $device->saveQuietly(); // Use saveQuietly to avoid triggering events if any
        echo "Updated device {$device->id} with UUID: {$device->uuid}\n";
        $count++;
    }
}

echo "Completed. Updated $count devices.\n";
echo 'First Device UUID: '.MedicalDevice::first()->uuid."\n";
