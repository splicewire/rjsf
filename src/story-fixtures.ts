/* eslint-disable */
// =============================================================================
// story-fixtures — the shared fixture schemas for the @splicewire/splice catalog
// (component-seams map, ticket 29). NOT part of the shipped package: tsup builds
// only the `index.ts` graph, so this file (imported solely by *.stories.tsx) never
// enters `dist`. Mirrors seam's `story-fixtures.ts` (ticket 17), one tier over:
// splice's headline surface is `SplicewireForm` — the base `SchemaForm` pre-wired
// with the Splicewire validator (tolerant of the full `x-*` grammar) and the
// Splicewire dialect's own composed widgets (the `x-widget: citation` chip).
//
// Per the rushing-prototype convention a form is the REAL `SplicewireForm` off a
// fixture schema; these are those schemas. They exercise representative field kinds
// (string / email / number / boolean / enum / date / string-array) and validation
// constraints (required / minLength / format / minimum) so a story can drive the
// composed form's error/validation `states` axis — plus the splice-specific
// `x-widget: citation` grounding-citation field that distinguishes the paid form
// from the plain seam.
// =============================================================================
import {
    createWidgetRegistry,
    type SchemaNode,
    type WidgetRegistry,
} from '@schemastud/seam';
import { registerCitationWidget } from './CitationWidget';

/**
 * The representative field-kind schema — one property per RJSF field kind the
 * composed form renders, so the catalog shows the full widget vocabulary in one
 * form (identical field-kind coverage to the seam fixture; the difference is the
 * form driving it is the pre-wired `SplicewireForm`, not the bare `SchemaForm`).
 */
export const FIELD_KINDS_SCHEMA: SchemaNode = {
    type: 'object',
    title: 'Brief',
    description: 'A representative schema exercising the composed form’s field-kind vocabulary.',
    required: ['name', 'email'],
    properties: {
        name: { type: 'string', title: 'Name', minLength: 2 },
        email: { type: 'string', title: 'Email', format: 'email' },
        summary: { type: 'string', title: 'Summary', description: 'A short description.' },
        wordCount: { type: 'number', title: 'Word count', minimum: 0, maximum: 5000 },
        published: { type: 'boolean', title: 'Published' },
        tone: { type: 'string', title: 'Tone', enum: ['formal', 'neutral', 'playful'] },
        dueAt: { type: 'string', title: 'Due at', format: 'date' },
        tags: {
            type: 'array',
            title: 'Tags',
            items: { type: 'string' },
        },
    },
} as SchemaNode;

/** A minimal valid value for {@link FIELD_KINDS_SCHEMA} (the "populated" state). */
export const FIELD_KINDS_VALUE = {
    name: 'Launch announcement',
    email: 'editor@splicewire.test',
    summary: 'A three-paragraph launch note in the brand voice.',
    wordCount: 420,
    published: true,
    tone: 'playful',
    dueAt: '2026-08-01',
    tags: ['launch', 'announcement'],
};

/**
 * The composed-tier schema whose `x-widget: citation` field carries grounding-token
 * citation keys — the widget the Splicewire dialect ships that the plain seam does
 * not. A `SplicewireForm` story renders this to catalog the citation chip resolving
 * THROUGH the real form (via the registry + `resolveCitation` formContext), not just
 * the widget in isolation (that isolation catalog is `CitationWidget.stories.tsx`).
 */
export const CITATION_SCHEMA: SchemaNode = {
    type: 'object',
    title: 'Generated cell',
    description: 'A generated cell whose grounding citations render as resolvable chips.',
    properties: {
        body: { type: 'string', title: 'Body' },
        groundingTokens: {
            type: 'array',
            title: 'Grounding citations',
            items: { type: 'string' },
            'x-widget': 'citation',
        } as SchemaNode,
    },
} as SchemaNode;

/** The citation schema's populated value — the same token vocabulary the resolver keys on. */
export const CITATION_VALUE = {
    body: 'A launch note grounded in the onboarding brief and brand soul.',
    groundingTokens: ['fragment:0191-onboarding-brief', 'fact:soul-7', 'fragment:0192-tone-guide'],
};

/**
 * The citation-resolver fixture — the host seam that maps a raw grounding token to its
 * display descriptor. Passed to a `SplicewireForm` story as `formContext.resolveCitation`
 * so the citation chips render human labels/links (degrading to the raw token when a
 * token is absent from the map). Shape matches `CitationWidget.stories.tsx`'s RESOLVER.
 */
export const CITATION_RESOLVER: Record<string, { label?: string; title?: string; href?: string }> = {
    'fragment:0191-onboarding-brief': {
        label: 'Onboarding brief',
        title: 'fragment:0191-onboarding-brief',
        href: '#/fragments/0191',
    },
    'fact:soul-7': { label: 'Brand soul #7', title: 'fact:soul-7' },
    'fragment:0192-tone-guide': {
        label: 'Tone guide',
        title: 'fragment:0192-tone-guide',
        href: '#/fragments/0192',
    },
};

export const resolveCitation = (token: string) => CITATION_RESOLVER[token];

/**
 * A registry with the Splicewire citation widget registered under `x-widget: citation`
 * — the app-side wiring (ADR-0072: registration through the registry door) that mounts
 * the composed widget on a form. A `SplicewireForm` story passes this via the `registry`
 * prop so `buildUiSchema` maps the `citation`-marked field onto `CitationWidget`. Built
 * over the default predicate registry so the seam's own widgets stay resolvable too.
 */
export function makeSplicewireRegistry(): WidgetRegistry {
    // createWidgetRegistry() already carries the seam's default predicate widgets
    // (button-group / star-rating); layer the Splicewire dialect's citation widget on top.
    const registry = createWidgetRegistry();
    registerCitationWidget(registry);

    return registry;
}
