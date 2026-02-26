<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalDevice extends Model
{
    use \Illuminate\Database\Eloquent\Concerns\HasUuids;
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $guarded = [];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    protected $casts = [
        'installation_date' => 'date',
        'last_sync_at' => 'datetime',
    ];

    public function sensors()
    {
        return $this->hasMany(Sensor::class);
    }

    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }
}
