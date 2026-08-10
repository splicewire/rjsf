> You are in **splicewire/splice** — the Splicewire adapter over seam: the vendored x-*
> generation-vocabulary meta-schema (sync-grammar pattern), the Splicewire keyword dialect
> configured onto the shell, and the pre-wired SplicewireForm.

This is a leaf npm package (`@splicewire/splice`). It layers Splicewire-specific `x-*` keyword
grammar and the pre-wired `SplicewireForm` on top of the vendor-neutral `@schemastud/seam`
primitive. See `README.md` for the install/usage summary and the binding-addressing convention.

## Vendored family-package conventions

Any repo that vendors another family repo's code (composer `vendor/<vendor>/<pkg>/`, npm
`node_modules/<vendor>/<pkg>/`) checks that vendored repo's own `AGENTS.md` for conventions it
ships with itself before editing through into it.
