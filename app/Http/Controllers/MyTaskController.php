<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MyTaskController extends Controller
{
    public function index()
    {
        return Inertia::render('myTask/index');
    }
}
