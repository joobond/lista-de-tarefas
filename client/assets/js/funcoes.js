//Caso o botão de pesquisar seja clicado
document.querySelector('#btn-buscar').addEventListener('click', function(event){
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
        .then(function(response){

            if(response == null){
                //Caso não sejam encontradas tarefas
                mostrarMensagem('Nenhum tarefa encontrada para este filtro.', 'd');
            } else{
                //Caso sejam encontradas tarefas
                mostrarMensagem('Resultados carregados.', 's');
                response.forEach(function(item){
    
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
        .catch(function(error){
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