# Currency rows release — currencies-20261114a

Scope: only `/catalog/v5-editor/`. Existing project records, IDs, artwork, backgrounds, storage keys and user JSON are unchanged. The V5.1 panel, highlights and transparent close button implementations are retained.

## Behavior

- Each owner-defined list is a single horizontal row: icon plus ticker (name if no ticker); the full name is available on hover. Narrow rows scroll horizontally.
- `coinsCaption` and `internalCurrenciesCaption` are plain, independently editable text in **Данные проекта**. Line breaks are retained and long text wraps. Empty captions are omitted; empty lists render no group.
- `coins` remains a neutral owner-defined list. No filtering or classification by `use`, no automatic mining/withdrawal/deposit labels, no synthetic HG item and no truncation to five currencies.
- `internalCurrencies` renders separately, with its own caption and icons. Both lists support add/remove, manual icon paths/URLs, library selection and per-view/device visibility checkboxes. Library entries can be added to either list explicitly.
- SolFarmer's SOL and SSOL remain exactly in the original list. The UI calls it “Валюты проекта”; this makes no assertion that SSOL is an external cryptocurrency. The SSOL icon remains the existing unknown-icon fallback until the owner selects one. No financial claims or project data were added.
- Existing explicit visibility lists are respected. With no explicit selection, all filled currencies are shown. Added currencies no longer disappear merely because they were absent from the base snapshot. Existing feature/gallery defaults are retained.

## Verification, 14 November 2026

- All JavaScript files pass `node --check`.
- Model and SolFarmer suites: 11 passing tests, including preservation of other records and storage, validation, round-trip data and explicit membership.
- Headless Chrome: HashGarden and SolFarmer × detail/cards/list × desktop/tablet/phone = 18 passing responsive cases. Icons load, currencies share one row, multiline captions and the separate internal row persist after reload; no card overflow or browser exceptions.
- Real editor controls: add internal currency, edit ticker and manual icon, edit both captions, save/reload, hide one currency for one device, preserve visibility on other devices, export/import JSON, force horizontal scroll with 15 currencies, omit both empty groups. Passed without browser exceptions.
- Phone screenshot visually reviewed: currency rows and caption wrapping are correct; existing SolFarmer artwork is retained.
- The pre-existing `editor-mobile.test.cjs` still fails because its fake Element lacks `.closest()`. The implementation of the mobile panel is unchanged; the real editor loaded and switched devices successfully.

Browser regression command (requires Playwright and Chrome):

`node catalog/v5-editor/currencies-browser.test.cjs`

Set `PLAYWRIGHT_PATH` and `CHROME_PATH` if they are not available at the default locations. Browser tests use their own isolated browser context and do not touch the owner's browser or stored drafts.
