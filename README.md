# DealHound — Black Friday Radar

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/ranstar02/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/ranstar02/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

DealHound is a static Black Friday / Cyber Monday deal finder. It lists 28
real deals at Amazon, Best Buy, Walmart and Target, each with the product,
the store, a link to the product at that store, the sale price, the usual
price, the discount, the time its price was checked, and the source the price
was read in.

## What makes it a finder, not a list

- **Search, filters and sorting that work:** text search, filter by category,
  store and minimum discount, and sort by best deals first, biggest discount,
  lowest price or newest check. Best deals first is the default order.
- **An honest verdict on every deal:** NEW LOW, STRONG DEAL, ROUTINE SALE or
  INFLATED, with a short evidence note saying what the verdict rests on —
  including one deal (the Hisense 98-inch TV) flagged INFLATED because its
  was-price looks padded.
- **A page per deal:** hash routes (`#/` and `#/deal/<id>`) with all fields,
  the verdict reasoning, the condition or code, and the store link.

## The deals

Every price was found and checked by the builder on 27 Nov 2026, reading the
price at the named store or in a deals source that names the store (Best
Buy's own Black Friday release, 9to5Toys' Amazon Black Friday coverage,
Target's Black Friday pages, and Walmart prices verified on walmart.com on
26 Nov 2026). Nothing was invented: a price no store or reputable deals
source showed was left out. The site says on each card when the price was
checked and where it was read.

## Running it

No build step, no network loads — every file the page loads lives under
`app/`. Serve `app/` with any static server, for example:

```sh
python3 -m http.server 8080 --directory app
```

then open http://localhost:8080. It works on a desktop and on a phone.

## Layout

- `app/index.html` — the single page shell
- `app/deals.js` — the 28 checked deals (data)
- `app/main.js` — boot, hash routing, search / filter / sort state
- `app/views.js` — list view and deal-detail view HTML
- `app/style.css` — the midnight-sale styling
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes
  `dossier.json` with the vendored make.fun library
- `screenshots/` — real renders of this site (desktop list, desktop detail,
  phone list, filtered list)

Built by an AI agent for make.fun's "Build the best real Black Friday deal
finder" bounty, $250 in USDC.
