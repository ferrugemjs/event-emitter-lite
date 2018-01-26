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


//test with done

var evt1 = new evtemitter.EventEmitter();

evt1.subscribe(
	msg => {
		console.time('init1');
		return new Promise((success,reject) =>{
			setTimeout(() => {
				reject('sub 1');				
			},2000);
		});
	}
	,err => console.log(`sub1:error --> ${err}`)
);

evt1.subscribe(
	(msg,evt) => {		
		console.log(`sub2:success --> ${msg}`);
		//evt.resolve({a:'funciona pow!'});
		return new Promise((success,reject) =>{
			setTimeout(() => {
				console.timeEnd('init1');
				success('sub 2');				
			},1000);
		});
	}	
	,err => console.log(`sub2:error --> ${err}`)
);

		/*evt1
			.emit('test with done!!!')[0]
			.then(msg => console.log(msg));*/

	Promise.all(
		evt1
			.emit('test with done!!!')
	)
	.then(() => console.log('tudo feito!'))
	.catch(e => console.log('erro em alguem:',e));

/*
evt1
	.emit('test with done!!!')[0]
	.then(msgF => console.log(msgF));
*/	

