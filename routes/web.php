<?php

use App\Http\Controllers\Admin\AdminCropController;
use App\Http\Controllers\Admin\AdminFarmerController;
use App\Http\Controllers\Admin\FarmerApprovalController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\FarmerProfileController;
use App\Http\Controllers\ProfileController;
use App\Models\Farmer;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/pending', function() {
        if (Auth::user()->isApproved) {
            return redirect()->route('crop.index');
        } return Inertia::render('Auth/Pending');
    })->name('pending');
});

Route::middleware('auth')->group(function () {
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --------------------------------------------------------
// Dedicated Farmer Group (Requires ALL checks: auth, verified, farmer)
// --------------------------------------------------------
Route::middleware(['auth', 'verified', 'approved.farmer'])->group(function () {
    
    Route::get('/crops', [CropController::class, 'index'])->name('crops.index');

    Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
    Route::get('/farmers/{farmer}', [FarmerController::class], 'show')->name('farmers.show');

    Route::get('/profile', [FarmerProfileController::class, 'show'])->name('profile.edit');
    Route::patch('/profile', FarmerProfileController::class, 'update')->name('profile.update');


    Route::get('/api/barangays', [FarmerController::class, 'getBarangays'])->name('farmer.api.barangays');
    Route::get('/api/sitios', [FarmerController::class, 'getSitios'])->name->farmer('farmer.api.sitios');
});

// --------------------------------------------------------
// Dedicated Admin Group (Requires ALL checks: auth, verified, admin)
// --------------------------------------------------------
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/crops', [AdminCropController::class, 'index'])->name('crops.index'); // Read
    Route::get('/crops/create', [AdminCropController::class, 'create'])->name('crops.create'); // Create
    Route::post('/crops', [AdminCropController::class, 'store'])->name('crops.store'); // Store
    Route::put('/crops/{crop}', [AdminCropController::class, 'update'])->name('crops.update'); // Update
    
    Route::get('/farmers', [AdminFarmerController::class, 'index'])->name('farmers.index'); // Read
    Route::post('/farmers', [AdminFarmerController::class, 'approve'])->name('farmers.approve'); // Store
    Route::delete('/farmers/{user}/approve', [AdminCropController::class, 'destroy'])->name('farmers.destroy'); // Delete

    Route::get('/api/barangays', [AdminFarmerController::class, 'getBarangays'])->name('api.barangays');
    Route::get('/api/sitios', [AdminFarmerController::class, 'getSitios'])->name('api.sitios');

    Route::get('crops', function () {
        return Inertia::render('Admin/Crops');
    })->name('admin.crops');

    Route::get('crops/crop', function () {
        return Inertia::render('Admin/Accounts');
    })->name('admin.accounts');

    Route::get('accounts/pending', [FarmerApprovalController::class, 'index'])
        ->name('admin.accounts.pending');

    Route::post('accounts/approve-all', [FarmerApprovalController::class, 'approveAll'])
        ->name('admin.accounts.approveAll');

    Route::post('accounts/{id}/approve', [FarmerApprovalController::class, 'approve'])
        ->name('admin.accounts.approve');
});

require __DIR__.'/auth.php';
