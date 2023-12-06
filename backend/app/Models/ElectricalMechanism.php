<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class ElectricalMechanism extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (ElectricalMechanism $electricalMechanism) {
            $electricalMechanism->created_by = Auth::id();
            $electricalMechanism->created_by_name = Auth::user()->name;
            $electricalMechanism->iva = round($electricalMechanism->iva_percent / 100 * $electricalMechanism->unit_price, 2);
        });

        static::updating(function (ElectricalMechanism $electricalMechanism) {
            $electricalMechanism->updated_by = Auth::id();
            $electricalMechanism->updated_by_name = Auth::user()->name;
            $electricalMechanism->iva = round($electricalMechanism->iva_percent / 100 * $electricalMechanism->unit_price, 2);
        });
    }
}
