import { describe, expect, it } from 'vitest';
import { baseNodeManifest } from '../src/base-manifest';

type Entry = { name: string; excludes?: string; attrsSchema?: { properties?: Record<string, unknown> } };

describe('vendored base node manifest', () => {
    const manifest = baseNodeManifest as {
        profile: string;
        version: number;
        nodes: Entry[];
        marks: Entry[];
    };

    it('is the base profile in manifest format v1', () => {
        expect(manifest.profile).toBe('base');
        expect(manifest.version).toBe(1);
        expect(manifest.nodes.length).toBeGreaterThan(0);
    });

    it('declares unique node and mark names', () => {
        const names = [...manifest.nodes, ...manifest.marks].map((entry) => entry.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it('carries the annotation mark with an id attr and overlap-permitting excludes', () => {
        const annotation = manifest.marks.find((mark) => mark.name === 'annotation');
        expect(annotation).toBeDefined();
        expect(annotation?.excludes).toBe('');
        expect(annotation?.attrsSchema?.properties).toHaveProperty('id');
    });

    it('every node carries an id attr in its attrsSchema', () => {
        for (const node of manifest.nodes) {
            expect(node.attrsSchema?.properties, `${node.name} attrsSchema`).toHaveProperty('id');
        }
    });
});
