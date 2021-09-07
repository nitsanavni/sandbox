import test from "ava";
import { Subject } from "rxjs";
import { map, delay, filter, tap, take } from "rxjs/operators";

test("infinite loop with rxjs", (t) => {
  t.plan(1);
  const subject = new Subject<number>();

  const incr = (i) => ++i;

  const iterations = 1000;

  const obs = subject.pipe(
    filter((i) => i >= iterations),
    take(1),
    tap(() => sub.unsubscribe()),
    tap((i) => t.is(i, iterations))
  );

  const sub = subject.pipe(map(incr), delay(2)).subscribe(subject);

  subject.next(0);

  return obs;
});
