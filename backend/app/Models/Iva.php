<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Iva extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Iva $iva) {
            $iva->created_by = Auth::id();
            $iva->created_by_name = Auth::user()->name;
        });

        static::updating(function (Iva $iva) {
            $iva->updated_by = Auth::id();
            $iva->updated_by_name = Auth::user()->name;
        });
    }
}
