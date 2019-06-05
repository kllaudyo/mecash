export default {

  render(props){
    return `${this.html(props)}`
  },

  html({id, descricao}){
    return `
    <input type="hidden" class="id" value="${id}" />
    <div class="form-row">
      <label class="col-form-label w-75">
        Descrição:
        <div class="input-group mb-3">
          <div class="input-group-prepend" >
            <span class="input-group-text bg-white">
              <img src="/static/images/tag.svg">
            </span>
          </div>
          <input type="text" class="form-control descricao" autofocus="autofocus" autocomplete="off" placeholder="Habitação" value="${descricao}">
          <div class="invalid-feedback">
            A descrição da categoria é obrigatória
          </div>
        </div>
      </label>
    </div>
    <div class="form-row">
      <label class="col-form-label">
        Tipo:
      </label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input tipo" type="radio" name="radioType" id="radioType1" value="C">
      <label class="form-check-label" for="radioType1">Crédito</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input tipo" type="radio" name="radioType" id="radioType2" value="D">
      <label class="form-check-label" for="radioType2">Débito</label>
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