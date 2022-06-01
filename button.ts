export default draw2d.shape.basic.Label.extend({
  init: function (attr) {
    const { action, text, bgColor } = attr;

    this.action = action;

    const shortText = text.length > 16 ? `${text.substring(0, 16)}...` : text;

    attr = {
      ...attr,
      xcssClass: 'button',
      //   cssClass: `button ${bgColor}`,
      text: shortText,
      xwidth: 300,
      fontSize: 16,
      xheight: 40,
      stroke: 0,
      xfontColor: '#fff',
      xstrokeColor: '#111',
      xradius: 4,
      bgColor: '#ccc',
      //selectable: false,
    };

    this._super(attr);
  },

  onClick: function () {
    //    alert('MyPolicy click:');
    this.action();
  },
});
