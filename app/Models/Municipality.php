<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    public function barangays()
    {
        return $this->hasMany(Barangay::class);
    }

    public function farmers()
    {
        return $this->hasMany(Farmer::class);
    }
}
