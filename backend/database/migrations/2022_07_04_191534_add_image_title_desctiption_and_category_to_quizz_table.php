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
            $table->string('title')->after('id');
            $table->string('image')->after('title')->nullable();
            $table->longText('description')->after('image')->nullable();
            $table->foreignId('category_id')->default(1)->after('image');
            $table->boolean('random_generated')->after('image')->default(0);

            $table->foreign('category_id')->references('id')->on('categories');
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
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            $table->dropColumn('description');
            $table->dropColumn('image');
            $table->dropColumn('random_generated');
            $table->dropColumn('title');
        });
    }
};
