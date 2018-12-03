//Caso o botão de pesquisar seja clicado
document.querySelector('#btn-buscar').addEventListener('click', function (event) {
    //Previne que o formnulário seja submetido
    event.preventDefault();
    montarPainel();
});

//Definindo uma tarefa global 
    let tarefa = {};

//Função para montar os cartões
function montarPainel() {

    //Mapeando o painel de tarefas do DOM
    let painelTarefas = document.querySelector('#painelTarefas');
    painelTarefas.innerHTML = '';

    //Capturando o texto da busca
    let filtro = document.querySelector('#texto-busca').value;

    //Espera o resultado da função listarTarefas()
    let promise = listarTarefas(filtro);
    promise
        //Caso dê certo
        .then(function (response) {

            if (response == null) {
                //Caso não sejam encontradas tarefas
                mostrarMensagem('Nenhum tarefa encontrada para este filtro.', 'd');
            } else {
                //Caso sejam encontradas tarefas
                mostrarMensagem('Resultados carregados.', 's');
                response.forEach(function (item) {

                    //Criando o cartão
                    let cartao = document.createElement('div');
                    cartao.className = 'card';
                    cartao.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <div>
                                    <span class="card-subtitle mb-2 text-muted">${dataToString(item.data)}</span>
                                </div>
                                <p class="card-text">${item.descricao}</p>
                            </div>
                        </div>
                    `;
                    //Adicionando o cartão no painel de tarefas;
                    painelTarefas.appendChild(cartao);

                    cartao.addEventListener('click', function(event){
                        montarFormularioAlterar(item.id);
                        tarefa.id = item.id;
                    });
                });
            }
        })

        //Caso dê errado
        .catch(function (error) {
            console.log(error);
        });
}
//Quando o botão adicionar tarefa for clicado
document.querySelector('#btn-adicionar').addEventListener('click', function (event) {

    event.preventDefault();

    //Carrega o modal
    $('#modal').modal('show');

    //Muda o layout do modal
    document.querySelector('#btn-inserir').classList.remove('nao-mostrar');
    document.querySelector('#btn-alterar').classList.add('nao-mostrar');
    document.querySelector('#btn-deletar').classList.add('nao-mostrar');
    document.querySelector('.modal-title').innerHTML = 'Inserir nova tarefa';

    //Settando o focus no campo descricao-tarefa
    document.querySelector('#descricao-tarefa').focus();

    //Limpando os campos do formulário
    document.querySelector('#descricao-tarefa').value = '';
    document.querySelector('#data-tarefa').value = '';
    document.querySelector('#status-tarefa').checked = false;
});

//Quando o botão inserir for clicado
document.querySelector('#btn-inserir').addEventListener('click', function (event) {
    event.preventDefault();
    inserir();
});

//Função para inserir dados via API
function inserir() {

    //Capturar os dados do formulário
    let descricao = document.querySelector('#descricao-tarefa').value;
    let data = document.querySelector('#data-tarefa').value;
    let realizado = document.querySelector('#status-tarefa').checked;
    console.log(realizado);
    

    //Criando um objeto tarefa
    let tarefa = {};
    tarefa.descricao = descricao;
    tarefa.data = data;
    tarefa.realizado = realizado;
    

    //Inserir uma nova tarefa
    let promise = inserirTarefa(tarefa);
    promise
        .then(function (response) {
            mostrarMensagem('Tarefa inserida com sucesso!', 's');
            montarPainel();
        })
        .catch(function (erro) {
            mostrarMensagem(erro, 'd');
        });

    //Mostrar o modal
    $('#modal').modal('toggle');
}

//Função que monsta o formulário para alterar
function montarFormularioAlterar(id) {
    let promise = listarTarefaPorId(id);
    promise
        .then(function (tarefa) {
            console.log(tarefa);
            document.querySelector('#idTarefa').value = tarefa.id;
            document.querySelector('#descricao-tarefa').value = tarefa.descricao;
            document.querySelector('#data-tarefa').value = dataToInput(tarefa.data);
            document.querySelector('#status-tarefa').checked = tarefa.realizado;

            //Carrega o modal
            $('#modal').modal('show');

            //Muda o layout do modal
            document.querySelector('#btn-inserir').classList.add('nao-mostrar');
            document.querySelector('#btn-alterar').classList.remove('nao-mostrar');
            document.querySelector('#btn-deletar').classList.remove('nao-mostrar');
            document.querySelector('.modal-title').innerHTML = 'Alterar tarefa';

            //Settando o focus no campo descricao-tarefa
            document.querySelector('#descricao-tarefa').focus();


        })
        .catch(function (erro) {
            mostrarMensagem(erro, 'd');
        });
}

//Quando o botão alterar for clicado
document.querySelector('#btn-alterar').addEventListener('click', function(event){
    event.preventDefault();

    //Dados do formulário
    tarefa.descricao = document.querySelector('#descricao-tarefa').value;
    tarefa.data = document.querySelector('#data-tarefa').value;
    tarefa.realizado = document.querySelector('#status-tarefa').checked;
    console.log(tarefa.realizado);
    

    let promisse = alterarTarefa(tarefa);
    promisse
        .then(function(resolve){
            montarPainel();
            mostrarMensagem('Tarefa alterada com sucesso!', 's');
        })
        .catch(function(erro){
            mostrarMensagem(erro, 'd');
        });

        //Fechar o modal
        $('#modal').modal('toggle');
});

//Quanto clicar no btn-deletar
document.querySelector('#btn-deletar').addEventListener('click',function(event){
    event.preventDefault();

    let promise = deletarTarefa(tarefa.id);
    promise
        .then(function(resolve){
            montarPainel();
            mostrarMensagem('Tarefa deletada com sucesso!', 's');
        })
        .catch(function(error){
            mostrarMensagem(error, 'd');
        });

    //Fechar o modal
    $('#modal').modal('toggle');
});