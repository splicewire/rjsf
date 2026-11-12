import * as _schemastud_seam from '@schemastud/seam';
import { SchemaFormProps, FormIntent, FormIntentHandler } from '@schemastud/seam';
export { FormIntent, FormIntentBus, FormIntentHandler, RegistryEntry, SchemaFetcher, SchemaNode, WidgetRegistry, WidgetRegistryContext, WidgetResolution, buildUiSchema, createFormIntentBus, createWidgetRegistry, defaultRegistry, mergeUiSchema, normalizeNullableRefs, registerWidget, resolveExternalRefs, resolveWidget } from '@schemastud/seam';
import * as react from 'react';
import { ValidatorType } from '@rjsf/utils';

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
declare const baseNodeManifest: Record<string, unknown>;

/**
 * The Splicewire `x-*` vendor-keyword grammar (see the app repo's
 * `.scratch/app-ui-overhaul/schema-grammar-inventory.md` for the full inventory).
 *
 * Form-facing keywords drive rendering; annotation keywords are pass-through
 * the validator must tolerate but the form NEVER renders from.
 */
/** Keywords the form layer actively consumes. */
declare const FORM_KEYWORDS: readonly ["x-widget", "x-placeholder"];
/** Keywords other layers consume; the form treats them as annotations. */
declare const ANNOTATION_KEYWORDS: readonly ["x-fragment", "x-type", "x-filter", "x-sort", "x-lazy", "x-optional", "x-dereference", "x-migrate", "x-migrate-from"];
/**
 * Engine-private generation grammar uses a per-engine configurable prefix
 * (`x-swc-*` for composition, `x-swk-*` for knowledge, …) — match by pattern,
 * never by a hard-coded list.
 */
declare const ENGINE_PRIVATE_PATTERN: RegExp;
/**
 * Shell-level binding keys (`x-sw-node`, `x-sw-span`, …): the platform-owned
 * `x-sw-*` prefix extending the base `@id` addressing doctrine.
 */
declare const SHELL_BINDING_PATTERN: RegExp;
/** The Splicewire dialect, declared through the generic vocabulary seam. */
declare const splicewireVocabulary: _schemastud_seam.KeywordVocabulary;
declare function isEnginePrivateKeyword(keyword: string): boolean;
declare function isSplicewireKeyword(keyword: string): boolean;

/**
 * The Splicewire schema-form: the base SchemaForm pre-wired with the
 * Splicewire validator (tolerant of the full x-* grammar). Satellites and the
 * platform SPA consume this; hosts with no Splicewire vocabulary use
 * seam's SchemaForm directly.
 */
declare function createSplicewireValidator(): ValidatorType;
declare const splicewireValidator: ValidatorType;
interface SplicewireFormProps extends SchemaFormProps {
}
declare function SplicewireForm({ validator, ...rest }: SplicewireFormProps): react.JSX.Element;

/**
 * The Splicewire intent vocabulary over the generic FormIntentBus. The bus
 * (seam) stays vocabulary-free; this module owns the `sw:*` names
 * and the router that fans a bus subscription out to typed handlers. Non-sw
 * intents pass through untouched — other vocabularies can share the bus.
 */
/** Revise the targeted content (optionally scoped to one block node). */
declare const SW_REVISE = "sw:revise";
/** Reserved: enrich the targeted content (grounding, links, media). */
declare const SW_ENRICH = "sw:enrich";
/** The `target` shape for sw:* intents — a block-document node id, when scoped. */
interface SwReviseTarget {
    nodeId?: string;
}
/** The `payload` shape for sw:revise — the human instruction, when given. */
interface SwRevisePayload {
    instruction?: string;
}
interface SplicewireIntentHandlers {
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
declare function createSplicewireIntentRouter(handlers: SplicewireIntentHandlers): FormIntentHandler;

interface RefineInstructionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Controlled by the host so a failed request never discards the author's instruction. */
    instruction: string;
    onInstructionChange: (instruction: string) => void;
    onConfirm: (payload: Required<SwRevisePayload>) => void;
    pending?: boolean;
    error?: string | null;
    title?: string;
    description?: string;
}
/** Collect the existing sw:revise instruction; transport and target selection remain with the host. */
declare function RefineInstructionDialog({ open, onOpenChange, instruction, onInstructionChange, onConfirm, pending, error, title, description, }: RefineInstructionDialogProps): react.JSX.Element;

export { ANNOTATION_KEYWORDS, ENGINE_PRIVATE_PATTERN, FORM_KEYWORDS, RefineInstructionDialog, type RefineInstructionDialogProps, SHELL_BINDING_PATTERN, SW_ENRICH, SW_REVISE, SplicewireForm, type SplicewireFormProps, type SplicewireIntentHandlers, type SwRevisePayload, type SwReviseTarget, baseNodeManifest, createSplicewireIntentRouter, createSplicewireValidator, isEnginePrivateKeyword, isSplicewireKeyword, splicewireValidator, splicewireVocabulary };
