<?php

namespace App\Notifications;

use App\Models\Alert;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SensorAlertNotification extends Notification
{
    use Queueable;

    public function __construct(public Alert $alert) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Sensor Alert: '.$this->alert->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A sensor alert has been triggered: '.$this->alert->title)
            ->line('Severity: '.ucfirst($this->alert->severity))
            ->line('Message: '.$this->alert->message)
            ->action('View Alert', url('/alerts/'.$this->alert->id))
            ->line('Please check the dashboard for more details.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'alert_id' => $this->alert->id,
            'title' => $this->alert->title,
            'message' => $this->alert->message,
            'severity' => $this->alert->severity,
            'sensor_id' => $this->alert->sensor_id,
            'medical_device_id' => $this->alert->medical_device_id,
        ];
    }
}
