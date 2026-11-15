# V5-Editor: project state and view geometry

This change is confined to `catalog/v5-editor`. It does not publish a site or modify other catalogue versions.

## Ownership

- Common project fields in `zz-v5-editor-project-data-51` own text, logos, feature/currency icons, links and ratings. Shared appearance is stored under the project's `appearance.<theme>.<semantic role>` fields. Existing project theme tokens remain project-wide.
- Each `zz-v5-editor-config-<project>-<view>-<device>-3` owns geometry and visibility. Geometry does not change when the light/dark theme changes. Appearance controls always update the common project layer.
- `editor-architecture.js` defines the appearance/geometry allowlists and provides pure normalization, migration, copying and backed-up storage operations.

## Compatibility and recovery

Legacy configuration version 2 and workspace exports 3/4 remain readable. The new workspace export is version 5. Configurations retain version 2 for the renderer and add `architectureVersion: 1`, semantic node roles and, when needed, a pending semantic geometry map.

Read-time migration does not modify browser storage. Published settings, saved configurations and unsaved session drafts are adapted in memory. A configuration's complete pre-migration value is retained in `legacySnapshot`. Recognizable legacy text/images and appearance become common fields. Explicit common fields win conflicts; alternatives remain in the snapshot and are reported rather than silently replacing owner data. The supplied RollerCoin configuration is covered by a round-trip test.

An explicit save serializes all entries first, creates a separate recovery snapshot, and only then writes. A failed write restores the previous entries. A failed backup prevents the save from starting. Recovery itself first makes another snapshot. Physical browser/profile loss and persistent storage failure require restoring an exported JSON; browser storage is not a server backup.

## Geometry copy

The source and receivers are view/device combinations of the current project. Users choose size/scale, X/Y, spacing, grid/layout, visibility or order. Data, appearance, palette, images, links, ratings and HTML snapshots are never part of this operation. Receivers are drafts until Save is pressed.

Matching uses exact node identity for the same template and unique semantic roles across templates. A receiver that has not been opened can resolve a unique role when rendered. Ambiguous/unmatched nodes are preserved and reported; no whole-template replacement is performed. Opening a receiver materializes matching role geometry into that receiver's editable geometry.

## Verification

Run `node --test catalog/v5-editor/tests/architecture.test.cjs` from the repository root. The tests cover legacy RollerCoin preservation, nine independent geometry configurations, shared-field conflicts, selective copying, ambiguous mappings, storage rollback and recovery.

With a local server, open `catalog/v5-editor/tests/browser-smoke.html`. The optional `name`, `color`, `logo`, `coin` and `rating` query parameters assert saved common values across all nine rendered contexts. Browser edits made during testing should use a separate local origin, never the live catalogue's storage.
