import type { WidgetRegistry } from '@rushing/rjsf-registry';

/**
 * The Splicewire citation widget — the rjsf successor to the citation renderer that died with the
 * Vue stack (composition-dialect-gaps issue 03). A field marked `x-widget: citation` carries one or
 * more grounding-token citation keys (`fragment:{uuid}`, `fact:soul-7`, …) — the same tokens a
 * generated cell records in `groundingTokens`. Citations are GENERATED, not hand-authored, so this
 * is a read-oriented renderer: it displays each token as an ordered, resolvable citation chip and
 * never mutates the underlying value (it declares no `onChange`).
 *
 * It resolves human labels/links through a host-supplied `formContext.resolveCitation` seam — the
 * platform hands the form a token→descriptor map (e.g. the frozen grounding snapshot), so a raw
 * `fragment:0191…` renders as its Fragment name. Absent a resolver it degrades to the raw token,
 * never blank. Mounted by the rjsf-registry walker as a `ui:widget` (string field) or a `ui:field`
 * (array field), so it accepts both signatures and normalizes internally.
 */

export interface CitationDescriptor {
    /** The human-facing citation label; falls back to the raw token when absent. */
    label?: string;
    /** An optional link to the cited source. */
    href?: string;
    /** Hover title; falls back to the raw token. */
    title?: string;
}

export interface CitationFormContext {
    /** Host seam: map a citation token to its display descriptor. */
    resolveCitation?: (token: string) => CitationDescriptor | undefined;
}

interface CitationWidgetProps {
    /** Widget-signature value (string field). */
    value?: unknown;
    /** Field-signature value (array field). */
    formData?: unknown;
    id?: string;
    registry?: { formContext?: CitationFormContext };
    formContext?: CitationFormContext;
}

/** Normalize a citation field value (a single token or an array of tokens) to a clean token list. */
function toTokens(value: unknown): string[] {
    const raw =
        typeof value === 'string'
            ? [value]
            : Array.isArray(value)
              ? value.filter((token): token is string => typeof token === 'string')
              : [];

    // Trim, drop blanks, and de-duplicate: a cell can legitimately cite the same token twice, but the
    // rendered chip list keys on the token, so duplicates must collapse (no duplicate React keys).
    const seen = new Set<string>();
    const tokens: string[] = [];
    for (const token of raw) {
        const trimmed = token.trim();
        if (trimmed !== '' && ! seen.has(trimmed)) {
            seen.add(trimmed);
            tokens.push(trimmed);
        }
    }

    return tokens;
}

export function CitationWidget(props: CitationWidgetProps) {
    const tokens = toTokens(props.value ?? props.formData);
    const resolve = (props.formContext ?? props.registry?.formContext)?.resolveCitation;

    if (tokens.length === 0) {
        return <span className="sw-citations sw-citations--empty" id={props.id} data-citations="0" />;
    }

    return (
        <ol className="sw-citations" id={props.id} data-citations={tokens.length}>
            {tokens.map((token, index) => {
                const descriptor = resolve?.(token);
                const label = descriptor?.label ?? token;
                const title = descriptor?.title ?? token;

                return (
                    <li key={token} className="sw-citation" data-token={token} title={title}>
                        <span className="sw-citation__index" aria-hidden="true">
                            {index + 1}
                        </span>
                        {descriptor?.href ? (
                            <a className="sw-citation__link" href={descriptor.href}>
                                {label}
                            </a>
                        ) : (
                            <cite className="sw-citation__label">{label}</cite>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

/**
 * Register the citation widget on a registry under the `x-widget: citation` key. The app-side wiring
 * (ADR-0072: registration through the registry door) calls this on its form registry; the widget
 * ships with the Splicewire dialect rather than each app re-implementing it.
 */
export function registerCitationWidget(registry: WidgetRegistry): WidgetRegistry {
    registry.registerWidget('citation', CitationWidget);

    return registry;
}
