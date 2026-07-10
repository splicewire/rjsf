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
const canonical = resolve(
    appDir,
    'resources/composition-grammars/_vocabulary/vocabulary.schema.json',
);
const vendored = resolve(here, '../grammar/vocabulary.schema.json');

if (!existsSync(canonical)) {
    console.log(
        `[sync-grammar] Canonical export not found at ${canonical}\n` +
            '[sync-grammar] Standalone checkout — keeping the committed vendored copy. No changes made.',
    );
    process.exit(0);
}

if (existsSync(vendored) && readFileSync(canonical).equals(readFileSync(vendored))) {
    console.log('[sync-grammar] Vendored vocabulary already up to date.');
    process.exit(0);
}

mkdirSync(dirname(vendored), { recursive: true });
copyFileSync(canonical, vendored);
console.log(`[sync-grammar] Vendored vocabulary refreshed from ${canonical}`);
