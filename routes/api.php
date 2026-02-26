<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\MedicalDeviceController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\PredictionProviderController;
use App\Http\Controllers\SensorController;
use App\Http\Controllers\SensorReadingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Medical Devices
Route::apiResource('medical-devices', MedicalDeviceController::class);
Route::get('medical-devices/{id}/sync-status', [MedicalDeviceController::class, 'syncStatus']);

// Sensors
Route::get('medical-devices/{deviceId}/sensors', [SensorController::class, 'index']);
Route::post('medical-devices/{deviceId}/sensors', [SensorController::class, 'store']);
Route::get('sensors/{id}', [SensorController::class, 'show']);
Route::put('sensors/{id}', [SensorController::class, 'update']);
Route::delete('sensors/{id}', [SensorController::class, 'destroy']);
Route::post('sensors/{id}/activate', [SensorController::class, 'activate']);

// Readings
Route::get('sensors/{sensorId}/readings', [SensorReadingController::class, 'index']);
Route::get('sensors/{sensorId}/stats', [SensorReadingController::class, 'stats']);
Route::get('sensors/{sensorId}/chart', [SensorReadingController::class, 'chart']);
Route::post('esp32/readings', [SensorReadingController::class, 'store']);

// Providers
Route::apiResource('prediction-providers', PredictionProviderController::class);
Route::post('prediction-providers/{id}/test', [PredictionProviderController::class, 'test']);
Route::post('prediction-providers/{id}/default', [PredictionProviderController::class, 'setDefault']);

// Predictions
Route::get('medical-devices/{deviceId}/predictions', [PredictionController::class, 'index']);
Route::post('medical-devices/{deviceId}/predictions', [PredictionController::class, 'generate']);
Route::get('predictions/{id}', [PredictionController::class, 'show']);

// Alerts
Route::get('alerts', [AlertController::class, 'index']);
Route::post('alerts/{id}/read', [AlertController::class, 'markAsRead']);
Route::post('alerts/{id}/acknowledge', [AlertController::class, 'acknowledge']);
Route::delete('alerts/{id}', [AlertController::class, 'dismiss']);
