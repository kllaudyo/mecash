const 
  getRequestHeaders = (headers=null) => ({
      'Accept': 'application/json',
        ...headers
    })
;

export const
  
  getContas = () =>
    fetch('/contas', {method: 'GET', headers: getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  postConta = formData =>
    fetch(
      '/conta/' + (formData.get('id').toString() !== '0' ? formData.get('id') : ''),
      {method: 'POST', body:formData, headers:getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  deleteConta = id =>
    fetch('/conta/'+id, {method: 'DELETE', headers:getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  getConsultaCategorias = () =>
    fetch('/relatorio/por-categoria', {method:'GET', headers:getRequestHeaders()})
      .then( response => response.json())
      .catch(error => console.error(error))
  ,

  getCategorias = () =>
    fetch('/categorias', {method:'GET', headers:getRequestHeaders()})
      .then(response => response.json())
      .catch( error => console.error(error))
  ,

  postCategoria = formData =>
    fetch('/categoria/' + (formData.get('id').toString() !== '0' ? formData.get('id') : ''),
      {method: 'POST', body:formData, headers:getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  deleteCategoria = id =>
    fetch('/categoria/'+id, {method: 'DELETE', headers:getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  getMovimentos = (year, month) =>
    fetch(`/movimentos/${year}/${month}`, {method: 'GET', headers: getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  postMovimento = formData =>
    fetch('/movimento/' + (formData.get('id').toString() !== '0' ? formData.get('id') : ''),
      {method: 'POST', body:formData, headers:getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  putMovimento = data =>
    fetch('/movimento/' + data.id_movimento,
      {method: 'PUT', body: JSON.stringify(data), headers: getRequestHeaders({'Content-Type':'application/javascript'})})
      .then(response => response.json())
      .catch(error => console.error(error))
  ,

  deleteMovimento = id =>
    fetch('/movimento/'+id, {method: 'DELETE', headers:getRequestHeaders()})
      .then(response => response.json())
      .catch(error => console.error(error))
;