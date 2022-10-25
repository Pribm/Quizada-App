<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Categories;
use App\Models\User;


class QuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Http::post(env('APP_URL').'api/webscrapping',[
            'url' => 'https://www.todamateria.com.br/jogos-de-conhecimentos-gerais/',
            'category' => 'Conhecimentos gerais'
        ]);

        Http::post(env('APP_URL').'api/webscrapping',[
            'url' => 'https://www.todamateria.com.br/perguntas-respostas-conhecimentos-gerais-nivel-dificil/',
            'regex_correct_answer' => '/(?<=:\s).*(?=\))/',
            'category' => 'Conhecimentos gerais (Difícil)'
        ]);

        Http::post(env('APP_URL').'api/webscrapping',[
            'url' => 'https://www.todamateria.com.br/perguntas-e-respostas-de-conhecimentos-gerais/',
            'category' => 'Conhecimentos gerais (Difícil)'
        ]);


        Http::post(env('APP_URL').'api/webscrapping',[
            'url' => 'https://www.todamateria.com.br/questoes-de-conhecimentos-gerais-e-atualidades/',
            'regex_question' => '/<p>(.*?)<\/p>/',
            'category' => 'Atualidades'
        ]);
    }
}
