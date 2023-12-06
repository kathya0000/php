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
        Schema::create('seller_doors', function (Blueprint $table) {
            $table->bigInteger('seller_id')->unsigned()->index();
            $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
            $table->bigInteger('door_id')->unsigned()->index();
            $table->foreign('door_id')->references('id')->on('doors')->onDelete('cascade');
            $table->primary(['seller_id', 'door_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seller_doors');
    }
};
