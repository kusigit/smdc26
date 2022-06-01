const Element = draw2d.shape.composite.Jailhouse.extend({
  NAME: 'Jailhouse',

  addLabel: function (text) {
    const editorAttr = {
      onCommit: (text) => {
        this.userData = {
          ...this.userData,
          text,
        };
      },
    };

    const editor = new draw2d.ui.LabelInplaceEditor(editorAttr);

    const labelAttr = {
      text,
      fontColor: '#000',
      stroke: 0,
      fontSize: 14,
      xbgColor: 'red',
      xheight: 40,
      editor,
    };

    const label = new draw2d.shape.basic.Label(labelAttr);

    const LabelLocator = draw2d.layout.locator.PortLocator.extend({
      init: function () {
        this._super();
      },
      relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, 0, -30);
      },
    });

    this.add(label, new LabelLocator());
  },

  init: function (attr, types) {
    const { height, userData } = attr;
    const { text, level, bgColor } = userData;

    // var p = this.getParent();
    // console.log(p.getWidth());

    const elementAttr = {
      //     ...attr,
      cssClass: `jailhouse ${bgColor}-${level}`,
      bgColor: 'red',
      width: attr.width - 100,
      height: attr.height - 60,
      id: attr.id,
      // draggable: true,
      // selectable: true,
    };

    //  console.log(elementAttr);

    this._super(elementAttr);

    this.addLabel(attr.id);
    //    this.addKpi(userData);
    //    this.addButton(types, userData, bgColor, level);
    //    this.addPorts(userData);
  },

  createShapeElement: function () {
    var shape = this._super();
    this.originalWidth = 670;
    this.originalHeight = 384;
    return shape;
  },

  xtoBack: function (figure) {
    this._super(figure);
    // console.log('toBack');
    // this._super(this.button);
    this.button?.toFront(this);
    //  this.kpi?.toFront(this);
    console.log(this.kpi);
    return this;
  },

  xonDrag: function (dx, dy, dx2, dy2) {
    console.log('onDrag', this);
    this._super(dx, dy, dx2, dy2);
    // return true;
  },

  xonDragStart: function () {
    console.log('onDragStart');
    return true;
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
