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
        
        // Get pending farmers for the notification panel
        $pendingFarmers = Farmer::with(['user', 'municipality', 'barangay'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', false);
            })
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'farmers' => $farmers,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
            'sitios' => $sitios,
            'pendingFarmers' => $pendingFarmers,
        ]);
    }
}
