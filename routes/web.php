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
    Route::middleware('permission:view category')->group(function () {
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    });
    Route::middleware('permission:create category')->group(function () {
        Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    });
    Route::middleware('permission:update category')->group(function () {
        Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    });
    Route::middleware('permission:delete category')->group(function () {
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

    // Product
    Route::middleware('permission:view product')->group(function () {
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
    });
    Route::middleware('permission:create product')->group(function () {
        Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('products', [ProductController::class, 'store'])->name('products.store');
    });
    Route::middleware('permission:update product')->group(function () {
        Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    });
    Route::middleware('permission:delete product')->group(function () {
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    });

    // Transaction
    Route::middleware('permission:view transaction')->group(function () {
        Route::get('transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
        Route::get('transactions/{transaction}', [\App\Http\Controllers\TransactionController::class, 'show'])
            ->name('transactions.show')
            ->whereUuid('transaction');
        Route::post('transactions/{transaction}/check-status', [\App\Http\Controllers\TransactionController::class, 'checkStatus'])
            ->name('transactions.check-status')
            ->whereUuid('transaction');
    });
    Route::middleware('permission:create transaction')->group(function () {
        Route::get('transactions/create', [\App\Http\Controllers\TransactionController::class, 'create'])->name('transactions.create');
        Route::post('transactions', [\App\Http\Controllers\TransactionController::class, 'store'])->name('transactions.store');
    });

    // User Management
    Route::middleware('permission:view user')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
    });
    Route::middleware('permission:create user')->group(function () {
        Route::get('users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
    });
    Route::middleware('permission:update user')->group(function () {
        Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    });
    Route::middleware('permission:delete user')->group(function () {
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Role Management
    Route::middleware('permission:view role')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    });
    Route::middleware('permission:create role')->group(function () {
        Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
    });
    Route::middleware('permission:update role')->group(function () {
        Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    });
    Route::middleware('permission:delete role')->group(function () {
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    });
});

// Public Webhooks
Route::post('webhooks/xendit', [\App\Http\Controllers\TransactionController::class, 'webhook'])->name('xendit.webhook');

require __DIR__ . '/settings.php';
