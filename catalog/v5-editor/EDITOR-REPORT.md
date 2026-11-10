# V5 Editor · isolated test laboratory

This directory extends the existing V5 HashGarden template and original Nocid data. It does not replace the live V5 or V5 Lab. Open `detail.html?project=hashgarden-demo&editor=1`.

## Implemented
- Native card layout is retained on opening; editor chrome is an overlay.
- Select nested DOM elements by click, selector, or parent; edit individual direct text fragments without replacing children or listeners.
- Replace images by URL or PNG/JPEG/WebP/GIF upload (1.5 MB).
- Shared palette plus per-element text, background, border, font/icon size, padding, gap, alignment and direction.
- Move relative to a target, into a container, or toward adjacent siblings. Restore an element to its original location, hide and restore it.
- History (100 actions), explicit browser save, reset, versioned JSON import/export. Presentation is shared; content is keyed by project.
- Close button is outside the editable tree and fixed at the top right. Panel can dock left/right and works on tablet width.

## Contracts and limits
- Settings schema `zetta-zone/shared-card`, version 2, template `pc-detail-v5`; future templates require their own DOM adapter using the same settings envelope.
- No raw HTML/CSS/JS import. JSON values are validated. Files up to 3 MB; image uploads use local data URLs. Export settings for transfer to another device/browser.
- Gallery and navigation internals cannot be moved; the gallery as a block can be moved. Existing native grid determines row/column wrapping. The editor does not introduce a new catalogue grid or force block dimensions.
- Only the PC detail template is adapted. Dynamic coin/mechanic children are rebound after the retained renderer recreates them. Text edits apply to the selected presentation slot; separate per-coin content editing is outside this adapter.
- Legacy schema `zetta-v5-lab-desktop` is intentionally rejected: it uses a forced desktop grid incompatible with preserving the source layout.

## Manual browser verification · 2026-11-10
- HashGarden and Nocid load, no captured JavaScript errors.
- Nested paragraph selection, exact text edits, save/reload passed.
- Literal `Тест · DEMO · ручной текст` is preserved against preview text cleanup, including after reload.
- Cross-section transfer, restore location, hide/recover passed.
- Font-size edit, undo and redo passed.
- Export/download and import via the file chooser passed.
- Palette leaves an explicit font size intact.
- 820 × 1180 viewport: editor and close visible; view/edit toggle passed.

Publication is for evaluation only; live directories remain untouched.

- Dynamic Litecoin panel: select nested bold text and edit after switching the native currency tab passed, no captured JavaScript errors.
- Cross-project persistence: edited HashGarden heading, saved in Nocid, returned to HashGarden; Nocid stayed unchanged and the HashGarden heading persisted.
