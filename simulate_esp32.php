<?php

// Simulating ESP32 client with UUID
$url = 'http://127.0.0.1:8000/api/esp32/readings';
$deviceUuid = '0996fd8b-a22d-4a70-bfb1-bf3712803e7f'; // Replaced with actual UUID

$data = [
    'device_uuid' => $deviceUuid,
    'readings' => [
        [
            'sensor_type' => 'temperature', // Using type instead of ID
            'sensor_index' => 0,
            'value' => 24.5,
            'status' => 'normal',
            'recorded_at' => date('Y-m-d H:i:s'),
        ],
        [
            'sensor_type' => 'vibration',
            'sensor_index' => 0,
            'value' => 0.5,
            'status' => 'normal',
            'recorded_at' => date('Y-m-d H:i:s'),
        ],
    ],
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true,
    ],
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$responseHeaders = $http_response_header;

echo "Response Headers:\n";
print_r($responseHeaders);
echo "\nResponse Body:\n";
echo $result;

if (strpos($responseHeaders[0], '201') !== false) {
    echo "\n\n✅ Success! Data sent to API using Device UUID.\n";
} else {
    echo "\n\n❌ Failed to send data.\n";
}
