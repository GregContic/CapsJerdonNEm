<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use App\Models\Sitio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $farmers = Farmer::with(['user', 'municipality', 'barangay', 'sitio', 'crops'])->get();
        $municipalities = Municipality::all();
        $barangays = Barangay::all();
        $sitios = Sitio::all();

        return Inertia::render('Admin/Dashboard', [
            'farmers' => $farmers,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
            'sitios' => $sitios,
        ]);
    }
}
