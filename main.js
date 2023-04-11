const btnAdicionarTarefa = document.querySelector('#btn-adicionarTarefa')
const btnSalvar = document.querySelector('#btn-salvar')
const form = document.querySelector('#form-tarefas')
const tarefasList = document.querySelector('.tarefas')
const btnEditTarefa = document.querySelector('.btn-editar')
const btnCancelar = document.querySelector('#btn-cancelar')
const modal = document.getElementById('adicionarTarefaModal')
const aviso = document.querySelector('.aviso')
const inputs = document.querySelectorAll('form .input')
let dados = [];

btnCancelar.addEventListener('click', () => {
    inputs.forEach(el => {
        el.value = "";
    })

    btnSalvar.innerText = "Adicionar tarefa"
    fechaModal(modal)
})

btnAdicionarTarefa.addEventListener('click', () => iniciaModal(modal))

form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    if (!form.dataset.tarefaId) {

        let tarefa = { id: gerarId() };

        inputs.forEach(el => {
            tarefa[el.name] = el.value
            el.value = "";
        })

        dados.push(tarefa)
        listaTarefa(tarefa)

    } else { //editando tarefa

        dados.forEach(tarefa => {

            if (tarefa.id === form.dataset.tarefaId) {

                inputs.forEach(el => {

                    if (tarefa[el.name]) {
                        tarefa[el.name] = el.value
                        el.value = "";
                    }

                })

                listaTarefa(tarefa, tarefa.id)

                form.dataset.tarefaId = "";

            }

        })

    }

    aviso.style.display = 'none'
    fechaModal(modal)

})

function listaTarefa(tarefa, id = null) {

    if (id) {

        const tarefaElement = tarefasList.querySelector(`[data-id="${tarefa.id}"]`);
        tarefaElement.querySelector('.tarefa-titulo').innerText = tarefa.titulo
        tarefaElement.querySelector('.tarefa-descricao').innerText = tarefa.descricao

    } else {

        const listaTarefaHTML = `
        <li class="tarefas-item" data-id="${tarefa.id}">
            <div class="tarefa-checkbox">
                <button type="button" id="btn-concluirTarefa" onClick="concluirTarefa(this, '${tarefa.id}')">
                    <div class="tarefa-checkbox-circulo">
                        <svg width="24" height="24">
                            <path fill="currentColor"
                                d="M11.23 13.7l-2.15-2a.55.55 0 0 0-.74-.01l.03-.03a.46.46 0 0 0 0 .68L11.24 15l5.4-5.01a.45.45 0 0 0 0-.68l.02.03a.55.55 0 0 0-.73 0l-4.7 4.35z">
                            </path>
                        </svg>
                    </div>
                </button>
            </div>
            <div class="tarefa-conteudo">
                <div class="tarefa-titulo-container">
                    <div class="tarefa-titulo">${tarefa.titulo}</div>
                    <div class="tarefa-acoes">
                        <button type="button" class="btn-editar" onClick="editarTarefa('${tarefa.id.trim()}')">
                            <svg width="24" height="24">
                                <g fill="none" fill-rule="evenodd">
                                    <path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z">
                                    </path>
                                    <path stroke="currentColor"
                                        d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z">
                                    </path>
                                </g>
                            </svg>
                        </button>
                        <button type="button" class="btn-excluir" onClick="excluirTarefa('${tarefa.id.trim()}', 'Deseja realmente excluir essa tarefa ?')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h24v24H0z"></path>
                                    <rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5">
                                    </rect>
                                    <path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path>
                                    <path stroke="currentColor"
                                        d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z">
                                    </path>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="tarefa-descricao">
                    ${tarefa.descricao}
                </div>
            </div>
        </li>
    `

        tarefasList.innerHTML += listaTarefaHTML

    }

    localStorage.setItem('tarefas', JSON.stringify(dados))
}

function excluirTarefa(id, msgConfirm) {

    if (confirm(msgConfirm)) {
        dados.forEach((tarefa, i) => {
            if (tarefa.id === id) {

                dados.splice(i, 1)
                tarefasList.querySelector(`[data-id="${tarefa.id}"]`).remove()

            }

        })

        if (!dados.length) {
            aviso.style.display = 'block'
        }

        localStorage.setItem('tarefas', JSON.stringify(dados))

    }
}

function editarTarefa(id) {

    dados.forEach(tarefa => {

        if (tarefa.id === id) {

            preparaEdicao(tarefa)

        }
    })


}

function preparaEdicao(tarefa) {

    inputs.forEach(el => {
        if (tarefa[el.name]) {

            el.value = tarefa[el.name]

        }
    })

    form.dataset.tarefaId = tarefa.id
    btnSalvar.innerText = "Salvar"
    iniciaModal(modal)

}

function concluirTarefa(btn, id) {

    btn.classList.add("checked")

    excluirTarefa(id, 'Deseja realmente concluir essa tarefa ? ')

}

function gerarId() {
    let numeroAleatorio = Math.floor(Date.now() * Math.random()); //Arredonda para baixo um número inteiro
    let numeroFormatado = numeroAleatorio.toString().substring(0, 8) //limite de 8 caracteres
    return `task_${numeroFormatado}`
}

function iniciaModal(modal) {
    if (modal) {
        modal.classList.add('mostrar');
        modal.addEventListener('click', (e) => {
            if (e.target.id == 'fechar') {
                fechaModal(modal)
            }
        });
    }
}

function fechaModal(modal) {
    modal.classList.remove('mostrar');

    form.dataset.tarefaId = "";

    inputs.forEach(el => {
        el.value = ""
    })

}
document.addEventListener('DOMContentLoaded', () => {

    const tarefas = JSON.parse(localStorage.getItem('tarefas'))

    dados = []

    if (tarefas.length) {

        for (let tarefa of tarefas) {

            dados.push(tarefa)
            listaTarefa(tarefa)


        }

        aviso.style.display = 'none'

    }

})

