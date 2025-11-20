<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = ['category_id', 'name', 'price', 'image_path'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function farmers()
    {
        return $this->belongsToMany(Farmer::class, 'farmer_crop')
                    ->withTimestamps();
    }
}
