import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("opfs-explorer-breadcrumb")
export class Breadcrumb extends LitElement {
  @property({ type: String, attribute: "root-label" })
  declare rootLabel: string;

  @property({ type: Array })
  declare breadcrumb: Array<FileSystemDirectoryHandle>;

  constructor() {
    super();
    this.breadcrumb = [];
    this.rootLabel = "Root";
  }

  #handleClick(handle: FileSystemDirectoryHandle) {
    this.dispatchEvent(
      new CustomEvent("click-directory", { detail: { handle } }),
    );
  }

  protected override render() {
    return html`
      ${this.breadcrumb.map(
        (handle, index) =>
          html`<button @click=${() => this.#handleClick(handle)}>
              ${handle.name ? handle.name : this.rootLabel}
            </button>
            ${index < this.breadcrumb.length - 1
              ? html`<span>&rsaquo;</span>`
              : nothing}`,
      )}
    `;
  }

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
    }

    button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: var(--opfs-color-text, inherit);
      font-size: var(--opfs-font-size, inherit);
    }

    span {
      display: inline-block;
      line-height: 1;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "opfs-explorer-breadcrumb": Breadcrumb;
  }
}
