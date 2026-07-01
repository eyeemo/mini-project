<?php

use Illuminate\Support\Facades\Route;

// Serve the Vue single-page app. Any non-API route renders the SPA shell,
// letting Vue Router handle dashboard / forms / detail views client-side.
Route::view('/{any?}', 'app')->where('any', '^(?!api).*$');
