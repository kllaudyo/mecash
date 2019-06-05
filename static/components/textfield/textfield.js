import Template from './template.js';

export default class TextField extends HTMLElement{

  static get observedAttributes() {
    return ['invalid','message'];
  }

  constructor(){
    super();
    this.root = this.attachShadow({mode: 'close'});
  }


  connectedCallback(){
    this.render();
    this.style.flex='1';
    this.root.input = this.root.querySelector('input');
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if(name==="invalid" && this.input)
      if(newValue==="true")
        this.root.input.classList.add("is-invalid");
      else
        this.root.input.classList.remove("is-invalid");

    if(name==='message' && this.input)
      this.root.querySelector('.invalid-feedback').textContent = newValue;

  }

  render(){
    const
      isFocus = this.getAttribute('autofocus'),
      isInvalid = this.getAttribute('invalid'),
      autofocus=(isFocus && isFocus.toString().toLowerCase().trim() === 'true')?'autofocus="autofocus"':'',
      invalid = (isInvalid && isInvalid.toString().toLowerCase().trim() === "true")?" is-invalid":""
    ;

    this.root.innerHTML = Template.render({
      icon:this.getAttribute('icon'),
      label:this.getAttribute('label'),
      value:this.getAttribute('value'),
      autofocus,
      invalid,
      placeholder:this.getAttribute('placeholder'),
      type:this.getAttribute('type'),
      width:this.getAttribute('width')?' '+this.getAttribute('width'):'',
      message:this.getAttribute('message')
    });

  }

}

if(!customElements.get('app-textfield'))
  customElements.define('app-textfield', TextField);