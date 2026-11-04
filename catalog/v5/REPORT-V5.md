# ZETTA-ZONE V5

Source baseline: b5d86a37591e58ea5941ab01dd296afbaebbab86.

- Catalog shell, branding, intro, sticky search, category strip and side menu come from catalog-lab.
- Legacy catalog-lab project records, card renderers, detail dialogs, comparison and gesture scripts are not loaded.
- List/cards, detail page, gallery, focused sections, mobile header/footer, favorites, comparison, ratings and dialogs come from catalog/v4.2.
- Shared dark palette uses catalog-lab navy surfaces, mint accents and blue. Green interface literals from V4.2 are recolored; project gallery artwork and cryptocurrency brand colors remain project content.
- V5 browser storage is isolated from V4.2. Manifest scope is limited to catalog/v5/.
- Source directories and the main page are unchanged.

Validation before publication:

- All JavaScript passes node --check; both HTML pages resolve their local references.
- Browser: nine project previews, list/cards switch, empty search and reset, side filters/sorting, favorites, two-project comparison, detail opening, gallery next slide and closing back to catalog.
- Responsive frames: 280px, 390px, 768px; no document horizontal overflow. Desktop checked at 1363px browser viewport.
- Mobile detail: visible footer with ratings, favorite, comparison and registration; compact header and separate close control. Feature explanations work in cards.

The inherited project set is fictional HashGarden and eight test instances. Real registration, server voting and external services are not connected in V4.2 and remain demonstration functions in V5. Browser checks do not replace a physical iPhone Safari/PWA check.
