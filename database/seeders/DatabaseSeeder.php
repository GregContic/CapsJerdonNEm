<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MunicipalitySeeder::class,
            BarangaySeeder::class,
            SitioSeeder::class,
            //CategorySeeder::class,  
            //CropSeeder::class,
        ]);

        // User::factory(10)->create();

        // User::firstOrCreate([
        //     'name' => env('ADMIN_NAME', 'Admin User'),
        //     'email' => env('ADMIN_EMAIL', 'admin@email.com'),
        //     'password' => Hash::make(env('ADMIN_PASSWORD', 'admin123')),
        //     'role' => 'admin',
        //     'status' => 'approved',
        // ]);

        User::firstOrCreate([
            'name' => 'Admin User',
            'email' => 'admin@email.com',
            'password' => 'password',
            'isAdmin' => true,
            'isApproved' => true,
        ]);
    }
}
