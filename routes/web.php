<?php

use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/onePageWebsite/{m_id}',[\App\Http\Controllers\HomeController::class, 'onePageWebsite']);

Route::get('/{any}', function () {
    return view('welcome'); // This should be the Blade view that includes your React app
})->where('any', '.*');