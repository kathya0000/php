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
        Schema::create('seller_blinds', function (Blueprint $table) {
            $table->bigInteger('seller_id')->unsigned()->index();
            $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
            $table->bigInteger('blind_id')->unsigned()->index();
            $table->foreign('blind_id')->references('id')->on('blinds')->onDelete('cascade');
            $table->primary(['seller_id', 'blind_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seller_blinds');
    }
};
