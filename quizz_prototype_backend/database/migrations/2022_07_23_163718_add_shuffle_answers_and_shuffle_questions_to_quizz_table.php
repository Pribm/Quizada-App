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
            $table->boolean('shuffle_questions')->default(1)->after('total_time');
            $table->boolean('shuffle_answers')->default(1)->after('total_time');
            $table->enum('count_time', ['none','seconds', 'minutes'])->after('total_time')->default('none');
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
            $table->dropColumn(['count_time', 'shuffle_answers', 'shuffle_questions']);
        });
    }
};
