export default {
  render(props){
    return this.html(props);
  },
  html(props){
    return `
      <ul class="list-group list-group-flush main">
        <li class="list-group-item d-flex justify-content-between align-items-center template" hidden>
          <span style="flex: .7" class="descricao" ></span>
          <span style="flex: .1" class="text-right porcentagem"></span>
          <span style="flex: .2" class="text-right valor"></span>
        </li>
      </ul>
    `;
  }
}