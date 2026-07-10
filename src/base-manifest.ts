import base from '../grammar/base.manifest.json';

/**
 * The vendored base node manifest — the prose vocabulary (paragraph, heading,
 * lists, marks incl. the annotation mark) every profile manifest composes
 * with. Canonical copy lives in laravel-block-schema
 * (resources/manifests/base.manifest.json); refresh with `npm run
 * sync-grammar` and commit alongside vocabulary changes. Kept loosely typed —
 * blockdoc's assemblePMSchema is the consumer that gives it shape.
 */
export const baseNodeManifest = base as Record<string, unknown>;
