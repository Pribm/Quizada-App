<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Score;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory(50)->has(Score::factory()->count(1)->state(function(array $attributes, User $u){
            return [
                'user_id' => $u->id,
            ];
        }))->create();

    }
}
