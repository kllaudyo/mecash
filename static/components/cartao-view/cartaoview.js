import Template from './template.js';

export default class CartaoView extends HTMLElement{

  connectedCallback(){

    const cartao = {
      id: this.getAttribute('id'),
      descricao: this.getAttribute('descricao'),
      valor: this.getAttribute('limite'),
      fechamento: this.getAttribute('fechamento'),
      anuidade: this.getAttribute('anuidade')
    };

    this.innerHTML = Template.render(cartao);

    this.form = this.querySelector('form');
    this.input_id = this.querySelector('.id');
    this.input_descricao = this.querySelector('.descricao');
    this.input_valor = this.querySelector('.valor');
    this.input_fechamento = this.querySelector('.fechamento');
    // this.input_anuidade = this.querySelector('.anuidade');

    this.button_salvar = this.querySelector('.salvar');
    this.button_excluir = this.querySelector('.excluir');

    if(cartao.id.toString()==='0')
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

    if(!this.input_fechamento.value.trim().length){
      this.input_fechamento.classList.add('is-invalid');
      return false;
    }

    this.input_descricao.classList.remove('is-invalid');
    this.input_valor.classList.remove('is-invalid');
    this.input_fechamento.classList.remove('is-invalid');
    return true;

  }

  handlerSave(e){
    e.preventDefault();
    const formData = new FormData(this.form);
      // formData.append('id', this.input_id.value);
      // formData.append('descricao', this.input_descricao.value);
      // formData.append('valor', this.input_valor.value);
      // formData.append('fechamento', this.input_fechamento.value);
      // if(this.submit())
        // postConta(formData)
        //   .then(result => {
        //     window.history.go(-1);
        //   });
  }

  handlerDelete(e){
    e.preventDefault();
    // if(this.input_id.value.toString().trim()!=="0" && confirm("Tem certeza que deseja excluir esse cartao?"))
      // deleteConta(this.input_id.value)
      //   .then(result => {
      //     alert(result.message);
      //     window.history.go(-1);
      //   });
  }

}

if(!customElements.get('app-cartaoview'))
  customElements.define('app-cartaoview', CartaoView);