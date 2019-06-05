export default {
  render(props){
    return `${this.html(props)}`;
  },
  html(props){
    return `
            
      <div class="sticky-wrap">
        <div class="sticky-content" >
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link" data-month="01" href="javascript:void(0)">janeiro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="02" href="javascript:void(0)">fevereiro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="03" href="javascript:void(0)">março</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="04" href="javascript:void(0)">abril</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="05" href="javascript:void(0)">maio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="06" href="javascript:void(0)">junho</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="07" href="javascript:void(0)">julho</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="08" href="javascript:void(0)">agosto</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="09" href="javascript:void(0)">setembro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="10" href="javascript:void(0)">outubro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="11" href="javascript:void(0)">novembro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-month="12" href="javascript:void(0)">dezembro</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="message alert alert-info mt-3 hide">Ainda não há movimentos registrados. Caso deseje, <a href="/movimento">clique aqui</a> para incluir um novo movimento financeiro.</div>
      <table class="table mt-1 table-hover">
        <thead>
          <tr>
            <th scope="col" class="border-top-0">#</th>
            <th scope="col" class="border-top-0">Confirmação</th>
            <th scope="col" class="border-top-0">Previsão</th>
            <th scope="col" class="border-top-0">Histórico</th>
            <th scope="col" class="border-top-0">Categoria</th>
            <th scope="col" class="border-top-0">Conta</th>
            <th scope="col" class="border-top-0">Valor</th>
            <th scope="col" class="border-top-0"></th>
          </tr>
        </thead>
        <tbody class="main">
          <tr class="template" hidden>
            <th scope="row" class="align-middle"><input class="form-check" type="checkbox" /></th>
            <td class="confirmacao align-middle"></td>
            <td class="previsao align-middle"></td>
            <td class="historico align-middle"></td>
            <td class="categoria align-middle"></td>
            <td class="conta align-middle"></td>
            <td class="valor align-middle text-right"></td>
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