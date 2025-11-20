<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function farmers()
    {
        return $this->hasMany(Farmer::class);
    }
}
