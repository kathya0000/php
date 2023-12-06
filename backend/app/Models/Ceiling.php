<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Ceiling extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Ceiling $ceiling) {
            $ceiling->created_by = Auth::id();
            $ceiling->created_by_name = Auth::user()->name;
            $ceiling->iva = round($ceiling->iva_percent / 100 * $ceiling->unit_price, 2);
        });

        static::updating(function (Ceiling $ceiling) {
            $ceiling->updated_by = Auth::id();
            $ceiling->updated_by_name = Auth::user()->name;
            $ceiling->iva = round($ceiling->iva_percent / 100 * $ceiling->unit_price, 2);
        });
    }
}
