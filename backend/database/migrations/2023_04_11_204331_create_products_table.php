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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->nullable();
            $table->string('facility')->nullable();
            $table->string('box_unit')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->double('unit_price', 8, 2);
            $table->double('iva', 8, 2)->nullable();
            $table->string('quality')->nullable();
            $table->string('opening')->nullable();
            $table->string('brand')->nullable();
            $table->string('series')->nullable();
            $table->unsignedBigInteger('product_type_id');
            $table->foreign('product_type_id')->references('id')->on('product_types')->onUpdate('cascade')->onDelete('restrict');
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
        Schema::dropIfExists('products');
    }
};
