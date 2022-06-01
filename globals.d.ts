

global.draw2d = 'world';
global.Class = 'world';

declare const draw2d: any;
declare const Class: any;

declare global {
    interface Window {
        Class: any;
        draw2d: any;
    }
  }
