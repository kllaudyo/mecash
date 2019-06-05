import Template from './template.js'
import {getMovimentos, deleteMovimento, putMovimento} from "../utils/api.js";

export default class MovimentosView extends HTMLElement{

  get search(){
    return this.getAttribute('serach');
  }

  set search(val){
    this.setAttribute('search', val);
  }

  get year(){
    return this.getAttribute('year');
  }

  set year(val){
    this.setAttribute('year', val);
  }

  get month(){
    return this.getAttribute('month');
  }

  set month(val){
    this.setAttribute('month', val);
  }

  static get observedAttributes() {
    return ['search','year','month'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === 'search')
      this.handlerSearch(newValue);
    else if(name === 'year')
      this.handlerUpdate(newValue, this.getAttribute('month'));
    else if(name === 'month')
      this.handlerUpdate(this.getAttribute('year'), newValue);
  }

  connectedCallback(){
    this.movimentos = [];
    this.timeout = null;
    this.elementMonth = null;
    this.innerHTML = Template.render();
    this.container = this.querySelector('.main');
    this.template = this.querySelector('.template');
    this.tabs = this.querySelectorAll('.nav-item');
    this.table = this.querySelector('table');
    this.message = this.querySelector('.message');

    this.tabs.forEach(element => {

      if(element.querySelector('.nav-link').dataset.month === this.getAttribute('month')){
        this.elementMonth = element.querySelector('.nav-link');
        this.elementMonth.classList.add('active');
      }


      element.querySelector('.nav-link').addEventListener('click',e => {

        const element = e.target;

        if(this.elementMonth!==null)
          this.elementMonth.classList.remove('active');

        this.setAttribute('month', element.dataset.month);
        this.elementMonth = element;
        this.elementMonth.classList.add('active');

        window.history.pushState('', '', `/movimentos/${this.getAttribute('year')}/${element.dataset.month}`);

      });

    });

    this.handlerUpdate(this.getAttribute('year'))

  }

  handlerUpdate(year){
    getMovimentos(year, this.month)
      .then(movimentos => {
        this.renderClean();
        this.movimentos = movimentos;
        this.render(movimentos);
      })
  }

  handlerSearch(searchTerm){
    if(this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.renderClean();
      this.render(
        this.movimentos.filter(movimento => movimento.ds_historico.toLowerCase().includes(searchTerm.toLowerCase())||movimento.ds_categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }, 350);
  }

  handlerPayed(e){
    const element = e.target,
      is_payed = element.checked ? 1 : 0,
      id = element.parentNode.parentNode.dataset.id,
      data = {id_movimento:id, is_payed:is_payed}
    ;
    putMovimento(data)
      .then(movimento => this.renderRow(movimento))
  }

  render(movimentos){
    if(movimentos.length){
      this.table.classList.remove('hide');
      this.message.classList.add('hide');
      movimentos.map(movimento => this.renderRow(movimento));
    }else{
      this.table.classList.add('hide');
      this.message.classList.remove('hide');
    }
  }

  renderClean(){
    this.container.innerHTML='';
  }

  renderRow({id_movimento,ds_historico,dt_previsao,dt_confirmacao,vl_movimento,ds_categoria,ds_conta}){
    let row = this.querySelector('tr[data-id="' + id_movimento + '"]');
    if(!row){
      row = this.template.cloneNode(true);
      row.dataset.id = id_movimento;
      row.removeAttribute('hidden');
      this.container.appendChild(row);
    }

    if(dt_confirmacao && dt_confirmacao.length)
      row.classList.add('payed');
    else
      row.classList.remove('payed');

    row.querySelector('.confirmacao').textContent = dt_confirmacao;
    row.querySelector('.previsao').textContent = dt_previsao;
    row.querySelector('.historico').textContent = ds_historico;
    row.querySelector('.categoria').textContent = ds_categoria;
    row.querySelector('.conta').textContent = ds_conta;
    row.querySelector('.valor').textContent = `R$ ${vl_movimento}`;

    const input = row.querySelector('input');
    input.checked = dt_confirmacao!==null;

    if(typeof input.onclick !== 'function')
      input.addEventListener('click', e => this.handlerPayed(e));

    if(typeof row.querySelector('.editar').onclick !== 'function')
      row.querySelector('.editar').addEventListener('click',MovimentosView.handlerEdit);

    if(typeof row.querySelector('.excluir').onclick !== 'function')
      row.querySelector('.excluir').addEventListener('click', MovimentosView.handlerDelete);
  }

  static handlerEdit(e){
    e.preventDefault();
    const element = e.target;
    let id_movimento = element.parentNode.parentNode.parentNode.parentNode.dataset.id;
    if(element.nodeName === 'BUTTON')
      id_movimento = element.parentNode.parentNode.parentNode.dataset.id;

    window.location.href = '/movimento/' + id_movimento;
  }

  static handlerDelete(e){
    e.preventDefault();
    const element = e.target;
    let id_movimento = element.parentNode.parentNode.parentNode.parentNode.dataset.id;
    if(element.nodeName === 'BUTTON')
      id_movimento = element.parentNode.parentNode.parentNode.dataset.id;

    if(confirm("Tem certeza que deseja excluir esse movimento?"))
      deleteMovimento(id_movimento)
        .then(result => {
          alert(result.message);
          window.location.reload();
        });
  }

}

if(!customElements.get('app-movimentosview'))
  customElements.define('app-movimentosview', MovimentosView);