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
        Schema::table('quizz_question', function (Blueprint $table) {
            $table->foreign('quizz_id')->references('id')->on('quizz')->onDelete('cascade')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quizz_question', function (Blueprint $table) {
            $table->dropForeign(['quizz_id']);
        });
    }
};
