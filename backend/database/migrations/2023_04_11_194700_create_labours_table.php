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
        Schema::create('labours', function (Blueprint $table) {
            $table->id();
            $table->string('product_type_code');
            $table->string('reference')->nullable();
            $table->string('work_do');
            $table->text('description')->nullable();
            $table->double('unit_price', 8, 2);
            $table->double('iva', 8, 2)->nullable();
            $table->double('iva_percent', 8, 2)->nullable();
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
        Schema::dropIfExists('labours');
    }
};
