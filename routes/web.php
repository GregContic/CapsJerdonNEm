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

Route::get('/dashboard', function () {
    $user = Auth::user();
    
    // Redirect unapproved farmers to pending page
    if (!$user->isApproved) {
        return redirect()->route('pending');
    }
    
    // All approved users go to admin dashboard
    return redirect()->route('admin.dashboard');
})->middleware(['auth'])->name('dashboard');

// Public API routes for registration form
Route::get('/api/barangays', [FarmerController::class, 'getBarangays'])->name('api.public.barangays');
Route::get('/api/sitios', [FarmerController::class, 'getSitios'])->name('api.public.sitios');

Route::middleware('auth')->group(function () {
    Route::get('/pending', function() {
        if (Auth::user()->isApproved) {
            return redirect()->route('crop.index');
        } return Inertia::render('Auth/Pending');
    })->name('pending');
});

// --------------------------------------------------------
// Dedicated Farmer Group (Requires ALL checks: auth, verified, farmer)
// --------------------------------------------------------
Route::middleware(['auth', 'verified', 'approved.farmer'])->group(function () {
    
    Route::get('/crops', [CropController::class, 'index'])->name('crops.index');

    Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
    Route::get('/farmers/{farmer}', [FarmerController::class, 'show'])->name('farmers.show');

    Route::get('/profile', [FarmerProfileController::class, 'show'])->name('profile.edit');
    Route::patch('/profile', [FarmerProfileController::class, 'update'])->name('profile.update');


    Route::get('/api/barangays', [FarmerController::class, 'getBarangays'])->name('farmer.api.barangays');
    Route::get('/api/sitios', [FarmerController::class, 'getSitios'])->name('farmer.api.sitios');
});

// --------------------------------------------------------
// Trader Routes (Requires auth, verified, trader OR admin)
// --------------------------------------------------------
Route::middleware(['auth', 'verified', 'trader'])->prefix('admin')->group(function () {
    Route::get('/crops', [AdminCropController::class, 'index'])->name('admin.crops.index');
    Route::get('/crops/manage', [AdminCropController::class, 'manage'])->name('admin.crops.manage');
    Route::get('/crops/create', [AdminCropController::class, 'create'])->name('admin.crops.create');
    Route::post('/crops', [AdminCropController::class, 'store'])->name('admin.crops.store');
    Route::get('/crops/{crop}/edit', [AdminCropController::class, 'edit'])->name('admin.crops.edit');
    Route::put('/crops/{crop}', [AdminCropController::class, 'update'])->name('admin.crops.update');
    Route::delete('/crops/{crop}', [AdminCropController::class, 'destroy'])->name('admin.crops.destroy');
});

// --------------------------------------------------------
// Shared Dashboard (All authenticated users)
// --------------------------------------------------------
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('admin.dashboard');
});

// --------------------------------------------------------
// Dedicated Admin Group (Requires ALL checks: auth, verified, admin)
// --------------------------------------------------------
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    
    Route::get('/farmers', [AdminFarmerController::class, 'index'])->name('farmers.index'); // Read
    Route::post('/farmers', [AdminFarmerController::class, 'approve'])->name('farmers.approve'); // Store
    Route::delete('/farmers/{user}/approve', [AdminCropController::class, 'destroy'])->name('farmers.destroy'); // Delete

    Route::get('/api/barangays', [AdminFarmerController::class, 'getBarangays'])->name('api.barangays');
    Route::get('/api/sitios', [AdminFarmerController::class, 'getSitios'])->name('api.sitios');

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
