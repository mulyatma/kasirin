<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');

    // Category
    Route::resource('categories', CategoryController::class)->except(['show']);

    // Product
    Route::resource('products', ProductController::class)->except(['show']);

    // Transaction
    Route::middleware('permission:view transaction')
        ->group(function () {
            Route::get(
                '/transactions',
                fn() =>
                Inertia::render('transaction/index')
            )->name('transactions.index');
        });

    // User Management
    Route::resource('users', UserController::class)->except(['show']);

    // Role Management
    Route::resource('roles', RoleController::class)->except(['show']);
});

require __DIR__ . '/settings.php';
