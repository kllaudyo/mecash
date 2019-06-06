export default {
  render(props){
    return `${this.html(props)}`
  },
  html(){
    return `
      <div class="message alert alert-info hide">Ainda não há contas registradas. Caso deseje, <a href="/conta">clique aqui</a> para incluir uma nova conta.</div>
      <table class="table mt-3 table-hover hide">
        <thead>
          <tr>
            <th scope="col" class="border-top-0">Descrição</th>
            <th scope="col" class="border-top-0">Fatura</th>
            <th scope="col" class="border-top-0">Limite</th>
            <th scope="col" class="border-top-0"></th>
          </tr>
        </thead>
        <tbody class="main">
          <tr class="template" hidden>
            <td class="descricao align-middle"></td>
            <td class="fatura align-middle"></td>
            <td class="valor w-1pc align-middle text-right text-nowrap"></td>
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