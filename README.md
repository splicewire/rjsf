# rjsf-splicewire

The Splicewire adapter over [`@stephenr85/rjsf-registry`](https://github.com/stephenr85/rjsf-registry):
the collective vocabulary plus Splicewire-specific routing. Mirrors the PHP seam between
`laravel-schema-forms` (host-agnostic primitive) and `laravel-splicewire-satellite-schema-form`
(Splicewire adapter).

- **Keyword dialect** — the Splicewire `x-*` grammar (`FORM_KEYWORDS`, `ANNOTATION_KEYWORDS`,
  and the engine-private `x-sw?-*` pattern) declared through the generic
  `createKeywordVocabulary` seam.
- **Vendored generation vocabulary** — `grammar/vocabulary.schema.json` mirrors the canonical
  export from the platform (`php artisan composition:export-grammar`); refresh with
  `npm run sync-grammar` (reads `$SPLICEWIRE_APP_DIR`, no-ops in standalone checkouts) and
  commit the refreshed copy alongside the grammar change. The conformance test asserts the
  adapter tolerates every published keyword.
- **`SplicewireForm`** — the pre-wired form: `SchemaForm` with the Splicewire validator.
  The generic registry/fetcher plumbing is re-exported so one import serves most consumers.

Satellites with **no** Splicewire frontend dependency (plain waitlist/contact forms) should use
`@stephenr85/rjsf-registry` directly — that package carries zero Splicewire vocabulary.

## Install

```sh
npm install @stephenr85/rjsf-splicewire
```

## Usage

```tsx
import { SplicewireForm, registerWidget } from '@stephenr85/rjsf-splicewire';

<SplicewireForm
    schema={schema}
    schemaFetcher={(ref) => api.get(ref).then((r) => r.data?.data?.schema ?? r.data?.data ?? r.data)}
    onSubmit={({ formData }) => save(formData)}
/>;
```

## Binding addressing (shell convention)

Span/node-level bindings address into rich-content documents as
`{ "@id": <field pointer>, "x-sw-node": <uuid>, "x-sw-span": <uuid>? }` — the base `@id`
doctrine extended with Splicewire-owned `x-sw-*` keys. The SQL graph is authoritative;
document attrs (node `id`s, `annotation` mark ids) are only the location index the editor
maintains (blockdoc's node-id and annotation-integrity plugins). Server-side reconciliation
flags dangling bindings at commit.
