<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FrameMaterial extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (FrameMaterial $frameMaterial) {
            $frameMaterial->created_by = Auth::id();
            $frameMaterial->created_by_name = Auth::user()->name;
        });

        static::updating(function (FrameMaterial $frameMaterial) {
            $frameMaterial->updated_by = Auth::id();
            $frameMaterial->updated_by_name = Auth::user()->name;
        });
    }

    public function scopeDoor($query)
    {
        $frameMaterialsId = DB::table('product_type_frame_materials')
            ->select('frame_material_id')
            ->join('product_types', 'product_type_frame_materials.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "DOORS");

        return $query->whereIn('id', $frameMaterialsId);
    }

    public function scopeWindow($query)
    {
        $frameMaterialsId = DB::table('product_type_frame_materials')
            ->select('frame_material_id')
            ->join('product_types', 'product_type_frame_materials.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "WINDOWS");

        return $query->whereIn('id', $frameMaterialsId);
    }

    public function scopeFloor($query)
    {
        $frameMaterialsId = DB::table('product_type_frame_materials')
            ->select('frame_material_id')
            ->join('product_types', 'product_type_frame_materials.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "FLOORS");

        return $query->whereIn('id', $frameMaterialsId);
    }

    public function scopeCeiling($query)
    {
        $frameMaterialsId = DB::table('product_type_frame_materials')
            ->select('frame_material_id')
            ->join('product_types', 'product_type_frame_materials.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "CEILINGS");

        return $query->whereIn('id', $frameMaterialsId);
    }

    public function scopeBlind($query)
    {
        $frameMaterialsId = DB::table('product_type_frame_materials')
            ->select('frame_material_id')
            ->join('product_types', 'product_type_frame_materials.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "BLINDS");

        return $query->whereIn('id', $frameMaterialsId);
    }

    public function scopeMechanism($query)
    {
        $frameMaterialsId = DB::table('product_type_frame_materials')
            ->select('frame_material_id')
            ->join('product_types', 'product_type_frame_materials.product_type_id', '=', 'product_types.id')
            ->where('product_types.code', "ELECTRICAL_MECHANISMS");

        return $query->whereIn('id', $frameMaterialsId);
    }
}
