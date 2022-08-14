import { fromEvent, zip, pipe, of, interval, take } from 'rxjs';
import { zipAll, delay, map } from 'rxjs/operators';

const source1 = of(1, 2, 3, 4);
const source2 = of('a', 'b', 'c');

//Collects all observable inner sources from the source, once the source completes, 
//it will subscribe to all inner sources, combining their values by index and emitting them.
// [1, 'a']
// [2, 'b']
// [3, 'c']
document.getElementById('zip-all').addEventListener('click', () => {
  of(source1.pipe(delay(2000)), source2)
    .pipe(zipAll())
    .subscribe(val => console.log(val));
});

const log = (event, val) => `${ event }: ${ JSON.stringify(val) }`;
const getCoords = pipe(
  map((e) => ({ x:e.clientX, y:e.clientY }))
);
const documentEvent = eventName => fromEvent(document, eventName).pipe(getCoords);
//After all observables emit, emit values as an array
//start: {"x":359,"y":305} end: {"x":804,"y":334}
zip(documentEvent('mousedown'), documentEvent('mouseup'))
  .subscribe(e => console.log(`${log('start', e[0])} ${log('end', e[1])}`));

const eventTime = eventName => fromEvent(document, eventName).pipe(map(() => new Date()));
const mouseClickDuration = zip(
  eventTime('mousedown'),
  eventTime('mouseup')
).pipe(map(([start, end]) => Math.abs(start.getTime() - end.getTime())));
mouseClickDuration.subscribe(console.log);

const sourceOne = of('Hello');
const sourceTwo = of('World!');
const sourceThree = of('Goodbye');
const sourceFour = of('World!');
//wait until all observables have emitted a value then emit all as an array
const example = zip(
  sourceOne,
  sourceTwo.pipe(delay(1000)),
  sourceThree.pipe(delay(2000)),
  sourceFour.pipe(delay(3000))
);
//output: ["Hello", "World!", "Goodbye", "World!"]
const subscribe = example.subscribe(val => console.log(val));

const intervalSource = interval(1000);
//when one observable completes no more values will be emitted
const intervalObservable = zip(intervalSource, intervalSource.pipe(take(3)));
//output: [0,0]...[1,1]...[2, 2]
const interval$ = intervalObservable.subscribe(val => console.log(val));
