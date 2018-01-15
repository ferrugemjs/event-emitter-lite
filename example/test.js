var evtemitter = require("../dist/commonjs/EventEmitter");

var myEvt = new evtemitter.EventEmitter();


myEvt.subscribe(msg => {
	console.log("1:"+msg);
});

myEvt.emit("first msg!");

let sub_once = myEvt.once(msg => {
	console.log("once:"+msg);
});

var sub_egoist = myEvt.subscribe(msg => {
	console.log("2:"+msg);
	myEvt.cancel(sub_egoist);
});
var insc_3 =  myEvt.subscribe(msg => {
	console.log("3:"+msg);
});

myEvt.emit("first msg!");

myEvt.unsubscribe(sub_egoist);

myEvt.emit("second msg!");


console.log(myEvt._events);

insc_3.cancel();

console.log('after');

console.log(myEvt._events);

sub_once.cancel();

myEvt.subscribe(
	msg => console.log(`msg:${msg}`)
	,erro => console.log(`erro:${erro}`)
);


myEvt
	.error(123);
