<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');


    // Category
    Route::middleware('permission:view category')
        ->group(function () {
            Route::get(
                '/categories',
                fn() =>
                Inertia::render('category/index')
            )->name('categories.index');
        });


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
    Route::middleware('permission:view user')
        ->group(function () {
            Route::get(
                '/users',
                fn() =>
                Inertia::render('user/index')
            )->name('users.index');
        });


    // Role Management
    Route::middleware('permission:view role')
        ->group(function () {
            Route::get(
                '/roles',
                fn() =>
                Inertia::render('role/index')
            )->name('roles.index');
        });
});

require __DIR__ . '/settings.php';
