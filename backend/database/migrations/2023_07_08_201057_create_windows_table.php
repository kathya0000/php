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
        Schema::create('windows', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('restrict');
            $table->unsignedInteger('type_id');
            $table->foreign('type_id')->references('id')->on('types')->onUpdate('cascade')->onDelete('restrict');
            $table->unsignedInteger('color_id');
            $table->foreign('color_id')->references('id')->on('colors')->onUpdate('cascade')->onDelete('restrict');
            $table->unsignedInteger('opening_id');
            $table->foreign('opening_id')->references('id')->on('openings')->onUpdate('cascade')->onDelete('restrict');
            $table->unsignedInteger('frame_material_id');
            $table->foreign('frame_material_id')->references('id')->on('frame_materials')->onUpdate('cascade')->onDelete('restrict');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('reference')->nullable();
            $table->string('facility')->nullable();
            $table->string('box_unit')->nullable();
            $table->string('quality')->nullable();
            $table->double('unit_price', 8, 2);
            $table->double('iva', 8, 2)->nullable();
            $table->double('iva_percent', 8, 2)->nullable();
            $table->double('thickness', 8, 2)->nullable();
            $table->double('blade_width', 8, 2)->nullable();
            $table->double('seller_price', 8, 2)->nullable();
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
        Schema::dropIfExists('windows');
    }
};
