import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { parse, ParsedPDF } from "@succefy/pdf-parser/parser";

export class Component extends LitElement {
  @property({ type: String })
  label = "Upload your CV";

  @property({ type: Boolean })
  multiple = false;

  @property({ type: String })
  hostUrl = "";

  render() {
    return html`
      <button class="glow_on_hover" @click="${this._onClick}">
        ${this.label}
      </button>
    `;
  }
  async CVTextToJSON(content: ParsedPDF[]) {
    // This allows multiple file contents to be sent
    const all_text_content = content
      .map((c) => `# ${c.filename}\n${c.content}`)
      .join("\n\n");
    const response = await fetch(`${this.hostUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: all_text_content }),
    });
    const json_result = await response.json();
    this.dispatchEvent(
      new CustomEvent(Component.AI_PARSE_EVENT, {
        detail: json_result,
      })
    );
    return json_result;
  }
  private _onClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.multiple = this.multiple;
    input.style.display = "none";
    input.addEventListener("change", async () => {
      if (!input.files) return;
      const parsedFiles = await parse(Array.from(input.files));
      this.dispatchEvent(
        new CustomEvent(Component.PDF_PARSE_EVENT, {
          detail: parsedFiles,
        })
      );

      // If there is a host url I know I need to make a request
      if (this.hostUrl) {
        this.CVTextToJSON(parsedFiles);
      }
    });
    input.click();
  }

  static PDF_PARSE_EVENT = "parse:pdf";
  static AI_PARSE_EVENT = "parse:ai";
  static styles = css`
    .glow_on_hover {
      padding: 8px 15px;
      border: none;
      outline: none;
      color: #fff;
      background: #111;
      cursor: pointer;
      position: relative;
      z-index: 0;
      border-radius: 10px;
    }

    .glow_on_hover:before {
      content: "";
      background: linear-gradient(
        45deg,
        #ff0000,
        #ff7300,
        #fffb00,
        #48ff00,
        #00ffd5,
        #002bff,
        #7a00ff,
        #ff00c8,
        #ff0000
      );
      position: absolute;
      top: -2px;
      left: -2px;
      background-size: 400%;
      z-index: -1;
      filter: blur(5px);
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      animation: glowing 20s linear infinite;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      border-radius: 10px;
    }

    .glow_on_hover:active {
      color: #000;
    }

    .glow_on_hover:active:after {
      background: transparent;
    }

    .glow_on_hover:hover:before {
      opacity: 1;
    }

    .glow_on_hover:after {
      z-index: -1;
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: #111;
      left: 0;
      top: 0;
      border-radius: 10px;
    }

    @keyframes glowing {
      0% {
        background-position: 0 0;
      }
      50% {
        background-position: 400% 0;
      }
      100% {
        background-position: 0 0;
      }
    }
  `;
}

export function register(name: string = "pdf-button") {
  customElements.define(name, Component);
}
