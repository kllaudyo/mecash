import Template from './template.js';
import {postCategoria, deleteCategoria} from "../utils/api.js";

export default class CategoriaView extends HTMLElement{

  connectedCallback(){

    const categoria = {
      id: this.getAttribute('id'),
      descricao: this.getAttribute('descricao'),
      tipo: this.getAttribute('tipo')
    };
    this.innerHTML = Template.render(categoria);

    this.input_id = this.querySelector('.id');
    this.input_descricao = this.querySelector('.descricao');
    this.input_tipo = this.querySelectorAll('.tipo');

    if(categoria.tipo === 'C')
      this.input_tipo[0].checked=true;
    else if(categoria.tipo === 'D')
      this.input_tipo[1].checked=true;

    this.button_salvar = this.querySelector('.salvar');
    this.button_excluir = this.querySelector('.excluir');

    if(categoria.id.toString()==='0')
      this.button_excluir.classList.add('hide');

    this.button_salvar.addEventListener('click', e => this.handlerSave(e));
    this.button_excluir.addEventListener('click', e => this.handlerDelete(e));

  }

  submit(){

    if(!this.input_descricao.value.trim().length){
      this.input_descricao.classList.add('is-invalid');
      return false;
    }

    this.input_descricao.classList.remove('is-invalid');
    return true;

  }

  handlerSave(e){

    e.preventDefault();

    const formData = new FormData();
    formData.append('id', this.input_id.value);
    formData.append('descricao', this.input_descricao.value);

    this.input_tipo.forEach(element => {
      if(element.checked)
        formData.append('tipo', element.value)
    });

    if(this.submit())
      postCategoria(formData)
        .then(result => {
          alert(result);
          window.history.go(-1);
        });

  }

  handlerDelete(e){
    e.preventDefault();
    if(this.input_id.value.toString().trim()!=="0" && confirm("Tem certeza que deseja excluir essa categoria?"))
      deleteCategoria(this.input_id.value)
        .then(result => {
          alert(result.message);
          window.history.go(-1);
        });
  }

}

if(!customElements.get('app-categoriaview'))
  customElements.define('app-categoriaview', CategoriaView);