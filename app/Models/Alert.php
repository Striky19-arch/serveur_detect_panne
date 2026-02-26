<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_read' => 'boolean',
        'acknowledged_at' => 'datetime',
    ];

    public function device()
    {
        return $this->belongsTo(MedicalDevice::class, 'medical_device_id');
    }

    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }

    public function prediction()
    {
        return $this->belongsTo(Prediction::class);
    }

    public function acknowledgedBy()
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }
}
