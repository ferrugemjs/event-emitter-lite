# event-emitter-lite

npm install event-emitter-lite

### use

#### import to use
``` javascript
let eventemitter = require("event-emitter-lite");
```

#### API
``` javascript
let onTest = new eventemitter.EventEmitter();
```
##### subscribe
``` javascript
onTest.subscribe(msg => console.log(msg));
```
##### once
``` javascript
onTest.once(msg => console.log(`One more time: ${msg}`));
```
##### cancel the next call
``` javascript
let egoistSubscribe = onTest.subscribe(msg =>{
    console.log(`the Dalek sad: ${msg}`);
    onTest.cancel();
});

onTest.subscribe(msg => console.log(`Im not a Dalek: ${msg}`));
```
##### emit
``` javascript
onTest.emit('go go go!!!');
```
##### unsubscribe
``` javascript
onTest.unsubscribe(egoistSubscribe);
```

##### cancel by subscribe
``` javascript
egoistSubscribe.cancel();
```

##### emit again and again ....
``` javascript
onTest.emit('go go go!!!');
```
##### getting emitted value
``` javascript
onTest.emit('last chance...');
console.log(`Would it recieve the last msg? ${onTest.emittedValue}`); 
//yes :)
```

##### working with errors
with javascript
``` javascript
let onTest = new eventemitter.EventEmitter();
onTest.subscribe(
	msg => console.log(msg)
	, err => console.log(err)
);

onTest.error('It´s is a multiverse erro!');

```
with typescript
``` typescript
let onTest = new EventEmitter<string,string>();
onTest.subscribe(
	msg => console.log(msg)
	, err => console.log(err)
);

onTest.error('It´s is a multiverse erro!');

```



