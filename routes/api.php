<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Auth (cookie-based via Sanctum stateful API) ──
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::get('user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// ── Authenticated routes ──
Route::middleware('auth:sanctum')->group(function () {
    // Items CRUD + search
    Route::get('items/labels', [ItemController::class, 'labels']);
    Route::apiResource('items', ItemController::class);

    // User management (admin only)
    Route::middleware('admin')->apiResource('users', UserController::class)
        ->except(['show']);
});
