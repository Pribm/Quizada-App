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
            $table->boolean('withTime')->after('user_id')->default(false);
            $table->integer('time_per_question')->after('withTime')->nullable();
            $table->integer('total_time')->after('time_per_question')->nullable();
            $table->foreignId('category_id')->nullable()->change();
            $table->string('title')->nullable()->change();
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
            $table->string('title')->change();
            $table->foreignId('category_id')->change();
            $table->dropColumn(['withTime', 'time_per_question', 'total_time']);
        });
    }
};
