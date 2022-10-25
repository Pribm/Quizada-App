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
        Schema::create('adm_invitation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inviter_user');
            $table->foreignId('invitated_user');
            $table->boolean('accepted')->default(false);
            $table->smallInteger('to_role')->default(env('MANAGER_ROLE_ID'));
            $table->timestamps();

            $table->foreign('inviter_user')->references('id')->on('users');
            $table->foreign('invitated_user')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('adm_invitation');
    }
};
