<div style="display: flex;
width: 100%;
min-height: 100vh;
flex-direction: column;
align-items: center;
justify-content: center;
font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
    <div style="width: 60%; margin-left: auto; margin-right: auto; text-align: center;">
        <img src="{{ asset('img/logo.svg') }}" alt="logo Quizada" width="120">
        <h1>Falta pouco para você Começar a criar seu quizz no Quizada!</h1>
        <h2>Este é um email de verificação, você não precisa responder, clique no botão abaixo para verificar se seu email é válido!</h2>
        <a href={{$url}} style="background-color: steelblue; text-decoration: none; color:white; padding: 5px; border-radius: 10px; margin-top: 20px;">Verifique seu E-mail</a>
    </div>
</div>
