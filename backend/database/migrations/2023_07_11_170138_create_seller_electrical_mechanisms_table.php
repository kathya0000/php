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
        Schema::create('seller_electrical_mechanisms', function (Blueprint $table) {
            $table->bigInteger('seller_id')->unsigned()->index();
            $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
            $table->bigInteger('electrical_mechanism_id')->unsigned()->index();
            $table->foreign('electrical_mechanism_id')->references('id')->on('electrical_mechanisms')->onDelete('cascade');
            $table->primary(['seller_id', 'electrical_mechanism_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seller_electrical_mechanisms');
    }
};
