import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RefineInstructionDialog } from './RefineInstructionDialog';

/**
 * Domain instruction collection, not a server-backed editor. Token and light/dark axes are
 * supplied by splice's preview decorators. Supported states: empty, filled, pending, rejected.
 * Viewport is shown at desktop and mobile. No collection-density or canvas capability exists.
 */
const meta = {
    title: 'Splice/RefineInstructionDialog',
    component: RefineInstructionDialog,
    parameters: { layout: 'centered' },
    args: {
        open: true,
        instruction: '',
        onOpenChange: () => {},
        onInstructionChange: () => {},
        onConfirm: () => {},
    },
} satisfies Meta<typeof RefineInstructionDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = {
    args: { instruction: 'Keep the examples and shorten the introduction.' },
};
export const Pending: Story = { args: { instruction: 'Keep the examples.', pending: true } };
export const Rejected: Story = {
    args: {
        instruction: 'Keep the examples.',
        error: 'Refinement is unavailable. Your instruction is kept; please try again.',
    },
};
export const Mobile: Story = {
    ...Filled,
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};

export const Retry: Story = {
    render: function RetryStory() {
        const [instruction, setInstruction] = useState('  Keep the examples.  ');
        const [error, setError] = useState<string | null>(null);
        const [attempts, setAttempts] = useState(0);
        const [accepted, setAccepted] = useState('');
        return (
            <>
                <RefineInstructionDialog
                    open={!accepted}
                    instruction={instruction}
                    onInstructionChange={setInstruction}
                    error={error}
                    onOpenChange={() => {}}
                    onConfirm={(payload) => {
                        if (attempts === 0) {
                            setAttempts(1);
                            setError('Please retry.');
                        } else setAccepted(payload.instruction);
                    }}
                />
                {accepted && <p role="status">Accepted: {accepted}</p>}
            </>
        );
    },
    play: async () => {
        const body = within(document.body);
        await userEvent.click(await body.findByRole('button', { name: 'Refine' }));
        await expect(await body.findByRole('alert')).toHaveTextContent('Please retry.');
        await expect(body.getByLabelText('Instruction')).toHaveValue('  Keep the examples.  ');
        await userEvent.click(body.getByRole('button', { name: 'Refine' }));
        await expect(await body.findByRole('status')).toHaveTextContent(
            'Accepted: Keep the examples.',
        );
    },
};
