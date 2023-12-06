<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/auth/check', [AuthController::class, 'check']);

    Route::get('/projects/{id}/budgetpdf', [ProjectController::class, 'budgetPDF'])->name('project.pdf');

    Route::post('/files/upload', [FileController::class, 'upload']);

    Route::get('/configs/globals', [ConfigurationController::class, 'globals']);

    Route::get('/configs/public/{key}', [ConfigurationController::class, 'public']);
});
