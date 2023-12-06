<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Category $category) {
            $category->created_by = Auth::id();
            $category->created_by_name = Auth::user()->name;
        });

        static::updating(function (Category $category) {
            $category->updated_by = Auth::id();
            $category->updated_by_name = Auth::user()->name;
        });
    }

    public function scopeDoor($query)
    {
        return $query->where('product_type_code', "DOORS");
    }

    public function scopeWindow($query)
    {
        return $query->where('product_type_code', "WINDOWS");
    }

    public function scopeFloor($query)
    {
        return $query->where('product_type_code', "FLOORS");
    }

    public function scopeCeiling($query)
    {
        return $query->where('product_type_code', "CEILINGS");
    }

    public function scopeBlind($query)
    {
        return $query->where('product_type_code', "BLINDS");
    }

    public function scopeMechanism($query)
    {
        return $query->where('product_type_code', "ELECTRICAL_MECHANISMS")->orWhere('product_type_code', "FRAMES");
    }

    public function scopeFrame($query)
    {
        return $query->where('product_type_code', "FRAMES");
    }
}
