<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    protected $casts = [
        'analysis_period_start' => 'datetime',
        'analysis_period_end' => 'datetime',
        'prediction_result' => 'array',
        'failure_probability' => 'decimal:2',
        'predicted_failure_date' => 'datetime',
        'recommendations' => 'array',
        'confidence_score' => 'decimal:2',
    ];

    public function medicalDevice()
    {
        return $this->belongsTo(MedicalDevice::class, 'medical_device_id');
    }

    public function provider()
    {
        return $this->belongsTo(PredictionProvider::class, 'provider_id');
    }
}
