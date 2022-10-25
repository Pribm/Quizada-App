<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\AppConfiguration;

class AppConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AppConfiguration::updateOrCreate([
            'id' => 1
        ], [
            'email' => 'quizada@gmail.com',
            'payment_button' => 'Colabore com as melhorias do app',
            'payment_title' => 'Ajude-nos nas atualizações e melhorias do app',
            'payment_text' => 'Contribua para que o projeto melhore à cada dia, qualquer contribuição é bem vinda!'
        ]);

    }
}
