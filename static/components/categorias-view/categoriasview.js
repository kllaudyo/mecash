import Template from './template.js';
import {getCategorias, deleteCategoria} from "../utils/api.js";

export default class CategoriasView extends HTMLElement{

  get search(){
    return this.getAttribute('serach');
  }

  set search(val){
    this.setAttribute('search', val);
  }

  static get observedAttributes() {
    return ['search'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name==='search')
      this.handlerSearch(newValue);
  }

  connectedCallback(){

    this.categorias = [];
    this.timeout = null;
    this.innerHTML = Template.render();
    this.container = this.querySelector('.main');
    this.template = this.querySelector('.template');
    this.table = this.querySelector('.table');
    this.message = this.querySelector('.message');

    getCategorias()
      .then(categorias => {
        this.categorias = categorias;
        this.render(categorias);
      })

  }

  handlerSearch(searchTerm){
    if(this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.renderClean();
      this.render(
        this.categorias.filter(categoria => categoria.ds_categoria.toLowerCase().includes(searchTerm))
      );
    }, 350);
  }

  render(categorias){
    if(categorias.length){
      this.table.classList.remove('hide');
      this.message.classList.add('hide');
      categorias.map(categoria => this.renderRow(categoria));
    }else{
      this.table.classList.add('hide');
      this.message.classList.remove('hide');
    }
  }

  renderClean(){
    this.container.innerHTML = '';
  }

  renderRow({id_categoria, ds_categoria, tp_categoria}){
    let row = this.querySelector('tr[data-id="' + id_categoria + '"]');
    if(!row){
      row = this.template.cloneNode(true);
      row.dataset.id = id_categoria;
      row.removeAttribute('hidden');
      this.container.appendChild(row);
    }
    row.querySelector('.tipo').classList.add(tp_categoria==='C'?'credit':'debit');
    row.querySelector('.descricao').textContent = ds_categoria;
    row.querySelector('.editar').addEventListener('click',e => {
      e.preventDefault();
      window.location.href='/categoria/' + id_categoria;
    });
    row.querySelector('.excluir').addEventListener('click',e => {
      e.preventDefault();
      if(confirm('Tem certeza que deseja excluir essa categoria?'))
        deleteCategoria(id_categoria)
          .then(result => {
            alert(result.message);
            window.location.reload();
          });
    });
  }

}

if(!customElements.get('app-categoriasview'))
  customElements.define('app-categoriasview', CategoriasView);