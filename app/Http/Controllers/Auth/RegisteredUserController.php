<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\Farmer;
use App\Models\Municipality;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $municipalities = Municipality::all();
        $crops = Crop::with('category')->get();

        return Inertia::render('Auth/Register', [
            'municipalities' => $municipalities,
            'crops' => $crops,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => ['required', 'string', 'regex:/^\+63\d{10}$/'],
            'municipality_id' => 'nullable|exists:municipalities,id',
            'barangay_id' => 'nullable|exists:barangays,id',
            'sitio_id' => 'nullable|exists:sitios,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'crops' => 'nullable|array|max:5',
            'crops.*' => 'nullable|exists:crops,id',
        ]);

        $latitude = $request->latitude;
        $longitude = $request->longitude;

        $withinBenguet = $latitude && $longitude && 
                         ($latitude >= 16.0 && $latitude <= 16.8) &&
                         ($longitude >= 120.3 && $longitude <= 120.8);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'isAdmin' => false,
                'isApproved' => false,
            ]);

            $farmer = Farmer::create([
                'user_id' => $user->id,
                'municipalitiy_id' => $request->municipality_id,
                'barangay_id' => $request->barangay_id,
                'sitio_id' => $request->sitio_id,
                'phone_number' => $request->phone_number,
                'latitude' => $latitude,
                'longitude' => $longitude,
            ]);

            if ($request->crops && count($request->crops) > 0) {
                $farmer->crops()->attach($request->crops);
            }

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            $locationWarning = null;
            if ($latitude && $longitude && !$withinBenguet) {
                $locationWarning = 'Your GPS coordinates appear to be outside Benguet Province. Your account will be reviewed by an administrator.';
            }

            return redirect()->route('pending')->with([
                'location_warning' => $locationWarning
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
