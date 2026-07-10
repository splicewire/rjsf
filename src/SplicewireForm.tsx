import {
    SchemaForm,
    createFormValidator,
    type SchemaFormProps,
} from '@stephenr85/rjsf-registry';

/**
 * The Splicewire schema-form: the base SchemaForm pre-wired with the
 * Splicewire validator (tolerant of the full x-* grammar). Satellites and the
 * platform SPA consume this; hosts with no Splicewire vocabulary use
 * rjsf-registry's SchemaForm directly.
 */

export function createSplicewireValidator() {
    return createFormValidator();
}

export const splicewireValidator = createSplicewireValidator();

export interface SplicewireFormProps extends SchemaFormProps {}

export function SplicewireForm({ validator, ...rest }: SplicewireFormProps) {
    return <SchemaForm validator={validator ?? splicewireValidator} {...rest} />;
}
