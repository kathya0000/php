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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->longText('client_data');
            $table->longText('address_data');
            $table->string('reference');
            $table->text('description')->nullable();
            $table->integer('space_count')->default('0');
            $table->string('address_data_version')->nullable();
            $table->string('spaces_data_version')->nullable();
            $table->longText('spaces_data');
            $table->decimal('budget');
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
        Schema::dropIfExists('projects');
    }
};
