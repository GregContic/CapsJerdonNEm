<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Crop;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class FarmerProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $farmer = $user->farmer->load(['municipality', 'barangay', 'sitio', 'crops.category']);
        $allCrops = Crop::with('category')->get();

        return Inertia::render('Profile/FarmerProfile', [
            'farmer' => $farmer,
            'allCrops' => $allCrops,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $farmer = $user->farmer;

        $validated = $request->validate([
            'phone_number' => 'required|string|max:20',
            'crops' => 'required|array|min:1|max:3',
            'crops.*' => 'exists:crops, id',
        ]);

        $farmer->update([
            'phone_number' => $validated['phone_number'],
        ]);

        $farmer->crops()->sync($validated['crops']);

        return Redirect::route('farmer.profile.show')
            ->with('success', 'Profile updated successfully.');
    }
}
