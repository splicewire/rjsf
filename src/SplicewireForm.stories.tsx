import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { SplicewireForm } from './SplicewireForm';
import { FIELD_KINDS_SCHEMA, FIELD_KINDS_VALUE } from './story-fixtures';

/**
 * Splice/SplicewireForm (component-seams ticket 29). The headline surface of the PAID
 * composed tier: the base seam `SchemaForm` pre-wired with the Splicewire validator
 * (tolerant of the full `x-*` grammar). It is the composed-tier counterpart to
 * `Seam/SchemaForm`: satellites and the platform SPA consume THIS form;
 * hosts with no Splicewire vocabulary use the plain seam directly.
 *
 * It renders standalone off a fixture JSON schema — the exact shape the rushing-prototype
 * convention graduates to Frame `EditShell` (a form is the real `SplicewireForm` off a
 * fixture schema), mirroring ticket 17's seam story.
 *
 * TREATMENT axes (treatment-axes.md): the **states** axis dominates — validation errors
 * are the natural states here (Populated / Empty / Invalid-on-submit / Disabled). The
 * splice-specific delta from the seam is the validator, not a widget: the former
 * `CitationField` story (the `x-widget: citation` chip resolving through the form) went
 * with `CitationWidget` in composition-dialect-gaps 13 — no host schema declared the
 * keyword and no host registry mounted it. Per the rule of sanction,
 * `variant`/`size`/`tone`/`density`/`viewport`
 * are not exposed by this form ⇒ absent-not-a-gap. Ambient token + light⊗dark are wired
 * globally (splice `.storybook`, `--splice-*` seed + `colorScheme` toolbar); interactive
 * stories `play`-await settled content so a VR baseline captures the resolved form, never
 * a transient.
 *
 * HONEST SKINNING NOTE (mirrors seam ticket 17 / beam ticket 23): the RJSF (shadcn theme)
 * form chrome re-skins under `.dark` via the semantic `--splice-*` seed — that is the real
 * light⊗dark coverage.
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
