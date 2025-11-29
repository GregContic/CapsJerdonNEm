<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Flower/Stem Vegetables',
            'Fruiting Vegetables',
            'Leafy/Head Vegetables',
            'Legumes/Podded',
            'Root/Tuber Vegetables',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate(['name' => $name]);
        }

    }
}
