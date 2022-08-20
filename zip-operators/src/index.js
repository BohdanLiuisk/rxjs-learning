import { fromEvent, zip, pipe, of, interval, take, forkJoin } from 'rxjs';
import { zipAll, delay, map, mergeMap, switchMap  } from 'rxjs/operators';

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
  map((e) => ({ x: e.clientX, y: e.clientY }))
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

//wait until all observables have emitted a value then emit all as an array
//output: ["Hello", "World!", "Goodbye", "World!"]
const example = zip(
  of('Hello'),
  of('World!').pipe(delay(1000)),
  of('Goodbye').pipe(delay(2000)),
  of('World!').pipe(delay(3000))
).subscribe(val => console.log(val));

const intervalSource = interval(1000);
//when one observable completes no more values will be emitted
//output: [0,0]...[1,1]...[2, 2]
zip(intervalSource, intervalSource.pipe(take(3)))
  .subscribe(val => console.log(val));

const myPromise = val =>
  new Promise(resolve =>
    setTimeout(() => resolve(`Promise Resolved: ${val}`), 2000)
  );

//emit array of all 5 results
/*
  output:
  [
   "Promise Resolved: 1",
   "Promise Resolved: 2",
   "Promise Resolved: 3",
   "Promise Resolved: 4",
   "Promise Resolved: 5"
  ]
*/
of([1, 2, 3, 4, 5])
.pipe(mergeMap(q => 
  forkJoin(q.map(myPromise)))
)
.subscribe(val => console.log(val));
