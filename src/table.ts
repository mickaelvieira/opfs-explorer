import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { formatBytes, formatLongDate, formatShortDate } from './format';

@customElement('opfs-explorer-table')
export class Table extends LitElement {
  @property({ type: Object })
  declare files: Array<FileSystemFileHandle>;

  @property({ type: Object })
  declare directories: Array<FileSystemDirectoryHandle>;

  constructor() {
    super();
    this.files = [];
    this.directories = [];
  }

  private _handleClickFile(handle: FileSystemHandle) {
    this.dispatchEvent(new CustomEvent(`click-file`, { detail: { handle } }));
  }

  private _handleDeleteFile(event: Event, handle: FileSystemHandle) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent(`delete-file`, { detail: { handle } }));
  }

  private _handleClickDirectory(handle: FileSystemHandle) {
    this.dispatchEvent(new CustomEvent(`click-directory`, { detail: { handle } }));
  }

  private _handleDeleteDirectory(event: Event, handle: FileSystemHandle) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent(`delete-directory`, { detail: { handle } }));
  }

  private handleEnterKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this._handleCreateDirectory(event);
    }
  }

  private _handleCreateDirectory(event: Event) {
    if (!this.shadowRoot) {
      return;
    }

    event.preventDefault();
    const input = this.shadowRoot.querySelector<HTMLInputElement>('input[type="text"]');

    if (!input || !input.value) {
      return;
    }

    this.dispatchEvent(new CustomEvent(`create-directory`, { detail: { name: input.value } }));
    input.value = '';
  }

  protected override render() {
    return html`<table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th style="width: 50%">Name</th>
          <th>Type</th>
          <th>Size</th>
          <th>Last Modified</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <opfs-icon-folder></opfs-icon-folder>
          </td>
          <td colspan="4">
            <input type="text" value="" placeholder="path/to/directory" @keydown=${this.handleEnterKey} />
          </td>
          <td>
            <button @click=${this._handleCreateDirectory} title="add a directory">
              <opfs-icon-plus></opfs-icon-plus>
            </button>
          </td>
        </tr>
        ${this.directories.length + this.files.length === 0
          ? html`<tr data-empty>
              <td colspan="6">This repository is empty</td>
            </tr>`
          : nothing}
        ${this.directories.map(
          (handle) => html`
            <tr @click=${() => this._handleClickDirectory(handle)}>
              <td>
                <opfs-icon-folder></opfs-icon-folder>
              </td>
              <td colspan="4">${handle.name}</td>
              <td>
                <button @click=${(event: PointerEvent) => this._handleDeleteDirectory(event, handle)}>
                  <opfs-icon-trash></opfs-icon-trash>
                </button>
              </td>
            </tr>
          `
        )}
        ${this.files.map(
          (handle) =>
            html`${until(
              handle.getFile().then(
                (file) => html`
                  <tr @click=${() => this._handleClickFile(handle)}>
                    <td>
                      <opfs-icon-file></opfs-icon-file>
                    </td>
                    <td>${file.name}</td>
                    <td>${file.type}</td>
                    <td>${formatBytes(file.size)}</td>
                    <td title="${formatLongDate(file.lastModified)}">${formatShortDate(file.lastModified)}</td>
                    <td>
                      <button
                        @click=${(event: PointerEvent) => this._handleDeleteFile(event, handle)}
                        title="delete this directory">
                        <opfs-icon-trash></opfs-icon-trash>
                      </button>
                    </td>
                  </tr>
                `
              ),
              html`<tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>`
            )}`
        )}
      </tbody>
    </table> `;
  }

  static override styles = css`
    :host {
      display: flex;
      padding: 0 8px;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
      border: 1px solid var(--opfs-color-border, var(--opfs-default-color-border));
      background-color: var(--opfs-color-background, inherit);
    }

    table {
      width: 100%;
    }

    table thead {
      color: var(--opfs-color-primary, inherit);
    }

    table td,
    table th {
      padding: 12px 8px;
      vertical-align: middle;
      border-bottom: 1px solid var(--opfs-color-border, var(--opfs-default-color-border));
    }

    table tr:last-child td {
      border-bottom: 0;
    }

    table button {
      display: block;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--opfs-color-text, inherit);
    }

    table tbody tr {
      cursor: pointer;
      transition: background-color 250ms ease-in-out;
      background-color: transparent;
    }

    table tbody tr[data-empty] td {
      padding: 24px 0;
    }

    table tbody tr[data-empty],
    table tbody tr:first-child {
      cursor: default;
    }

    table tbody tr td:first-child,
    table tbody tr td:last-child {
      vertical-align: middle;
      text-align: center;
      width: 16px;
    }

    table tbody tr td:nth-child(3),
    table tbody tr td:nth-child(4),
    table tbody tr td:nth-child(5) {
      text-align: center;
    }

    table input,
    table input:focus-visible {
      width: 100%;
      background: none;
      outline: 0;
      border: 0;
      padding: 8px 0 6px;
      color: var(--opfs-color-text, inherit);
      font-size: var(--opfs-font-size, inherit);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'opfs-explorer-table': Table;
  }
}
