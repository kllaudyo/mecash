import Template from './template.js';
import { postConta, deleteConta } from "../utils/api.js";

export default class ContaView extends HTMLElement{

  connectedCallback(){

    const conta = {
      id: this.getAttribute('id'),
      descricao: this.getAttribute('descricao'),
      valor: this.getAttribute('valor')
    };
    this.innerHTML = Template.render(conta);

    this.input_id = this.querySelector('.id');
    this.input_descricao = this.querySelector('.descricao');
    this.input_valor = this.querySelector('.valor');
    this.button_salvar = this.querySelector('.salvar');
    this.button_excluir = this.querySelector('.excluir');

    if(conta.id.toString()==='0')
      this.button_excluir.classList.add('hide');

    this.button_salvar.addEventListener('click', e => this.handlerSave(e));
    this.button_excluir.addEventListener('click', e => this.handlerDelete(e));

  }

  submit(){

    if(!this.input_descricao.value.trim().length){
      this.input_descricao.classList.add('is-invalid');
      return false;
    }

    if(!this.input_valor.value.trim().length){
      this.input_valor.classList.add('is-invalid');
      return false;
    }

    this.input_descricao.classList.remove('is-invalid');
    this.input_valor.classList.remove('is-invalid');
    return true;

  }

  handlerSave(e){
    e.preventDefault();
    const formData = new FormData();
      formData.append('id', this.input_id.value);
      formData.append('descricao', this.input_descricao.value);
      formData.append('valor', this.input_valor.value);
      if(this.submit())
        postConta(formData)
          .then(result => {
            window.history.go(-1);
          });
  }

  handlerDelete(e){
    e.preventDefault();
    if(this.input_id.value.toString().trim()!=="0" && confirm("Tem certeza que deseja excluir essa conta?"))
      deleteConta(this.input_id.value)
        .then(result => {
          alert(result.message);
          window.history.go(-1);
        });
  }

}

if(!customElements.get('app-contaview'))
  customElements.define('app-contaview', ContaView);