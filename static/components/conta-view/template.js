export default {

  render(props){
    return `${this.html(props)}`
  },

  html({id, descricao, valor}){
    return `
      <input type="hidden" class="id" value="${id}" />
      <div class="form-row">
        <label class="col-form-label w-75">
          Descrição:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/credit-card.svg">
              </span>
            </div>
            <input type="text" class="form-control descricao" autofocus="autofocus" autocomplete="off" placeholder="Caixa Econômica..." value="${descricao}">
            <div class="invalid-feedback">
              A descrição da conta é obrigatório
            </div>
          </div>
        </label>
      </div>
      <div class="form-row">
        <label class="col-form-label w-25">
          Valor:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/currency-usd.svg">
              </span>
            </div>
            <input type="text" class="form-control valor" placeholder="0,12" value="${valor}">
            <div class="invalid-feedback">
              O saldo inicial é obrigatório
            </div>
          </div>
        </label>
      </div>
      <hr />
      <div class="form-row">
        <button class="btn btn-outline-dark salvar">Salvar</button>
        <button class="btn btn-outline-danger ml-2 excluir">Excluir</button>
        <button class="btn btn-outline-dark ml-2 cancelar">Cancelar</button>
      </div>      
    `;

  }
}