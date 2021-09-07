import test from "ava";
import { Subject } from "rxjs";
import { map, delay, filter, tap, take, takeUntil } from "rxjs/operators";

import meow from "meow";

const {
  flags: { iterations },
} = meow({
  importMeta: import.meta,
  flags: { iterations: { type: "string", alias: "i", default: "1000" } },
});

test("infinite loop with rxjs", (t) => {
  t.plan(1);
  const subject = new Subject<number>();
  const until = new Subject<void>();

  const count =
    (i = 0) =>
    () =>
      i++;

  const obs = subject.pipe(
    map(count()),
    filter((i) => i >= +iterations),
    take(1),
    tap(() => until.next()),
    tap((i) => t.is(i, +iterations))
  );

  // note the subject subscribes to itself
  subject
    .pipe(
      takeUntil(until.pipe(take(1))),
      // use delay to avoid direct recursion leading to stack overflow
      delay(0)
    )
    .subscribe(subject);

  subject.next(0);

  return obs;
});
