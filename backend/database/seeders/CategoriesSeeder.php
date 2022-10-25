<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categories;
use Illuminate\Support\Facades\Storage;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['name' => 'Conhecimentos gerais', 'image' => 'quizz_categories/conhecimentos_gerais.jpg', 'user_id' => 1],
            ['name' => 'Filmes e Séries', 'image' => 'quizz_categories/filmes_e_series.jpg', 'user_id' => 1],
            ['name' => 'Matemática', 'image' => 'quizz_categories/matematica.jpg', 'user_id' => 1],
            ['name' => 'Ciência', 'image' => 'quizz_categories/ciencia.jpg', 'user_id' => 1],
            ['name' => 'Literatura', 'image' => 'quizz_categories/literatura.jpg', 'user_id' => 1],
            ['name' => 'Variedades', 'image' => 'quizz_categories/variedades.jpg', 'user_id' => 1],
            ['name' => 'Games', 'image' => 'quizz_categories/games.jpg', 'user_id' => 1],
            ['name' => 'Medicina', 'image' => 'quizz_categories/medicina.jpg', 'user_id' => 1],
            ['name' => 'Programação', 'image' => 'quizz_categories/programacao.jpg', 'user_id' => 1],
            ['name' => 'Língua Portuguesa', 'image' => 'quizz_categories/lingua_portuguesa.jpg', 'user_id' => 1],
            ['name' => 'Religião', 'image' => 'quizz_categories/religiao.jpg', 'user_id' => 1],
            ['name' => 'Música', 'image' => 'quizz_categories/musica.jpg', 'user_id' => 1],
        ];

        Categories::insert($categories);

    }
}
