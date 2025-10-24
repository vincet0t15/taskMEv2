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
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'office_id' => ['required', 'exists:offices,id'],
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'username' => $input['username'],
            'office_id' => $input['office_id'],
            'password' => $input['password'],
        ]);
    }
}
