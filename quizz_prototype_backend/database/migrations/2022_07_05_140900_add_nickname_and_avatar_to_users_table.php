<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Dirape\Token\Token;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nickname')->after('name')->nullable();
            $table->string('avatar')->after('nickname')->nullable();
            $table->boolean('custom_avatar')->after('avatar')->default(0);
        });

        $users = User::all();

        foreach ($users as $user) {
            $user->update(['nickname' => (new Token())->Unique('quizz', 'token', 6)]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('nickname')->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar');
            $table->dropColumn('nickname');
        });
    }
};
