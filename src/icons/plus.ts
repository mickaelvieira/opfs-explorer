import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('opfs-icon-plus')
export class PlusIcon extends LitElement {
  override render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M256 112v288M400 256H112" />
      </svg>
    `;
  }

  static override styles = css`
    ${styles}
  `;
}
