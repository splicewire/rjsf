import type { ValidatorType } from '@rjsf/utils';
import {
    SchemaForm,
    createFormValidator,
    type SchemaFormProps,
} from '@schemastud/rjsf-registry';

/**
 * The Splicewire schema-form: the base SchemaForm pre-wired with the
 * Splicewire validator (tolerant of the full x-* grammar). Satellites and the
 * platform SPA consume this; hosts with no Splicewire vocabulary use
 * rjsf-registry's SchemaForm directly.
 */

export function createSplicewireValidator(): ValidatorType {
    return createFormValidator();
}

export const splicewireValidator: ValidatorType = createSplicewireValidator();

export interface SplicewireFormProps extends SchemaFormProps {}

export function SplicewireForm({ validator, ...rest }: SplicewireFormProps) {
    return <SchemaForm validator={validator ?? splicewireValidator} {...rest} />;
}
