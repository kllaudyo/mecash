import Template from './template.js';
import {getCategorias, getContas, postMovimento, deleteMovimento} from '../utils/api.js';

export default class MovimentoView extends HTMLElement{

  connectedCallback(){

    const movimento = {
      id: this.getAttribute('id'),
      conta: this.getAttribute('conta'),
      categoria: this.getAttribute('categoria'),
      historico: this.getAttribute('historico'),
      previsao: this.getAttribute('previsao'),
      confirmacao: this.getAttribute('confirmacao'),
      valor: this.getAttribute('valor')
    };

    this.innerHTML = Template.render(movimento);
    this.input_id = this.querySelector('.id');
    this.input_conta = this.querySelector('.conta');
    this.input_categoria = this.querySelector('.categoria');
    this.input_historico = this.querySelector('.historico');
    this.input_previsao = this.querySelector('.previsao');
    this.input_confirmacao = this.querySelector('.confirmacao');
    this.input_valor = this.querySelector('.valor');

    this.button_salvar = this.querySelector('.salvar');
    this.button_excluir = this.querySelector('.excluir');

    if(this.getAttribute('id')==='0')
      this.button_excluir.classList.add('hide');

    this.button_salvar.addEventListener('click', e => this.handlerSave(e));
    this.button_excluir.addEventListener('click', e => this.handlerDelete(e));

    getCategorias()
      .then(categorias => this.renderCategorias(categorias, parseInt(movimento.categoria,10)));

    getContas()
      .then(contas => this.renderContas(contas, parseInt(movimento.conta,10)));

  }

  submit(){

    if(!this.input_historico.value.trim().length){
      this.input_historico.classList.add('is-invalid');
      return false;
    }

    if(!this.input_previsao.value.trim().length){
      this.input_previsao.classList.add('is-invalid');
      return false;
    }

    if(!this.input_valor.value.trim().length){
      this.input_valor.classList.add('is-invalid');
      return false;
    }

    this.input_historico.classList.remove('is-invalid');
    this.input_previsao.classList.remove('is-invalid');
    this.input_valor.classList.remove('is-invalid');
    return true;

  }

  renderCategorias(categorias, id=0){
    categorias.map( ({id_categoria, ds_categoria}) => {
      const option = document.createElement('option');
      option.setAttribute('value', id_categoria);
      option.appendChild(document.createTextNode(ds_categoria));
      if(id_categoria===id)
        option.selected=true;
      this.input_categoria.appendChild(option);
    });
  }

  renderContas(contas, id=0){
    contas.map(({id_conta, ds_conta}) => {
      const option = document.createElement('option');
      option.setAttribute('value', id_conta);
      option.appendChild(document.createTextNode(ds_conta));
      if(id_conta===id)
        option.selected=true;
      this.input_conta.appendChild(option);
    });
  }

  handlerSave(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', this.input_id.value);
    formData.append('conta', this.input_conta.value);
    formData.append('categoria', this.input_categoria.value);
    formData.append('historico', this.input_historico.value);
    formData.append('previsao', this.input_previsao.value);
    formData.append('confirmacao', this.input_confirmacao.value);
    formData.append('valor', this.input_valor.value);

    if(this.submit())
      postMovimento(formData)
        .then(result => {
          // alert(result);
          // window.history.go(-1);
          // window.location.href='/movimentos/';
        })
  }

  handlerDelete(e){
    e.preventDefault();
    if(this.input_id.value.toString().trim()!=="0" && confirm("Tem certeza que deseja excluir esse movimento?"))
      deleteMovimento(this.input_id.value)
        .then(result => {
          alert(result.message);
          window.history.go(-1);
        })
  }

}

if(!customElements.get('app-movimentoview'))
  customElements.define('app-movimentoview', MovimentoView);