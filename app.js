
const apiUrl = 'http://10.105.196.6:3002';


function carregarTurmas() {
  fetch(`${apiUrl}/turmas`)
    .then(response => response.json())
    .then(turmas => {
      const selectEditar = document.getElementById('selecionar-turma');
      const selectExcluir = document.getElementById('turma-excluir');
      const selectAdicionar = document.getElementById('selecionar-turma-adicionar');
      const selectTurmasHorarios = document.getElementById('turma-excluir-horarios');
      const selectHorariosIniciais = document.getElementById('horario-inicio');


      selectEditar.innerHTML = '';
      selectExcluir.innerHTML = '';
      selectAdicionar.innerHTML = '';
      selectTurmasHorarios.innerHTML = '';
      selectHorariosIniciais.innerHTML = '';

      // preencher os campos de select
      turmas.forEach(turma => {
        const optionEditar = document.createElement('option');
        optionEditar.value = turma.id;
        optionEditar.textContent = `${turma.codigo_turma} - ${turma.nome}`;
        selectEditar.appendChild(optionEditar);

        const optionExcluir = document.createElement('option');
        optionExcluir.value = turma.id;
        optionExcluir.textContent = `${turma.codigo_turma} - ${turma.nome}`;
        selectExcluir.appendChild(optionExcluir);

        const optionAdicionar = document.createElement('option');
        optionAdicionar.value = turma.codigo_turma;
        optionAdicionar.textContent = `${turma.codigo_turma} - ${turma.nome}`;
        selectAdicionar.appendChild(optionAdicionar);

        const optionTurmasHorarios = document.createElement('option');
        optionTurmasHorarios.value = turma.codigo_turma;
        optionTurmasHorarios.textContent = `${turma.codigo_turma} - ${turma.nome}`;
        selectTurmasHorarios.appendChild(optionTurmasHorarios);

      });

    })
    .catch(error => console.error('Erro ao carregar turmas:', error));
}

// carregar os horários de início
function carregarHorariosInicio() {
  fetch(`${apiUrl}/opcoes_horarios`)
    .then(response => response.json())
    .then(horarios => {
      const selectHorariosIniciais = document.getElementById('horario-inicio');
      selectHorariosIniciais.innerHTML = ''; 

      // adicionar as opções de horários
      horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario.hora;
        option.textContent = horario.hora;
        selectHorariosIniciais.appendChild(option);
      });
    })
    .catch(error => console.error('Erro ao carregar horários de início:', error));
}


window.addEventListener('load', () => {
  carregarTurmas();
  carregarHorariosInicio(); 
});




// carregar os horários de uma turma específica
function carregarHorariosPorTurma(codigoTurma) {
  fetch(`${apiUrl}/horarios`)
    .then(response => response.json())
    .then(horarios => {
      const selectExcluirHorario = document.getElementById('horario-excluir');
      const selectTurmasHorarios = document.getElementById('turma-excluir-horarios');
      selectExcluirHorario.innerHTML = '';
      
      // filtrar os horários pela turma escolhida
      const horariosFiltrados = horarios.filter(horario => horario.codigo_turma === codigoTurma);

      // gerar as opções de horários
      horariosFiltrados.forEach(horario => {
        const optionExcluir = document.createElement('option');
        optionExcluir.value = horario.id; // Usando o id da aula como valor
        optionExcluir.textContent = `${horario.disciplina} (${horario.dia_aula})`; // Exibindo a disciplina e o dia da aula
        selectExcluirHorario.appendChild(optionExcluir);
      });
    })
    .catch(error => console.error('Erro ao carregar horários:', error));
}

// carregar os horários ao selecionar a turma
document.getElementById('turma-excluir').addEventListener('change', function () {
  const codigoTurma = this.value;
  if (codigoTurma) {
    carregarHorariosPorTurma(codigoTurma); // Carregar os horários baseados no código da turma
  }
});

// excluir uma aula
function excluirAula(event) {
  event.preventDefault();

  const aulaExcluirSelect = document.getElementById('horario-excluir');
  const aulaId = aulaExcluirSelect.value;

  if (!aulaId) {
    alert('Por favor, selecione uma aula para excluir!');
    return;
  }


  fetch(`${apiUrl}/horarios/${aulaId}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        alert('Aula excluída com sucesso!');
        const turmaSelecionada = document.getElementById('turma-excluir-horarios').value;
        carregarHorariosPorTurma(turmaSelecionada); // Recarregar os horários da turma selecionada
      } else {
        alert('Erro ao excluir a aula!');
      }
    })
    .catch(error => console.error('Erro ao excluir aula:', error));
}

// Adicionar evento de mudança para carregar os horários ao selecionar a turma
document.getElementById('turma-excluir-horarios').addEventListener('change', function () {
  const codigoTurma = this.value;
  if (codigoTurma) {
    carregarHorariosPorTurma(codigoTurma); // Carregar os horários baseados no código da turma
  }
});

// evento de exclusão de aula
document.getElementById('form-excluir-horario').addEventListener('submit', excluirAula);




// Fcriar uma nova turma
document.getElementById('form-criar').addEventListener('submit', function(event) {
  event.preventDefault();

  const codigoTurma = document.getElementById('id_turma').value;
  const nomeTurma = document.getElementById('nome_turma').value;
  const quantidadeAlunos = document.getElementById('quantidade_alunos').value;
  const horarioAlmoco = document.getElementById('novo-horario-almoco').value;

  const novaTurma = {
    codigo_turma: codigoTurma,
    nome: nomeTurma,
    quantidade_alunos: quantidadeAlunos,
    horario_almoco: horarioAlmoco
  };

  fetch(`${apiUrl}/turmas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaTurma)
  })
    .then(response => response.json())
    .then(() => carregarTurmas())
    .catch(error => console.error('Erro ao criar turma:', error));
});




// criar uma nova aula
document.getElementById('form-adicionar-horarios').addEventListener('submit', function(event) {
  event.preventDefault();

  const codigoTurma = document.getElementById('selecionar-turma-adicionar').value;
  const diaAula = document.getElementById('dia-aula').value;
  const formatoAula = document.getElementById('formato-aula').value;
  const quantidadeAulas = document.getElementById('quantidade-aulas').value;
  const horarioInicio = document.getElementById('horario-inicio').value;
  const disciplina = document.getElementById('disciplina').value;
  const professor = document.getElementById('professor').value;
  const sala = document.getElementById('sala').value;

  const novaAula = {
    codigo_turma: codigoTurma,
    dia_aula: diaAula,
    formato_aula: formatoAula,
    quantidade_aulas: quantidadeAulas,
    horario_inicio: horarioInicio,
    disciplina: disciplina,
    professor: professor,
    sala: sala
  };

  fetch(`${apiUrl}/horarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaAula)
  })
    .then(response => response.json())
    .then(() => alert('Aula adicionada com sucesso!'))
    .catch(error => console.error('Erro ao adicionar aula:', error));
});




// editar uma turma
document.getElementById('form-editar-turma').addEventListener('submit', function(event) {
  event.preventDefault();

  const codigoTurma = document.getElementById('selecionar-turma').value;
  const novoNomeTurma = document.getElementById('novo-nome-turma').value;
  const novaQuantidadeAlunos = document.getElementById('nova-quantidade-alunos').value;
  const novoHorarioAlmoco = document.getElementById('novo-horario-almoco').value;

  const turmaAtualizada = {
    nome: novoNomeTurma,
    quantidade_alunos: novaQuantidadeAlunos,
    horario_almoco: novoHorarioAlmoco
  };

  fetch(`${apiUrl}/turmas/${codigoTurma}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(turmaAtualizada)
  })
    .then(response => response.json())
    .then(() => carregarTurmas())
    .catch(error => console.error('Erro ao editar turma:', error));
});




// excluir uma turma
function excluirTurma(event) {
  event.preventDefault();

  const turmaExcluirSelect = document.getElementById('turma-excluir');
  const turmaId = turmaExcluirSelect.value;

  if (!turmaId) {
    alert('Por favor, selecione uma turma para excluir!');
    return;
  }

  fetch(`${apiUrl}/turmas/${turmaId}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        alert('Turma excluída com sucesso!');
        carregarTurmas();
      } else {
        alert('Erro ao excluir a turma!');
      }
    })
    .catch(error => console.error('Erro ao excluir turma:', error));
}


document.getElementById('form-excluir-turma').addEventListener('submit', excluirTurma);
