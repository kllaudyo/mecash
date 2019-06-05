import Template from './template.js';
import {getContas, deleteConta} from "../utils/api.js";

export default class ContasView extends HTMLElement{

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

    this.contas = [];
    this.timeout = null;
    this.innerHTML = Template.render();
    this.container = this.querySelector('.main');
    this.template = this.querySelector('.template');
    this.table = this.querySelector('table');
    this.message = this.querySelector('.message');

    getContas()
      .then(contas => {
        this.contas = contas;
        this.render(contas);
      })
      .catch(error => console.error(error));

  }

  handlerSearch(searchTerm){
    if(this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.renderClean();
      this.render(
        this.contas.filter(conta => conta.ds_conta.toLowerCase().includes(searchTerm))
      );
    }, 350);
  }

  render(contas){
    if(contas.length) {
      this.table.classList.remove('hide');
      this.message.classList.add('hide');
      contas.map(conta => this.renderRow(conta));
    }else{
      this.table.classList.add('hide');
      this.message.classList.remove('hide');
    }
  }

  renderClean(){
    this.container.innerHTML='';
  }

  renderRow({id_conta, ds_conta, vl_saldo}){
    let row = this.querySelector('tr[data-id="' + id_conta + '"]');
    if(!row){
      row = this.template.cloneNode(true);
      row.dataset.id = id_conta;
      row.removeAttribute('hidden');
      this.container.appendChild(row);
    }
    row.querySelector('.descricao').textContent = ds_conta;
    row.querySelector('.valor').textContent = `R$ ${vl_saldo}`;
    row.querySelector('.editar').addEventListener('click',function (e) {
      e.preventDefault();
      window.location.href = '/conta/' + id_conta;
    });
    row.querySelector('.excluir').addEventListener('click', function (e) {
      e.preventDefault();
      if(confirm("Tem certeza que deseja excluir essa conta?"))
        deleteConta(id_conta)
          .then(result => {
            alert(result.message);
            window.location.reload();
          });
    });
  }

}

if(!customElements.get('app-contasview'))
  customElements.define('app-contasview', ContasView);