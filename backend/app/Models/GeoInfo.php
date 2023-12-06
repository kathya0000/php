<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class GeoInfo extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (GeoInfo $geoInfo) {
            $geoInfo->created_by = Auth::id();
            $geoInfo->created_by_name = Auth::user()->name;
        });

        static::updating(function (GeoInfo $geoInfo) {
            $geoInfo->updated_by = Auth::id();
            $geoInfo->updated_by_name = Auth::user()->name;
        });
    }
}
