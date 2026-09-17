# Equity Approved References

Equity is an approved reference for serious data terminals: dense tables, financial state, source-aware feeds, and comparison-first layouts.

## Screenshots

| Screenshot | Lesson | Tags |
| --- | --- | --- |
| `screenshots/01-market-command-center-overview.png` | Frame dense market data with search, ticker context, summary metrics, and a table. | terminal, overview, ticker-tape, table |
| `screenshots/02-watchlist-coverage-board.png` | Pair a dense table with a side inspector for active research scope. | watchlist, coverage, inspector |
| `screenshots/03-return-leaderboard-bars.png` | Use summary metrics and horizontal bars for ranked performance comparison. | leaderboard, bars, performance |
| `screenshots/04-return-matrix-heatmap.png` | Use heatmaps for cross-object and cross-time metric comparison. | heatmap, matrix, comparison |
| `screenshots/05-news-lens-headline-tape.png` | Keep source, sentiment, ticker, and recency controls near a long news stream. | news, filters, source-labels |
| `screenshots/06-quote-tape-range-table.png` | Pair current values with range bars for compact market scanning. | quote-tape, range-bars, table |

## Reusable Patterns

- Dense data needs stable navigation, search, filters, and source labels.
- Active scopes should be visible before the table or feed they control.
- Color should encode semantic state, especially gain/loss/review/live.
- Tables should preserve identifiers and units under heavy density.

## App-Specific-Only Patterns

- Financial tickers, live market values, returns, headlines, and source names.
- Neon green terminal accent.
- Market-specific red/green conventions.

## Top Approved Directions

1. Data terminal with real scanning hierarchy.
2. Table-plus-inspector layouts.
3. Heatmap and leaderboard comparison views.
4. Source-aware news tape.

## Warnings For Future Agents

- Do not fake live financial data.
- Do not use terminal density unless the product needs it.
- Do not copy ticker names, sources, or numbers into new products.
