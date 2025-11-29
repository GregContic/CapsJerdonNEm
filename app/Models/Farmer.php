<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    protected $fillable = [
        'user_id',
        'municipalitiy_id',
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
        return $this->belongsTo(Municipality::class, 'municipalitiy_id');
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
