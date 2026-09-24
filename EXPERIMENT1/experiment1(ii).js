const EventEmitter = require('events');

class Button extends EventEmitter{};  // class

const button = new Button (); // object

button.on('click' , () => {
    console.log("Button Clicked!");
});

button.on ( 'mouseover', () => {
    console.log (" Mouse is over the button ");
});

button.emit('click');
button.emit('mouseover');
