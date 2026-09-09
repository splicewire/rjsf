import { useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RefineInstructionDialog } from './RefineInstructionDialog';
afterEach(cleanup);

describe('refinement instruction collection', () => {
    it('blocks blank instructions and emits the trimmed existing revise payload', () => {
        const confirm = vi.fn();
        function Harness() {
            const [value, setValue] = useState('');
            return (
                <RefineInstructionDialog
                    open
                    instruction={value}
                    onInstructionChange={setValue}
                    onOpenChange={() => {}}
                    onConfirm={confirm}
                />
            );
        }
        render(<Harness />);
        const submit = within(screen.getByRole('dialog')).getByRole<HTMLButtonElement>('button', {
            name: 'Refine',
        });
        expect(submit.disabled).toBe(true);
        fireEvent.change(screen.getByLabelText('Instruction'), {
            target: { value: '  Keep the examples.  ' },
        });
        fireEvent.click(submit);
        expect(confirm).toHaveBeenCalledWith({ instruction: 'Keep the examples.' });
    });
    it('retains the controlled draft after a rejected submission and allows retry', () => {
        const confirm = vi.fn();
        function Harness() {
            const [value, setValue] = useState('Kept instruction');
            const [error, setError] = useState<string | null>(null);
            return (
                <RefineInstructionDialog
                    open
                    instruction={value}
                    onInstructionChange={setValue}
                    onOpenChange={() => {}}
                    error={error}
                    onConfirm={(payload) => {
                        confirm(payload);
                        setError('Server unavailable');
                    }}
                />
            );
        }
        render(<Harness />);
        fireEvent.click(screen.getByRole('button', { name: 'Refine' }));
        expect(screen.getByRole('alert').textContent).toBe('Server unavailable');
        expect((screen.getByLabelText('Instruction') as HTMLTextAreaElement).value).toBe(
            'Kept instruction',
        );
        fireEvent.click(screen.getByRole('button', { name: 'Refine' }));
        expect(confirm).toHaveBeenCalledTimes(2);
    });
    it('disables editing and confirmation while pending', () => {
        const confirm = vi.fn();
        render(
            <RefineInstructionDialog
                open
                pending
                instruction="Kept instruction"
                onInstructionChange={() => {}}
                onOpenChange={() => {}}
                onConfirm={confirm}
            />,
        );
        expect((screen.getByLabelText('Instruction') as HTMLTextAreaElement).disabled).toBe(true);
        const button = screen.getByRole<HTMLButtonElement>('button', { name: 'Refining…' });
        expect(button.disabled).toBe(true);
        fireEvent.click(button);
        expect(confirm).not.toHaveBeenCalled();
    });
});
