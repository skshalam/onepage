<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::get('/onepagehome', [\App\Http\Controllers\HomeController::class, 'homescreen']);//view
Route::get('/onepage/{m_id}', [\App\Http\Controllers\LoginController::class, 'loginview']); //view api
Route::post('/websiteLogin', [\App\Http\Controllers\OtpLoginController::class, 'websiteLogin']);
Route::post('/onePageLoginOtpVerifyNew', [\App\Http\Controllers\OtpLoginController::class, 'onePageLoginOtpVerifyNew']);
Route::post('/onePageLoginResendOtp', [\App\Http\Controllers\OtpLoginController::class, 'onePageLoginResendOtp']);

Route::middleware(['auth:api'])->group(function () {
    
    Route::post('/creditbalance', [\App\Http\Controllers\HomeController::class, 'creditbalance']);
    Route::post('/walletbalance', [\App\Http\Controllers\HomeController::class, 'walletbalance']);
    Route::post('/couponscart', [\App\Http\Controllers\HomeController::class, 'couponscart']);
    Route::post('/couponhold', [\App\Http\Controllers\HomeController::class, 'couponhold']);
    Route::POST('/rewards', [\App\Http\Controllers\HomeController::class, 'rewards']);
    Route::POST('/memebership', [\App\Http\Controllers\HomeController::class, 'memebershippackage']);
    Route::POST('/eWalletissue',[\App\Http\Controllers\HomeController::class, 'eWalletissue']);
    Route::POST('/bookletissue', [\App\Http\Controllers\HomeController::class, 'bookletissue']);
    Route::POST('/bookletcoupon',[\App\Http\Controllers\HomeController::class, 'bookletcoupon']);
    Route::POST('/couponsredeem', [\App\Http\Controllers\HomeController::class, 'couponsRedeem']);  

    Route::get('/about', [\App\Http\Controllers\HomeController::class, 'about']);
    // Route::get('/referral_program', [\App\Http\Controllers\HomeController::class, 'referral_program']);
    Route::POST('/referErn', [\App\Http\Controllers\HomeController::class, 'referErn']);
    Route::post('/referral_programview', [\App\Http\Controllers\HomeController::class, 'referral_programview']);
    Route::get('/contact', [\App\Http\Controllers\HomeController::class, 'contact']);
    Route::POST('/contactsubmit',[\App\Http\Controllers\HomeController::class, 'contactsubmit']);
    Route::get('/termscon', [\App\Http\Controllers\HomeController::class, 'termscondition']);
    Route::get('/accountInfo', [\App\Http\Controllers\HomeController::class, 'accountInfo']);
    Route::get('/infodata', [\App\Http\Controllers\HomeController::class, 'infodata']);
    Route::POST('/editinfo', [\App\Http\Controllers\HomeController::class, 'editinfo']);
    Route::get('/getDataCounts', [\App\Http\Controllers\HomeController::class, 'getDataCounts']);
    Route::post('/cities', [\App\Http\Controllers\HomeController::class, 'cities']);
    Route::post('/gettingregion', [\App\Http\Controllers\HomeController::class, 'gettingregion']);
    Route::get('/countries', [\App\Http\Controllers\HomeController::class, 'countries']);
    Route::post('/state', [\App\Http\Controllers\HomeController::class, 'state']);
    Route::get('/themecolor', [\App\Http\Controllers\HomeController::class, 'themecolor']);
});



