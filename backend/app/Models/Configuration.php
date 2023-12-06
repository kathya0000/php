<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Configuration extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Configuration $configuration) {
            $configuration->created_by = Auth::id();
            $configuration->created_by_name = Auth::user()->name;
        });

        static::updating(function (Configuration $configuration) {
            $configuration->updated_by = Auth::id();
            $configuration->updated_by_name = Auth::user()->name;
        });
    }
}
