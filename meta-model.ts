import { LitElement, css, html, customElement, property } from 'lit-element';
// import { state } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import store, { RootState } from './store.ts';
import { addType, typeSelectors } from './type-store.ts';
import { connect } from 'pwa-helpers';
import Type, { PortLocatorRight } from './type.ts';
import Canvas from './canvas.ts';
import { Attribute } from './types.ts';
import { addConnection, createConnection } from './connection.ts';
import {
  getConnections,
  typeConnectionSelectors,
  setTypeConnections,
  setConnectionRepaint,
  removeTypeConnection,
  resetTypeConnections,
  selectConnectionRepaint,
} from './store/type-connections.ts';
import {
  typeSelectors,
  setTypes,
  getTypes,
  editType,
  setTypeRepaint,
  selectTypeRepaint,
} from './type-store.ts';
import { drawBoardStyles } from './draw-board-styles';
import { debounce } from 'lodash';

import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-select';
import '@material/mwc-formfield';
import '@material/mwc-checkbox';
import '@material/mwc-list/mwc-list-item';
import './new-type-dialog';
import './edit-type-dialog';
import { Attribute } from './types';

const DRAW_DEBOUNCE = 200;

@customElement('meta-model')
export class MetaModel extends connect(store)(LitElement) {
  // @query('mwc-dialog')
  // dialog: HTMLFormElement;

  static get styles() {
    return [
      drawBoardStyles,
      css`
      #gfx_holder {
        position: absolute;
        top: 110px;
        width: 300vw;
        height: 300vh;
        xdisplay: none;
        overflow: hidden;
        background-color: var(--material-color-grey-100);
      }
    `,
    ];
  }

  @property()
  canvas: HTMLFormElement;

  @property()
  newDialog: HTMLFormElement;

  @property()
  editDialog: HTMLFormElement;

  @property()
  types = [];

  @property()
  elements = [];

  @property()
  connections = [];

  private drawing = false;

  async reset() {
    //   this.elements = [];
    //   this.types = [];
    //  await store.dispatch(setElements([]));
    await store.dispatch(setTypes([]));
    await store.dispatch(resetTypeConnections());

    //   this.setItem('elements', this.elements);
    //   this.setItem('types', this.types);
    //   location.reload();
  }

  // dialog: HTMLFormElement;
  render() {
    return html`

      <mwc-button @click="${() => this.newDialog.open()}" outlined>
        Neu
      </mwc-button>
      <mwc-button @click="${() => this.reset()}" outlined>
        Reset
      </mwc-button> 

      <div id="gfx_holder"></div>

      <new-type-dialog></new-type-dialog> 
      <edit-type-dialog></edit-type-dialog> 
    `;
  }

  private draw = debounce(async (rootState) => {
    // console.log('draw', this.canvas);

    await store.dispatch(setConnectionRepaint(false));
    await store.dispatch(setTypeRepaint(false));

    //   const elementRepaint = selectTypeRepaint(rootState);
    //   const connectionRepaint = selectConnectionRepaint(rootState);

    //   if (!elementRepaint && !connectionRepaint) {
    //     return;
    //   }

    this.drawing = true;
    console.log('draw');

    //  const numOfConn = typeConnectionSelectors.selectTotal(rootState);
    //  console.log('numOfConn 2', numOfConn);

    this.types = typeSelectors.selectAll(rootState);
    const connections = typeConnectionSelectors.selectAll(rootState);

    this.canvas.clear();

    const elements = this.types
      .sort((a, b) => b.userData.level - a.userData.level)
      .map((item) => {
        const attr: Attribute = {
          ...item,
          userData: {
            ...item.userData,
            action: (x, y, parent, level) =>
              this.newDialog.open(x, y, parent, level),
          },
        };

        const node = new Type(attr);
        // const node = new Type();
        //      console.log(node);
        // const _this = this;

        node.onDoubleClick = (a) => {
          // node.onClickx = function () {

          const { height, id, userData } = item;
          const { text, figure, bgColor, parent } = userData;

          // console.log('onDoubleClick 2', a, item);
          this.editDialog.open(id, text, figure, bgColor);
        };

        this.canvas.add(node, item.x, item.y);

        //   node.composite = item.composite;
        // console.log('new', item.userData.level, node.composite);

        // item.assignFigure(elements);

        return node;
      });

    //  items = this.getItem('connections', []);
    connections.forEach((item) => {
      //   console.log(item);

      let sourcePort = null;
      let targetPort = null;

      elements.forEach((element) => {
        element.hybridPorts.data.forEach((port) => {
          if (port.id === item.source.id) {
            sourcePort = port;
          }
          if (port.id === item.target.id) {
            targetPort = port;
          }
        });
      });

      let c = addConnection(item.id, sourcePort, targetPort);
      this.canvas.add(c);
    });

    elements
      //  .sort((a, b) => b.userData.level - a.userData.level)
      .forEach((item) => {
        const parent = elements.find(
          (node) => node.id === item.userData.parent
        );
        if (parent) {
          parent.assignFigure(item);
        }
      });

    this.drawing = false;
  }, DRAW_DEBOUNCE);

  stateChanged(rootState: RootState): void {
    const elementRepaint = selectTypeRepaint(rootState);
    const connectionRepaint = selectConnectionRepaint(rootState);

    //  const numOfTypes = typeSelectors.selectTotal(rootState);
    //  console.log('numOfTypes', numOfTypes);

    //  const numOfConn = typeConnectionSelectors.selectTotal(rootState);
    //  console.log('numOfConn', numOfConn);

    if (elementRepaint || connectionRepaint) {
      this.drawing = true;
      this.draw(rootState);
      //    this.drawing = false;
    }
  }

  //  openDialog() {}

  async firstUpdated() {
    this.newDialog = this.shadowRoot.querySelector('new-type-dialog');
    this.editDialog = this.shadowRoot.querySelector('edit-type-dialog');
    //  this.form = this.shadowRoot.querySelector('form');

    // this.tabBar = this.shadowRoot.querySelector('mwc-tab-bar');

    //   this.elements = this.getItem('elements', []);
    // this.types = this.getItem('types', []);
    // elements = this.getItem('elements', []);

    //   this.canvas = new draw2d.Canvas('gfx_holder');

    const container = this.shadowRoot.querySelector('#gfx_holder');
    this.canvas = new Canvas(container);
    // console.log('firstUpdated', this.canvas);

    this.canvas.installEditPolicy(
      new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection,
      })
    );

    this.canvas.on('connect', (a, { port, connection }) => {
      console.log('connect drawing', this.drawing);

      //  return;

      if (this.drawing) {
        return;
      }

      //  const userData = {
      //    ...this.userData,
      //  ports,
      //  sourcePort: connection.sourcePort?.id,
      //    sourcePorts: [...this.userData.sourcePorts, connection.sourcePort?.id],
      //  };

      // console.log('connection.sourcePort', connection.sourcePort);

      const sourceIndex =
        connection.sourcePort.parent.hybridPorts.data.findIndex(
          (i) => i.id === connection.sourcePort.id
        );

      const targetIndex =
        connection.targetPort.parent.hybridPorts.data.findIndex(
          (i) => i.id === connection.targetPort.id
        );

      // console.log(aa);
      // console.log(connection.sourcePort.locator instanceof PortLocatorRight);

      const pos = {};
      pos[0] = 'top';
      pos[1] = 'right';
      pos[2] = 'bottom';
      pos[3] = 'left';

      const data: Attribute = {
        //        type: this.type,
        //        height: this.height,
        //        width: this.width,
        //        x: this.x,
        //        y: this.y,
        // userData: {
        id: connection.id,
        source: {
          id: connection.sourcePort.id,
          parentId: connection.sourcePort.parent.id,
          position: pos[sourceIndex],
        },
        target: {
          id: connection.targetPort.id,
          parentId: connection.targetPort.parent.id,
          position: pos[targetIndex],
        },
        //   target: connection.targetPort.id,

        // },
      };

      //// await store.dispatch(updatePorts(data));
      store.dispatch(setTypeConnections(data));
      //  setTimeout(() => store.dispatch(setConnections(data)), 0);
      //     connection.sourcePort.id,
      //     connection.sourcePort.parent.id,
    });

    this.canvas.on('disconnect', (a, { port, connection }) => {
      console.log(connection.id);

      if (this.drawing) {
        return;
      }

      store.dispatch(removeTypeConnection(connection.id));
    });

    await store.dispatch(getTypes());
    //   await store.dispatch(getElements());
    await store.dispatch(getConnections());

    //  this.initialize();
  }
}
