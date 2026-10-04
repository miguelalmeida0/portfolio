# Measured reference values

Resolved (post-cascade) computed styles, captured from `reference/*.html` by `tests/parity/measure.capture.spec.ts`.
Full data for all five viewports, including every property, is in `reference/measurements/*.json`. Values here are for orientation; the parity tests are the gate.

Flow is measured with the Compound proposal pending. Leu is measured with ¶2 answered “It's warmer in July…” and the chain on stage 3.

## Flow at desktop-1440

| Selector | Box (px) | Font | Colour | Background | Radius | Padding | Margin |
|---|---|---|---|---|---|---|---|
| `body` | 1440x7343.27 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 0px | 0px | 0px |
| `.pnav .wrap` | 1312x64 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 64px |
| `.pname` | 50.13x24 | Figtree 800 24px/24px ls -0.72px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.pnav ul a` | 90x39.19 | Figtree 400 14.5px/23.2px | #0B2B22 | #E4EAD3 | 999px | 8px 14px | 0px |
| `.pnav ul a[aria-current="true"]` | 90x39.19 | Figtree 400 14.5px/23.2px | #0B2B22 | #E4EAD3 | 999px | 8px 14px | 0px |
| `.pnav .btn` | 70x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.hero` | 1312x539.91 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 86.4px 0px 43.2px | 0px |
| `.hero .kicker` | 251x24 | Figtree 600 15px/24px | #610D3D | transparent | 0px | 0px | 0px 0px 22px |
| `.hero h1` | 1026x167.03 | Figtree 800 83.52px/83.52px ls -3.7584px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.hero .sub` | 572x94.5 | Figtree 400 21px/31.5px | #12372D | transparent | 0px | 0px | 22px 0px 28px |
| `.ctas .btn.primary` | 85x50.8 | Figtree 600 15.5px/24.8px | #FAF7ED | #610D3D | 999px | 13px 24px | 0px |
| `.tlink` | 103x27.19 | Figtree 600 17px/27.2px | #610D3D | transparent | 0px | 0px | 0px |
| `#cmd` | 1312x812.56 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 36px | 50.4px | 0px |
| `#cmd .window` | 1211.22x711.78 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 24px | 56px 56px 0px | 0px |
| `.cmd-top .tag` | 304x22.39 | Figtree 600 14px/22.4px | #506353 | transparent | 0px | 0px | 0px |
| `.replay` | 70x35.59 | Figtree 600 13.5px/21.6px | #12372D | #E4EAD3 | 999px | 7px 14px | 0px |
| `.sentence` | 1020x183.52 | Figtree 700 51.84px/61.1712px ls -1.8144px | #0B2B22 | transparent | 0px | 0px | 0px 0px 44px |
| `.tok.t` | 399.16x62 | Figtree 700 51.84px/61.1712px ls -1.8144px | #0B2B22 | transparent | 6px | 0px 3px | 0px -3px |
| `.tok.a` | 245.05x62 | Figtree 700 51.84px/61.1712px ls -1.8144px | #0B2B22 | transparent | 6px | 0px 3px | 0px -3px |
| `.tok.k` | 821.72x123.17 | Figtree 700 51.84px/61.1712px ls -1.8144px | #0B2B22 | transparent | 6px | 0px 3px | 0px -3px |
| `.ops` | 1099.22x168.28 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.op` | 358.41x168.28 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 18px | 18px 20px 20px | 0px |
| `.op .verb` | 48.11x24.5 | mono 600 12.5px/12.5px | #12372D | #E2EDBA | 7px | 6px 9px | 0px 0px 12px |
| `.op.k .verb` | 48.11x24.5 | mono 600 12.5px/12.5px | #610D3D | #F1E3E8 | 7px | 6px 9px | 0px 0px 12px |
| `.op .what` | 318.41x27.59 | Figtree 700 24px/27.6px ls -0.48px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.op .how` | 318.41x23.19 | Figtree 400 14.5px/23.2px | #506353 | transparent | 0px | 0px | 4px 0px 0px |
| `.op .res` | 318.41x24 | Figtree 600 15px/24px | #0B2B22 | transparent | 0px | 0px | 12px 0px 0px |
| `.checks li` | 104x36.39 | Figtree 600 14px/22.4px | #12372D | #E2EDBA | 999px | 7px 14px | 0px |
| `.tl` | 1099.22x104 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 36px 0px 0px |
| `.tl .bar` | 21.13x30 | Figtree 500 12.5px/30px | #0B2B22 | #E4EAD3 | 9px | 0px 10px | 0px |
| `.tl .bar.prot` | 84.55x30 | Figtree 500 12.5px/30px | #FAF7ED | #12372D | 9px | 0px 10px | 0px |
| `.tl .bar.ghost` | 84.55x30 | Figtree 600 12.5px/30px | #12372D | #E2EDBA | 9px | 0px 10px | 0px |
| `.chapter` | 1312x1070.53 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 158.4px 0px 0px | 0px |
| `.head` | 1312x154.2 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 48px |
| `.head h2` | 680x107.81 | Figtree 800 51.84px/53.9136px ls -2.3328px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.head p` | 720x30.39 | Figtree 400 19px/30.4px | #12372D | transparent | 0px | 0px | 16px 0px 0px |
| `.bento` | 1312x709.94 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.tile` | 869.33x271.81 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 36px | 0px |
| `.tile.w4` | 869.33x271.81 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 36px | 0px |
| `.tile.w2` | 426.66x271.81 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 36px | 0px |
| `.tile.w6` | 1311.98x145.44 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 28px | 36px | 0px |
| `.tile.blue` | 869.33x271.81 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 36px | 0px |
| `.tile.sage` | 869.33x260.69 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 36px | 0px |
| `.tile.warn` | 426.66x271.81 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 36px | 0px |
| `.tile.blush` | 426.66x260.69 | Figtree 400 17px/27.2px | #0B2B22 | #F1E3E8 | 28px | 36px | 0px |
| `.tile.well` | 1311.98x145.44 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 28px | 36px | 0px |
| `.tile h3` | 352x36.72 | Figtree 800 34px/36.72px ls -1.53px | #0B2B22 | transparent | 0px | 0px | 0px 0px 10px |
| `.tile > p` | 400x76.78 | Figtree 400 16px/25.6px | #12372D | transparent | 0px | 0px | 0px 0px 24px |
| `.tile .go` | 194x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 11.125px 0px 0px |
| `#demoStage` | 1312x1071.47 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 36px | 0px | 0px |
| `#demoStage .window` | 1312x1071.47 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 36px | 0px | 0px |
| `.demo` | 1312x1071.47 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.talk` | 377.69x1071.47 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 26px | 0px |
| `.cal` | 576.48x1071.47 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 26px | 0px |
| `.rail` | 357.81x1071.47 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 26px | 0px |
| `.colhead` | 324.69x26.39 | Figtree 700 22px/26.4px ls -0.44px | #0B2B22 | transparent | 0px | 0px | 0px 0px 4px |
| `.colsub` | 324.69x21.59 | Figtree 400 13.5px/21.6px | #506353 | transparent | 0px | 0px | 0px 0px 16px |
| `.chip` | 98x38.39 | Figtree 600 14px/22.4px | #FAF7ED | #610D3D | 999px | 8px 14px | 0px |
| `.chip[aria-pressed="true"]` | 98x38.39 | Figtree 600 14px/22.4px | #FAF7ED | #610D3D | 999px | 8px 14px | 0px |
| `.fail` | 324.69x22.39 | Figtree 400 14px/22.4px | #12372D | transparent | 0px | 0px | 0px 0px 16px |
| `.fail input` | 34x20 | Arial 400 13.3333px/normal | #000000 | #9FAE9B @0.55 | 999px | 0px | 0px |
| `.log` | 324.69x440 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.replies` | 324.69x40.39 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 14px 0px 0px |
| `.tools` | 324.69x95.78 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 16px 0px 0px | 16px 0px 0px |
| `.tool` | 58x36.39 | Figtree 600 14px/22.4px | #12372D | transparent | 999px | 7px 12px | 0px |
| `.days` | 523.48x783.59 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.dayhead` | 231.73x55.59 | Figtree 700 19px/22.8px ls -0.38px | #0B2B22 | #E2EDBA | 12px | 6px 10px 10px | 0px 0px 8px |
| `.dayhead[aria-pressed="true"]` | 231.73x55.59 | Figtree 700 19px/22.8px ls -0.38px | #0B2B22 | #E2EDBA | 12px | 6px 10px 10px | 0px 0px 8px |
| `.hours span` | 14x18.39 | Figtree 400 11.5px/18.4px | #506353 | transparent | 0px | 0px | 0px |
| `.track` | 231.73x720 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 14px | 0px | 0px |
| `.track .line` | 231.73x1 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.ev` | 219.73x11.84 | Figtree 400 12px/15px | #0B2B22 | #FAF7ED | 10px | 0px 9px 0px 11px | 0px |
| `.ev .t` | 46x15 | Figtree 600 12px/15px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.ev .tm` | 0x0 | Figtree 400 11.5px/14.375px | #506353 | transparent | 0px | 0px | 0px |
| `.ev.prot` | 219.73x53.38 | Figtree 400 13px/16.25px | #FAF7ED | #12372D | 10px | 4px 9px 4px 11px | 0px |
| `.now` | 231.73x2 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.stages .stage` | 305.81x113.19 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px 0px 14px 36px | 0px |
| `.stage .nm` | 269.81x23.19 | Figtree 600 14.5px/23.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.stage pre` | 269.81x70 | mono 400 12px/18px | #12372D | #EFF3E3 | 10px | 8px 10px | 6px 0px 0px |
| `.rail-note` | 305.81x20.8 | Figtree 400 13px/20.8px | #506353 | transparent | 0px | 0px | 10px 0px 0px |
| `.stats` | 1312x243.27 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 16px |
| `.stat` | 648x243.27 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 40px | 0px |
| `.stat.sage` | 648x243.27 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 40px | 0px |
| `.stat.blue` | 648x243.27 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 40px | 0px |
| `.stat .n` | 568x74.88 | Figtree 800 74.88px/74.88px ls -3.3696px | #12372D | transparent | 0px | 0px | 0px |
| `.stat .l` | 420x24.8 | Figtree 600 15.5px/24.8px | #12372D | transparent | 0px | 0px | 10px 0px 4px |
| `.stat p` | 568x74.88 | Figtree 800 74.88px/74.88px ls -3.3696px | #12372D | transparent | 0px | 0px | 0px |
| `#latWin` | 1264x333.38 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 24px | 40px | 0px |
| `.seg` | 414x49.19 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 999px | 4px | 0px 0px 26px |
| `.seg button` | 182x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.seg button[aria-pressed="true"]` | 182x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.lrow` | 1184x73.59 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 13px 0px | 0px |
| `.lrow .n` | 337.92x45.59 | Figtree 600 15.5px/24.8px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.bar-wrap` | 826.08x30 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.lbar` | 139.11x22 | Figtree 400 17px/27.2px | #0B2B22 | #12372D | 6px | 0px | 0px |
| `.lrow.speech .lbar` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | #610D3D | 6px | 0px | 0px |
| `.lval` | 141x22 | Figtree 700 13.5px/22px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.p95` | 2x30 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.target` | 1x38 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.ticks span` | 26x19.19 | Figtree 400 12px/19.2px | #506353 | transparent | 0px | 0px | 0px |
| `.cap` | 648x67.17 | Figtree 400 14px/22.4px | #506353 | transparent | 0px | 0px | 14px 0px 0px |
| `.early` | 1312x24 | Figtree 400 15px/24px | #506353 | transparent | 0px | 0px | 0px 0px 22px |
| `.pipe` | 1312x89.69 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 17px 0px |
| `.pipe li` | 150x89.69 | Figtree 600 14.5px/18.85px | #0B2B22 | transparent | 0px | 14px 2px 0px | 0px |
| `.pipe li span` | 146x26 | Figtree 700 26px/26px ls -0.52px | #506353 | transparent | 0px | 0px | 0px |
| `.pipe li.commit` | 150x89.69 | Figtree 600 14.5px/18.85px | #610D3D | transparent | 0px | 14px 2px 0px | 0px |
| `.quote` | 840x96.56 | Figtree 500 23px/32.2px | #0B2B22 | transparent | 0px | 0px | 28px 0px 0px |
| `.stories` | 1312x487.25 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 86.4px 0px 0px |
| `.story` | 1312x487.25 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 56px 0px | 0px |
| `.story h3` | 527.66x77.75 | Figtree 800 36px/38.88px ls -1.44px | #0B2B22 | transparent | 0px | 0px | 0px 0px 14px |
| `.story .said` | 527.66x28.8 | Figtree 400 18px/28.8px | #506353 | transparent | 0px | 0px | 0px |
| `.story dl` | 712.34x374.25 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.story dt` | 110x54.38 | Figtree 700 14.5px/23.2px | #610D3D | transparent | 0px | 2px 0px 0px | 0px |
| `.story dd` | 578.34x54.38 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 0px |
| `.specs2` | 1312x523.84 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.vgrid` | 641.98x445.56 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 40px | 0px |
| `.vgrid b` | 264.98x43.2 | Figtree 800 43.2px/43.2px ls -1.728px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.vgrid span` | 94x18 | Figtree 400 14.5px/23.2px | #FAF7ED @0.78 | transparent | 0px | 0px | 0px |
| `.facts` | 583.63x523.84 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.facts h3` | 583.63x25.59 | Figtree 700 16px/25.6px | #0B2B22 | transparent | 0px | 0px | 0px 0px 4px |
| `.facts p` | 583.63x27.19 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 0px |
| `.next` | 1312x165 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 44px 0px 64px | 40px 0px 0px |
| `.next .lbl` | 82x23.19 | Figtree 400 14.5px/23.2px | #506353 | transparent | 0px | 0px | 0px |
| `.next a` | 86.45x56 | Figtree 800 56px/56px ls -2.52px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.skip` | 152x47.19 | Figtree 600 17px/27.2px | #FAF7ED | #610D3D | 10px | 10px 16px | 0px |

## Flow at mobile-390

| Selector | Box (px) | Font | Colour | Background | Radius | Padding | Margin |
|---|---|---|---|---|---|---|---|
| `body` | 390x10496.36 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 0px | 0px | 0px |
| `.pnav .wrap` | 358x64 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 16px |
| `.pname` | 50.13x24 | Figtree 800 24px/24px ls -0.72px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.pnav ul a` | 0x0 | Figtree 400 14.5px/23.2px | #0B2B22 | #E4EAD3 | 999px | 8px 14px | 0px |
| `.pnav ul a[aria-current="true"]` | 0x0 | Figtree 400 14.5px/23.2px | #0B2B22 | #E4EAD3 | 999px | 8px 14px | 0px |
| `.pnav .btn` | 70x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.hero` | 358x429.8 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 40px 0px 28px | 0px |
| `.hero .kicker` | 251x24 | Figtree 600 15px/24px | #610D3D | transparent | 0px | 0px | 0px 0px 22px |
| `.hero h1` | 358x132 | Figtree 800 44px/44px ls -1.98px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.hero .sub` | 358x81 | Figtree 400 18px/27px | #12372D | transparent | 0px | 0px | 22px 0px 28px |
| `.ctas .btn.primary` | 85x50.8 | Figtree 600 15.5px/24.8px | #FAF7ED | #610D3D | 999px | 13px 24px | 0px |
| `.tlink` | 103x27.19 | Figtree 600 17px/27.2px | #610D3D | transparent | 0px | 0px | 0px |
| `#cmd` | 358x1050.09 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 20px | 18px | 0px |
| `#cmd .window` | 322x1014.09 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 16px | 22px 20px 0px | 0px |
| `.cmd-top .tag` | 196x44.78 | Figtree 600 14px/22.4px | #506353 | transparent | 0px | 0px | 0px |
| `.replay` | 70x35.59 | Figtree 600 13.5px/21.6px | #12372D | #E4EAD3 | 999px | 7px 14px | 0px |
| `.sentence` | 282x122.69 | Figtree 700 26px/30.68px ls -0.91px | #0B2B22 | transparent | 0px | 0px | 0px 0px 24px |
| `.tok.t` | 199.53x32 | Figtree 700 26px/30.68px ls -0.91px | #0B2B22 | transparent | 6px | 0px 3px | 0px -3px |
| `.tok.a` | 125x32 | Figtree 700 26px/30.68px ls -0.91px | #0B2B22 | transparent | 6px | 0px 3px | 0px -3px |
| `.tok.k` | 98.64x32 | Figtree 700 26px/30.68px ls -0.91px | #0B2B22 | transparent | 6px | 0px 3px | 0px -3px |
| `.ops` | 282x528.84 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.op` | 282x168.28 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 18px | 18px 20px 20px | 0px |
| `.op .verb` | 48.11x24.5 | mono 600 12.5px/12.5px | #12372D | #E2EDBA | 7px | 6px 9px | 0px 0px 12px |
| `.op.k .verb` | 48.11x24.5 | mono 600 12.5px/12.5px | #610D3D | #F1E3E8 | 7px | 6px 9px | 0px 0px 12px |
| `.op .what` | 242x27.59 | Figtree 700 24px/27.6px ls -0.48px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.op .how` | 242x23.19 | Figtree 400 14.5px/23.2px | #506353 | transparent | 0px | 0px | 4px 0px 0px |
| `.op .res` | 242x24 | Figtree 600 15px/24px | #0B2B22 | transparent | 0px | 0px | 12px 0px 0px |
| `.checks li` | 104x36.39 | Figtree 600 14px/22.4px | #12372D | #E2EDBA | 999px | 7px 14px | 0px |
| `.tl` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 22px 0px 0px |
| `.tl .bar` | 0x0 | Figtree 500 12.5px/30px | #0B2B22 | #E4EAD3 | 9px | 0px 10px | 0px |
| `.tl .bar.prot` | 0x0 | Figtree 500 12.5px/30px | #FAF7ED | #12372D | 9px | 0px 10px | 0px |
| `.tl .bar.ghost` | 0x0 | Figtree 600 12.5px/30px | #12372D | #E2EDBA | 9px | 0px 10px | 0px |
| `.chapter` | 358x1503.08 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 88px 0px 0px | 0px |
| `.head` | 358x136.91 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 28px |
| `.head h2` | 358x66.53 | Figtree 800 32px/33.28px ls -1.44px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.head p` | 358x54.38 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 16px 0px 0px |
| `.bento` | 358x1250.17 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.tile` | 358x253.64 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 24px | 0px |
| `.tile.w4` | 358x253.64 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 24px | 0px |
| `.tile.w2` | 358x240 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 24px | 0px |
| `.tile.w6` | 358x212.53 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 28px | 24px | 0px |
| `.tile.blue` | 358x253.64 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 24px | 0px |
| `.tile.sage` | 358x240 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 24px | 0px |
| `.tile.warn` | 358x240 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 24px | 0px |
| `.tile.blush` | 358x240 | Figtree 400 17px/27.2px | #0B2B22 | #F1E3E8 | 28px | 24px | 0px |
| `.tile.well` | 358x212.53 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 28px | 24px | 0px |
| `.tile h3` | 272x28.08 | Figtree 800 26px/28.08px ls -1.17px | #0B2B22 | transparent | 0px | 0px | 0px 0px 10px |
| `.tile > p` | 310x102.38 | Figtree 400 16px/25.6px | #12372D | transparent | 0px | 0px | 0px 0px 24px |
| `.tile .go` | 194x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `#demoStage` | 358x2466.39 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 20px | 0px | 0px |
| `#demoStage .window` | 358x2466.39 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 20px | 0px | 0px |
| `.demo` | 358x2466.39 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.talk` | 358x690.72 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 26px | 0px |
| `.cal` | 358x783.58 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 26px | 0px |
| `.rail` | 358x992.09 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 26px | 0px |
| `.colhead` | 306x26.39 | Figtree 700 22px/26.4px ls -0.44px | #0B2B22 | transparent | 0px | 0px | 0px 0px 4px |
| `.colsub` | 306x21.59 | Figtree 400 13.5px/21.6px | #506353 | transparent | 0px | 0px | 0px 0px 16px |
| `.chip` | 98x38.39 | Figtree 600 14px/22.4px | #FAF7ED | #610D3D | 999px | 8px 14px | 0px |
| `.chip[aria-pressed="true"]` | 98x38.39 | Figtree 600 14px/22.4px | #FAF7ED | #610D3D | 999px | 8px 14px | 0px |
| `.fail` | 306x22.39 | Figtree 400 14px/22.4px | #12372D | transparent | 0px | 0px | 0px 0px 16px |
| `.fail input` | 34x20 | Arial 400 13.3333px/normal | #000000 | #9FAE9B @0.55 | 999px | 0px | 0px |
| `.log` | 306x220 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.replies` | 306x40.39 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 14px 0px 0px |
| `.tools` | 306x95.78 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 16px 0px 0px | 16px 0px 0px |
| `.tool` | 58x36.39 | Figtree 600 14px/22.4px | #12372D | transparent | 999px | 7px 12px | 0px |
| `.days` | 306x663.59 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.dayhead` | 97.69x55.59 | Figtree 700 19px/22.8px ls -0.38px | #0B2B22 | #E2EDBA | 12px | 6px 10px 10px | 0px 0px 8px |
| `.dayhead[aria-pressed="true"]` | 97.69x55.59 | Figtree 700 19px/22.8px ls -0.38px | #0B2B22 | #E2EDBA | 12px | 6px 10px 10px | 0px 0px 8px |
| `.hours span` | 14x18.39 | Figtree 400 11.5px/18.4px | #506353 | transparent | 0px | 0px | 0px |
| `.track` | 260x600 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 14px | 0px | 0px |
| `.track .line` | 260x1 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.ev` | 248x9.53 | Figtree 400 12px/15px | #0B2B22 | #FAF7ED | 10px | 0px 9px 0px 11px | 0px |
| `.ev .t` | 46x15 | Figtree 600 12px/15px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.ev .tm` | 0x0 | Figtree 400 11.5px/14.375px | #506353 | transparent | 0px | 0px | 0px |
| `.ev.prot` | 248x44.14 | Figtree 400 13px/16.25px | #FAF7ED | #12372D | 10px | 4px 9px 4px 11px | 0px |
| `.now` | 260x2 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.stages .stage` | 306x111.19 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px 0px 12px 36px | 0px |
| `.stage .nm` | 270x23.19 | Figtree 600 14.5px/23.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.stage pre` | 270x70 | mono 400 12px/18px | #12372D | #EFF3E3 | 10px | 8px 10px | 6px 0px 0px |
| `.rail-note` | 306x20.8 | Figtree 400 13px/20.8px | #506353 | transparent | 0px | 0px | 10px 0px 0px |
| `.stats` | 358x401.58 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 16px |
| `.stat` | 358x205.19 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 24px | 0px |
| `.stat.sage` | 358x205.19 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 24px | 0px |
| `.stat.blue` | 358x180.39 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 24px | 0px |
| `.stat .n` | 310x44 | Figtree 800 44px/44px ls -1.98px | #12372D | transparent | 0px | 0px | 0px |
| `.stat .l` | 310x24.8 | Figtree 600 15.5px/24.8px | #12372D | transparent | 0px | 0px | 10px 0px 4px |
| `.stat p` | 310x44 | Figtree 800 44px/44px ls -1.98px | #12372D | transparent | 0px | 0px | 0px |
| `#latWin` | 330x415.75 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 16px | 22px | 0px |
| `.seg` | 286x95.56 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 999px | 4px | 0px 0px 26px |
| `.seg button` | 126.05x87.56 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.seg button[aria-pressed="true"]` | 126.05x87.56 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.lrow` | 286x109.59 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 13px 0px | 0px |
| `.lrow .n` | 286x45.59 | Figtree 600 15.5px/24.8px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.bar-wrap` | 286x30 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.lbar` | 48.16x22 | Figtree 400 17px/27.2px | #0B2B22 | #12372D | 6px | 0px | 0px |
| `.lrow.speech .lbar` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | #610D3D | 6px | 0px | 0px |
| `.lval` | 141x22 | Figtree 700 13.5px/22px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.p95` | 2x30 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.target` | 1x38 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.ticks span` | 26x19.19 | Figtree 400 12px/19.2px | #506353 | transparent | 0px | 0px | 0px |
| `.cap` | 358x111.95 | Figtree 400 14px/22.4px | #506353 | transparent | 0px | 0px | 14px 0px 0px |
| `.early` | 358x56 | Figtree 400 15px/24px | #506353 | transparent | 0px | 0px | 0px 0px 22px |
| `.pipe` | 358x302.22 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 17px 0px |
| `.pipe li` | 171x70.84 | Figtree 600 14.5px/18.85px | #0B2B22 | transparent | 0px | 14px 2px 0px | 0px |
| `.pipe li span` | 167x26 | Figtree 700 26px/26px ls -0.52px | #506353 | transparent | 0px | 0px | 0px |
| `.pipe li.commit` | 171x70.84 | Figtree 600 14.5px/18.85px | #610D3D | transparent | 0px | 14px 2px 0px | 0px |
| `.quote` | 358x132.97 | Figtree 500 19px/26.6px | #0B2B22 | transparent | 0px | 0px | 28px 0px 0px |
| `.stories` | 358x972.44 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 48px 0px 0px |
| `.story` | 358x972.44 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 32px 0px | 0px |
| `.story h3` | 358x56.16 | Figtree 800 26px/28.08px ls -1.04px | #0B2B22 | transparent | 0px | 0px | 0px 0px 14px |
| `.story .said` | 358x57.59 | Figtree 400 18px/28.8px | #506353 | transparent | 0px | 0px | 0px |
| `.story dl` | 358x755.69 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.story dt` | 358x25.19 | Figtree 700 14.5px/23.2px | #610D3D | transparent | 0px | 2px 0px 0px | 0px |
| `.story dd` | 358x81.56 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 0px 0px 10px |
| `.specs2` | 358x1079.72 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.vgrid` | 358x387.94 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 24px | 0px |
| `.vgrid b` | 139x30 | Figtree 800 30px/30px ls -1.2px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.vgrid span` | 94x18 | Figtree 400 14.5px/23.2px | #FAF7ED @0.78 | transparent | 0px | 0px | 0px |
| `.facts` | 358x659.78 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.facts h3` | 358x25.59 | Figtree 700 16px/25.6px | #0B2B22 | transparent | 0px | 0px | 0px 0px 4px |
| `.facts p` | 358x27.19 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 0px |
| `.next` | 358x143 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 44px 0px 64px | 40px 0px 0px |
| `.next .lbl` | 82x23.19 | Figtree 400 14.5px/23.2px | #506353 | transparent | 0px | 0px | 0px |
| `.next a` | 52.42x34 | Figtree 800 34px/34px ls -1.53px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.skip` | 152x47.19 | Figtree 600 17px/27.2px | #FAF7ED | #610D3D | 10px | 10px 16px | 0px |

## Leu at desktop-1440

| Selector | Box (px) | Font | Colour | Background | Radius | Padding | Margin |
|---|---|---|---|---|---|---|---|
| `body` | 1440x12294.16 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 0px | 0px | 0px |
| `.pnav .wrap` | 1312x64 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 64px |
| `.pname` | 35.03x35.19 | Figtree 800 22px/35.2px ls -0.66px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.pnav ul a` | 90x39.19 | Figtree 400 14.5px/23.2px | #12372D | transparent | 999px | 8px 14px | 0px |
| `.pnav .btn` | 70x41.19 | Figtree 700 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.hero` | 1312x535.91 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 86.4px 0px 43.2px | 0px |
| `.hero .kicker` | 1312x24 | Figtree 600 15px/24px | #610D3D | transparent | 0px | 0px | 0px 0px 20px |
| `.hero h1` | 918x167.03 | Figtree 800 83.52px/83.52px ls -3.7584px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.hero .sub` | 572x94.5 | Figtree 400 21px/31.5px | #12372D | transparent | 0px | 0px | 22px 0px 28px |
| `.ctas .btn.primary` | 85x50.8 | Figtree 700 15.5px/24.8px | #FAF7ED | #610D3D | 999px | 13px 24px | 0px |
| `.tlink` | 103x27.19 | Figtree 600 17px/27.2px | #610D3D | transparent | 0px | 0px | 0px |
| `.cap` | 684x22.39 | Figtree 400 14px/22.4px | #506353 | transparent | 0px | 0px | 14px 0px 0px |
| `#try` | 1312x1312.25 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 36px | 46.08px | 0px |
| `.reader` | 1219.84x1220.09 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.paper` | 593.92x729.36 | Source Serif 4 400 17px/27.2px | #0B2B22 | #FAF7ED | 24px | 51.84px | 0px |
| `.paper .run` | 490.27x12 | mono 400 12px/12px ls 0.24px | #506353 | transparent | 0px | 0px | 0px 0px 32px |
| `.paper h3` | 490.27x37.39 | Figtree 800 34px/37.4px ls -1.53px | #0B2B22 | transparent | 0px | 0px | 0px 0px 18px |
| `.psg` | 518.27x128.44 | Source Serif 4 400 18.72px/30.3264px | #0B2B22 | transparent | 12px | 10px 14px | 0px -14px 8px |
| `.psg .pid` | 490.27x11.5 | mono 600 11.5px/11.5px | #506353 | transparent | 0px | 0px | 0px 0px 6px |
| `.dtable` | 490.27x107 | Figtree 400 14.5px/21.75px | #0B2B22 | transparent | 0px | 0px | 18px 0px 0px |
| `.dtable caption` | 490.27x25.5 | Figtree 700 13px/19.5px | #506353 | transparent | 0px | 0px 0px 6px | 0px |
| `.dtable td` | 214.02x40.75 | Figtree 400 14.5px/21.75px | #0B2B22 | transparent | 0px | 9px 0px | 0px |
| `.sheet` | 593.92x1220.09 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 24px | 18px 28px 22px | 0px |
| `.trace-h` | 537.92x39.19 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 18px |
| `.trace-h h3` | 172x25.59 | Figtree 700 16px/25.6px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.node` | 537.92x153.58 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px 0px 16px 38px | 0px |
| `.node .k` | 499.92x26 | Figtree 700 15.5px/26px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.node .hint` | 0x0 | Figtree 400 14px/22.4px | #506353 | transparent | 0px | 0px | 0px |
| `.trace-note` | 499.92x21.59 | Figtree 400 13.5px/21.6px | #506353 | transparent | 0px | 0px | 4px 0px 0px 38px |
| `.chapter` | 1312x822.56 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 158.4px 0px 0px | 0px |
| `.head` | 1312x214.98 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 48px |
| `.head h2` | 680x107.81 | Figtree 800 51.84px/53.9136px ls -2.3328px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.head p` | 720x91.17 | Figtree 400 19px/30.4px | #12372D | transparent | 0px | 0px | 16px 0px 0px |
| `.segwrap` | 1312x81.19 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.seg` | 489x49.19 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 999px | 4px | 0px 0px 32px |
| `.seg button` | 127x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.seg button[aria-checked="true"]` | 127x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.extract` | 1312x320 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.mini` | 700.89x216.84 | Source Serif 4 400 17px/27.2px | #0B2B22 | #FAF7ED | 20px | 28px 32px | 0px |
| `.mini .lbl` | 636.89x11.5 | Figtree 700 11.5px/11.5px ls 4.83px | #610D3D | transparent | 0px | 0px | 0px 0px 8px |
| `.mini .rh` | 636.89x12 | mono 400 12px/12px | #506353 | transparent | 0px | 0px | 0px 0px 18px |
| `.mini h4` | 636.89x27.59 | Figtree 800 24px/27.6px ls -1.08px | #0B2B22 | transparent | 0px | 0px | 0px 0px 14px |
| `.mini .cols` | 636.89x69.75 | Source Serif 4 400 15px/23.25px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.notes li` | 560.72x67.59 | Figtree 400 15.5px/24.8px | #12372D | transparent | 0px | 4px 0px 14px | 0px |
| `.chain` | 1312x3870 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.steps` | 551.52x3870 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px 0px 162px | 0px |
| `.step` | 551.52x360 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 36px 0px | 0px |
| `.step h3` | 551.52x42 | Figtree 800 40px/42px ls -1.8px | #0B2B22 | transparent | 0px | 0px | 0px 0px 12px |
| `.step p` | 550x27.19 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 0px 0px 12px |
| `.step .warn` | 500x40 | Figtree 600 15px/24px | #610D3D | #F1E3E8 | 12px | 8px 14px | 0px 0px 12px |
| `.diagram` | 674.09x1278.7 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 32px | 34px | 0px |
| `.dstages` | 606.09x1210.7 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.dst` | 606.09x127.98 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 18px | 12px 14px 12px 0px | 0px |
| `.dst .n` | 36x36 | Figtree 800 13px/20.8px | #FAF7ED | #12372D | 50% | 0px | 0px |
| `.dst .body` | 540.09x103.98 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 6px 0px 0px | 0px |
| `.dst .nm` | 540.09x32 | Figtree 800 20px/32px ls -0.5px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.dst .ds` | 540.09x23.19 | Figtree 400 14.5px/23.2px | #506353 | transparent | 0px | 0px | 2px 0px 0px |
| `.dst.cur` | 606.09x605.98 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 18px | 12px 14px 12px 0px | 0px |
| `.graph` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 10px 0px 0px |
| `.graph .nb` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .nt` | 0x0 | Figtree 700 15px/normal ls -0.15px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .ns` | 0x0 | Figtree 500 11.5px/normal | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .lab text` | 0x0 | Figtree 600 12px/normal | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .e` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.tabs` | 444x50 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 999px | 4px | 0px 775.844px 32px 0px |
| `.tab` | 141x42 | Figtree 700 15px/24px | #12372D | transparent | 999px | 9px 20px | 0px |
| `.tab[aria-selected="true"]` | 167x42 | Figtree 700 15px/24px | #FAF7ED | #610D3D | 999px | 9px 20px | 0px |
| `.vpanel` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.vpanel > div` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 24px | 36px | 0px |
| `.flowline` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 22px |
| `.flowline li` | 0x0 | Figtree 700 14px/17.5px | #0B2B22 | #EFF3E3 | 12px | 9px 13px | 0px |
| `.flowline li small` | 0x0 | Figtree 600 11.5px/14.375px | #FAF7ED @0.8 | transparent | 0px | 0px | 0px |
| `.flowline li.auth` | 0x0 | Figtree 700 14px/17.5px | #FAF7ED | #610D3D | 12px | 9px 13px | 0px |
| `.flowline li.gate` | 281x35.5 | Figtree 700 14px/17.5px | #0B2B22 | #E2EDBA | 12px | 9px 13px | 0px |
| `.case .who` | 0x0 | Figtree 700 13px/20.8px | #506353 | transparent | 0px | 0px | 0px 0px 6px |
| `.case .said` | 0x0 | Source Serif 4 400 19px/28.5px | #12372D | transparent | 0px | 0px | 0px 0px 16px |
| `.judge` | 499.92x189.95 | Figtree 400 14.5px/23.2px | #0B2B22 | #E2EDBA | 18px | 16px 18px | 6px 0px 0px |
| `.judge dt` | 63x24.8 | Figtree 700 12.5px/20px | #506353 | transparent | 0px | 2px 0px 0px | 0px |
| `.judge dd` | 386.92x24.8 | Source Serif 4 400 15.5px/24.8px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.nums` | 521.92x202.72 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 18px 0px 14px |
| `.nums div` | 255.95x96.36 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 16px | 14px 16px | 0px |
| `.nums b` | 223.95x41.17 | Figtree 800 37.44px/41.184px ls -1.6848px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.nums span` | 101x16 | Figtree 400 13.5px/21.6px | #12372D | transparent | 0px | 0px | 0px |
| `.pull` | 0x0 | Source Serif 4 400 21px/30.45px | #12372D | transparent | 0px | 0px | 0px 0px 14px |
| `.small` | 0x0 | Figtree 400 13.5px/21.6px | #12372D | transparent | 0px | 0px | 16px 0px 14px |
| `.bento` | 1312x574.22 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.tile` | 648x329.11 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 36px | 0px |
| `.tile.indigo` | 648x329.11 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 36px | 0px |
| `.tile.peach` | 648x329.11 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 36px | 0px |
| `.tile.plain` | 869.33x229.11 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 28px | 36px | 0px |
| `.tile .hn` | 576x54.72 | Figtree 800 54.72px/54.72px ls -2.4624px | #FAF7ED | transparent | 0px | 0px | 0px 0px 6px |
| `.tile h3` | 396x30.8 | Figtree 800 28px/30.8px ls -1.26px | #FAF7ED | transparent | 0px | 0px | 0px 0px 10px |
| `.pbars` | 576x66 | Figtree 400 17px/27.2px | #FAF7ED | transparent | 0px | 0px | 22px 0px 18px |
| `.pb` | 576x28 | Figtree 400 17px/27.2px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.pb span` | 52x20 | Figtree 700 12.5px/20px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.track` | 512x28 | Figtree 400 17px/27.2px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.fill` | 512x28 | Figtree 400 17px/27.2px | #FAF7ED | #FAF7ED @0.22 | 8px | 0px | 0px |
| `.val` | 55x28 | Figtree 800 15px/28px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.native` | 1312x750.66 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.native figure` | 648x750.66 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 32px | 40px 40px 0px | 0px |
| `.native figcaption b` | 568x41.47 | Figtree 800 25.92px/41.472px ls -0.9072px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.slot` | 568x620 | Figtree 400 14.5px/23.2px | #506353 | #EFF3E3 | 28px 28px 0px 0px | 24px | 0px |
| `.md` | 1312x415 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.md-list` | 527x415 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.md-tab` | 527x69 | Figtree 700 20px/32px ls -0.4px | #0B2B22 | transparent | 0px | 18px 16px 18px 18px | 0px |
| `.md-tab[aria-selected="true"]` | 527x69 | Figtree 700 20px/32px ls -0.4px | #0B2B22 | transparent | 0px | 18px 16px 18px 18px | 0px |
| `.md-panel` | 713x360.69 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 43.2px | 0px |
| `.md-panel h3` | 626.63x74.78 | Figtree 800 34px/37.4px ls -1.36px | #0B2B22 | transparent | 0px | 0px | 0px 0px 20px |
| `.md-panel dt` | 626.63x22.39 | Figtree 700 14px/22.4px | #610D3D | transparent | 0px | 0px | 0px |
| `.md-panel dd` | 626.63x54.38 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 4px 0px 0px |
| `.close` | 1312x763.41 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 8px 0px 0px | 0px |
| `.close .paper` | 627.2x473.77 | Source Serif 4 400 17px/27.2px | #0B2B22 | #FAF7ED | 24px | 40px | 0px |
| `.psg-static` | 547.2x94.39 | Source Serif 4 400 16px/24.8px | #0B2B22 | #EFF3E3 | 12px | 10px 14px | 0px 0px 12px |
| `.summary` | 627.2x90 | Figtree 400 20px/30px | #12372D | transparent | 0px | 0px | 0px 0px 14px |
| `.legend li` | 71x21.59 | Figtree 400 13.5px/21.6px | #12372D | transparent | 0px | 0px | 0px |
| `.next a` | 114.92x89.59 | Figtree 800 56px/89.6px ls -2.52px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.skip` | 152x47.19 | Figtree 600 17px/27.2px | #FAF7ED | #610D3D | 10px | 10px 16px | 0px |

## Leu at mobile-390

| Selector | Box (px) | Font | Colour | Background | Radius | Padding | Margin |
|---|---|---|---|---|---|---|---|
| `body` | 390x13878.36 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 0px | 0px | 0px |
| `.pnav .wrap` | 358x64 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 16px |
| `.pname` | 35.03x35.19 | Figtree 800 22px/35.2px ls -0.66px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.pnav ul a` | 0x0 | Figtree 400 14.5px/23.2px | #12372D | transparent | 999px | 8px 14px | 0px |
| `.pnav .btn` | 70x41.19 | Figtree 700 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.hero` | 358x381.8 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 40px 0px 28px | 0px |
| `.hero .kicker` | 358x24 | Figtree 600 15px/24px | #610D3D | transparent | 0px | 0px | 0px 0px 20px |
| `.hero h1` | 358x88 | Figtree 800 44px/44px ls -1.98px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.hero .sub` | 358x81 | Figtree 400 18px/27px | #12372D | transparent | 0px | 0px | 22px 0px 28px |
| `.ctas .btn.primary` | 85x50.8 | Figtree 700 15.5px/24.8px | #FAF7ED | #610D3D | 999px | 13px 24px | 0px |
| `.tlink` | 103x27.19 | Figtree 600 17px/27.2px | #610D3D | transparent | 0px | 0px | 0px |
| `.cap` | 358x44.78 | Figtree 400 14px/22.4px | #506353 | transparent | 0px | 0px | 14px 0px 0px |
| `#try` | 358x2633.58 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 20px | 16px | 0px |
| `.reader` | 326x2601.58 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.paper` | 326x820.59 | Source Serif 4 400 17px/27.2px | #0B2B22 | #FAF7ED | 16px | 24px | 0px |
| `.paper .run` | 278x12 | mono 400 12px/12px ls 0.24px | #506353 | transparent | 0px | 0px | 0px 0px 20px |
| `.paper h3` | 278x28.59 | Figtree 800 26px/28.6px ls -1.17px | #0B2B22 | transparent | 0px | 0px | 0px 0px 18px |
| `.psg` | 306x202.69 | Source Serif 4 400 17px/27.54px | #0B2B22 | transparent | 12px | 10px 14px | 0px -14px 8px |
| `.psg .pid` | 278x11.5 | mono 600 11.5px/11.5px | #506353 | transparent | 0px | 0px | 0px 0px 6px |
| `.dtable` | 278x107 | Figtree 400 14.5px/21.75px | #0B2B22 | transparent | 0px | 0px | 18px 0px 0px |
| `.dtable caption` | 278x25.5 | Figtree 700 13px/19.5px | #506353 | transparent | 0px | 0px 0px 6px | 0px |
| `.dtable td` | 121.36x40.75 | Figtree 400 14.5px/21.75px | #0B2B22 | transparent | 0px | 9px 0px | 0px |
| `.sheet` | 326x1764.98 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 16px | 18px 18px 22px | 0px |
| `.trace-h` | 290x39.19 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 18px |
| `.trace-h h3` | 172x25.59 | Figtree 700 16px/25.6px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.node` | 290x227.97 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px 0px 16px 38px | 0px |
| `.node .k` | 252x26 | Figtree 700 15.5px/26px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.node .hint` | 0x0 | Figtree 400 14px/22.4px | #506353 | transparent | 0px | 0px | 0px |
| `.trace-note` | 252x43.19 | Figtree 400 13.5px/21.6px | #506353 | transparent | 0px | 0px | 4px 0px 0px 38px |
| `.chapter` | 358x1005.42 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 88px 0px 0px | 0px |
| `.head` | 358x218.47 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 28px |
| `.head h2` | 358x66.53 | Figtree 800 32px/33.28px ls -1.44px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.head p` | 358x135.94 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 16px 0px 0px |
| `.segwrap` | 358x110.38 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.seg` | 358x90.38 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 999px | 4px | 0px 0px 20px |
| `.seg button` | 127x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.seg button[aria-checked="true"]` | 127x41.19 | Figtree 600 14.5px/23.2px | #FAF7ED | #610D3D | 999px | 9px 18px | 0px |
| `.extract` | 358x560.58 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.mini` | 358x308.59 | Source Serif 4 400 17px/27.2px | #0B2B22 | #FAF7ED | 20px | 28px 32px | 0px |
| `.mini .lbl` | 294x11.5 | Figtree 700 11.5px/11.5px ls 4.83px | #610D3D | transparent | 0px | 0px | 0px 0px 8px |
| `.mini .rh` | 294x12 | mono 400 12px/12px | #506353 | transparent | 0px | 0px | 0px 0px 18px |
| `.mini h4` | 294x27.59 | Figtree 800 24px/27.6px ls -1.08px | #0B2B22 | transparent | 0px | 0px | 0px 0px 14px |
| `.mini .cols` | 294x161.5 | Source Serif 4 400 15px/23.25px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.notes li` | 358x92.39 | Figtree 400 15.5px/24.8px | #12372D | transparent | 0px | 4px 0px 14px | 0px |
| `.chain` | 358x2602.83 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.steps` | 358x2602.83 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px 0px 151.92px | 0px |
| `.step` | 358x298.14 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 36px 0px | 0px |
| `.step h3` | 358x29.39 | Figtree 800 28px/29.4px ls -1.26px | #0B2B22 | transparent | 0px | 0px | 0px 0px 12px |
| `.step p` | 358x27.19 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 0px 0px 12px |
| `.step .warn` | 358x40 | Figtree 600 15px/24px | #610D3D | #F1E3E8 | 12px | 8px 14px | 0px 0px 12px |
| `.diagram` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 32px | 20px | 0px |
| `.dstages` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.dst` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 18px | 12px 14px 12px 0px | 0px |
| `.dst .n` | 0x0 | Figtree 800 13px/20.8px | #FAF7ED | #12372D | 50% | 0px | 0px |
| `.dst .body` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 6px 0px 0px | 0px |
| `.dst .nm` | 0x0 | Figtree 800 17px/27.2px ls -0.425px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.dst .ds` | 0x0 | Figtree 400 14.5px/23.2px | #506353 | transparent | 0px | 0px | 2px 0px 0px |
| `.dst.cur` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 18px | 12px 14px 12px 0px | 0px |
| `.graph` | 358x318.06 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 10px 0px 0px |
| `.graph .nb` | 118.41x37.18 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .nt` | 39.07x13 | Figtree 700 15px/normal ls -0.15px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .ns` | 27x10 | Figtree 500 11.5px/normal | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .lab text` | 32x10 | Figtree 600 12px/normal | #0B2B22 | transparent | 0px | 0px | 0px |
| `.graph .e` | 55.08x44.75 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.tabs` | 326x50 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 999px | 4px | 0px 0px 20px |
| `.tab` | 141x42 | Figtree 700 15px/24px | #12372D | transparent | 999px | 9px 20px | 0px |
| `.tab[aria-selected="true"]` | 167x42 | Figtree 700 15px/24px | #FAF7ED | #610D3D | 999px | 9px 20px | 0px |
| `.vpanel` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.vpanel > div` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 24px | 22px | 0px |
| `.flowline` | 0x0 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px 0px 22px |
| `.flowline li` | 0x0 | Figtree 700 14px/17.5px | #0B2B22 | #EFF3E3 | 12px | 9px 13px | 0px |
| `.flowline li small` | 0x0 | Figtree 600 11.5px/14.375px | #FAF7ED @0.8 | transparent | 0px | 0px | 0px |
| `.flowline li.auth` | 0x0 | Figtree 700 14px/17.5px | #FAF7ED | #610D3D | 12px | 9px 13px | 0px |
| `.flowline li.gate` | 281x35.5 | Figtree 700 14px/17.5px | #0B2B22 | #E2EDBA | 12px | 9px 13px | 0px |
| `.case .who` | 0x0 | Figtree 700 13px/20.8px | #506353 | transparent | 0px | 0px | 0px 0px 6px |
| `.case .said` | 0x0 | Source Serif 4 400 19px/28.5px | #12372D | transparent | 0px | 0px | 0px 0px 16px |
| `.judge` | 252x329.91 | Figtree 400 14.5px/23.2px | #0B2B22 | #E2EDBA | 18px | 16px 18px | 6px 0px 0px |
| `.judge dt` | 63x49.59 | Figtree 700 12.5px/20px | #506353 | transparent | 0px | 2px 0px 0px | 0px |
| `.judge dd` | 139x49.59 | Source Serif 4 400 15.5px/24.8px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.nums` | 282x209.16 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 18px 0px 14px |
| `.nums div` | 136x113.17 | Figtree 400 17px/27.2px | #0B2B22 | #EFF3E3 | 16px | 14px 16px | 0px |
| `.nums b` | 104x30.8 | Figtree 800 28px/30.8px ls -1.26px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.nums span` | 101x16 | Figtree 400 13.5px/21.6px | #12372D | transparent | 0px | 0px | 0px |
| `.pull` | 0x0 | Source Serif 4 400 18px/26.1px | #12372D | transparent | 0px | 0px | 0px 0px 14px |
| `.small` | 0x0 | Figtree 400 13.5px/21.6px | #12372D | transparent | 0px | 0px | 16px 0px 14px |
| `.bento` | 358x1004.11 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.tile` | 358x279.78 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 24px | 0px |
| `.tile.indigo` | 358x279.78 | Figtree 400 17px/27.2px | #FAF7ED | #12372D | 28px | 24px | 0px |
| `.tile.peach` | 358x279.78 | Figtree 400 17px/27.2px | #0B2B22 | #E2EDBA | 28px | 24px | 0px |
| `.tile.plain` | 358x198.58 | Figtree 400 17px/27.2px | #0B2B22 | #FAF7ED | 28px | 24px | 0px |
| `.tile .hn` | 310x36 | Figtree 800 36px/36px ls -1.62px | #FAF7ED | transparent | 0px | 0px | 0px 0px 6px |
| `.tile h3` | 308x24.19 | Figtree 800 22px/24.2px ls -0.99px | #FAF7ED | transparent | 0px | 0px | 0px 0px 10px |
| `.pbars` | 310x66 | Figtree 400 17px/27.2px | #FAF7ED | transparent | 0px | 0px | 22px 0px 18px |
| `.pb` | 310x28 | Figtree 400 17px/27.2px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.pb span` | 52x20 | Figtree 700 12.5px/20px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.track` | 246x28 | Figtree 400 17px/27.2px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.fill` | 246x28 | Figtree 400 17px/27.2px | #FAF7ED | #FAF7ED @0.22 | 8px | 0px | 0px |
| `.val` | 55x28 | Figtree 800 15px/28px | #FAF7ED | transparent | 0px | 0px | 0px |
| `.native` | 358x986.38 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.native figure` | 358x485.19 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 32px | 24px 24px 0px | 0px |
| `.native figcaption b` | 310x32 | Figtree 800 20px/32px ls -0.7px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.slot` | 310x380 | Figtree 400 14.5px/23.2px | #506353 | #EFF3E3 | 28px 28px 0px 0px | 24px | 0px |
| `.md` | 358x873.56 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.md-list` | 358x440.5 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.md-tab` | 358x91.38 | Figtree 700 17px/27.2px ls -0.34px | #0B2B22 | transparent | 0px | 18px 16px 18px 18px | 0px |
| `.md-tab[aria-selected="true"]` | 358x91.38 | Figtree 700 17px/27.2px ls -0.34px | #0B2B22 | transparent | 0px | 18px 16px 18px 18px | 0px |
| `.md-panel` | 358x409.06 | Figtree 400 17px/27.2px | #0B2B22 | #E4EAD3 | 28px | 24px | 0px |
| `.md-panel h3` | 310x52.78 | Figtree 800 24px/26.4px ls -0.96px | #0B2B22 | transparent | 0px | 0px | 0px 0px 20px |
| `.md-panel dt` | 310x22.39 | Figtree 700 14px/22.4px | #610D3D | transparent | 0px | 0px | 0px |
| `.md-panel dd` | 310x81.56 | Figtree 400 17px/27.2px | #12372D | transparent | 0px | 0px | 4px 0px 0px |
| `.close` | 358x1222.8 | Figtree 400 17px/27.2px | #0B2B22 | transparent | 0px | 8px 0px 0px | 0px |
| `.close .paper` | 358x569.75 | Source Serif 4 400 17px/27.2px | #0B2B22 | #FAF7ED | 16px | 24px | 0px |
| `.psg-static` | 310x143.98 | Source Serif 4 400 16px/24.8px | #0B2B22 | #EFF3E3 | 12px | 10px 14px | 0px 0px 12px |
| `.summary` | 358x102 | Figtree 400 17px/25.5px | #12372D | transparent | 0px | 0px | 0px 0px 14px |
| `.legend li` | 71x21.59 | Figtree 400 13.5px/21.6px | #12372D | transparent | 0px | 0px | 0px |
| `.next a` | 69.89x54.39 | Figtree 800 34px/54.4px ls -1.53px | #0B2B22 | transparent | 0px | 0px | 0px |
| `.skip` | 152x47.19 | Figtree 600 17px/27.2px | #FAF7ED | #610D3D | 10px | 10px 16px | 0px |
