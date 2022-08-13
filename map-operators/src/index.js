import { of, from } from 'rxjs'; 
import { map, mergeMap, delay, mergeAll, switchMap, switchAll, concatMap, concatAll, exhaustMap } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

const displayResult = (value) => {
  const html = `<p>${ value }</p>`;
  result.insertAdjacentHTML('beforeend', html);
  console.log(value);
}

const observable$ = from([1,2,3,4]);

//flatMap/mergeMap - creates an Observable immediately for any source item, all previous Observables are kept alive.
//!!!immediatly
//retrieved new data with param 1
//retrieved new data with param 2
//retrieved new data with param 3
//retrieved new data with param 4
document.getElementById('megre-map').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    mergeMap(param => getData(param))
  ).subscribe(value => {
    displayResult(value);
  });
});

// using map and mergeAll
// result same as mergeMap
document.getElementById('megre-all').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    map(param => getData(param)),
    mergeAll()
  ).subscribe(value => {
    displayResult(value);
  });
});

//switchMap for any source item, completes the previous Observable and immediately creates the next one
//completes previous, and run next so have only last
//retrieved new data with param 4
document.getElementById('switch-map').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    switchMap(param => getData(param))
  ).subscribe(value => {
    displayResult(value);
  });
});

// using map and switchAll
// result same as switchMap
document.getElementById('switch-all').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    map(param => getData(param)),
    switchAll()
  ).subscribe(value => {
    displayResult(value);
  });
});


//waits for the previous Observable to complete before creating the next one
//!!!one by one
//retrieved new data with param 1
//retrieved new data with param 2
//retrieved new data with param 3
//retrieved new data with param 4
document.getElementById('concat-map').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    concatMap(param => getData(param))
  ).subscribe(value => {
    displayResult(value);
  });
});

// using map and concatAll
// result same as concatMap
document.getElementById('concat-all').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    map(param => getData(param)),
    concatAll()
  ).subscribe(value => {
    displayResult(value);
  });
});


//!!!source items are ignored while the previous Observable is not completed
//retrieved new data with param 1
document.getElementById('exhaust-map').addEventListener('click', () => {
  result.innerHTML = '';
  observable$.pipe(
    exhaustMap(param => getData(param))
  ).subscribe(value => {
    displayResult(value);
  });
});
