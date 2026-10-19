import base from '../grammar/base.manifest.json';

/**
 * The vendored base node manifest — the prose vocabulary (p, h2–h6, lists,
 * blockquote, pre, hr, br; marks incl. the annotation mark) every profile
 * manifest composes with. Node names are the JSX tags blockdoc's editor
 * normalizes stored documents into (EP-07c), so this copy must track the
 * blockdoc release hosts run. Canonical copy lives in schemastud/laravel-blockdoc
 * (resources/manifests/base.manifest.json); refresh with `npm run
 * sync-grammar` and commit alongside vocabulary changes. Kept loosely typed —
 * blockdoc's assemblePMSchema is the consumer that gives it shape.
 */
export const baseNodeManifest = base as Record<string, unknown>;
