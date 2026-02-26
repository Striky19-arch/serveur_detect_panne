<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/documentation', function () {
    return Inertia::render('documentation');
})->name('documentation');

use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\MedicalDeviceController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('medical-devices', MedicalDeviceController::class);

    // Providers
    Route::post('providers/test-connection', [\App\Http\Controllers\Web\PredictionProviderController::class, 'testConnection'])->name('providers.test-connection');
    Route::post('providers/{provider}/test', [\App\Http\Controllers\Web\PredictionProviderController::class, 'test'])->name('providers.test');
    Route::resource('providers', \App\Http\Controllers\Web\PredictionProviderController::class);

    // Predictions
    Route::get('predictions/create', [\App\Http\Controllers\Web\PredictionController::class, 'create'])->name('predictions.create'); // Specific route before resource
    Route::post('predictions/execute', [\App\Http\Controllers\Web\PredictionController::class, 'execute'])->name('predictions.execute');
    Route::resource('predictions', \App\Http\Controllers\Web\PredictionController::class)->only(['index', 'show', 'store', 'destroy']);

    Route::resource('alerts', \App\Http\Controllers\Web\AlertController::class)->only(['index']);

    // Readings
    Route::get('readings', [\App\Http\Controllers\Web\SensorReadingController::class, 'index'])->name('readings.index');

    // Locale
    Route::post('locale', [\App\Http\Controllers\LocaleController::class, 'update'])->name('locale.update');

    // Notifications
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Settings
    Route::get('/settings/notifications', [App\Http\Controllers\SettingsController::class, 'edit'])->name('settings.notifications');
    Route::post('/settings/notifications', [App\Http\Controllers\SettingsController::class, 'update'])->name('settings.notifications.update');
    Route::post('/settings/notifications/test', [App\Http\Controllers\SettingsController::class, 'test'])->name('settings.notifications.test');
});

require __DIR__.'/settings.php';
