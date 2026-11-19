import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { RJSFSchema } from '@rjsf/utils';

// SplicewireForm's job here is delegation: with no validator prop, seam's SchemaForm applies its own default, the
// provider's localized validator (useFormMessages().validator, i.e. useFormValidator(); seam's tests prove that
// default localizes). So record exactly what SplicewireForm hands SchemaForm.
const received = vi.hoisted(() => [] as Array<Record<string, unknown>>);
vi.mock('@schemastud/seam', async (importOriginal) => {
    const seam = await importOriginal<typeof import('@schemastud/seam')>();
    return {
        ...seam,
        SchemaForm: (props: Record<string, unknown>) => {
            received.push(props);
            return null;
        },
    };
});

import { createFormValidator } from '@schemastud/seam';
import { SplicewireForm, splicewireValidator } from '../src';

const schema: RJSFSchema = { type: 'object', properties: { title: { type: 'string' } } };

beforeEach(() => {
    received.length = 0;
});
afterEach(cleanup);

it('leaves the validator to SchemaForm by default, so its localized default applies', () => {
    render(<SplicewireForm schema={schema} />);
    expect(received).toHaveLength(1);
    expect(received[0].schema).toBe(schema);
    expect(received[0].validator).toBeUndefined();
    expect(received[0].validator).not.toBe(splicewireValidator);
});

it('passes an explicit validator prop through, so it wins over the localized default', () => {
    const explicit = createFormValidator();
    render(<SplicewireForm schema={schema} validator={explicit} />);
    expect(received).toHaveLength(1);
    expect(received[0].validator).toBe(explicit);
});
