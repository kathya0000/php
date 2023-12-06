<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('geo_infos', function (Blueprint $table) {
            $table->id();
            $table->string('country_code');
            $table->string('country_name');
            $table->string('region_code')->nullable();
            $table->string('region_name')->nullable();
            $table->string('state_code')->nullable();
            $table->string('state_name')->nullable();
            $table->string('city_code')->nullable();
            $table->string('city_name')->nullable();
            $table->enum('info_type', ['CITY', 'STATE', 'REGION', 'COUNTRY']);
            $table->integer('enabled')->default('1');
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->string('created_by_name')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable()->default(null);
            $table->foreign('updated_by')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->string('updated_by_name')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable()->default(null);
            $table->foreign('deleted_by')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('geo_infos');
    }
};
