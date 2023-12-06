<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Door extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Door $door) {
            $door->created_by = Auth::id();
            $door->created_by_name = Auth::user()->name;
            $door->iva = round($door->iva_percent / 100 * $door->unit_price, 2);
        });

        static::updating(function (Door $door) {
            $door->updated_by = Auth::id();
            $door->updated_by_name = Auth::user()->name;
            $door->iva = round($door->iva_percent / 100 * $door->unit_price, 2);
        });
    }

}
