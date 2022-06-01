import { LitElement, css, html, customElement, property } from 'lit-element';
// import { state } from 'lit/decorators.js';
import { createConnection } from './connection.ts';
import { v4 as uuidv4 } from 'uuid';
import store, { RootState } from './store.ts';
import { addType, typeSelectors } from './type-store.ts';
import { connect } from 'pwa-helpers';
import Canvas from './canvas.ts';
import Element from './element.ts';
import { createConnection, addConnection } from './connection.ts';
import { typeSelectors, setTypes, getTypes } from './type-store.ts';
import {
  getElements,
  addElement,
  elementSelectors,
  selectElementRepaint,
  resetElements,
  setElementRepaint,
  setElements,
} from './element-store.ts';
import {
  setConnections,
  resetConnections,
  getConnections,
  selectConnectionRepaint,
  removeConnection,
  connectionSelectors,
  setConnectionRepaint,
} from './connection-store.ts';
import { Attribute, UserData } from './types';
import { debounce } from 'lodash';

import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-select';
import '@material/mwc-formfield';
import '@material/mwc-checkbox';
import '@material/mwc-list/mwc-list-item';
import { drawBoardStyles } from './draw-board-styles';

const DRAW_DEBOUNCE = 200;

@customElement('draw-board')
export class DrawBoard extends connect(store)(LitElement) {
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
  types = [];

  @property()
  elements = [];

  @property()
  connections = [];

  private drawing = false;

  save() {
    const writer = new draw2d.io.json.Writer();
    writer.marshal(this.canvas, async (json) => {
      // convert the json object into string representation
      //  var jsonTxt = JSON.stringify(json, null, 2);

      const elements = json.filter((item) => item.type === 'Element');
      // console.log(elements);
      //  this.setItem('elements', elements);
      await store.dispatch(setElements(elements));

      const connections = json.filter((item) => item.type === 'Connection');
      //  console.log(connections);
      // this.setItem('connections', connections);
      await store.dispatch(setConnections(connections));
    });
  }

  async reset() {
    //   this.elements = [];
    //   this.types = [];
    // await store.dispatch(setElements([]));
    await store.dispatch(resetElements());
    await store.dispatch(resetConnections());
    //    await store.dispatch(setTypes([]));

    //   this.setItem('elements', this.elements);
    //   this.setItem('types', this.types);
    //   location.reload();
  }

  // dialog: HTMLFormElement;
  render() {
    return html`
 <!--     <mwc-button @click="${() => this.save()}" outlined>
        Speichern
      </mwc-button> -->
      <mwc-button @click="${() => this.reset()}" outlined>
        Reset
      </mwc-button>

      ${this.types
        .filter((item) => !item.userData.parent)
        .map(
          (item: Attribute) => html`
              <mwc-button
              @click="${() => {
                //        const buttons = this.types.filter(
                //          (type) => item.id === type.userData.parent
                //       );

                //  console.log(item.userData);

                //    const attr: Attribute = {
                //      ...item,
                //      id: uuidv4(),
                const userData: Partial<UserData> = {
                  ...item.userData,
                  level: 1,
                  buttons: this.types,
                  typeId: item.id,
                  //   ports: [uuidv4(), uuidv4(), uuidv4(), uuidv4()],
                  // sour
                };
                //  };

                //  console.log(item);

                store.dispatch(addElement({ item, userData }));
                //              store.dispatch(addElement(item));
              }}" outlined
              >
                + ${item.userData.text}
              </mwc-button>
      `
        )}

        <div id="gfx_holder"></div>

      <new-type-dialog></new-type-dialog> 

    `;
  }

  private draw = debounce((rootState) => {
    // console.log('draw', this.canvas);

    store.dispatch(setConnectionRepaint(false));
    store.dispatch(setElementRepaint(false));

    this.drawing = true;
    console.log('draw');

    this.types = typeSelectors.selectAll(rootState);
    this.elements = elementSelectors.selectAll(rootState);
    this.connections = connectionSelectors.selectAll(rootState);
    // this.typeConnections = connectionSelectors.selectAll(rootState);

    this.canvas.clear();
    //  console.log('stateChanged', this.canvas);

    // console.log('elements', this.elements.length);

    const elements = this.elements
      .sort((a, b) => a.userData.level - b.userData.level)
      .map((item) => {
        const types = this.types.filter(
          (type) => item.id === type.userData.parent
        );

        const node = new Element(item, types);

        //    console.log(this.canvas);

        this.canvas.add(node, item.x, item.y);

        //   node.composite = item.composite;
        // console.log('new', item.userData.level, node.composite);

        // item.assignFigure(elements);

        return node;
      });

    const connections = connectionSelectors.selectAll(rootState);

    connections.forEach((connection) => {
      //   console.log(item);

      let sourcePort = null;
      let targetPort = null;

      elements.forEach((element) => {
        element.hybridPorts.data.forEach((port) => {
          //      console.log('source check', port.id, connection.source.id);
          //       console.log('target check', port.id, connection.target.id);

          if (port.id === connection.source.id) {
            sourcePort = port;
          }
          if (port.id === connection.target.id) {
            targetPort = port;
          }
        });
      });

      let c = addConnection(connection.id, sourcePort, targetPort);
      this.canvas.add(c);
    });

    elements.forEach((item) => {
      const parent = elements.find((node) => node.id === item.userData.parent);

      if (parent) {
        parent.assignFigure(item);
      }
    });

    this.drawing = false;
  }, DRAW_DEBOUNCE);

  stateChanged(rootState: RootState): void {
    const elementRepaint = selectElementRepaint(rootState);
    const connectionRepaint = selectConnectionRepaint(rootState);

    if (elementRepaint || connectionRepaint) {
      this.draw(rootState);
    }
  }

  async firstUpdated() {
    //  this.dialog = this.shadowRoot.querySelector('new-type-dialog');
    //  this.form = this.shadowRoot.querySelector('form');

    // this.tabBar = this.shadowRoot.querySelector('mwc-tab-bar');

    //   this.elements = this.getItem('elements', []);
    // this.types = this.getItem('types', []);
    // elements = this.getItem('elements', []);

    //   this.canvas = new draw2d.Canvas('gfx_holder');
    //    this.canvas = window.getCanvas();
    const container = this.shadowRoot.querySelector('#gfx_holder');
    this.canvas = new Canvas(container);
    //    this.canvas = new Canvas(container, 800, 800);

    this.canvas.installEditPolicy(
      new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection,
      })
    );

    const MyInterceptorPolicy =
      draw2d.policy.canvas.DropInterceptorPolicy.extend({
        init: function (attr, getter, setter) {
          this._super(attr, getter, setter);
        },

        delegateTarget: function (requestingFigure, connectTarget) {
          // we allow that a figure with a special class is droppable to a connection
          //
          // console.log(
          //   requestingFigure.parent?.userData.typeId,
          //          requestingFigure.parent?.userData.sourcePorts,
          //  connectTarget.parent?.userData.ports
          //   connectTarget.parent?.userData.ports
          // );

          const allowed = connectTarget.parent?.userData.ports.some(
            (item) => item.allowed === requestingFigure.parent?.userData.typeId
          );

          //      console.log(allowed);

          if (allowed) {
            return this._super(requestingFigure, connectTarget);
          }

          return null;
        },
      });

    this.canvas.installEditPolicy(new MyInterceptorPolicy());

    this.canvas.on('connect', (a, { port, connection }) => {
      //   console.log(a);
      console.log('connect drawing', this.drawing);

      //  return;

      if (this.drawing) {
        return;
      }

      const data: any = {
        id: connection.id,
        source: {
          id: connection.sourcePort.id,
          parentId: connection.sourcePort.parent.id,
        },
        target: {
          id: connection.targetPort.id,
          parentId: connection.targetPort.parent.id,
        },
      };

      //// await store.dispatch(updatePorts(data));
      store.dispatch(setConnections(data));
    });

    this.canvas.on('disconnect', (a, { port, connection }) => {
      console.log(connection.id);

      if (this.drawing) {
        return;
      }

      store.dispatch(removeConnection(connection.id));
    });

    await store.dispatch(getTypes());
    await store.dispatch(getElements());
    await store.dispatch(getConnections());

    //  this.initialize();
  }
}
