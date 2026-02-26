<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PredictionProvider extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'config' => 'encrypted:array',
        'last_tested_at' => 'datetime',
    ];

    public function predictions()
    {
        return $this->hasMany(Prediction::class, 'provider_id');
    }
}
