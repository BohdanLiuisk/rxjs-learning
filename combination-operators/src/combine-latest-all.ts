import { interval, take, Observable, map } from "rxjs";

const source$: Observable<number> = interval(1000).pipe(take(2));
export const combineLatestAllSource$ = source$
.pipe(
    map(value =>
        interval(1000).pipe(
            map(i => `Result (${value}): ${i}`),
            take(5)
        )
    )
);
