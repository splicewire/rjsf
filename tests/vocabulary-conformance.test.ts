import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isSplicewireKeyword } from '../src';

const here = dirname(fileURLToPath(import.meta.url));
const vendored = resolve(here, '../grammar/vocabulary.schema.json');
const vocabulary = JSON.parse(readFileSync(vendored, 'utf8')) as {
    properties?: Record<string, unknown>;
};
const keywords = Object.keys(vocabulary.properties ?? {});

describe('generation-vocabulary conformance', () => {
    it('the vendored vocabulary publishes keywords', () => {
        expect(keywords.length).toBeGreaterThan(0);
    });

    it.each(keywords)('the adapter tolerates the published keyword %s', (keyword) => {
        expect(isSplicewireKeyword(keyword)).toBe(true);
    });
});
