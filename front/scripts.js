/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/flights';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.flights.forEach(item => insertList(item.name, 
                                                item.day, 
                                                item.week,
                                                item.airline,
                                                item.flight_no,
                                                item.tail,
                                                item.origin,
                                                item.destination,
                                                item.dep_delay,
                                                item.schedule_arrival,
                                                item.delay
                                              ))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar a tabela antes de recarregar os dados
  --------------------------------------------------------------------------------------
*/
const clearTable = () => {
  var table = document.getElementById('myTable');
  // Remove todas as linhas exceto o cabeçalho (primeira linha)
  while(table.rows.length > 1) {
    table.deleteRow(1);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para recarregar a lista completa do servidor
  --------------------------------------------------------------------------------------
*/
const refreshList = async () => {
  clearTable();
  await getList();
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
// Carrega a lista apenas uma vez quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
  getList();
});




/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputFlight, inputDay, inputWeek,
                        inputAirline, inputFlightNo, inputTail, 
                        inputOrigin, inputDestination, inputDepDelay, inputScheduleArrival) => {
    
  const formData = new FormData();
  formData.append('name', inputFlight);
  formData.append('day', inputDay);
  formData.append('week', inputWeek);
  formData.append('airline', inputAirline);
  formData.append('flight_no', inputFlightNo);
  formData.append('tail', inputTail);
  formData.append('origin', inputOrigin);
  formData.append('destination', inputDestination);
  formData.append('dep_delay', inputDepDelay);
  formData.append('schedule_arrival', inputScheduleArrival);

  let url = 'http://127.0.0.1:5000/flight';
  return fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      return data; // Retorna os dados do voo com a análise
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertDeleteButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/flight?name='+item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com voo e dados 
  --------------------------------------------------------------------------------------
*/
const newItem = async (event) => {
  event.preventDefault();

  let inputFlight = document.getElementById("newInput").value;
  let inputDay = document.getElementById("newDay").value;
  let inputWeek = document.getElementById("newWeek").value;
  let inputAirline = document.getElementById("newAirline").value;
  let inputFlightNo = document.getElementById("newFlightNo").value;
  let inputTail = document.getElementById("newTail").value;
  let inputOrigin = document.getElementById("newOrigin").value;
  let inputDestination = document.getElementById("newDestination").value;
  let inputDepDelay = document.getElementById("newDepDelay").value;
  let inputScheduleArrival = document.getElementById("newScheduleArrival").value;

  // Verifique se o nome do produto já existe antes de adicionar
  const checkUrl = `http://127.0.0.1:5000/flights?nome=${inputFlight}`;
  fetch(checkUrl, {
    method: 'get'
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.flights && data.flights.some(item => item.name === inputFlight)) {
        alert("O voo já está cadastrado.\nCadastre o voo com um nome diferente ou atualize o existente.");
      } else if (inputFlight === '') {
        alert("O nome do voo não pode ser vazio!");
      } else if (isNaN(inputDay) || isNaN(inputWeek) || isNaN(inputAirline) || isNaN(inputFlightNo) || isNaN(inputTail) || isNaN(inputOrigin) || isNaN(inputDestination) || isNaN(inputDepDelay) || isNaN(inputScheduleArrival)) {
        alert("Esse(s) campo(s) precisam ser números!");
      } else {
        try {
          // Envia os dados para o servidor e aguarda a resposta com o diagnóstico
          const result = await postItem(inputFlight, inputDay, inputWeek, inputAirline, inputFlightNo, inputTail, inputOrigin, inputDestination, inputDepDelay, inputScheduleArrival);
            // Limpa o formulário
          document.getElementById("newInput").value = "";
          document.getElementById("newDay").value = "";
          document.getElementById("newWeek").value = "";
          document.getElementById("newAirline").value = "";
          document.getElementById("newFlightNo").value = "";
          document.getElementById("newTail").value = "";
          document.getElementById("newOrigin").value = "";
          document.getElementById("newDestination").value = "";
          document.getElementById("newDepDelay").value = "";
          document.getElementById("newScheduleArrival").value = "";
          
          // Recarrega a lista completa para mostrar o novo voo com a análise
          await refreshList();
          
          // Mostra mensagem de sucesso com a análise
          const analise = result.delay === 1 ? "COM ATRASO" : "SEM ATRASO";
          alert(`Voo adicionado com sucesso!\nAnálise: ${analise}`);
          
          // Scroll para a tabela para mostrar o novo resultado
          document.querySelector('.items').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
        } catch (error) {
          console.error('Erro ao adicionar o voo:', error);
          alert("Erro ao adicionar o voo. Tente novamente.");
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Erro ao verificar voo existente. Tente novamente.");
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameFlight, day, week, airline, flight_no, tail, origin, destination, dep_delay, schedule_arrival, delay) => {
  var item = [nameFlight, day, week, airline, flight_no, tail, origin, destination, dep_delay, schedule_arrival];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  // Insere as células com os dados do flight
  for (var i = 0; i < item.length; i++) {
    var cell = row.insertCell(i);
    if (i==2)
      if (item[i]==1)
        cell.textContent="Sunday"
      else if (item[i]==2)
        cell.textContent="Monday"
      else if (item[i]==3)
        cell.textContent="Tuesday"
      else if (item[i]==4)
        cell.textContent="Wednesday"
      else if (item[i]==5)
        cell.textContent="Thursday"
      else if (item[i]==6)
        cell.textContent="Friday"
      else
        cell.textContent="Saturday"
    else
      cell.textContent = item[i];
  }

  // Insere a célula da analise com styling
  var analysisCell = row.insertCell(item.length);
  const analysisText = delay === 1 ? "COM ATRASO" : "SEM ATRASO";
  analysisCell.textContent = analysisText;
  
  // Aplica styling baseado no diagnóstico
  if (delay === 1) {
    analysisCell.className = "analysis-positive";
  } else {
    analysisCell.className = "analysis-negative";
  }

  // Insere o botão de deletar
  var deleteCell = row.insertCell(-1);
  insertDeleteButton(deleteCell);

  removeElement();
}