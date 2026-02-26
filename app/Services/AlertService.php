<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\Sensor;
use App\Models\SensorReading;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;

class AlertService
{
    public function checkThresholds(SensorReading $reading)
    {
        $sensor = $reading->sensor;
        $settings = Setting::all()->pluck('value', 'key');

        // Critical Max Check
        if (! is_null($sensor->critical_max_value) && $reading->value >= $sensor->critical_max_value) {
            $this->createAlert(
                $sensor,
                $reading,
                'critical',
                'Critical Max Value Exceeded',
                $this->formatMessage($settings['alert_template_critical_max'] ?? 'Sensor {sensor} value {value} exceeds critical max {threshold}', $sensor, $reading, $sensor->critical_max_value),
                $settings->get('notification_email')
            );

            return;
        }

        // Critical Min Check
        if (! is_null($sensor->critical_min_value) && $reading->value <= $sensor->critical_min_value) {
            $this->createAlert(
                $sensor,
                $reading,
                'critical',
                'Critical Min Value Exceeded',
                $this->formatMessage($settings['alert_template_critical_min'] ?? 'Sensor {sensor} value {value} exceeds critical min {threshold}', $sensor, $reading, $sensor->critical_min_value),
                $settings->get('notification_email')
            );

            return;
        }

        // Warning Max Check
        if (! is_null($sensor->max_normal_value) && $reading->value > $sensor->max_normal_value) {
            $this->createAlert(
                $sensor,
                $reading,
                'warning',
                'Abnormal High Value',
                $this->formatMessage($settings['alert_template_warning_max'] ?? 'Sensor {sensor} value {value} exceeds normal max {threshold}', $sensor, $reading, $sensor->max_normal_value),
                $settings->get('notification_email')
            );

            return;
        }

        // Warning Min Check
        if (! is_null($sensor->min_normal_value) && $reading->value < $sensor->min_normal_value) {
            $this->createAlert(
                $sensor,
                $reading,
                'warning',
                'Abnormal Low Value',
                $this->formatMessage($settings['alert_template_warning_min'] ?? 'Sensor {sensor} value {value} below normal min {threshold}', $sensor, $reading, $sensor->min_normal_value),
                $settings->get('notification_email')
            );

            return;
        }
    }

    protected function formatMessage(string $template, Sensor $sensor, SensorReading $reading, $threshold)
    {
        return str_replace(
            ['{sensor}', '{value}', '{unit}', '{threshold}', '{time}', '{equipment}'],
            [
                $sensor->name,
                $reading->value,
                $sensor->unit ?? '',
                $threshold,
                $reading->created_at->format('H:i:s'),
                $sensor->medicalDevice->name ?? 'Unknown Device',
            ],
            $template
        );
    }

    protected function createAlert(Sensor $sensor, SensorReading $reading, string $severity, string $title, string $message, ?string $email = null)
    {
        // Check duplication: avoid creating same alert for same sensor within last hour if unacknowledged? (Simplified for now: just create)
        $type = $severity === 'critical' ? 'sensor_critical' : 'sensor_warning';

        $alert = Alert::create([
            'medical_device_id' => $sensor->medical_device_id,
            'sensor_id' => $sensor->id,
            'type' => $type,
            'severity' => $severity,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);

        // Update reading status
        $reading->update(['status' => $severity]);

        // Dispatch Notification
        try {
            // Send to configured email if available
            if ($email) {
                \Illuminate\Support\Facades\Notification::route('mail', $email)
                    ->notify(new \App\Notifications\SensorAlertNotification($alert));
            }

            // Also send to all users (in-app notifications)
            $users = \App\Models\User::all();
            if ($users->count() > 0) {
                \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\SensorAlertNotification($alert));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send alert notification: '.$e->getMessage());
        }
    }
}
