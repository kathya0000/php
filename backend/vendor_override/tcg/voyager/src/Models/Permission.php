<?php

namespace TCG\Voyager\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use TCG\Voyager\Facades\Voyager;

class Permission extends Model
{
    protected $guarded = [];

    public function roles()
    {
        return $this->belongsToMany(Voyager::modelClass('Role'));
    }

    public static function generateFor($table_name)
    {
        self::firstOrCreate(['key' => 'browse_'.$table_name, 'table_name' => $table_name]);
        self::firstOrCreate(['key' => 'read_'.$table_name, 'table_name' => $table_name]);
        self::firstOrCreate(['key' => 'edit_'.$table_name, 'table_name' => $table_name]);
        self::firstOrCreate(['key' => 'add_'.$table_name, 'table_name' => $table_name]);
        self::firstOrCreate(['key' => 'delete_'.$table_name, 'table_name' => $table_name]);
    }

    public static function removeFrom($table_name)
    {
        self::where(['table_name' => $table_name])->delete();
    }

    public function getByUserLogin(){
        if(Auth::user()->email != 'soporte@reforma.com'){
            $data = $this->whereNotIn('key', [
                'browse_bread','browse_database','browse_media','browse_compass','browse_menus','read_menus','edit_menus',
                'add_menus','delete_menus','browse_settings','read_settings','edit_settings','add_settings','delete_settings',
                'browse_posts', 'read_posts','edit_posts','add_posts','delete_posts','browse_pages', 'read_pages','edit_pages',
                'add_pages','delete_pages','edit_product_types','add_product_types','delete_product_types','browse_configurations',
                'read_configurations','edit_configurations','add_configurations','delete_configurations'
                ])->get()->groupBy('table_name');
        }else{
            $data = $this->all()->groupBy('table_name');
        }
        return $data;
    }
}
