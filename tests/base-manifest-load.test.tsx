// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { LEGACY_PROSE_RENAME, legacyHeadingTag } from '@schemastud/blockdoc/core';
import type { BlockdocManifest } from '@schemastud/blockdoc/core';
import { BlockdocEditor } from '@schemastud/blockdoc/react';
import type { BlockdocEditorHandle, DocJson } from '@schemastud/blockdoc/react';
import { baseNodeManifest } from '../src/base-manifest';

/**
 * The vendored base manifest is only correct if the editor that consumes it can open the
 * documents hosts have stored. blockdoc renames every pre-EP-07c prose node (paragraph,
 * heading, bullet_list, …) to its JSX tag (p, h2–h6, ul, …) on load, so a base manifest
 * still declaring the old names makes EVERY document invalid: Tiptap drops it and opens an
 * empty editor, and the next keystroke saves that emptiness over the stored content.
 */

const base = baseNodeManifest as unknown as BlockdocManifest;

/** A stored document from before EP-07c: the old names, heading level as an attr. */
const oldNameDoc: DocJson = {
    type: 'doc',
    content: [
        { type: 'heading', attrs: { id: 'n-h', level: 2 }, content: [{ type: 'text', text: 'Release notes' }] },
        {
            type: 'paragraph',
            attrs: { id: 'n-p' },
            content: [
                { type: 'text', text: 'Ships with ' },
                { type: 'text', marks: [{ type: 'strong' }], text: 'two' },
                { type: 'text', text: ' fixes.' },
                { type: 'hard_break', attrs: { id: 'n-br' } },
                { type: 'text', text: 'Read on.' },
            ],
        },
        {
            type: 'bullet_list',
            attrs: { id: 'n-ul' },
            content: [
                {
                    type: 'list_item',
                    attrs: { id: 'n-li1' },
                    content: [{ type: 'paragraph', attrs: { id: 'n-p1' }, content: [{ type: 'text', text: 'First item' }] }],
                },
                {
                    type: 'list_item',
                    attrs: { id: 'n-li2' },
                    content: [{ type: 'paragraph', attrs: { id: 'n-p2' }, content: [{ type: 'text', text: 'Second item' }] }],
                },
            ],
        },
        {
            type: 'ordered_list',
            attrs: { id: 'n-ol' },
            content: [
                {
                    type: 'list_item',
                    attrs: { id: 'n-li3' },
                    content: [{ type: 'paragraph', attrs: { id: 'n-p3' }, content: [{ type: 'text', text: 'Step one' }] }],
                },
            ],
        },
        {
            type: 'blockquote',
            attrs: { id: 'n-q' },
            content: [{ type: 'paragraph', attrs: { id: 'n-p4' }, content: [{ type: 'text', text: 'Quoted.' }] }],
        },
        { type: 'code_block', attrs: { id: 'n-code' }, content: [{ type: 'text', text: 'npm run build' }] },
        { type: 'horizontal_rule', attrs: { id: 'n-hr' } },
        { type: 'heading', attrs: { id: 'n-h4', level: 4 }, content: [{ type: 'text', text: 'Details' }] },
    ],
};

/** The same document as saved after EP-07c: JSX-tag names, heading level in the tag. */
const newNameDoc: DocJson = {
    type: 'doc',
    content: [
        { type: 'h2', attrs: { id: 'n-h' }, content: [{ type: 'text', text: 'Release notes' }] },
        {
            type: 'p',
            attrs: { id: 'n-p' },
            content: [
                { type: 'text', text: 'Ships with ' },
                { type: 'text', marks: [{ type: 'strong' }], text: 'two' },
                { type: 'text', text: ' fixes.' },
                { type: 'br', attrs: { id: 'n-br' } },
                { type: 'text', text: 'Read on.' },
            ],
        },
        {
            type: 'ul',
            attrs: { id: 'n-ul' },
            content: [
                {
                    type: 'li',
                    attrs: { id: 'n-li1' },
                    content: [{ type: 'p', attrs: { id: 'n-p1' }, content: [{ type: 'text', text: 'First item' }] }],
                },
                {
                    type: 'li',
                    attrs: { id: 'n-li2' },
                    content: [{ type: 'p', attrs: { id: 'n-p2' }, content: [{ type: 'text', text: 'Second item' }] }],
                },
            ],
        },
        {
            type: 'ol',
            attrs: { id: 'n-ol' },
            content: [
                {
                    type: 'li',
                    attrs: { id: 'n-li3' },
                    content: [{ type: 'p', attrs: { id: 'n-p3' }, content: [{ type: 'text', text: 'Step one' }] }],
                },
            ],
        },
        {
            type: 'blockquote',
            attrs: { id: 'n-q' },
            content: [{ type: 'p', attrs: { id: 'n-p4' }, content: [{ type: 'text', text: 'Quoted.' }] }],
        },
        { type: 'pre', attrs: { id: 'n-code' }, content: [{ type: 'text', text: 'npm run build' }] },
        { type: 'hr', attrs: { id: 'n-hr' } },
        { type: 'h4', attrs: { id: 'n-h4' }, content: [{ type: 'text', text: 'Details' }] },
    ],
};

const storedText = 'Release notesShips with two fixes.Read on.First itemSecond itemStep oneQuoted.npm run buildDetails';

/** prosemirror-view needs layout APIs jsdom does not implement; Tiptap's bubble menu needs ResizeObserver. */
beforeAll(() => {
    const rect = { x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, toJSON: () => ({}) };
    const noRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator] }) as unknown as DOMRectList;

    Range.prototype.getBoundingClientRect = () => rect as DOMRect;
    Range.prototype.getClientRects = noRects;
    Element.prototype.getClientRects = noRects;
    document.elementFromPoint ??= () => null;
    globalThis.ResizeObserver ??= class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    };
});

afterEach(() => {
    cleanup();
});

function openInEditor(value: DocJson): BlockdocEditorHandle {
    const ref = createRef<BlockdocEditorHandle>();

    render(<BlockdocEditor ref={ref} manifests={[base]} value={value} palette={false} />);

    return ref.current!;
}

describe('a stored document opened through the vendored base manifest', () => {
    it('loads a pre-EP-07c document (old names) in full, under the current names', () => {
        const editor = openInEditor(oldNameDoc).editor!;

        expect(editor.state.doc.textContent).toBe(storedText);
        expect(editor.getJSON()).toEqual(newNameDoc);
    });

    it('loads a post-EP-07c document (current names) in full, unchanged', () => {
        const editor = openInEditor(newNameDoc).editor!;

        expect(editor.state.doc.textContent).toBe(storedText);
        expect(editor.getJSON()).toEqual(newNameDoc);
    });

    it('renders the loaded document, not an empty editor', () => {
        const view = openInEditor(oldNameDoc).view!;

        expect(view.dom.querySelector('h2')?.textContent).toBe('Release notes');
        expect([...view.dom.querySelectorAll('ul > li')].map((item) => item.textContent)).toEqual([
            'First item',
            'Second item',
        ]);
    });
});

describe('the vendored base manifest against blockdoc read-compat', () => {
    const declared = new Set(base.nodes.map((node) => node.name));

    it('declares every node name blockdoc renames a stored document into', () => {
        const targets = [...Object.values(LEGACY_PROSE_RENAME), ...[2, 3, 4, 5, 6].map(legacyHeadingTag)];

        expect(targets.filter((name) => !declared.has(name))).toEqual([]);
    });

    it('declares none of the pre-EP-07c names blockdoc renames away', () => {
        const retired = [...Object.keys(LEGACY_PROSE_RENAME), 'heading'];

        expect(retired.filter((name) => declared.has(name))).toEqual([]);
    });
});
