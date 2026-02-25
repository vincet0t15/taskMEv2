<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $accounts = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('accounts/index', [
            'accountList' => $accounts,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function toggleActive(User $user)
    {
        $user->update([
            'is_active' => !$user->is_active,
        ]);

        return redirect()->back()->with('success', 'User status updated successfully.');
    }
}
