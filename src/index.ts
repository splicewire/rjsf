// Splicewire vocabulary + pre-wired form.
export {
    ANNOTATION_KEYWORDS,
    ENGINE_PRIVATE_PATTERN,
    FORM_KEYWORDS,
    isEnginePrivateKeyword,
    isSplicewireKeyword,
    splicewireVocabulary,
} from './keywords';
export {
    SplicewireForm,
    createSplicewireValidator,
    splicewireValidator,
    type SplicewireFormProps,
} from './SplicewireForm';

// Re-export the generic seam so consumers of the pre-wired form don't need a
// second import for registry/fetcher plumbing.
export {
    WidgetRegistryContext,
    buildUiSchema,
    createWidgetRegistry,
    defaultRegistry,
    mergeUiSchema,
    registerWidget,
    relaxNullableRequired,
    resolveExternalRefs,
    resolveWidget,
} from '@stephenr85/rjsf-registry';
export type {
    RegistryEntry,
    SchemaFetcher,
    SchemaNode,
    WidgetRegistry,
    WidgetResolution,
} from '@stephenr85/rjsf-registry';
