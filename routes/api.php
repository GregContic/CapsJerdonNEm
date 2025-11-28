<?php

use App\Http\Controllers\CategoryController;
use App\Models\Barangay;
use App\Models\Sitio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/barangays', function (Request $request) {
    $barangays = Barangay::where('municipality_id', $request->municipality_id)
        ->orderBy('name')
        ->get();
    return response()->json($barangays);
});

Route::get('/sitios', function (Request $request) {
    $sitios = Sitio::where('barangay_id', $request->barangay_id)
        ->orderBy('name')
        ->get();
    return response()->json($sitios);
});

Route::get('/', [CategoryController::class]);