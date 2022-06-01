import { LitElement, css, html, customElement, property } from 'lit-element';
// import { state } from 'lit/decorators.js';
import Element from './element.ts';
import Button from './button.ts';
// import { v4 as uuidv4 } from 'uuid';
import { createConnection, addConnection } from './connection.ts';
import { connect } from 'pwa-helpers';
import material from './material.ts';
import store, { RootState } from './store.ts';
import {
  getElements,
  addElement,
  elementSelectors,
  setElements,
} from './element-store.ts';
import { typeSelectors, setTypes, getTypes } from './type-store.ts';
import {
  setConnections,
  getConnections,
  connectionSelectors,
} from './connection-store.ts';

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
import './meta-model.ts';
import './draw-board.ts';

@customElement('main-app')
export class MainApp extends connect(store)(LitElement) {
  // @query('mwc-dialog')
  // dialog: HTMLFormElement;

  static get styles() {
    return [
      css`
      mwc-tab-bar {
        margin-bottom: 8px;
      }
    `,
    ];
  }

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
      <mwc-tab label="Metamodell" icon="account_tree" @click=${() => {
        this.tabIndex = 0;
      }}></mwc-tab>
      <mwc-tab label="Board" icon="dashboard" @click=${() => {
        this.tabIndex = 1;
      }}></mwc-tab>
    </mwc-tab-bar>

   

    ${
      this.tabIndex === 0
        ? html`<meta-model></meta-model>`
        : html`<draw-board></draw-board>`
    }


    `;
  }

  stateChanged(rootState: RootState): void {}

  //  openDialog() {}

  async firstUpdated() {
    //  this.initialize();
  }
}
