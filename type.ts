import store from './store.ts';
import Button from './button.ts';
import { addElement } from './element-store.ts';
import { updatePorts, deleteType, savePosition } from './type-store';
import { Attribute } from './types.ts';
import { debounce } from 'lodash';

const PortLocatorRight = draw2d.layout.locator.PortLocator.extend({
  init: function () {
    this._super();
  },
  relocate: function (index, figure) {
    var p = figure.getParent();
    this.applyConsiderRotation(figure, p.getWidth(), p.getHeight() / 2);
  },
});

// const Element = draw2d.shape.basic.Rectangle.extend({
const Element = draw2d.shape.composite.Jailhouse.extend({
  NAME: 'Type',

  addTitle: function (text) {
    const editorAttr = {
      onCommit: (text) => {
        this.userData = {
          ...this.userData,
          text,
        };
      },
    };

    // const editor = new draw2d.ui.LabelInplaceEditor(editorAttr);

    const labelAttr = {
      text,
      fontColor: '#000',
      stroke: 0,
      fontSize: 20,
      //  editor,
    };

    const label = new draw2d.shape.basic.Label(labelAttr);

    const LabelLocator = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, 10, 0);
      },
    });

    //this.add(label, new draw2d.layout.locator.CenterLocator());
    this.add(label, new LabelLocator());
    return label;
  },

  addButton: function (userData) {
    const buttonAttr = {
      // bgColor: attr.bgColor,
      cssClass: `button`,
      text: `Neu`,
      //    action: () => app.addElement(item, this),
      action: () =>
        userData.action(this.x, this.y, this.id, this.userData.level + 1),
    };

    const button = new Button(buttonAttr);
    const LabelLocator = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth() - 100, 0);
      },
    });

    this.add(button, new LabelLocator());

    return button;
  },

  addKpi: function (attr) {
    const footer = new draw2d.shape.layout.HorizontalLayout();

    const kpis = attr.kpi.map((kpi, index) => {
      const labelAttr = {
        text: `${kpi.key}:`,
        fontColor: '#000',
        stroke: 0,
        fontSize: 16,
        //  xbgColor: 'red',
        //  xheight: 40,
        //        editor,
      };

      const key = new draw2d.shape.basic.Label(labelAttr);

      footer.add(key);

      const editorAttr = {
        onCommit: (text) => {
          //   console.log(this.userData.kpi, index);

          const kpi = [...this.userData.kpi];
          kpi[index] = {
            key: kpi[index].key,
            value: text,
          };

          this.userData = {
            ...this.userData,
            kpi,
          };
        },
      };

      const editor = new draw2d.ui.LabelInplaceEditor(editorAttr);
      const valueAttr = {
        text: kpi.value || 1,
        fontColor: '#000',
        stroke: 0,
        fontSize: 16,
        bgColor: '#00000010',
        //  xheight: 40,
        editor,
      };

      const value = new draw2d.shape.basic.Label(valueAttr);
      footer.add(value);

      return { key, value };
    });

    const Locator = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, 0, p.getHeight() - 26);
      },
    });

    this.add(footer, new Locator());

    return kpis;
  },

  addPorts: function (ports) {
    var PortLocatorLeft = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, 0, p.getHeight() / 2);
      },
    });

    var PortLocatorRight = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth(), p.getHeight() / 2);
      },
    });

    const PortLocatorTop = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth() / 2, 0);
      },
    });

    const PortLocatorBottom = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth() / 2, p.getHeight());
      },
    });

    //  if (userData.inputLeft) {
    // this.createPort('hybrid', new PortLocatorLeft());
    //  }

    //  if (userData.inputTop) {
    // this.createPort('hybrid', new PortLocatorTop());
    //  }

    //  if (userData.outputRight) {
    // this.createPort('hybrid', new PortLocatorRight());
    //  }

    let hybridPort = new draw2d.HybridPort({ id: ports[0] });
    this.addPort(hybridPort, new PortLocatorTop());

    hybridPort = new draw2d.HybridPort({ id: ports[1] });
    this.addPort(hybridPort, new PortLocatorRight());

    hybridPort = new draw2d.HybridPort({ id: ports[2] });
    this.addPort(hybridPort, new PortLocatorBottom());

    //  if (userData.outputBottom) {
    hybridPort = new draw2d.HybridPort({ id: ports[3] });
    this.addPort(hybridPort, new PortLocatorLeft());

    //     this.createPort('hybrid', new PortLocatorBottom());
    //  }

    // console.log(this.hybridPorts.data[3].id);

    const updatePort = (number, connection) => {
      //  console.log(
      //    'onConnect',
      //    number,
      //        this.userData.text,
      //    connection.sourcePort?.id,
      //    connection.targetPort?.parent.id
      //  );

      const ports = this.hybridPorts.data.map((item) => ({
        id: item.id,
        conn: !!item.connections,
        //       conn: item.connections.data.length,
      }));

      const userData = {
        ...this.userData,
        //  ports,
        //  sourcePort: connection.sourcePort?.id,
        sourcePorts: [...this.userData.sourcePorts, connection.sourcePort?.id],
      };

      const data = {
        id: this.id,
        type: this.type,
        height: this.height,
        width: this.width,
        x: this.x,
        y: this.y,
        userData,
      };

      store.dispatch(updatePorts(data));
    };
    /*
    this.hybridPorts.data[0].onConnect = (connection) => {
      updatePort(0, connection);
    };
    this.hybridPorts.data[1].onConnect = (connection) => {
      updatePort(1, connection);
    };
    this.hybridPorts.data[2].onConnect = (connection) => {
      updatePort(2, connection);
    };
    this.hybridPorts.data[3].onConnect = (connection) => {
      updatePort(3, connection);
    };
    */
  },

  init: function (attr: Attribute) {
    const { height, userData } = attr;
    const { text, level, bgColor } = userData;

    //  console.log(userData);

    const elementAttr = {
      ...attr,
      cssClass: `type ${bgColor}-${userData.level}`,
      //  userData,
      //  fill: 'green',
      // xheight: 80,
      // xwidth: 240,
      // resizable: false,
      // xselectable: false,
      //   'stroke-width': 0,
      //  draggable: false,
    };

    this._super(elementAttr);

    //  console.log('init', elementAttr.composite);

    // this.jailhouse = this.addJailhouse(attr);

    //   this.label = this.addLabel(attr.id + ' | ' + attr.composite);
    this.title = this.addTitle(text);
    this.button = this.addButton(userData);
    this.kpis = this.addKpi(userData);
    this.addPorts(userData.ports);

    const resizeListener = debounce((id, x, y, height, width) => {
      const data = {
        id,
        x,
        y,
        height,
        width,
      };

      // console.log('resizeListener', data);
      store.dispatch(savePosition(data));
    }, 500);

    this.on('change:dimension', ({ height, width }) =>
      resizeListener(this.id, this.x, this.y, height, width)
    );

    // this.attachResizeListener(this.resizeListener);
  },

  assignFigure: function (figure) {
    if (figure instanceof draw2d.Connection) return;

    // console.log('assignFigure');

    this._super(figure);

    figure.title.toFront();
    figure.button.toFront();

    figure.kpis.forEach(({ key, value }) => {
      key.toFront();
      value.toFront();
    });

    figure.getPorts().each((i, port) => {
      port.toFront();
      port.getConnections().each((i, connection) => {
        connection.toFront();
      });
    });

    return this;
  },

  createShapeElement: function () {
    var shape = this._super();
    this.originalWidth = 270;
    this.originalHeight = 184;
    return shape;
  },

  createSet: function () {
    const set = this.canvas.paper.set();
    let shape = null;

    // console.log(this.userData);

    switch (this.userData.figure) {
      case 'process':
        shape = this.canvas.paper.path('M0,0 L220,0 L270,92 L220,184 L0,184');
        break;

      default:
        shape = this.canvas.paper.path('M0,0 L270,0 L270,184 L0,184');
        break;
    }

    // Rectangle

    set.push(shape);

    return set;
  },

  // resizeListener: function ({ height, width }) {

  onDragEnd: function (x, y, shiftKey, ctrlKey) {
    this._super(x, y, shiftKey, ctrlKey);

    const data = {
      id: this.id,
      x: this.x,
      y: this.y,
    };

    store.dispatch(savePosition(data));
  },

  onContextMenu: function (x, y) {
    $.contextMenu({
      selector: 'body',
      events: {
        hide: function () {
          $.contextMenu('destroy');
        },
      },
      callback: function (key, options) {
        switch (key) {
          case 'delete':
            var cmd = new draw2d.command.CommandDelete(this);
            this.getCanvas().getCommandStack().execute(cmd);
            store.dispatch(deleteType(this.id));
            break;

          default:
            break;
        }
      }.bind(this),
      x: x,
      y: y,
      items: {
        //   sep1: '---------',
        delete: { name: 'Löschen' },
      },
    });
  },

  // applyAlpha: function () {},
});

export default Element;

export { PortLocatorRight };
