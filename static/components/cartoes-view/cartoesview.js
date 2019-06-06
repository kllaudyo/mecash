import Template from './template.js';
// import {getContas, deleteConta} from "../utils/api.js";

export default class CartoesView extends HTMLElement{

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

    this.cartoes = [];
    this.timeout = null;
    this.innerHTML = Template.render();
    this.container = this.querySelector('.main');
    this.template = this.querySelector('.template');
    this.table = this.querySelector('table');
    this.message = this.querySelector('.message');

    // getContas()
    //   .then(contas => {
    //     this.contas = contas;
    //     this.render(contas);
    //   })
    //   .catch(error => console.error(error));

  }

  handlerSearch(searchTerm){
    if(this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.renderClean();
      this.render(
        this.cartoes.filter(cartao => cartao.ds_cartao.toLowerCase().includes(searchTerm))
      );
    }, 350);
  }

  render(cartoes){
    if(cartoes.length) {
      this.table.classList.remove('hide');
      this.message.classList.add('hide');
      cartoes.map(cartao => this.renderRow(cartao));
    }else{
      this.table.classList.add('hide');
      this.message.classList.remove('hide');
    }
  }

  renderClean(){
    this.container.innerHTML='';
  }

  renderRow({id_cartao, ds_cartao, vl_limite, dt_fatura}){
    let row = this.querySelector('tr[data-id="' + id_cartao + '"]');
    if(!row){
      row = this.template.cloneNode(true);
      row.dataset.id = id_cartao;
      row.removeAttribute('hidden');
      this.container.appendChild(row);
    }
    row.querySelector('.descricao').textContent = ds_cartao;
    row.querySelector('.fatura').textContent = dt_fatura;
    row.querySelector('.valor').textContent = `R$ ${vl_limite}`;
    row.querySelector('.editar').addEventListener('click',function (e) {
      e.preventDefault();
      window.location.href = '/cartoes/' + id_cartao;
    });
    row.querySelector('.excluir').addEventListener('click', function (e) {
      e.preventDefault();
      if(confirm("Tem certeza que deseja excluir esse cartão?"))
        deleteConta(id_cartao)
          .then(result => {
            alert(result.message);
            window.location.reload();
          });
    });
  }

}

if(!customElements.get('app-cartoesview'))
  customElements.define('app-cartoesview', CartoesView);