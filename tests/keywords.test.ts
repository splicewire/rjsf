import { describe, expect, it } from 'vitest';
import type { RJSFSchema } from '@rjsf/utils';
import { isEnginePrivateKeyword, isSplicewireKeyword, splicewireValidator } from '../src';


describe('keyword grammar', () => {
    it('matches engine-private keywords by pattern, not a hard-coded list', () => {
        expect(isEnginePrivateKeyword('x-swc-beat')).toBe(true);
        expect(isEnginePrivateKeyword('x-swk-adjudicate')).toBe(true);
        expect(isEnginePrivateKeyword('x-widget')).toBe(false);
        expect(isEnginePrivateKeyword('x-filter')).toBe(false);
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

        const result = splicewireValidator.validateFormData({ approved: 'nope' }, schema as RJSFSchema);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});
