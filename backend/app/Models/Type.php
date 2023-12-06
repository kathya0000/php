<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Type extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Type $type) {
            $type->created_by = Auth::id();
            $type->created_by_name = Auth::user()->name;
        });

        static::updating(function (Type $type) {
            $type->updated_by = Auth::id();
            $type->updated_by_name = Auth::user()->name;
        });
    }

    public function scopeDoor($query)
    {
        $typesId = DB::table('product_type_types')
            ->select('type_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "DOORS");

        return $query->whereIn('id', $typesId);
    }

    public function scopeWindow($query)
    {
        $typesId = DB::table('product_type_types')
            ->select('type_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "WINDOWS");

        return $query->whereIn('id', $typesId);
    }

    public function scopeFloor($query)
    {
        $typesId = DB::table('product_type_types')
            ->select('type_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "FLOORS");

        return $query->whereIn('id', $typesId);
    }

    public function scopeCeiling($query)
    {
        $typesId = DB::table('product_type_types')
            ->select('type_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "CEILINGS");

        return $query->whereIn('id', $typesId);
    }

    public function scopeBlind($query)
    {
        $typesId = DB::table('product_type_types')
            ->select('type_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "BLINDS");

        return $query->whereIn('id', $typesId);
    }

    public function scopeMechanism($query)
    {
        $typesId = DB::table('product_type_types')
            ->select('type_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "ELECTRICAL_MECHANISMS");

        return $query->whereIn('id', $typesId);
    }
}
