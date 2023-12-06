<?php

namespace TCG\Voyager\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use TCG\Voyager\Facades\Voyager;
use TCG\Voyager\Tests\Database\Factories\RoleFactory;

class Role extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function users()
    {
        $userModel = Voyager::modelClass('User');

        return $this->belongsToMany($userModel, 'user_roles')
                    ->select(app($userModel)->getTable().'.*')
                    ->union($this->hasMany($userModel))->getQuery();
    }

    public function permissions()
    {
        return $this->belongsToMany(Voyager::modelClass('Permission'));
    }

    protected static function newFactory()
    {
        return RoleFactory::new();
    }

    /**
     * Scope a query to no include soporte role.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return void
     */
    public function scopeNotSoporte($query)
    {
        if(Auth::user()->email != 'soporte@reforma.com'){
            $query->where('name', '<>', 'soporte');
        }
    }
}
