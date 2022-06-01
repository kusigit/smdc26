import store from './store.ts';
import Button from './button.ts';
import { addElement, updateElement, deleteElement } from './element-store.ts';
import { v4 as uuidv4 } from 'uuid';
import { Attribute, UserData } from './types';
import { debounce } from 'lodash';

// const Element = draw2d.shape.basic.Rectangle.extend({
const Element = draw2d.shape.composite.Jailhouse.extend({
  NAME: 'Element',

  addTitle: function (text) {
    const editorAttr = {
      onCommit: (text) => {
        const data: Partial<Attribute> = {
          id: this.id,
          userData: {
            text,
          },
        };

        store.dispatch(updateElement(data));
      },
    };

    const editor = new draw2d.ui.LabelInplaceEditor(editorAttr);

    const labelAttr = {
      text,
      fontColor: '#000',
      stroke: 0,
      fontSize: 20,
      editor,
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

    this.add(label, new LabelLocator());
    return label;
  },

  addButton: function (userData, types) {
    //  const children = types.filter((item) => item.parent === userData.id);

    const header = new draw2d.shape.layout.HorizontalLayout({
      // xwidth: 300,
      // xheight: 1,
      gap: 10,
      //bgColor: 'red',
    });

    const buttons2 = types.filter(
      (type) => userData.typeId === type.userData.parent
    );

    const width = buttons2.length * 100;
    header.setDimension(width, 20);

    const buttons = buttons2.map((item) => {
      const buttonAttr = {
        // bgColor: attr.bgColor,
        cssClass: `button`,
        text: `+ ${item.userData.text}`,
        //    action: () => app.addElement(item, this),
        action: () => {
          //   const buttons = types.filter(
          //     (type) => item.id === type.userData.parent
          //   );

          // const attr: Attribute = {
          //   ...item,
          //   id: uuidv4(),
          const userData: Partial<UserData> = {
            //            ...item.userData,
            ...item.userData,
            buttons: types,
            level: this.userData.level + 1,
            parent: this.id,
            typeId: item.id,
          };
          // };

          console.log(item);

          store.dispatch(addElement({ item, userData }));
        },
      };

      const button = new Button(buttonAttr);
      header.add(button);

      return button;
    });

    const Locator = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth() - width, 0);
      },
    });

    // console.log(header.getWidth());

    this.add(header, new Locator());

    return buttons;
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

  addPorts: function (ports: any[]) {
    ports.forEach((port) => {
      if (port.position === 'top') {
        const PortLocatorTop = draw2d.layout.locator.PortLocator.extend({
          init: function () {
            this._super();
          },
          relocate: function (index, figure) {
            var p = figure.getParent();
            this.applyConsiderRotation(figure, p.getWidth() / 2, 0);
          },
        });

        const hybridPort = new draw2d.HybridPort({ id: port.id });
        this.addPort(hybridPort, new PortLocatorTop());

        // this.createPort('hybrid', new PortLocatorTop());
      }

      if (port.position === 'right') {
        const PortLocatorRight = draw2d.layout.locator.PortLocator.extend({
          init: function () {
            this._super();
          },
          relocate: function (index, figure) {
            var p = figure.getParent();
            this.applyConsiderRotation(figure, p.getWidth(), p.getHeight() / 2);
          },
        });

        const hybridPort = new draw2d.HybridPort({ id: port.id });
        this.addPort(hybridPort, new PortLocatorRight());
        //   this.createPort('hybrid', new PortLocatorRight());
      }

      if (port.position === 'left') {
        const PortLocatorLeft = draw2d.layout.locator.PortLocator.extend({
          init: function () {
            this._super();
          },
          relocate: function (index, figure) {
            var p = figure.getParent();
            this.applyConsiderRotation(figure, 0, p.getHeight() / 2);
          },
        });

        const hybridPort = new draw2d.HybridPort({ id: port.id });
        this.addPort(hybridPort, new PortLocatorLeft());
        //    this.createPort('hybrid', new PortLocatorLeft());
      }

      if (port.position === 'bottom') {
        const PortLocatorBottom = draw2d.layout.locator.PortLocator.extend({
          init: function () {
            this._super();
          },
          relocate: function (index, figure) {
            var p = figure.getParent();
            this.applyConsiderRotation(figure, p.getWidth() / 2, p.getHeight());
          },
        });

        const hybridPort = new draw2d.HybridPort({ id: port.id });
        this.addPort(hybridPort, new PortLocatorBottom());
        //       this.createPort('hybrid', new PortLocatorBottom());
      }
    });
  },

  init: function (attr, types) {
    const { height, userData } = attr;
    const { text, level, bgColor, buttons } = userData;

    //  console.log(userData);

    const elementAttr = {
      ...attr,
      cssClass: `element ${bgColor}-${level}`,
      //   fill: 'none',
      //   'stroke-width': 0,
      //  draggable: false,
    };

    this._super(elementAttr);

    //  console.log('init', elementAttr.composite);

    // this.jailhouse = this.addJailhouse(attr);

    //   this.label = this.addLabel(attr.id + ' | ' + attr.composite);
    this.title = this.addTitle(text);
    this.buttons = this.addButton(userData, buttons);
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
      store.dispatch(updateElement(data));
    }, 500);

    this.on('change:dimension', ({ height, width }) =>
      resizeListener(this.id, this.x, this.y, height, width)
    );
  },

  assignFigure: function (figure) {
    if (figure instanceof draw2d.Connection) return;

    // console.log('assignFigure');

    this._super(figure);

    figure.title.toFront();
    figure.buttons.forEach((button) => button.toFront());

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

  onDragEnd: function (x, y, shiftKey, ctrlKey) {
    this._super(x, y, shiftKey, ctrlKey);

    const data = {
      id: this.id,
      x: this.x,
      y: this.y,
    };

    store.dispatch(updateElement(data));
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
            store.dispatch(deleteElement(this.id));
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
