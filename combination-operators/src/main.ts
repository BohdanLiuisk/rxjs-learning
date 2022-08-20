import { combineLatestAll } from 'rxjs';
import { combineLatestAllSource$ } from './combine-latest-all';

const combiteLastestAllButtonId = 'combine-latest-all';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id=${ combiteLastestAllButtonId }>Combine lastest all</button>
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

