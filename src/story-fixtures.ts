/* eslint-disable */
// =============================================================================
// story-fixtures — the shared fixture schemas for the @splicewire/splice catalog
// (component-seams map, ticket 29). NOT part of the shipped package: tsup builds
// only the `index.ts` graph, so this file (imported solely by *.stories.tsx) never
// enters `dist`. Mirrors seam's `story-fixtures.ts` (ticket 17), one tier over:
// splice's headline surface is `SplicewireForm` — the base `SchemaForm` pre-wired
// with the Splicewire validator (tolerant of the full `x-*` grammar).
//
// Per the rushing-prototype convention a form is the REAL `SplicewireForm` off a
// fixture schema; these are those schemas. They exercise representative field kinds
// (string / email / number / boolean / enum / date / string-array) and validation
// constraints (required / minLength / format / minimum) so a story can drive the
// composed form's error/validation `states` axis.
//
// The `x-widget: citation` fixture that used to live here went with `CitationWidget`
// (composition-dialect-gaps 13): no host schema declared the keyword and no host
// registry mounted the widget, so the paid form's catalog delta was a story with no
// production counterpart.
// =============================================================================
import type { SchemaNode } from '@schemastud/seam';

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
