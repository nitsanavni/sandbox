import test from "ava";
import { Subject } from "rxjs";
import { map, delay, filter, tap, take } from "rxjs/operators";

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

  const incr = (i) => ++i;

  const obs = subject.pipe(
    filter((i) => i >= +iterations),
    take(1),
    tap(() => sub.unsubscribe()),
    tap((i) => t.is(i, +iterations))
  );

  const sub = subject.pipe(map(incr), delay(2)).subscribe(subject);

  subject.next(0);

  return obs;
});
