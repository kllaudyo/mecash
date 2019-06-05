import Template from './template.js';
import { getConsultaCategorias } from '../utils/api.js';

export default class ConsultaCategoriaView extends HTMLElement{

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
    this.categorias = [];
    this.timeout = null;
    this.innerHTML = Template.render();
    this.container = this.querySelector('.main');
    this.template = this.querySelector('.template');
    this.handlerUpdate();
  }

  clean(){
    this.container.innerHTML='';
  }

  render(categorias){
    categorias.map( ({id_categoria, ds_categoria, vl_porcentagem, vl_total, movimentos=[]}) => {
      this.renderRow({descricao:ds_categoria, valor:vl_total, porcentagem:vl_porcentagem, classes:'list-group-item-header'});
      movimentos.map(({ds_historico, vl_porcentagem, vl_total}) => {
        this.renderRow({descricao:ds_historico, valor:vl_total, porcentagem:vl_porcentagem});
      })
    })
  }

  renderRow({descricao, valor, porcentagem, classes=null}){
    const row = this.template.cloneNode(true);
    if(classes)
      row.classList.add(classes);

    row.removeAttribute('hidden');
    this.container.appendChild(row);
    row.querySelector('.descricao').textContent = descricao;
    row.querySelector('.valor').textContent = parseFloat(valor).toFixed(2);
    row.querySelector('.porcentagem').textContent = parseFloat(porcentagem).toFixed(2) + '%';

  }

  handlerUpdate(){
    getConsultaCategorias()
      .then(categorias => {
        this.clean();
        this.categorias = categorias;
        this.render(this.categorias);
      });
  }

  handlerSearch(searchTerm){
    if(this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.clean();
      this.render(
        this.categorias.filter(categoria => categoria.ds_categoria.toLowerCase().includes(searchTerm.toLowerCase())||categoria.ds_categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }, 350);
  }

}

if(!customElements.get('app-consulta-categoria'))
  customElements.define('app-consulta-categoria', ConsultaCategoriaView);