import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createWidgetRegistry } from '@rushing/rjsf-registry';
import { CitationWidget, registerCitationWidget } from '../src';

describe('CitationWidget', () => {
    it('renders a single citation token (widget signature) as one resolvable chip', () => {
        const { container } = render(<CitationWidget value="fragment:0191-abc" />);

        const list = container.querySelector('.sw-citations');
        expect(list?.getAttribute('data-citations')).toBe('1');

        const chip = container.querySelector('.sw-citation');
        expect(chip?.getAttribute('data-token')).toBe('fragment:0191-abc');
        // No resolver → the raw token is the label, never blank.
        expect(chip?.querySelector('.sw-citation__label')?.textContent).toBe('fragment:0191-abc');
    });

    it('renders an array of tokens (field signature) as an ordered citation list', () => {
        const { container } = render(
            <CitationWidget formData={['fact:soul-7', 'fact:path-3']} />,
        );

        const chips = container.querySelectorAll('.sw-citation');
        expect(chips).toHaveLength(2);
        expect(chips[0].querySelector('.sw-citation__index')?.textContent).toBe('1');
        expect(chips[1].getAttribute('data-token')).toBe('fact:path-3');
    });

    it('resolves human labels and links through formContext.resolveCitation', () => {
        const { container } = render(
            <CitationWidget
                value="fragment:0191-abc"
                formContext={{
                    resolveCitation: (token) =>
                        token === 'fragment:0191-abc'
                            ? { label: 'Cold Holding', href: '/fragments/0191-abc', title: 'Food Code' }
                            : undefined,
                }}
            />,
        );

        const link = container.querySelector('.sw-citation__link');
        expect(link?.textContent).toBe('Cold Holding');
        expect(link?.getAttribute('href')).toBe('/fragments/0191-abc');
        expect(container.querySelector('.sw-citation')?.getAttribute('title')).toBe('Food Code');
    });

    it('also reads the resolver from registry.formContext (RJSF field mount)', () => {
        const { container } = render(
            <CitationWidget
                formData={['fact:soul-7']}
                registry={{ formContext: { resolveCitation: () => ({ label: 'The Seeker' }) } }}
            />,
        );

        expect(container.querySelector('.sw-citation__label')?.textContent).toBe('The Seeker');
    });

    it('renders an empty, non-crashing placeholder for no/blank citations', () => {
        const { container } = render(<CitationWidget value="   " />);

        const empty = container.querySelector('.sw-citations--empty');
        expect(empty).not.toBeNull();
        expect(empty?.getAttribute('data-citations')).toBe('0');
        expect(container.querySelectorAll('.sw-citation')).toHaveLength(0);
    });

    it('ignores non-string array entries (defensive against dirty data)', () => {
        const { container } = render(
            <CitationWidget formData={['fact:soul-7', null, 42, '', 'fact:path-3'] as unknown[]} />,
        );

        expect(container.querySelectorAll('.sw-citation')).toHaveLength(2);
    });

    it('de-duplicates a token cited more than once (no duplicate React keys)', () => {
        const { container } = render(
            <CitationWidget formData={['fact:soul-7', 'fact:soul-7', 'fact:path-3']} />,
        );

        const chips = container.querySelectorAll('.sw-citation');
        expect(chips).toHaveLength(2);
        expect(container.querySelector('.sw-citations')?.getAttribute('data-citations')).toBe('2');
    });

    it('trims surrounding whitespace from tokens', () => {
        const { container } = render(<CitationWidget value="  fragment:0191-abc  " />);

        expect(container.querySelector('.sw-citation')?.getAttribute('data-token')).toBe('fragment:0191-abc');
    });
});

describe('registerCitationWidget', () => {
    it('registers the component under the x-widget: citation key', () => {
        const registry = createWidgetRegistry();
        registerCitationWidget(registry);

        expect(registry.resolveWidget({ type: 'string', 'x-widget': 'citation' })).toBe(CitationWidget);
    });

    it('does not pollute a sibling registry (isolation)', () => {
        const registry = createWidgetRegistry();
        registerCitationWidget(registry);

        const fresh = createWidgetRegistry();
        expect(fresh.resolveWidget({ 'x-widget': 'citation' })).toBeUndefined();
    });
});
