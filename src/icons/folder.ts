import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { styles } from "./styles";

@customElement("opfs-icon-folder")
export class FolderIcon extends LitElement {
  override render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M440 432H72a40 40 0 01-40-40V120a40 40 0 0140-40h75.89a40 40 0 0122.19 6.72l27.84 18.56a40 40 0 0022.19 6.72H440a40 40 0 0140 40v240a40 40 0 01-40 40zM32 192h448"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
    `;
  }

  static override styles = css`
    ${styles}
  `;
}
