# Newsletter launch copy — The Long Second

Launch communications for the beehiiv publication. Two sends: the welcome email
(fires on subscribe via `send_welcome_email: true`, see `docs/BEEHIIV.md`) and
Dispatch No. 1, the first proper edition.

Conventions:

- `{{...}}` marks a beehiiv merge tag or a link slot. Real destination URLs are
  given inline so nothing has to be looked up at paste time.
- We collect email only (no first name), so there is no name merge tag anywhere.
- beehiiv appends `{{unsubscribe_url}}` and the postal address via the
  publication footer settings; the footers below note where they land.
- Voice per `content/voice/VOICE.md`. Every factual claim below is taken from
  the linked essay's dek or tldr.

---

## 1. Welcome email

Sent immediately on subscribe, from every capture point (footer, popup, quiz,
essay). It has one job: set the voice, be honest about cadence, hand over three
good reads.

**Subject:** Welcome to The Long Second

**Preheader:** Occasional essays on watches and endurance. Three places to start.

**Body:**

> You're in. Thank you.
>
> The Long Second covers watches and the endurance athletes who live by them:
> the timing that decided races, the craft inside the case, who wears what and
> why. It's written by a fan who raced long enough to know what a second costs,
> and who is still, happily, learning the watch side.
>
> On cadence, the honest version: this newsletter is occasional. It arrives when
> there's an essay worth your inbox and stays quiet when there isn't.
>
> Three places to start:
>
> **[Eight Seconds]({{link: https://thelongsecond.com/features/the-1989-tour-eight-seconds}})**
> — the 1989 Tour de France ran 3,285 kilometres and came down to the closest
> margin in its history.
>
> **[The Number That Doesn't Count]({{link: https://thelongsecond.com/features/the-number-that-doesnt-count}})**
> — a clock in Vienna read 1:59:40, and the record book politely refuses to
> recognise it.
>
> **[The Escapement]({{link: https://thelongsecond.com/features/the-escapement-the-part-that-lets-go}})**
> — the fifteen-tooth wheel that holds back the mainspring and spends it, eight
> beats a second.
>
> Anthony
> The Long Second
> {{link: https://thelongsecond.com}}

**Footer (beehiiv settings, not body copy):**

> You signed up at thelongsecond.com. {{unsubscribe_url}} · {{postal_address}}

**Alternative subject lines (for testing):**

1. What a second costs
2. Time measured, time felt
3. Start with eight seconds

---

## 2. Dispatch No. 1

The first edition. Sent to the full list once the site is public. Word count
target 400–500; this runs ~440.

**Subject:** Dispatch No. 1 — the long second

**Preheader:** The site exists. Here's what it's for, and three reads to start.

**Body:**

> The site exists now, so let me tell you what it's for.
>
> The Long Second covers watches and the endurance athletes who live by them.
> The timing that decided races. The craft inside the case. Who wears what on
> the start line, and why. It's the site I went looking for when I fell for
> watches and couldn't find: coverage written by someone who knows exactly what
> a second can cost, because he spent years paying for them.
>
> The name carries the whole idea. A second on a stopwatch is always the same
> length. A second in the body is not. Anyone who has raced long knows the
> moment when time thickens — the last kilometre when the gap stops closing,
> hour five when the store runs low, the point in a time trial where the clock
> stops being information. Under the crystal, meanwhile, a balance wheel keeps
> its beat whether you finish or not. Time measured and time felt, side by side
> on one wrist. That is the long second, and every essay on the site is some
> version of it.
>
> About the writing. I raced bikes for twenty-odd years, so the endurance half
> is lived. The watch half is a passion I'm still learning, out loud, with the
> facts checked and every reference cited. Fan, not professor. When I don't
> know, I'll say so.
>
> The archive opens with forty-five essays across features, guides, reviews and
> dispatches. There's a [timeline]({{link: https://thelongsecond.com/timeline}})
> — a century of dates where watches and endurance sport share the record, from
> Mercedes Gleitze's vindication swim in 1927 to Filippo Ganna's
> 56.792-kilometre Hour in 2022 — and
> [collections]({{link: https://thelongsecond.com/collections}}) that sequence
> essays into reading trails, so one piece sets up the next.
>
> Three reads to start:
>
> **[The Longest Hour]({{link: https://thelongsecond.com/features/the-longest-hour}})**
> — most records ask how fast you can cover a distance; the Hour asks how far
> you can get before the clock runs out. Merckx called his the hardest hour of
> his life.
>
> **[Seventeen Hours]({{link: https://thelongsecond.com/features/seventeen-hours}})**
> — fifteen men on a Waikiki beach in 1978, answering a dare scribbled on an
> entry form, invented the race where the opponent is a clock counting down to
> midnight.
>
> **[What a Chronometer Actually Is]({{link: https://thelongsecond.com/guides/what-a-chronometer-actually-is}})**
> — the name is earned in a lab: COSC's fifteen-day exam, the −4/+6 standard,
> and where the certificate's promises end.
>
> One promise before I go. This newsletter is occasional. It arrives when
> there's an essay worth your inbox and stays quiet when there isn't. If that
> sounds like a low bar, watch how rarely the watch internet clears it.
>
> Thanks for being here at the start.
>
> Anthony
> The Long Second
> {{link: https://thelongsecond.com}}

**Footer (beehiiv settings, not body copy):**

> You signed up at thelongsecond.com. {{unsubscribe_url}} · {{postal_address}}

**Alternative subject lines (for testing):**

1. Eighty-seven hours, decided by eight seconds
2. A second measured and a second felt
3. The watch as an instrument of effort

---

## Send notes

- The welcome email is configured in beehiiv (Dashboard → Automations), per
  `docs/BEEHIIV.md`. Dispatch No. 1 is a normal post/send.
- Quiz subscribers arrive with `source: quiz` and a `profile` custom field; the
  welcome copy above works unchanged for them, but a quiz-specific variant can
  reference their result later via a segmented automation. Out of scope here.
- Subject lines stay under ~45 characters so they survive mobile truncation;
  the preheader carries the second clause.
