export default {
  render(props){
    return `${this.html(props)}`
  },
  html({id, historico, previsao, confirmacao, valor}){
    return `
    <input type="hidden" class="id" value="${id}" />
      <div class="form-row">
        <label class="col-form-label w-50">
          Conta:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/credit-card.svg">
              </span>
            </div>
            <select class="form-control conta"></select>
            <div class="invalid-feedback">
              A conta é obrigatória
            </div>
          </div>
        </label>
      </div>
      <div class="form-row">
        <label class="col-form-label w-50">
          Categoria:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/tag.svg">
              </span>
            </div>
            <select class="form-control categoria"></select>
            <div class="invalid-feedback">
              A categoria é obrigatória
            </div>
          </div>
        </label>
      </div>
      <div class="form-row">
        <label class="col-form-label w-75">
          Histórico:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/information-outline.svg">
              </span>
            </div>
            <input class="form-control historico" autofocus="autofocus" autocomplete="off" placeholder="Prestação do carro" value="${historico}">
            <div class="invalid-feedback">
              O histórico é obrigatório
            </div>
          </div>
        </label>
      </div>
      <div class="form-row">
        <label class="col-form-label w-50">
          Previsão:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/calendar-month-outline.svg">
              </span>
            </div>
            <input type="date" class="form-control previsao" value="${previsao}">
            <div class="invalid-feedback">
              A data de previsão é obrigatória
            </div>
          </div>
        </label>
      </div>
      <div class="form-row">
        <label class="col-form-label w-50">
          Confirmação:
          <div class="input-group mb-3">
            <div class="input-group-prepend" >
              <span class="input-group-text bg-white">
                <img src="/static/images/calendar-month-outline.svg">
              </span>
            </div>
            <input type="date" class="form-control confirmacao" value="${confirmacao}">
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
            <input type="text" class="form-control valor" placeholder="1.200,00" value="${valor}">
            <div class="invalid-feedback">
              O valor é obrigatória
            </div>
          </div>
        </label>
      </div>
      <hr />
      <div class="form-row">
        <button type="button" class="btn btn-outline-dark salvar">Salvar</button>
        <button type="button" class="btn btn-outline-danger ml-2 excluir">Excluir</button>
        <button type="button" class="btn btn-outline-dark ml-2 cancelar">Cancelar</button>
      </div>   
    `;
  }
}