<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use App\Models\Sitio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFarmerController extends Controller
{
    public function index(Request $request) {
        $query = Farmer::with(['user', 'municipality', 'barangay', 'sitio', 'crops']);

        // Filter by Municipality
        if ($request->filled('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }
        //Filter by Barangay
        if ($request->filled('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }
        //Filter by Sitio
        if ($request->filled('sitio_id')) {
            $query->where('sitio_id', $request->sitio_id);
        }

        $approvedFarmers = (clone $query)->whereHas('user', function($q) {
            $q->where('isApproved', true);
        })->get();

        $pendingFarmers = (clone $query)->whereHas('user', function($q) {
            $q->where('isApproved', false);
        })->get();

        $municipalities = Municipality::all();

        return Inertia::render('Admin/Farmers', [
            'approvedFarmers' => $approvedFarmers,
            'pendingFarmers' => $pendingFarmers,
            'municipalities' => $municipalities,
            'filters' => $request->only(['municipality_id', 'barangay_id', 'sitio_id']),
        ]);
    }

    public function approve($userId) {
        $user = User::findOrFail($userId);
        
        if (!$user->farmer) {
            return redirect()->back()
                ->with('error', 'The selected user is not a farmer.');
        }

        $user->update(['isApproved' => true]);

        return redirect()->back()->with('success', 'Farmer approved successfully.');
    }

    public function destroy(Farmer $farmer) {
        $user = $farmer->user;

        $farmer->forceDelete();

        $user->forceDelete();

        return redirect()->route('admin.farmers.index')
            ->with('success', 'Farmer and associated account deleted successfully.');
    }

    public function getBarangays(Request $request) {
        $barangays = Barangay::where('municipality_id', $request->municipality_id)->get();
        return response()->json($barangays);
    }

    public function getSitios(Request $request) {
        $sitios = Sitio::where('barangay_id', $request->barangay_id)->get();
        return response()->json($sitios );
    }
}
