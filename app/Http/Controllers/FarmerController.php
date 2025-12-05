<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use App\Models\Sitio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmerController extends Controller
{
    public function publicIndex(Request $request) {
        // Public dashboard with map view
        $farmers = Farmer::with(['user', 'municipality', 'barangay', 'sitio', 'crops'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', true);
            })
            ->get();

        $municipalities = Municipality::all();
        $barangays = Barangay::all();
        $sitios = Sitio::all();

        return Inertia::render('Farmers/Dashboard', [
            'farmers' => $farmers,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
            'sitios' => $sitios,
        ]);
    }

    public function show(Farmer $farmer)
    {
        if (!$farmer->user->isApproved) {
            abort(404);
        }

        $farmer->load(['user', 'municipality', 'barangay', 'sitio', 'crops.category']);

        return Inertia::render('Farmers/Show', [
            'farmer' => $farmer,
        ]);
    }

    public function getBarangays(Request $request)
    {
        $barangays = Barangay::where('municipality_id', $request->municipality_id)->get();
        return response()->json($barangays);
    }

    public function getSitios(Request $request)
    {
        $sitios = Sitio::where('barangay_id', $request->barangay_id)->get();
        return response()->json($sitios);
    }
}
