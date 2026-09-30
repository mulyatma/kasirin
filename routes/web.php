<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use \App\Http\Controllers\CategoryController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');

    // Category
    Route::resource('categories', CategoryController::class)->except(['show']);

    // Product
    Route::middleware('permission:view product')
        ->group(function () {
            Route::get(
                '/products',
                fn() =>
                Inertia::render('product/index')
            )->name('products.index');
        });

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
