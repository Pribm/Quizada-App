<div align='center'>
  <img src='https://ik.imagekit.io/zbc999xfd/android-chrome-512x512__lpRY7qVP.png?ik-sdk-version=javascript-1.4.3&updatedAt=1663275197816' alt='quizada app' width='120'/>
</div>


<h1 align='center'>Quizada, crie quizzes e compartilhe com seus amigos</h1>

[![NPM](https://img.shields.io/apm/l/react)](https://github.com/Pribm/Sistema_Agendamento_Policlinica/blob/main/LICENSE)

## Sobre
<p>Uma aplicação desenvolvida com a finalidade de criar quizzes personalizados e compartilhá-los através de uma rede social de jogadores.</p>

# Test Application

## Teste local
> Após clonar o projeto, realize os seguintes passos :

### Dentro da pasta frontend:
- Use o comando `npm i` no seu terminal para instalar todas as dependências do pacote.
- Use o comando `npm start` para executar o frontend na máquina local.

### Dentro da pasta backend:

#### Configurações do arquivo .env:
- Configure o seu arquivo `.env` na raiz da pasta de backend com os atributos do banco de dados a ser executado no ambiente de desenvolvimento, o banco de dados utilizado no desenvolvimento do projeto foi o mySql, siga as instruções abaixo:
1. Crie um arquivo .env e copie e cole o conteúdo de .env.example para ele;
2. Crie o seu banco de dados relacional e o configure-o no arquivo .env;
3. Use o comando `php artisan key:generate` para gerar as novas chaves do aplicativo:
```

- Use o comando `composer install` no terminal para poder instalar todas as dependências para rodar o servidor.
- Execute o comando `php artisan passport:install`
- Execute o comando `php artisan migrate`


DB_CONNECTION=<your_database_connection>
DB_HOST=<your localhost adress>
DB_PORT=<your localhost port>
DB_DATABASE=<the name of your database>
DB_USERNAME=<your database username>
DB_PASSWORD=<your database password>
```

3. Para testar localmente a recuperação de senha, você precisa configurar o servidor SMTP no arquivo .env:
```
MAIL_MAILER=smtp
MAIL_HOST=<your email host adress>
MAIL_PORT=<your email host port>
MAIL_USERNAME=<your email host name>
MAIL_PASSWORD=<your email host password>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=<your app email adress>
MAIL_FROM_NAME="${APP_NAME}"
```

4. Para configurar o seu servidor oauth, você precisa configurar suas credenciais geradas ao instalar o pacote Laravel passport, você pode encontrá-las no seu banco de dados:
```
PASSPORT_CLIENT_ID=<your oauth passord client id>
PASSPORT_CLIENT_SECRET=<your oauth client secret>
```
5. Como alguns dados semeados provém de procedimentos de webscrapping, é possível que algumas fontes de dados estejam fora do ar ou os links usados para fazer a raspagem precisem de ajustes. O arquivo com a lógica de webscrapping se encontra no caminho `app/Controllers/WebScrappers`;

 6. Execute `php artisan seed` para semear o banco de dados.

## Teste Online
> Você pode encontrar a aplicação no ar no seguinte link: https://quizada.com.br


# Tecnologias utilizadas

## Backend
- PHP
- Laravel
- MySql
> O backend foi desenvolvido utilizando o framework Laravel na versão 8, e o banco de dados utilizado foi o mySql com o table Schema do InnoDb;

## Esquema do banco de dados:

<div align='center'>
  <img src='https://ik.imagekit.io/zbc999xfd/uml_U8w7WH4kD.png?ik-sdk-version=javascript-1.4.3&updatedAt=1663274953513' alt='logo cardoso fontes' width='100%'/>
</div>


## Frontend
- React/Redux
- Material Ui
- Bootstrap

> As requisições para o servidor foram feitas utilizando o pacote do axios;

## Autor

Paulo Vinícius Ribeiro Monteiro



