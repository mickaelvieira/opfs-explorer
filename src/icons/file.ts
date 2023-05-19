import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('opfs-icon-file')
export class FileIcon extends LitElement {
  override render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z"
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="32" />
        <path
          d="M256 56v120a32 32 0 0032 32h120"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32" />
      </svg>
    `;
  }

  static override styles = css`
    ${styles}
  `;
}
