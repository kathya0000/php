<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Floor extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Floor $floor) {
            $floor->created_by = Auth::id();
            $floor->created_by_name = Auth::user()->name;
            $floor->iva = round($floor->iva_percent / 100 * $floor->unit_price, 2);
        });

        static::updating(function (Floor $floor) {
            $floor->updated_by = Auth::id();
            $floor->updated_by_name = Auth::user()->name;
            $floor->iva = round($floor->iva_percent / 100 * $floor->unit_price, 2);
        });
    }
}
