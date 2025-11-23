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
    public function index(Request $request) {
        $query = Farmer::with(['user', 'municipality', 'barangay', 'sitio', 'crops'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', true);
            });

            if ($request->filled('municipality_id')) {
                $query->where('municipality_id', $request->municipality_id);
            }

            if ($request->filled('barangay_id')) {
                $query->where('barangay_id', $request->barangay_id);
            }

            if ($request->filled('sitio_id')) {
                $query->wjere('sitio_id', $request->sitio_id);
            }

            $farmers = $query->get();
            $municipalities = Municipality::all();

            return Inertia::render('Farmers/Index', [
                'farmers' => $farmers,
                'municipalities' => $municipalities,
                'filters' => $request->only(['municipality_id', 'barangay_id', 'sitio_id']),
            ]);
    }

    public function show(Farmer $farmer)
    {
        if (!$farmer->user->isApproved) {
            abort(404);
        }

        $farmer->load(['user', 'municipality', 'narangay', 'sitio', 'crops.category']);

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
