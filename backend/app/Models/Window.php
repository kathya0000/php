<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Window extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Window $window) {
            $window->created_by = Auth::id();
            $window->created_by_name = Auth::user()->name;
            $window->iva = round($window->iva_percent / 100 * $window->unit_price, 2);
        });

        static::updating(function (Window $window) {
            $window->updated_by = Auth::id();
            $window->updated_by_name = Auth::user()->name;
            $window->iva = round($window->iva_percent / 100 * $window->unit_price, 2);
        });
    }
}
