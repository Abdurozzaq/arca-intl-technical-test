<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\WorkLogController;
use Illuminate\Support\Facades\Route;

Route::apiResource('work-logs', WorkLogController::class);
Route::apiResource('employees', EmployeeController::class);

// Additional custom routes
Route::get('employees/{id}/statistics', [EmployeeController::class, 'statistics']);
Route::get('employees/{id}/work-logs', [WorkLogController::class, 'getByEmployee']);
