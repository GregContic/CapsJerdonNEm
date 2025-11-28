<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'phone_number' => ['required', 'string', 'regex:/^\+63\d{10}$/'],
            'municipality_id' => ['nullable', 'exists:municipalities,id'],
            'barangay_id' => ['nullable', 'exists:barangays,id'],
            'sitio_id' => ['nullable', 'exists:sitios,id'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'crops' => ['nullable', 'array', 'min:1', 'max:5'],
            'crops.*' => ['exists:crops,id'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => 'farmer',
            'status' => 'pending',
        ]);

        // Create farmer record with additional details
        $farmer = $user->farmer()->create([
            'phone_number' => $input['phone_number'],
            'municipality_id' => $input['municipality_id'] ?? null,
            'barangay_id' => $input['barangay_id'] ?? null,
            'sitio_id' => $input['sitio_id'] ?? null,
            'latitude' => $input['latitude'] ?? null,
            'longitude' => $input['longitude'] ?? null,
        ]);

        // Attach crops if provided
        if (!empty($input['crops'])) {
            $farmer->crops()->attach($input['crops']);
        }

        return $user;
    }
}
