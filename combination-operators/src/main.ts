import { combineLatestAll, fromEvent, map, scan, startWith, combineLatest, Observable, delay, EMPTY, concat } from 'rxjs';
import { combineLatestAllSource$ } from './combine-latest-all';

const combiteLastestAllButtonId = 'combine-latest-all';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div><p id="wait-message"></p></div>
    <button id=${ combiteLastestAllButtonId }>Combine lastest all</button>
    <div>
      <button id="red">Red</button>
      <button id="black">Black</button>
    </div>
    <div>Red: <span id="red-total"></span></div>
    <div>Black: <span id="black-total"></span></div>
    <div>Total: <span id="total"></span></div>
  </div>
`;

/*
  2 values from source will map to 2 (inner) interval observables that emit every 1s.
  combineAll uses combineLatest strategy, emitting the last value from each
  whenever either observable emits a value
*/
document.getElementById(combiteLastestAllButtonId)?.addEventListener('click', () => {
  combineLatestAllSource$
  .pipe(
    combineLatestAll() //same as combineAll
  )
  .subscribe({
    next: (value) => {
      console.log(value);
    },
    error: (error) => {
      console.log(error);
    },
    complete: () => {
      console.log('source completed');
    }
  });
});

const redTotal = document.getElementById('red-total');
const blackTotal = document.getElementById('black-total');
const total = document.getElementById('total');

const addOneClick$ = (id: string): Observable<number> => {
  return fromEvent(document.getElementById(id)!, 'click').pipe(
    map(() => 1),
    scan((acc, curr) => acc + curr, 0),
    startWith(0)
  );
};

combineLatest([addOneClick$('red'), addOneClick$('black')]).subscribe(
  ([red, black]: any) => {
    redTotal!.innerHTML = red;
    blackTotal!.innerHTML = black;
    total!.innerHTML = red + black;
  }
);

const waitMessage = document.getElementById('wait-message')!;
const delayedMessage = (message: string | number, delayedTime: number = 1000): Observable<string | number> => {
  return EMPTY.pipe(startWith(message), delay(delayedTime));
};

concat(
  delayedMessage('Get Ready!', 500),
  delayedMessage(3),
  delayedMessage(2),
  delayedMessage(1),
  delayedMessage('Go!')
).subscribe((message: any) => (waitMessage.innerHTML = message));