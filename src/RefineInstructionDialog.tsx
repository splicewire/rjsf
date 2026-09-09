import { useId } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Textarea,
} from '@schemastud/ui';
import type { SwRevisePayload } from './intents';

export interface RefineInstructionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Controlled by the host so a failed request never discards the author's instruction. */
    instruction: string;
    onInstructionChange: (instruction: string) => void;
    onConfirm: (payload: Required<SwRevisePayload>) => void;
    pending?: boolean;
    error?: string | null;
    title?: string;
    description?: string;
}

/** Collect the existing sw:revise instruction; transport and target selection remain with the host. */
export function RefineInstructionDialog({
    open,
    onOpenChange,
    instruction,
    onInstructionChange,
    onConfirm,
    pending = false,
    error,
    title = 'Refine content',
    description = 'Describe what should change.',
}: RefineInstructionDialogProps) {
    const instructionId = useId();
    const trimmed = instruction.trim();
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!pending) onOpenChange(next);
            }}
        >
            <DialogContent>
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!pending && trimmed) onConfirm({ instruction: trimmed });
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <label htmlFor={instructionId} className="text-sm font-medium">
                            Instruction
                        </label>
                        <Textarea
                            id={instructionId}
                            value={instruction}
                            onChange={(event) => onInstructionChange(event.target.value)}
                            disabled={pending}
                            aria-describedby={error ? `${instructionId}-error` : undefined}
                        />
                    </div>
                    {error && (
                        <p
                            id={`${instructionId}-error`}
                            role="alert"
                            className="text-sm text-destructive"
                        >
                            {error}
                        </p>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={pending}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={pending || !trimmed}>
                            {pending ? 'Refining…' : 'Refine'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
