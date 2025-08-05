import * as fs from "@mickaelvieira/opfs";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./breadcrumb";
import "./icons";
import "./statistics";
import "./table";

interface State {
  root: FileSystemDirectoryHandle;
  directory: FileSystemDirectoryHandle;
  entries: Map<string, FileSystemHandle>;
  breadcrumb: Array<FileSystemDirectoryHandle>;
}

@customElement("opfs-explorer")
export class Explorer extends LitElement {
  @property({ type: String, attribute: "breadcrumbs-root-label" })
  declare bcRootLabel?: string;

  @property({ type: Object })
  declare statistics: {
    percent: string;
    usage: string;
    quota: string;
  };

  @state()
  declare state: State;

  protected override async firstUpdated(): Promise<void> {
    const directory = await navigator.storage.getDirectory();
    const entries = await fs.readdir(directory);

    this.statistics = await fs.statistics();
    this.state = {
      root: directory,
      directory,
      breadcrumb: [directory],
      entries,
    };
  }

  async #handleAddFile() {
    const root = await navigator.storage.getDirectory();
    const { directory } = this.state;
    const parts = await root.resolve(directory);
    if (!parts) {
      return;
    }

    const dirpath = parts.join("/");
    const handles = await window.showOpenFilePicker({
      multiple: true,
    });

    for (const handle of handles) {
      const file = await handle.getFile();
      await fs.writeFile(`${dirpath}/${handle.name}`, file);
    }

    const entries = await fs.readdir(this.state.directory);

    this.statistics = await fs.statistics();
    this.state = {
      ...this.state,
      entries,
    };
  }

  async #handleClickDirectory(
    event: CustomEvent<{ handle: FileSystemDirectoryHandle }>,
  ) {
    const { handle: directory } = event.detail;
    const entries = await fs.readdir(directory);
    const breadcrumb = await fs.breadcrumb(directory);

    this.state = {
      ...this.state,
      breadcrumb,
      directory,
      entries,
    };
  }

  async #handleClickFile(event: CustomEvent<{ handle: FileSystemFileHandle }>) {
    const { handle: file } = event.detail;
    const blob = await file.getFile();

    const handle = await window.showSaveFilePicker({
      suggestedName: file.name,
    });

    const stream = await handle.createWritable();
    await stream.write(blob);
    await stream.close();
  }

  async #handleDeleteDirectory(
    event: CustomEvent<{ handle: FileSystemDirectoryHandle }>,
  ) {
    const { handle } = event.detail;

    if (!confirm(`Do you want to delete the directory ${handle.name}`)) {
      return;
    }

    const result = await fs.rmdir(handle);
    if (result) {
      const entries = await fs.readdir(this.state.directory);
      this.statistics = await fs.statistics();
      this.state = {
        ...this.state,
        entries,
      };
    }
  }

  async #handleCreateDirectory(event: CustomEvent<{ name: string }>) {
    const { name } = event.detail;

    const root = await navigator.storage.getDirectory();
    const path = await root.resolve(this.state.directory);

    if (!path || !name) {
      return;
    }

    path.push(name);

    const result = await fs.mkdir(path.join("/"));
    if (result) {
      const entries = await fs.readdir(this.state.directory);
      this.statistics = await fs.statistics();
      this.state = {
        ...this.state,
        entries,
      };
    }
  }

  async #handleDeleteFile(
    event: CustomEvent<{ handle: FileSystemFileHandle }>,
  ) {
    const { handle } = event.detail;

    if (!confirm(`Do you want to delete the file ${handle.name}`)) {
      return;
    }

    const result = await fs.removeFile(handle);
    if (result) {
      const entries = await fs.readdir(this.state.directory);
      this.statistics = await fs.statistics();
      this.state = {
        ...this.state,
        entries,
      };
    }
  }

  protected override render() {
    if (!this.state) {
      return nothing;
    }

    const files: Array<FileSystemFileHandle> = [];
    const directories: Array<FileSystemDirectoryHandle> = [];

    this.state.entries.forEach((handle) => {
      if (handle.kind === "file") {
        files.push(handle as FileSystemFileHandle);
      } else {
        directories.push(handle as FileSystemDirectoryHandle);
      }
    });

    files.sort((a, b) => (a.name > b.name ? 1 : -1));
    directories.sort((a, b) => (a.name > b.name ? 1 : -1));

    return html`
      <header>
        <opfs-explorer-breadcrumb
          part="breadcrumb"
          root-label=${this.bcRootLabel ?? nothing}
          .breadcrumb=${this.state.breadcrumb}
          @click-directory=${this.#handleClickDirectory}
        ></opfs-explorer-breadcrumb>
        <button @click=${this.#handleAddFile}>Add file</button>
      </header>
      <section>
        <opfs-explorer-table
          part="table"
          .files=${files}
          .directories=${directories}
          @click-file=${this.#handleClickFile}
          @delete-file=${this.#handleDeleteFile}
          @click-directory=${this.#handleClickDirectory}
          @delete-directory=${this.#handleDeleteDirectory}
          @create-directory=${this.#handleCreateDirectory}
        ></opfs-explorer-table>
      </section>
      <footer>
        <opfs-explorer-statistics
          part="statistics"
          quota=${this.statistics.quota}
          usage=${this.statistics.usage}
          percent=${this.statistics.percent}
        ></opfs-explorer-statistics>
      </footer>
    `;
  }

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      color: var(--opfs-color-text, inherit);
      font-size: var(--opfs-font-size, initial);
      font-family: var(--opfs-font-family, sans-serif);

      --opfs-default-color-border: #000;
    }

    header,
    footer {
      display: flex;
      align-content: center;
      margin: 16px 0;
    }

    header {
      justify-content: space-between;
    }

    footer {
      justify-content: flex-end;
    }

    button {
      display: block;
      border-radius: 20px;
      padding: 0 16px;
      height: 32px;
      cursor: pointer;
      color: var(--opfs-color-text, inherit);
      font-size: var(--opfs-font-size, inherit);
      font-family: var(--opfs-font-family, inherit);
      border: none;
      background-color: var(--opfs-color-primary, transparent);
    }

    section {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: scroll;
      padding-right: 4px;
      scrollbar-color: var(--opfs-color-primary, #ccc)
        var(--opfs-color-background, initial);
      scrollbar-width: thin;
    }

    section::-webkit-scrollbar {
      width: 8px;
      background-color: var(--opfs-color-background, initial);
    }

    section::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 6px;
      background-color: var(--opfs-color-background, initial);
    }

    section::-webkit-scrollbar-thumb {
      border-radius: 6px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: var(--opfs-color-primary, initial);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "opfs-explorer": Explorer;
  }
}
