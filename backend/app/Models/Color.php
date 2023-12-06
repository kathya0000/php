<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Color extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Color $color) {
            $color->created_by = Auth::id();
            $color->created_by_name = Auth::user()->name;
        });

        static::updating(function (Color $color) {
            $color->updated_by = Auth::id();
            $color->updated_by_name = Auth::user()->name;
        });
    }

    public function scopeDoor($query)
    {
        $colorsId = DB::table('product_type_colors')
            ->select('color_id')
            ->join('product_types', 'product_type_colors.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "DOORS");

        return $query->whereIn('id', $colorsId);
    }

    public function scopeWindow($query)
    {
        $colorsId = DB::table('product_type_colors')
            ->select('color_id')
            ->join('product_types', 'product_type_colors.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "WINDOWS");

        return $query->whereIn('id', $colorsId);
    }

    public function scopeFloor($query)
    {
        $colorsId = DB::table('product_type_colors')
            ->select('color_id')
            ->join('product_types', 'product_type_colors.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "FLOORS");

        return $query->whereIn('id', $colorsId);
    }

    public function scopeCeiling($query)
    {
        $colorsId = DB::table('product_type_colors')
            ->select('color_id')
            ->join('product_types', 'product_type_types.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "CEILINGS");

        return $query->whereIn('id', $colorsId);
    }

    public function scopeBlind($query)
    {
        $colorsId = DB::table('product_type_colors')
            ->select('color_id')
            ->join('product_types', 'product_type_colors.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "BLINDS");

        return $query->whereIn('id', $colorsId);
    }

    public function scopeMechanism($query)
    {
        $colorsId = DB::table('product_type_colors')
            ->select('color_id')
            ->join('product_types', 'product_type_colors.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "ELECTRICAL_MECHANISMS");

        return $query->whereIn('id', $colorsId);
    }
}
