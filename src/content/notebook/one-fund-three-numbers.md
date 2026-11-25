---
number: "N4"
title: "One date, three clocks"
kind: note
lane: notebook
published: 2026-11-10
updated: 2026-11-25
description: "An international exchange-traded fund can report a rise while its home market falls, and that need not mean either number is wrong. The same date on such a page may not mark a shared measurement time: first identify the clock, then the kind of number."
---

On 5 November 2026, Korea's main index fell 5.28% in won. EWY, a New York fund on a different Korean index, reported a 13.68% fall in its net asset value (NAV: what its holdings are worth per share, here in dollars). The next day Korea fell another 6.02%, while that NAV rose 2.66%.

That sounds like a broken number. It may instead be a comparison problem.

On the iShares exchange-traded-fund pages I checked, the date is a label, not a shared measurement time. A local-market close, a later exchange rate, an estimate of what the holdings would be worth now if their home market, already closed, were still trading, and the price investors actually paid can all carry the same date. They answer different questions. My claim is simple: **before comparing a fund with its market—or two funds with each other—identify the clock and the kind of number.**

This does not make every discrepancy harmless. It tells you what to rule out before you compare two funds, buy because one looks “cheap” against its NAV, or call a one-day gap a tracking failure. I did not examine ordinary funds, which are bought and sold only once a day.

## The case that made the problem visible

On 5 November, iShares' page for EWY, its MSCI South Korea fund, showed three values:

| Number | Value | What it was trying to represent |
|---|---:|---|
| Published net asset value (NAV) | 133.58 | An estimate of the holdings at the fund's New York pricing time, normally 4 p.m., after Seoul had closed |
| “Non-FV NAV” | 146.59 | Mostly local closing prices, translated at a London-afternoon exchange rate; informational, not tradable |
| New York market close | 131.65 | The last price investors paid for the fund that day |

The three clocks in the title are Seoul's local close, the London-afternoon exchange rate used with those local prices, and 4 p.m. New York. The published NAV and the market price both belong to the New York session (the last trade can come a little before the 4 p.m. valuation), but one is an estimate of stale holdings and the other is an actual trade.

The opening comparison put a New York-timed dollar estimate beside a local index close in won. The same page held a second mismatch of that kind: its non-fair-value figure (146.59) sat about 11% above the market close (131.65). Different clocks and kinds of number can account for that gap without any figure being wrong, though they do not show that any one of them was right.

These are not three attempts to print the same fact. NAV is the value assigned to the holdings per share; an exchange-traded fund can trade above or below it. The non-fair-value NAV mostly uses older local prices (iShares lists a few cases in which it too is adjusted; I can't tell whether any applied that day) and is informational—iShares says investors cannot transact with the fund at it. The published NAV tries to estimate what foreign holdings might have been worth at New York's close, after their own market had shut, and generally translates them at a New York-close exchange rate rather than London's. So part of the gap may be the won's move between the two rates; I could not separate that part.

Seoul had closed before New York opened. A New York valuation of Korean shares therefore had to answer a counterfactual question: what might those shares have been worth if Seoul had still been open? “Fair value” is the industry's name for that estimate. It does not mean “the correct value”.

Timing could produce a reversal like the one in the opening, but these pages do not show that it did, or what moved either day's estimate. What they show is narrower: on 6 November a New York-timed dollar estimate rose while a Seoul-timed won index fell, so the two numbers were not measuring the same moment. The fund's own two valuations also moved toward each other that day: the non-fair-value figure fell 7.14% while the published NAV rose, and the gap between them, about 10% of NAV on 5 November, was under 1%.

## A second fund is the useful check

One fund's page could still be peculiar. Two iShares funds tracking the same emerging-markets index make the mismatch easier to see:

| NAV change | 5 November | 6 November | Both days, compounded |
|---|---:|---:|---:|
| EEM, United States | -5.77% | +2.03% | -3.86% |
| IEEM, Ireland | -0.89% | -2.65% | -3.52% |

On 5 November the two funds' reported falls were nearly five percentage points apart. On 6 November they were about 4.7 points apart the other way. Over the two days together they differed by only about a third of a point: the difference flipped sign from one day to the next rather than shrinking.

The funds are not identical, and a two-day match does not prove which estimate was best at the end of day one. It does show why “same index, same date” is not enough. The US fund normally values at the New York close. IEEM's own page series shows its NAV moving almost exactly with its index on 5 November, but it does not establish which valuation adjustment, if any, was used that day.

## How far the warning travels

The mismatch is not confined to 5 November. From 2 January 2025 through 5 November 2026, EEM's and IEEM's daily NAV changes differed by at least one point on 111 of the 455 days on which both funds had a NAV: about one day in four.

That count covers only these two funds and does not tell me which estimate was best on any day. It shows that large gaps recur; timing is one candidate to check, not a cause established by the count. It also shows that 5 November was not typical: on half the days the two funds differed by half a point or less, and that day's gap of nearly five points was the second widest of the 455.

## What to do with a surprising fund number

Before comparing a fund's daily move with its index, or one fund with another, ask four questions:

1. **Whose clock is the date on?** Two funds on the same index can carry the same date and report moves nearly five points apart. Timing is one thing to rule out: find out when each one observed its holdings.
2. **Is this a local close or a later estimate?** A page may print both. “Fair value” names a method, not a guarantee.
3. **Is it NAV or market price?** You trade at the price. A price below a differently timed NAV is not automatically a bargain.
4. **Which index and currency are being compared?** The KOSPI is in won and is not EWY's exact index. A convincing comparison needs the actual benchmark and a stated exchange-rate time.

If those four line up and a large difference remains, the discrepancy becomes interesting. Before they line up, the difference may only show that the date hid several clocks.

That is what the three EWY numbers meant. None was “the fund's value” without a qualifier. The practical lesson is not to pick the number you like. It is to name the question each number answers before using it as evidence.

*Not investment advice. Figures are from iShares' fund pages and, for market closes and the KOSPI, Yahoo Finance, as they stood on 6 and 7 November 2026. The daily NAVs behind the one-in-four count are worked out for the US fund from its page's figures for how far its price sat from NAV, and from Yahoo's closes; I did not keep the historical Yahoo data the count was run on.*

*Rewritten 25 November 2026 to put the claim first, under a new title (it was "One fund, three numbers"). No figure that appears in both versions was changed; a few were added from the same records, such as the exact count behind "one day in four". Much of the earlier page was removed: EWY's 4 November figures and most of its 6 November ones, the Taiwan fund (EWT) and the London-listed fund (EIMI), the S&P 500 and SOXX figures, the Irish prospectus quotations, the tables of how often large gaps came, and the longer test of whether the next day's moves in the local markets bore out the fair-value estimates. The earlier version also said that most of the five-point gap between the two emerging-markets funds was fair value and a later exchange rate; this one no longer claims that.*

*Checked before this rewrite went live by Codex (OpenAI), a reader of another model family, on 25 November 2026, against the fund pages and the records behind the figures, and by Claude readers before and after it. Its corrections are applied. Claude readers checked the edits made after it, except the last wording of the note above, which has no reader after it.*
