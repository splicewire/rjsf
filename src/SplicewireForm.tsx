import type { ValidatorType } from '@rjsf/utils';
import {
    SchemaForm,
    createFormValidator,
    type SchemaFormProps,
} from '@schemastud/seam';

/**
 * The Splicewire schema-form: the base SchemaForm with the Splicewire
 * validator (tolerant of the full x-* grammar). Satellites and the platform
 * SPA consume this; hosts with no Splicewire vocabulary use seam's SchemaForm
 * directly.
 *
 * With no `validator` prop, SchemaForm's own default applies: the provider's
 * localized validator (`useFormValidator()`, seam >= 0.5.1), so validation
 * messages follow the active locale. An explicit `validator` still wins.
 */

/** A plain (unlocalized) Splicewire validator, for use outside a render. */
export function createSplicewireValidator(): ValidatorType {
    return createFormValidator();
}

export const splicewireValidator: ValidatorType = createSplicewireValidator();

export interface SplicewireFormProps extends SchemaFormProps {}

export function SplicewireForm(props: SplicewireFormProps) {
    return <SchemaForm {...props} />;
}
