<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Labour extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Labour $labour) {
            $labour->created_by = Auth::id();
            $labour->created_by_name = Auth::user()->name;
            $labour->iva = round($labour->iva_percent / 100 * $labour->unit_price, 2);
        });

        static::updating(function (Labour $labour) {
            $labour->updated_by = Auth::id();
            $labour->updated_by_name = Auth::user()->name;
            $labour->iva = round($labour->iva_percent / 100 * $labour->unit_price, 2);
        });
    }
}
