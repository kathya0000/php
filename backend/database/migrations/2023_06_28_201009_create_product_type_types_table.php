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
        Schema::create('product_type_types', function (Blueprint $table) {
            $table->bigInteger('product_type_id')->unsigned()->index();
            $table->foreign('product_type_id')->references('id')->on('product_types')->onDelete('cascade');
            $table->Integer('type_id')->unsigned()->index();
            $table->foreign('type_id')->references('id')->on('types')->onDelete('cascade');
            $table->primary(['product_type_id', 'type_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_type_types');
    }
};
