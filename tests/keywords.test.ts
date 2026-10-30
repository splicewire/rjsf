import { describe, expect, it } from 'vitest';
import type { RJSFSchema } from '@rjsf/utils';
import { ANNOTATION_KEYWORDS, isEnginePrivateKeyword, isSplicewireKeyword, splicewireValidator } from '../src';


describe('keyword grammar', () => {
    it('retires x-optional without retiring the remaining annotations', () => {
        expect(ANNOTATION_KEYWORDS).not.toContain('x-optional');
        expect(isSplicewireKeyword('x-optional')).toBe(false);
        for (const keyword of [
            'x-fragment', 'x-type', 'x-filter', 'x-sort', 'x-lazy',
            'x-dereference', 'x-migrate', 'x-migrate-from',
        ]) {
            expect(ANNOTATION_KEYWORDS).toContain(keyword);
            expect(isSplicewireKeyword(keyword)).toBe(true);
        }
    });

    it('matches engine-private keywords by pattern, not a hard-coded list', () => {
        expect(isEnginePrivateKeyword('x-swc-beat')).toBe(true);
        expect(isEnginePrivateKeyword('x-swk-adjudicate')).toBe(true);
        expect(isEnginePrivateKeyword('x-widget')).toBe(false);
        expect(isEnginePrivateKeyword('x-filter')).toBe(false);
    });

    it('tolerates the shell binding keys (x-sw-node / x-sw-span)', () => {
        expect(isSplicewireKeyword('x-sw-node')).toBe(true);
        expect(isSplicewireKeyword('x-sw-span')).toBe(true);
    });

    it('recognizes the form-facing and annotation vocabulary', () => {
        for (const kw of ['x-widget', 'x-placeholder', 'x-fragment', 'x-filter', 'x-dereference']) {
            expect(isSplicewireKeyword(kw)).toBe(true);
        }
        expect(isSplicewireKeyword('x-unrelated')).toBe(false);
    });

    it('the validator tolerates the full x-* grammar (strict mode off, all errors on)', () => {
        const schema = {
            type: 'object',
            'x-type': 'form',
            properties: {
                headline: {
                    type: 'string',
                    'x-widget': 'textarea',
                    'x-placeholder': 'Write…',
                    'x-swc-generate': true,
                    'x-swc-prose': 'subject',
                    'x-filter': { operator: 'exact', name: 'headline', control: 'text' },
                },
                approved: { type: 'boolean', 'x-swc-pause': true },
            },
            required: ['headline'],
        };

        const valid = splicewireValidator.isValid(schema as RJSFSchema, { headline: 'hi' }, schema as RJSFSchema);
        expect(valid).toBe(true);
        expect(splicewireValidator.isValid(schema as RJSFSchema, {}, schema as RJSFSchema)).toBe(false);

        const result = splicewireValidator.validateFormData({ approved: 'nope' }, schema as RJSFSchema);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});
