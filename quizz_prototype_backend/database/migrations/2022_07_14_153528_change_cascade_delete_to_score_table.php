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
        Schema::table('score', function (Blueprint $table) {
            $table->dropForeign(['user_id'])->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->change();
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['user_id'])->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->change();
        });

        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropForeign(['user_id'])->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('score', function (Blueprint $table) {
            $table->dropForeign(['user_id'])->change();
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['user_id'])->change();
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropForeign(['user_id'])->change();
            $table->foreign('user_id')->references('id')->on('users');
        });
    }
};
