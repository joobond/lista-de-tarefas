//Caso o botão de pesquisar seja clicado
document.querySelector('#btn-buscar').addEventListener('click', function (event) {
    //Previne que o formnulário seja submetido
    event.preventDefault();
    montarPainel();
});


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
                                    <span class="card-subtitle mb-2 text-muted">${item.data}</span>
                                </div>
                                <p class="card-text">${item.descricao}</p>
                            </div>
                        </div>
                    `;
                    //Adicionando o cartão no painel de tarefas;
                    painelTarefas.appendChild(cartao);
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

    //Criando um objeto tarefa
    let tarefa = {};
    tarefa.descricao = descricao;
    tarefa.data = data;
    tarefa.realizado = false;

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

            document.querySelector('#idTarefa').value = tarefa.id;
            document.querySelector('#descricao-tarefa').value = tarefa.descricao;
            document.querySelector('#data-tarefa').value = tarefa.data;

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