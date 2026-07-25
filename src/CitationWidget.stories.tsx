import type { Meta, StoryObj } from '@storybook/react-vite';
import { CitationWidget, type CitationDescriptor } from './CitationWidget';

/**
 * Splice/CitationWidget (component-seams ticket 28's stand-up SMOKE story — repeats the beam
 * stand-up, ticket 23, one tier over: open → free → PAID). The Splicewire citation widget: a
 * read-oriented renderer that displays each grounding-token citation key (`fragment:{uuid}`,
 * `fact:soul-7`, …) as an ordered, resolvable chip, resolving human labels through a
 * host-supplied `resolveCitation` seam (degrades to the raw token when absent).
 *
 * This is JUST the stand-up smoke — enough to prove the splice workbench renders skinned with
 * the seeded `--splice-*` token layer (`.storybook/preview.css`) + the light⊗dark toolbar. The
 * full splice catalog (every component across its treatment axes) is ticket 29, NOT this ticket.
 *
 * HONEST SKINNING NOTE (mirrors beam ticket 23 / Frame ticket 15): `CitationWidget` itself emits
 * hardcoded `sw-citation*` classNames, not semantic Tailwind utilities — so the CHROME here (the
 * card frame + labels wrapping it) is what proves the `--splice-*` seed re-skins under `.dark`
 * (`bg-card`/`text-foreground`/`text-muted-foreground`/`border-border`). The widget's own chip
 * styling is app-owned CSS (out of the headless package), so it reads unstyled in isolation by
 * design — cataloguing its markup + resolver behaviour is ticket 29's job.
 */

/** A citation-resolver fixture — the host seam that maps a raw token to its display descriptor. */
const RESOLVER: Record<string, CitationDescriptor> = {
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

const resolveCitation = (token: string): CitationDescriptor | undefined => RESOLVER[token];

/** A card frame skinned entirely with the SEMANTIC utilities the `--splice-*` seed feeds —
 *  rendering this skinned (and re-skinned under `.dark`) IS the seed proof. */
function Panel({ heading, children }: { heading: string; children: React.ReactNode }) {
    return (
        <div className="w-80 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{heading}</p>
            {children}
        </div>
    );
}

const meta = {
    title: 'Splice/CitationWidget',
    component: CitationWidget,
    parameters: { layout: 'centered' },
} satisfies Meta<typeof CitationWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resolved — tokens carry a host descriptor, so each chip renders its human label + link. */
export const Resolved: Story = {
    render: () => (
        <Panel heading="Grounding citations">
            <CitationWidget
                value={['fragment:0191-onboarding-brief', 'fact:soul-7', 'fragment:0192-tone-guide']}
                formContext={{ resolveCitation }}
            />
        </Panel>
    ),
};

/** Unresolved — no resolver, so the widget degrades to the raw tokens (never blank). */
export const RawTokens: Story = {
    render: () => (
        <Panel heading="Unresolved (no host seam)">
            <CitationWidget value={['fragment:0191-onboarding-brief', 'fact:soul-7']} />
        </Panel>
    ),
};

/** Empty — no tokens; the widget renders an empty, data-attributed placeholder. */
export const Empty: Story = {
    render: () => (
        <Panel heading="No citations">
            <span className="text-sm text-muted-foreground">
                (empty) <CitationWidget value={[]} />
            </span>
        </Panel>
    ),
};
