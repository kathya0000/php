<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Blind extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Blind $blind) {
            $blind->created_by = Auth::id();
            $blind->created_by_name = Auth::user()->name;
            $blind->iva = round($blind->iva_percent / 100 * $blind->unit_price, 2);
        });

        static::updating(function (Blind $blind) {
            $blind->updated_by = Auth::id();
            $blind->updated_by_name = Auth::user()->name;
            $blind->iva = round($blind->iva_percent / 100 * $blind->unit_price, 2);
        });
    }
}
