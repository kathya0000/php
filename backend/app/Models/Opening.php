<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Opening extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Opening $opening) {
            $opening->created_by = Auth::id();
            $opening->created_by_name = Auth::user()->name;
        });

        static::updating(function (Opening $opening) {
            $opening->updated_by = Auth::id();
            $opening->updated_by_name = Auth::user()->name;
        });
    }

    public function scopeDoor($query)
    {
        $openingsId = DB::table('product_type_openings')
            ->select('opening_id')
            ->join('product_types', 'product_type_openings.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "DOORS");

        return $query->whereIn('id', $openingsId);
    }

    public function scopeWindow($query)
    {
        $openingsId = DB::table('product_type_openings')
            ->select('opening_id')
            ->join('product_types', 'product_type_openings.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "WINDOWS");

        return $query->whereIn('id', $openingsId);
    }

    public function scopeFloor($query)
    {
        $openingsId = DB::table('product_type_openings')
            ->select('opening_id')
            ->join('product_types', 'product_type_openings.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "FLOORS");

        return $query->whereIn('id', $openingsId);
    }

    public function scopeCeiling($query)
    {
        $openingsId = DB::table('product_type_openings')
            ->select('opening_id')
            ->join('product_types', 'product_type_openings.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "CEILINGS");

        return $query->whereIn('id', $openingsId);
    }

    public function scopeBlind($query)
    {
        $openingsId = DB::table('product_type_openings')
            ->select('opening_id')
            ->join('product_types', 'product_type_openings.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "BLINDS");

        return $query->whereIn('id', $openingsId);
    }

    public function scopeMechanism($query)
    {
        $openingsId = DB::table('product_type_openings')
            ->select('opening_id')
            ->join('product_types', 'product_type_openings.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "ELECTRICAL_MECHANISMS");

        return $query->whereIn('id', $openingsId);
    }
}
