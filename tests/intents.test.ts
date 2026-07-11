import { describe, expect, it, vi } from 'vitest';
import type { FormIntent } from '@schemastud/rjsf-registry';
import { createFormIntentBus } from '@schemastud/rjsf-registry';
import { SW_ENRICH, SW_REVISE, createSplicewireIntentRouter } from '../src';

describe('createSplicewireIntentRouter', () => {
    it('routes sw:revise to onRevise with the full intent', async () => {
        const onRevise = vi.fn();
        const router = createSplicewireIntentRouter({ onRevise });

        const intent: FormIntent = {
            type: SW_REVISE,
            fieldPath: 'bodyDoc',
            target: { nodeId: 'node-1' },
            payload: { instruction: 'Tighten the lede.' },
        };

        await router(intent);

        expect(onRevise).toHaveBeenCalledTimes(1);
        expect(onRevise).toHaveBeenCalledWith(intent);
    });

    it('routes sw:enrich to onEnrich when a handler is provided', async () => {
        const onRevise = vi.fn();
        const onEnrich = vi.fn();
        const router = createSplicewireIntentRouter({ onRevise, onEnrich });

        const intent: FormIntent = { type: SW_ENRICH, fieldPath: 'bodyDoc' };
        await router(intent);

        expect(onEnrich).toHaveBeenCalledTimes(1);
        expect(onEnrich).toHaveBeenCalledWith(intent);
        expect(onRevise).not.toHaveBeenCalled();
    });

    it('treats sw:enrich as a silent no-op when no handler is provided (reserved)', async () => {
        const onRevise = vi.fn();
        const router = createSplicewireIntentRouter({ onRevise });

        await expect(
            Promise.resolve(router({ type: SW_ENRICH, fieldPath: 'bodyDoc' })),
        ).resolves.toBeUndefined();
        expect(onRevise).not.toHaveBeenCalled();
    });

    it('ignores non-sw intent types so other vocabularies share the bus', async () => {
        const onRevise = vi.fn();
        const onEnrich = vi.fn();
        const router = createSplicewireIntentRouter({ onRevise, onEnrich });

        await router({ type: 'other:thing', fieldPath: 'title' });

        expect(onRevise).not.toHaveBeenCalled();
        expect(onEnrich).not.toHaveBeenCalled();
    });

    it('awaits an async onRevise handler through the bus dispatch', async () => {
        const bus = createFormIntentBus();
        const order: string[] = [];

        bus.registerFlush(() => order.push('flush'));
        bus.onIntent(
            createSplicewireIntentRouter({
                onRevise: async () => {
                    await Promise.resolve();
                    order.push('revise');
                },
            }),
        );

        await bus.dispatch({ type: SW_REVISE, fieldPath: 'bodyDoc' });

        expect(order).toEqual(['flush', 'revise']);
    });
});
