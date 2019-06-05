export default {
  render(props){
    return `${this.html(props)}`
  },
  html(){
    return `
      <div class="message alert alert-info hide">Ainda não há categorias registradas. Caso deseje, <a href="/categoria">clique aqui</a> para incluir uma nova categoria.</div>
      <table class="table mt-3 table-hover">
        <thead>
          <tr>
            <th colspan="3" scope="col" class="border-top-0">Descrição</th>
          </tr>
        </thead>
        <tbody class="main">
          <tr class="template" hidden>
            <td class="tipo w-40px" ></td>
            <td class="descricao align-middle"></td>
            <td class="w-1pc">
              <div class="btn-group mr-2" role="group" aria-label="Ações">
                <button type="button" class="btn btn-light editar" data-toggle="tooltip" data-placement="bottom" title="Editar"><img src="/static/images/pencil-outline.svg" alt="Editar"  /></button>
                <button type="button" class="btn btn-light excluir" data-toggle="tooltip" data-placement="bottom" title="Excluir"><img src="/static/images/delete-forever-outline.svg" alt="Remover" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>    
    `;
  }
}