<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    protected $fillable = [
        'user_id',
        'municipality_id',
        'barangay_id',
        'sitio_id',
        'phone_number',
        'longitude',
        'latitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function sitio()
    {
        return $this->belongsTo(Sitio::class);
    }

    public function crops()
    {
        return $this->belongsToMany(Crop::class, 'farmer_crop')
                    ->withTimestamps();
    }
}
