<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Seller extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Seller $seller) {
            $seller->created_by = Auth::id();
            $seller->created_by_name = Auth::user()->name;
        });

        static::updating(function (Seller $seller) {
            $seller->updated_by = Auth::id();
            $seller->updated_by_name = Auth::user()->name;
        });
    }

}
