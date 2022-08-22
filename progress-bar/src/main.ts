import { of, delay, Observable, from, concatAll, fromEvent, switchMap, share, count, scan, withLatestFrom } from 'rxjs';
import './style.css';

const requestOne = of('first').pipe(delay(500));
const requestTwo = of('second').pipe(delay(800));
const requestThree = of('third').pipe(delay(1100));
const requestFour = of('fourth').pipe(delay(1400));
const requestFive = of('fifth').pipe(delay(1700));

const loadButton = document.getElementById('load')!;
const progressBar = document.getElementById('progress')!;
const content = document.getElementById('data')!;

const updateProgress = (progressRatio: number): void => {
  console.log('Progress Ratio: ', progressRatio);
  progressBar.style.width = 100 * progressRatio + '%';
  if (progressRatio === 1) {
    progressBar.className += ' finished';
  } else {
    progressBar.className = progressBar.className.replace(' finished', '');
  }
};

const updateContent = (newContent: string): void => {
  content.innerHTML += newContent;
};

const displayData = (data: string) => {
  updateContent(`<div class="content-item">${ data }</div>`);
};

const observables: Array<Observable<string>> = [
  requestOne,
  requestTwo,
  requestThree,
  requestFour,
  requestFive
];

const array$ = from(observables);
const requests$ = array$.pipe(concatAll());
const clicks$ = fromEvent(loadButton, 'click');
const progress$ = clicks$.pipe(switchMap(() => requests$), share());
const count$ = array$.pipe(count());
const ratio$ = progress$.pipe(
  scan(current => current + 1, 0),
  withLatestFrom(count$, (current, count) => current / count)
);

clicks$
  .pipe(switchMap(() => ratio$))
  .subscribe(updateProgress);
progress$
  .subscribe(displayData);
