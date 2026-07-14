import type { FormIntent, FormIntentHandler } from '@schemastud/seam';

/**
 * The Splicewire intent vocabulary over the generic FormIntentBus. The bus
 * (seam) stays vocabulary-free; this module owns the `sw:*` names
 * and the router that fans a bus subscription out to typed handlers. Non-sw
 * intents pass through untouched — other vocabularies can share the bus.
 */

/** Revise the targeted content (optionally scoped to one block node). */
export const SW_REVISE = 'sw:revise';

/** Reserved: enrich the targeted content (grounding, links, media). */
export const SW_ENRICH = 'sw:enrich';

/** The `target` shape for sw:* intents — a block-document node id, when scoped. */
export interface SwReviseTarget {
    nodeId?: string;
}

/** The `payload` shape for sw:revise — the human instruction, when given. */
export interface SwRevisePayload {
    instruction?: string;
}

export interface SplicewireIntentHandlers {
    onRevise: (intent: FormIntent) => void | Promise<void>;
    /** Reserved vocabulary — routed when provided, a silent no-op otherwise. */
    onEnrich?: (intent: FormIntent) => void | Promise<void>;
}

/**
 * Build the host-side FormIntentHandler for the Splicewire vocabulary:
 * subscribe the result via `bus.onIntent(router)`. Dispatches by intent type;
 * unknown (non-sw) types are ignored so the router composes with other
 * vocabularies on the same bus.
 */
export function createSplicewireIntentRouter(handlers: SplicewireIntentHandlers): FormIntentHandler {
    return (intent: FormIntent) => {
        switch (intent.type) {
            case SW_REVISE:
                return handlers.onRevise(intent);
            case SW_ENRICH:
                return handlers.onEnrich?.(intent);
            default:
                return undefined;
        }
    };
}
