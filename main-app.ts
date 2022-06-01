import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { connect } from 'pwa-helpers';
import store, { RootState } from './store';
import { material } from './style/material';

import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-select';
import '@material/mwc-formfield';
import '@material/mwc-checkbox';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-list/mwc-list-item';
import './new-type-dialog.ts';
import './meta/meta-model';
import './draw-board.ts';

@customElement('main-app')
export class MainApp extends connect(store)(LitElement) {
  // @query('mwc-dialog')
  // dialog: HTMLFormElement;

  static styles = [
    material,
    css`
      mwc-tab-bar {
        margin-bottom: 8px;
      }
    `,
  ];

  @property()
  dialog: HTMLFormElement;

  @property()
  canvas: HTMLFormElement;

  @property()
  tabBar: HTMLFormElement;

  @property()
  types = [];

  @property()
  elements = [];

  @property()
  connections = [];

  @property()
  tabIndex = 0;

  // dialog: HTMLFormElement;
  render() {
    return html`
      <mwc-tab-bar>
        <mwc-tab
          label="Metamodell"
          icon="account_tree"
          @click=${() => {
            this.tabIndex = 0;
          }}
        ></mwc-tab>
        <mwc-tab
          label="Board"
          icon="dashboard"
          @click=${() => {
            this.tabIndex = 1;
          }}
        ></mwc-tab>
      </mwc-tab-bar>

      ${this.tabIndex === 0
        ? html`<meta-model></meta-model>`
        : html`<draw-board></draw-board>`}
    `;
  }

  stateChanged(rootState: RootState): void {}

  //  openDialog() {}

  async firstUpdated() {
    //  this.initialize();
  }
}
