<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class SpaceType extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (SpaceType $spaceType) {
            $spaceType->created_by = Auth::id();
            $spaceType->created_by_name = Auth::user()->name;
        });

        static::updating(function (SpaceType $spaceType) {
            $spaceType->updated_by = Auth::id();
            $spaceType->updated_by_name = Auth::user()->name;
        });
    }
}
