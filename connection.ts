import { v4 as uuidv4 } from 'uuid';

const Connection = draw2d.Connection.extend({
  /** required for JSON serialize/deserialize. **/
  NAME: 'Connection',

  init: function (id = uuidv4()) {
    const attr = {
      id,
      cssClass: 'connection',
      targetDecorator: new draw2d.decoration.connection.ArrowDecorator(),
    };

    this._super(attr);

    this.setRouter(new draw2d.layout.connection.ManhattanConnectionRouter());
    // this.setOutlineStroke(1);
    //  this.setOutlineColor('#303030');
    // this.setStroke(3);
    // this.setColor('#999');
    //  this.setRadius(20);
  },

  XonPainting: function (dx, dy, dx2, dy2) {
    this._super(dx, dy, dx2, dy2);
    console.log('onPainting');
  },

  /**
   * @method
   * called by the framework if the figure should show the contextmenu.</br>
   * The strategy to show the context menu depends on the plattform. Either loooong press or
   * right click with the mouse.
   *
   * @param {Number} x the x-coordinate to show the menu
   * @param {Number} y the y-coordinate to show the menu
   * @since 1.1.0
   */
  onContextMenu: function (x, y) {
    // console.log(x, y);

    $.contextMenu({
      selector: 'body',
      events: {
        hide: function () {
          $.contextMenu('destroy');
        },
      },
      callback: function (key, options) {
        switch (key) {
          case 'red':
            this.setColor('#f3546a');
            break;
          case 'green':
            this.setColor('#b9dd69');
            break;
          case 'blue':
            this.setColor('#00A8F0');
            break;
          case 'delete':
            // without undo/redo support
            //     this.getCanvas().remove(this);
            // with undo/redo support
            var cmd = new draw2d.command.CommandDelete(this);
            this.getCanvas().getCommandStack().execute(cmd);
          default:
            break;
        }
      }.bind(this),
      x: x,
      y: y,
      // maxWidth: 200,
      items: {
        //   red: { name: 'Red' },
        //   green: { name: 'Green' },
        //   blue: { name: 'Blue' },
        //   sep1: '---------',
        delete: { name: 'Löschen' },
      },
    });
  },
});

const createConnection = (id) => new Connection(id);

const addConnection = (id, sourcePort, targetPort) => {
  // return my special kind of connection
  const connection = createConnection(id);
  //  con.setRouter(new draw2d.layout.connection.ManhattanConnectionRouter());
  //  connection.setRouter(new // draw2d.layout.connection.SplineConnectionRouter());

  connection.setSource(sourcePort);
  connection.setTarget(targetPort);

  return connection;
};

export { addConnection, createConnection };
