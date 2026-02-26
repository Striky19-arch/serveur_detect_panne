<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'min_normal_value' => 'decimal:2',
        'max_normal_value' => 'decimal:2',
        'critical_min_value' => 'decimal:2',
        'critical_max_value' => 'decimal:2',
    ];

    public function medicalDevice()
    {
        return $this->belongsTo(MedicalDevice::class, 'medical_device_id');
    }

    public function readings()
    {
        return $this->hasMany(SensorReading::class);
    }
}
