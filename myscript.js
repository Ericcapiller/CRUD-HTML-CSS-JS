//JAVASCRIPT

//quando a pagina carregar
window.onload = function () {
	listar();
	document.getElementById('frmCadastro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmCadastro').addEventListener('submit', listar);
}

//variavel global
var idAlterar = null;

function exibirFormulario() {
	document.getElementById('div-form').style.display = 'block';
}

//Evento do botao cadastrar/salvar (verificação)
function adicionarOuAlterar(e) {
	var nom = document.getElementById('txtNome').value;
	var p = {
		nome: !nom ? "sem nome" : nom, //mesmo que if(nom = ""){ nom = "sem nome";}
		nasc: new Date(document.getElementById('dtpDataNascimento').value.replace("-", "/")),
		email: document.getElementById('txtEmail').value
	}

	if (idAlterar == null)
		adicionar(p);
	else if (idAlterar > 0)
		alterar(p);
	else
		alert("Ação desconhecida");

	//bloqueia a ação de atualização do browser
	e.preventDefault();
}

function adicionar(p) {
	var pessoas = [];
	var idValido = 1;
	//se já possuir o localStorage, adiciono no array	
	if (localStorage.getItem('value') !== null) {
		pessoas = JSON.parse(localStorage.getItem('value')); //captura o array de objetos(JSON);

		if (pessoas.length > 0)
			idValido = (function obterIdValido() {	//Função Auto-executável
				//percorre verificando se tiver "buraco" entre os numeros
				for (var i = 0; i < pessoas.length; i++)
					if (pessoas[i].Id != i + 1)
						return i + 1;
				//se nao achar, retorna o id posterior da ultima pessoa
				return pessoas[pessoas.length - 1].Id + 1;
			})();
	}

	var pessoa = {
		Id: idValido,
		Nome: p.nome,
		DataNascimento: p.nasc.toLocaleString("pt-BR").substring(0, 10),
		Email: p.email,
	};

	//Adiciona o objeto ao ultimo indice do array
	pessoas.push(pessoa);
	//Ordeno o array pelo ID do objeto
	pessoas.sort(function (a, b) {
		return a.Id - b.Id;
	});
	//armazena no Localstorage
	localStorage.setItem('value', JSON.stringify(pessoas));
	//reseta os campos do formulario
	document.getElementById('frmCadastro').reset();
}

function alterar(p) {
	var btn = document.getElementById('btnCadastrarSalvar');

	pessoas = JSON.parse(localStorage.getItem('value'));
	//substituir as informaçoes
	for (var i = 0; i < pessoas.length; i++) {
		if (pessoas[i].Id == idAlterar) {
			pessoas[i].Nome = p.nome;
			pessoas[i].DataNascimento = p.nasc.toLocaleString("pt-BR").substring(0, 10);
			pessoas[i].Email = p.email;

			btn.value = "Cadastrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(pessoas));
			document.getElementById('frmCadastro').reset();
			break;
		}
	}
}

//função do botao Alterar
function prepararAlterar(idRow) {
	document.getElementById('btnCadastrarSalvar').value = "Salvar";

	var txtNome = document.getElementById('txtNome'),
		dtpDataNascimento = document.getElementById('dtpDataNascimento'),
		rdoMasculino = document.getElementById('rdoMasculino'),
		rdoFeminino = document.getElementById('rdoFeminino');

	var pessoas = JSON.parse(localStorage.getItem('value'));
	for (var i = 0; i < pessoas.length; i++) {
		if (pessoas[i].Id == idRow) {
			//popular os campos
			txtNome.value = pessoas[i].Nome;
			dtpDataNascimento.value = pessoas[i].DataNascimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'); //caso fosse tipo date toISOString().substring(0, 10);
			txtEmail.value = pessoas[i].Email;

			//recarrega a lista para limpar o th com background alterado
			listar();
			//coloco ID null (caso clicar em varios botao alterar)
			idAlterar = null;
			if (idAlterar === null) {
				//mudar o background da nova linha
				var th = document.getElementById("rowTable" + i);
				th.className = "estadoAlteracao";
			}

			//atribuir o Id a variavel global
			idAlterar = pessoas[i].Id;
			break;
		}
	}
}

function excluir(cod) {
	if (confirm("Deseja realmente deletar este usuário?") == true) {
		var pessoas = JSON.parse(localStorage.getItem('value'));

		for (var i = 0; i < pessoas.length; i++)
			if (pessoas[i].Id == cod)
				pessoas.splice(i, 1);


		localStorage.setItem('value', JSON.stringify(pessoas));
		listar();

		//se nao possuir mais nenhum registro, limpar o storage
		if (pessoas.length == 0)
			window.localStorage.removeItem("value");
	}
}

function listar() {
	//se nao possuir nenhum local storage, nao fazer nada
	if (localStorage.getItem('value') === null)
		return;

	//captura os objetos de volta
	var pessoas = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");

	//limpar o body toda vez que atualizar
	tbody.innerHTML = '';

	for (var i = 0; i < pessoas.length; i++) {
		var id = pessoas[i].Id,
			nome = pessoas[i].Nome,
			nasc = pessoas[i].DataNascimento,
			email = pessoas[i].Email

		tbody.innerHTML += '<tr id="rowTable' + i + '">' +
			'<td>' + id + '</td>' +
			'<td>' + nome + '</td>' +
			'<td>' + nasc + '</td>' +
			'<td>' + email + '</td>' +
			'<td><button class="btn-delete" onclick="excluir(\'' + id + '\')">Excluir</button><button class="btn-edit" monclick="prepararAlterar(\'' + id + '\')">Alterar</button></td>' +
			'</tr>';
	}
}
							//'<td class="celTable'+i+'">'+id+'</td>'+
