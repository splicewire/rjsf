import { createKeywordVocabulary } from '@rushing/rjsf-registry';

/**
 * The Splicewire `x-*` vendor-keyword grammar (see the app repo's
 * `.scratch/app-ui-overhaul/schema-grammar-inventory.md` for the full inventory).
 *
 * Form-facing keywords drive rendering; annotation keywords are pass-through
 * the validator must tolerate but the form NEVER renders from.
 */

/** Keywords the form layer actively consumes. */
export const FORM_KEYWORDS = ['x-widget', 'x-placeholder'] as const;

/** Keywords other layers consume; the form treats them as annotations. */
export const ANNOTATION_KEYWORDS = [
    'x-fragment',
    'x-type',
    'x-filter',
    'x-sort',
    'x-lazy',
    'x-optional',
    'x-dereference',
    'x-migrate',
    'x-migrate-from',
] as const;

/**
 * Engine-private generation grammar uses a per-engine configurable prefix
 * (`x-swc-*` for composition, `x-swk-*` for knowledge, …) — match by pattern,
 * never by a hard-coded list.
 */
export const ENGINE_PRIVATE_PATTERN = /^x-sw[a-z]-/;

/**
 * Shell-level binding keys (`x-sw-node`, `x-sw-span`, …): the platform-owned
 * `x-sw-*` prefix extending the base `@id` addressing doctrine.
 */
export const SHELL_BINDING_PATTERN = /^x-sw-/;

/** The Splicewire dialect, declared through the generic vocabulary seam. */
export const splicewireVocabulary = createKeywordVocabulary({
    keywords: ANNOTATION_KEYWORDS,
    patterns: [ENGINE_PRIVATE_PATTERN, SHELL_BINDING_PATTERN],
});

export function isEnginePrivateKeyword(keyword: string): boolean {
    return ENGINE_PRIVATE_PATTERN.test(keyword);
}

export function isSplicewireKeyword(keyword: string): boolean {
    return splicewireVocabulary.isKnownKeyword(keyword);
}
