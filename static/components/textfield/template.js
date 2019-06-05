export default {
  render(props){
    return `${this.html(props)}`;
  },
  html({type, value, placeholder, autofocus, label, invalid, feedback, width}){
    return `
      <label class="col-form-label${width}">
        ${label}
        <div class="input-group mb-3">
          <div class="input-group-prepend" >
            <div class="input-group-text bg-white">
              <slot name="icon"></slot>
            </div>
          </div>
          <input type="${type}" class="form-control${invalid}" ${autofocus} autocomplete="off" placeholder="${placeholder}" value="${value}">
          <div class="invalid-feedback">${feedback}</div>
        </div>
      </label>      
    `;
  }
}