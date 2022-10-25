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
        Schema::table('quizz', function (Blueprint $table) {
            $table->boolean('public_quizz')->default(0)->after('shuffle_questions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quizz', function (Blueprint $table) {
            $table->dropColumn('public_quizz');
        });
    }
};
