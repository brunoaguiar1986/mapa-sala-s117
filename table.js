fetch('db.json')
  .then(response => response.json())
  .then(data => {
    const turmas = data.turmas;
    const horarios = data.horarios;

    const diasSemana = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const horariosAula = [
      '07:30 - 08:15', '08:15 - 09:00', '09:15 - 10:00', '10:00 - 10:45', '10:45 - 11:30',
      'Almoço',
      '13:00 - 13:45', '13:45 - 14:30', '14:45 - 15:30', '15:30 - 16:15', '16:15 - 17:00'
    ];

    const container = document.getElementById('tabelas-container');

    turmas.forEach(turma => {
      const tabela = document.createElement('table');
      tabela.border = '1';
      tabela.style.width = '90%';
      tabela.style.tableLayout = 'fixed';

      let cabecalho = `<tr><th style="width: 10%;">Período</th>`;
      diasSemana.forEach(dia => cabecalho += `<th style="width: 15%;">${dia.charAt(0).toUpperCase() + dia.slice(1)}</th>`);
      cabecalho += `</tr>`;

      let corpoTabela = '';
      const horarioAlmocoInicio = turma.horario_almoco;
      const horarioAlmocoFim = (parseInt(horarioAlmocoInicio.split(':')[0]) + 2) + ':' + (parseInt(horarioAlmocoInicio.split(':')[1]) + 30 === 60 ? '00' : '30');

      let ocupacao = {};
      let linhasProfessor = {};

      horariosAula.forEach((horario, index) => {
        if (horario === 'Almoço') {
          corpoTabela += `<tr><td colspan="${diasSemana.length + 1}" style="text-align:center; background-color:#a38787;"><strong>Almoço (${horarioAlmocoInicio} - ${horarioAlmocoFim})</strong></td></tr>`;
        } else {
          corpoTabela += `<tr><td style="width: 10%;">${horario}</td>`;

          diasSemana.forEach(dia => {
            let conteudoCelula = '';
            const aula = horarios.find(h => h.codigo_turma === turma.codigo_turma && h.dia_aula === dia && h.horario_inicio === horario.split(' - ')[0]);

            if (aula) {
              for (let i = 0; i < aula.quantidade_aulas; i++) {
                ocupacao[dia + (index + i)] = aula;
              }
              conteudoCelula = aula.disciplina;
            } else if (ocupacao[dia + index]) {
              conteudoCelula = ocupacao[dia + index].disciplina;
            }

            corpoTabela += `<td style="width: 15%; word-wrap: break-word;">${conteudoCelula}</td>`;

            if (ocupacao[dia + index] && (!ocupacao[dia + (index + 1)] || horariosAula[index + 1] === 'Almoço')) {
              if (!linhasProfessor[index]) linhasProfessor[index] = {};
              linhasProfessor[index][dia] = ocupacao[dia + index];
            }
          });
          corpoTabela += `</tr>`;

          if (linhasProfessor[index]) {
            corpoTabela += `<tr><td></td>`;
            diasSemana.forEach(d => {
              const aula = linhasProfessor[index][d];
              if (aula) {
                corpoTabela += `<td class="professores" style="color: #555; text-align: center;">Prof: ${aula.professor} <br> Sala: ${aula.sala}</td>`;
              } else {
                corpoTabela += `<td></td>`;
              }
            });
            corpoTabela += `</tr>`;
          }
        }
      });

      tabela.innerHTML = `<caption class=''>${turma.nome} (${turma.codigo_turma})</caption>` + cabecalho + corpoTabela;

      const wrapper = document.createElement('div');
      wrapper.classList.add('tabela-wrapper');
      wrapper.appendChild(tabela);
      container.appendChild(wrapper);
    });
  })
  .catch(error => console.error('Erro ao carregar os dados:', error));