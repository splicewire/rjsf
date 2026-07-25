import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { SplicewireForm } from './SplicewireForm';
import {
    CITATION_SCHEMA,
    CITATION_VALUE,
    FIELD_KINDS_SCHEMA,
    FIELD_KINDS_VALUE,
    makeSplicewireRegistry,
    resolveCitation,
} from './story-fixtures';

/**
 * Splice/SplicewireForm (component-seams ticket 29). The headline surface of the PAID
 * composed tier: the base seam `SchemaForm` pre-wired with the Splicewire validator
 * (tolerant of the full `x-*` grammar) and the Splicewire dialect's own composed
 * widgets — the `x-widget: citation` grounding-citation chip. It is the composed-tier
 * counterpart to `Seam/SchemaForm`: satellites and the platform SPA consume THIS form;
 * hosts with no Splicewire vocabulary use the plain seam directly.
 *
 * It renders standalone off a fixture JSON schema — the exact shape the rushing-prototype
 * convention graduates to Frame `EditShell` (a form is the real `SplicewireForm` off a
 * fixture schema), mirroring ticket 17's seam story.
 *
 * TREATMENT axes (treatment-axes.md): the **states** axis dominates — validation errors
 * are the natural states here (Populated / Empty / Invalid-on-submit / Disabled). The
 * splice-specific delta from the seam is the composed **citation widget resolving through
 * the form** (the `CitationField` story) — the one thing the paid form does that the plain
 * seam does not. Per the rule of sanction, `variant`/`size`/`tone`/`density`/`viewport`
 * are not exposed by this form ⇒ absent-not-a-gap. Ambient token + light⊗dark are wired
 * globally (splice `.storybook`, `--splice-*` seed + `colorScheme` toolbar); interactive
 * stories `play`-await settled content so a VR baseline captures the resolved form, never
 * a transient.
 *
 * HONEST SKINNING NOTE (mirrors seam ticket 17 / beam ticket 23): the RJSF (shadcn theme)
 * form chrome re-skins under `.dark` via the semantic `--splice-*` seed — that is the real
 * light⊗dark coverage. The citation chips themselves emit hardcoded `sw-citation*`
 * classNames (app-owned CSS, out of the headless package), so their chip styling reads
 * unstyled in isolation by design; re-treating those to tokens is ticket 32 debt.
 */
const meta = {
    title: 'Splice/SplicewireForm',
    parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const awaitField =
    (label: string): Story['play'] =>
    async ({ canvasElement }) => {
        await within(canvasElement).findByText(label);
    };

/**
 * states = populated — the representative field-kind vocabulary (string / email / summary
 * / number / boolean / enum / date / string-array) rendered in one form off the pre-wired
 * Splicewire validator, seeded with a valid value.
 */
export const FieldKinds: Story = {
    render: () => (
        <div style={{ maxWidth: 520 }}>
            <SplicewireForm schema={FIELD_KINDS_SCHEMA} formData={FIELD_KINDS_VALUE} />
        </div>
    ),
    play: awaitField('Name'),
};

/** states = empty — the same schema with no formData: every field renders in its blank state. */
export const Empty: Story = {
    render: () => (
        <div style={{ maxWidth: 520 }}>
            <SplicewireForm schema={FIELD_KINDS_SCHEMA} />
        </div>
    ),
    play: awaitField('Name'),
};

/**
 * states = error — submit a near-empty form so the Splicewire (AJV) validator surfaces the
 * `required` (name / email) and `minLength(name)` violations inline. `play` clicks Submit
 * and awaits the first error so the VR baseline captures the settled error state, not the
 * pristine form.
 */
export const ValidationErrors: Story = {
    render: () => (
        <div style={{ maxWidth: 520 }}>
            <SplicewireForm schema={FIELD_KINDS_SCHEMA} formData={{ name: 'A' }}>
                <button type="submit" data-testid="submit">
                    Submit
                </button>
            </SplicewireForm>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await canvas.findByText('Name');
        await userEvent.click(await canvas.findByTestId('submit'));
        await canvas.findByText(/must NOT have fewer than|is a required property|required/i);
    },
};

/**
 * states = disabled — the whole form read-only. RJSF disables every control; the composed
 * form honours `disabled` exactly as the base seam does.
 */
export const Disabled: Story = {
    render: () => (
        <div style={{ maxWidth: 520 }}>
            <SplicewireForm schema={FIELD_KINDS_SCHEMA} formData={FIELD_KINDS_VALUE} disabled />
        </div>
    ),
    play: awaitField('Name'),
};

/**
 * The splice-specific composed widget — the `x-widget: citation` field resolving THROUGH
 * the real form. A Splicewire registry (default seam widgets + citation) is passed via the
 * `registry` prop so `buildUiSchema` mounts `CitationWidget` on the `groundingTokens` field,
 * and `formContext.resolveCitation` renders the grounding tokens as human-labelled,
 * linkable citation chips. This is the one story that distinguishes the paid form from the
 * plain seam's `SchemaForm`; the widget's own isolation catalog is `Splice/CitationWidget`.
 */
export const CitationField: Story = {
    render: () => (
        <div style={{ maxWidth: 520 }}>
            <SplicewireForm
                schema={CITATION_SCHEMA}
                formData={CITATION_VALUE}
                registry={makeSplicewireRegistry()}
                formContext={{ resolveCitation }}
            />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Await a resolved citation label so the VR baseline captures the resolved chips.
        await canvas.findByText('Onboarding brief');
    },
};
