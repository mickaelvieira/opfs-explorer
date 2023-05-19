import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('opfs-explorer-statistics')
export class Statistics extends LitElement {
  @property({ type: String })
  declare usage: string;

  @property({ type: String })
  declare quota: string;

  @property({ type: String })
  declare percent: string;

  constructor() {
    super();
    this.usage = '';
    this.quota = '';
    this.percent = '';
  }

  protected override render() {
    return html` <span>${this.usage} out of ${this.quota} (${this.percent})</span> `;
  }

  static override styles = css`
    :host {
      display: flex;
      font-size: 0.85rem;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'opfs-explorer-statistics': Statistics;
  }
}
