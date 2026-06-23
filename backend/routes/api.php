<?php

use App\Http\Controllers\TramiteController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tramites', TramiteController::class);
