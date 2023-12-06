<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class ProductCategory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (ProductCategory $productCategory) {
            $productCategory->created_by = Auth::id();
            $productCategory->created_by_name = Auth::user()->name;
        });

        static::updating(function (ProductCategory $productCategory) {
            $productCategory->updated_by = Auth::id();
            $productCategory->updated_by_name = Auth::user()->name;
        });
    }
}
