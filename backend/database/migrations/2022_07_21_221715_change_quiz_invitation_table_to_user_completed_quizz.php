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
        Schema::table('user_completed_quizz', function (Blueprint $table) {
            $table->rename('quizz_invitation');
            $table->boolean('invitation_accepted')->default(0)->after('user_id');
            $table->boolean('quizz_complete')->default(0)->after('invitation_accepted');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quizz_invitation', function (Blueprint $table) {
            $table->dropColumn(['quizz_complete', 'invitation_accepted']);
            $table->rename('user_completed_quizz');
        });
    }
};
