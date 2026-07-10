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
