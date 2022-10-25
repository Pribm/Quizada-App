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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notifier_id');
            $table->foreignId('notified_id');
            $table->longText('message');
            $table->boolean('opened_notification')->default(false);
            $table->enum('notification_type', [
                'friendship_request',
                'friendship_accepted',
                'quizz_request',
                'quizz_accepted',
                'quizz_complete',
                'admin_request',
                'admin_accepted',
            ]);
            $table->timestamps();

            $table->foreign('notifier_id')->references('id')->on('users');
            $table->foreign('notified_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
