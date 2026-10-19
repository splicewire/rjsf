# Vendored generation vocabulary

`vocabulary.schema.json` is a **generated, do-not-hand-edit** mirror of the
composition engine's generation-grammar meta-schema (the `x-swc-*` dialect,
derived from engine attributes/enums — ADR-0060).

Source of truth: the app repo's
`resources/composition-grammars/_vocabulary/vocabulary.schema.json`, produced by
`php artisan composition:export-grammar`.

To refresh this copy, run `npm run sync-grammar` from the package root — it
copies the canonical export in-place. Commit the refreshed copy alongside the
grammar change that produced it.

Why vendored: the package must be self-contained for satellites that install it
standalone (no dependency on the app repo's `resources/` tree), and the
conformance test (`tests/vocabulary-conformance.test.ts`) reads only this copy
so it runs identically in the monorepo and in a standalone checkout.

## Vendored base node manifest

`base.manifest.json` is the same kind of mirror for the blockdoc base prose
vocabulary. Source of truth: schemastud/laravel-blockdoc's
`resources/manifests/base.manifest.json`; `npm run sync-grammar` refreshes it
too. Its node names must be the ones `@schemastud/blockdoc` normalizes stored
documents into, or the editor drops every document it opens.
`tests/base-manifest-load.test.tsx` opens old-name and current-name documents
through this copy with the real editor and fails on any drift.
