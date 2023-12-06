<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class ProductType extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (ProductType $productType) {
            $productType->created_by = Auth::id();
            $productType->created_by_name = Auth::user()->name;
        });

        static::updating(function (ProductType $productType) {
            $productType->updated_by = Auth::id();
            $productType->updated_by_name = Auth::user()->name;
        });
    }
}
