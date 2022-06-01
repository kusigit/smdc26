import { LitElement, css, html, customElement, property } from 'lit-element';
// import { state } from 'lit/decorators.js';
import { createConnection } from './connection.ts';
import { v4 as uuidv4 } from 'uuid';
import store, { RootState } from './store.ts';
import { addType, typeSelectors } from './type-store.ts';
import { connect } from 'pwa-helpers';
import { typeSelectors, setTypes, getTypes } from './type-store.ts';
import { Attribute, UserData } from './types';
import Type from './type.ts';

import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-select';
import '@material/mwc-formfield';
import '@material/mwc-checkbox';
import '@material/mwc-list/mwc-list-item';

@customElement('new-type-dialog')
export class NewTypeDialog extends connect(store)(LitElement) {
  // @query('mwc-dialog')
  // dialog: HTMLFormElement;

  static get styles() {
    return css`
      .grid { 
        margin-top: 16px;
        display: grid;
        width: 512px;
        gap: 24px;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
          'text text'
          '. .'
          '. .';
      }


      [name="text"] {
        grid-area: text;
      }

      [name="parent"] {
        display: none;
        grid-area: parent;
      }

      .input {
        grid-area: input;
      }

      .output {
        grid-area: output;
      }
    `;
  }

  @property()
  dialog: HTMLFormElement;

  @property()
  form: HTMLFormElement;

  @property()
  bgColor: HTMLFormElement;

  @property()
  text: HTMLFormElement;

  //  @property()
  // parent: HTMLFormElement;

  @property()
  kpi: HTMLFormElement;

  @property()
  kpi2: HTMLFormElement;

  @property()
  kpi3: HTMLFormElement;

  //  @property()
  //  canvas: HTMLFormElement;

  // @property()
  private level = 0;

  //  @property()
  //  attr: Attribute;

  @property()
  types = [];

  @property()
  colors = [
    'red',
    'pink',
    'purple',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'amber',
    'orange',
    //  'brown',
  ];

  @property()
  figures = ['rectangle', 'process'];

  private x = 0;
  private y = 0;
  private parent = '';

  async save() {
    const nameValid = this.text.reportValidity();

    if (nameValid) {
      const kpi = [];
      const formData = new FormData(this.form);

      let userData = {
        //    ...this.attr.userData,
      };

      formData.forEach((value: string, key: string) => {
        //   console.log(value, key);

        if (key === 'kpi' && value) {
          kpi.push({ key: value, value: '1' });
        }

        userData = {
          ...userData,
          [key]: value === 'on' ? true : value,
        };
      });
      /*
      const attr2: Attribute = {
        ...this.attr,
        userData: {
          ...userData,
          kpi,
          ports: [uuidv4(), uuidv4(), uuidv4(), uuidv4()],
        },
      };
*/
      const attr: Attribute = {
        id: uuidv4(),
        userData: {
          ...userData,
          //   kpi: [],
          kpi,
          level: this.level,
          parent: this.parent,
          //  text: '',
          //  figure: 'rectangle',
          //  bgColor: 'blue',
          //  buttons: [],
          ports: [uuidv4(), uuidv4(), uuidv4(), uuidv4()],
        },
        //  x,
        //  y,
        height: 120,
        width: 240,
        x: this.x + 20,
        y: this.y + 50,
      };

      //    const node = new Type(attr);
      //    console.log(node.hybridPorts.data);

      // const ports = node.hybridPorts.data.map((port) => port.id);

      //  attr = {
      //    ...attr,
      //    userData: {
      //     ...attr.userData,
      //      ports,
      //   },
      // };

      await store.dispatch(addType(attr));
      this.dialog.close();
    }
  }

  // dialog: HTMLFormElement;
  render() {
    return html`
      <mwc-dialog heading="Elementtyp" xopen> 
        <form class="grid"> 

        <mwc-textfield name="text" label="Bezeichnung" maxlength="20" outlined required></mwc-textfield>

        <mwc-select name="parent" label="Übergeordnetes Element" outlined >
        <mwc-list-item></mwc-list-item>
        ${this.types.map(
          (item) => html`
            <mwc-list-item value="${item.id}">${item.userData.text}</mwc-list-item>
          `
        )}
        </mwc-select>

        <mwc-select name="figure" outlined label="Figur" fixedMenuPosition>
        ${this.figures.map(
          (figure) => html`
            <mwc-list-item value="${figure}">${figure}</mwc-list-item>
          `
        )}
        </mwc-select>

        <mwc-select name="bgColor" outlined label="Hintergrundfarbe" fixedMenuPosition>
          <mwc-list-item></mwc-list-item>
          ${this.colors.map(
            (color) => html`
              <mwc-list-item value="${color}" style="background-color:var(--material-color-${color}-500)">${color}</mwc-list-item>
            `
          )}
        </mwc-select>


        <mwc-textfield name="kpi" label="KPI" maxlength="20" outlined></mwc-textfield>
        <!--
        <mwc-select name="kpi-value"  label="Werte" outlined >
          <mwc-list-item value="scala3">Scala 1 - 3</mwc-list-item>
          <mwc-list-item value="scala10">Scala 1 - 10</mwc-list-item>       
        </mwc-select> -->

        <mwc-textfield name="kpi" label="KPI" maxlength="20" outlined></mwc-textfield>
     
        <!--
        <fieldset class="input">
          <legend>Verbinder (Eingang)</legend>
          <mwc-formfield label="links">
            <mwc-checkbox name="inputLeft"></mwc-checkbox>
          </mwc-formfield>
          <mwc-formfield label="oben">
            <mwc-checkbox name="inputTop"></mwc-checkbox>
          </mwc-formfield>
          <mwc-formfield label="rechts">
            <mwc-checkbox name="inputRight"></mwc-checkbox>
          </mwc-formfield>
          <mwc-formfield label="unten">
            <mwc-checkbox name="inputBottom"></mwc-checkbox>
          </mwc-formfield>
        </fieldset>

        <fieldset class="output">
          <legend>Verbinder (Ausgang)</legend>
          <mwc-formfield label="links">
            <mwc-checkbox name="outputLeft"></mwc-checkbox>
          </mwc-formfield>
          <mwc-formfield label="oben">
            <mwc-checkbox name="outputTop"></mwc-checkbox>
          </mwc-formfield>
          <mwc-formfield label="rechts">
            <mwc-checkbox name="outputRight"></mwc-checkbox>
          </mwc-formfield>
          <mwc-formfield label="unten">
            <mwc-checkbox name="outputBottom"></mwc-checkbox>
          </mwc-formfield>
        </fieldset>
-->
      </form>
      <mwc-button
      @click="${() => this.save()}"
          slot="primaryAction">
        Speichern
      </mwc-button>
      <mwc-button
          dialogAction="cancel"
          slot="secondaryAction">
        Abbrechen
      </mwc-button>
    </mwc-dialog>

 
    `;
  }

  async open(x = 100, y = 100, parent = '', level = 1) {
    // console.log(parent);
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.level = level;
    /*
    this.attr = {
      id: uuidv4(),
      userData: {
        kpi: [],
        level,
        parent,
        text: '',
        figure: 'rectangle',
        bgColor: 'blue',
        buttons: [],
        //   ports: [uuidv4(), uuidv4(), uuidv4(), uuidv4()],
      },
      //  x,
      //  y,
      height: 100,
      width: 200,
      x: x + 20,
      y: y + 50,
    };
*/
    //  this.x = x;
    //  this.y = y;
    // this.level = level;

    await store.dispatch(getTypes());

    this.text.value = '';
    //    this.parent.value = parent;
    this.bgColor.value = '';
    //  this.kpi1.value = '';
    //  this.kpi2.value = '';
    //  this.kpi3.value = '';

    this.dialog.show();
  }

  stateChanged(rootState: RootState): void {
    this.types = typeSelectors.selectAll(rootState);
  }

  firstUpdated(): void {
    this.dialog = this.shadowRoot.querySelector('mwc-dialog');
    this.form = this.shadowRoot.querySelector('form');

    this.text = this.shadowRoot.querySelector('[name="text"]');
    this.parent = this.shadowRoot.querySelector('[name="parent"]');
    this.bgColor = this.shadowRoot.querySelector('[name="bgColor"]');

    this.kpi = this.shadowRoot.querySelector('[name="kpi"]');
    //    this.kpi2 = this.shadowRoot.querySelector('[name="kpi2"]');
    //    this.kpi3 = this.shadowRoot.querySelector('[name="kpi3"]');

    // this.types = this.getItem('types', []);
  }
}
