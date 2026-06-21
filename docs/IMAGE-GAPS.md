# Image gaps — athlete + watch

The standard (`docs/EDITORIAL.md`) is that every article carries an image pairing
**the athlete and the watch**. Where we have a usable asset, it's mapped. The list
below is what's still missing — almost all of it blocked by the same wall: photos of
a specific athlete *wearing* a specific watch are copyrighted agency images we can't
legally pull in. These need to be supplied or licensed, then dropped into
`public/photography/` and wired into the article's `image` meta.

## Articles on a watch-only shot (need an athlete-on-wrist photo)

| Article | Current image | Needs |
|---|---|---|
| `essays/watches-and-the-world-cup` | `messi-rolex-daydate.jpg` (watch only) | Messi wearing the green "Jubilee Gold" Day-Date (ref. 228235JG) |
| `essays/what-messi-actually-wore` | `messi-rolex-daydate-dial.jpg` (dial macro) | Messi wearing any of his watches |

## Buyers guides without a header image

| Guide | Needs |
|---|---|
| `buying-guides/running` | A runner wearing a watch (no running asset in the library) |

## Mapped and good (athlete + watch, from existing assets)

- `essays/the-same-machine` → Pogačar · RM 67-02
- `essays/the-sweep-and-the-surge` → van der Poel · RM 67-02
- `essays/what-it-costs-to-keep-time` → Pogačar · RM 67-02
- `essays/watches-in-sport-field-guide` → Tiger Woods · Rolex
- `buying-guides/cycling` → Pogačar · RM 67-02
- `buying-guides/gym` → topuria · RM

## How to close a gap

1. Drop the licensed photo into `public/photography/` (note the source + rights in `RIGHTS.md`).
2. Update the article's `image` meta: `src`, `alt`, `subject`, `watch`.
3. Caption must name the watch (subject + reference).
