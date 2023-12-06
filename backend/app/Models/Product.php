<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->created_by = Auth::id();
            $product->created_by_name = Auth::user()->name;
        });

        static::updating(function (Product $product) {
            $product->updated_by = Auth::id();
            $product->updated_by_name = Auth::user()->name;
        });
    }
}
