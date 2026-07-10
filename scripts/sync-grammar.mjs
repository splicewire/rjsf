#!/usr/bin/env node
/**
 * Refresh the vendored generation-vocabulary meta-schema from the canonical
 * export in the platform app repo. Run alongside `php artisan
 * composition:export-grammar` whenever the grammar changes, and commit the
 * refreshed copy in the same change.
 *
 * The canonical artifact is derived (ADR-0060); this vendored copy is a
 * do-not-hand-edit mirror so the package is self-contained for standalone
 * installs. The app repo location comes from $SPLICEWIRE_APP_DIR (falling back
 * to ~/Herd/splicewire-app); where the canonical file is absent — a standalone
 * checkout — the script no-ops (exit 0) and leaves the committed vendored copy
 * authoritative.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = process.env.SPLICEWIRE_APP_DIR ?? join(homedir(), 'Herd', 'splicewire-app');
const blockSchemaDir =
    process.env.BLOCK_SCHEMA_DIR ??
    join(homedir(), 'Workspaces', 'laravel', 'packages', 'rushing', 'laravel-block-schema');

const mirrors = [
    {
        label: 'generation vocabulary',
        canonical: resolve(
            appDir,
            'resources/composition-grammars/_vocabulary/vocabulary.schema.json',
        ),
        vendored: resolve(here, '../grammar/vocabulary.schema.json'),
    },
    {
        label: 'base node manifest',
        canonical: resolve(blockSchemaDir, 'resources/manifests/base.manifest.json'),
        vendored: resolve(here, '../grammar/base.manifest.json'),
    },
];

for (const { label, canonical, vendored } of mirrors) {
    if (!existsSync(canonical)) {
        console.log(
            `[sync-grammar] Canonical ${label} not found at ${canonical}\n` +
                '[sync-grammar] Standalone checkout — keeping the committed vendored copy. No changes made.',
        );
        continue;
    }

    if (existsSync(vendored) && readFileSync(canonical).equals(readFileSync(vendored))) {
        console.log(`[sync-grammar] Vendored ${label} already up to date.`);
        continue;
    }

    mkdirSync(dirname(vendored), { recursive: true });
    copyFileSync(canonical, vendored);
    console.log(`[sync-grammar] Vendored ${label} refreshed from ${canonical}`);
}
