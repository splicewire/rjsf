// Splicewire vocabulary + pre-wired form.
export { baseNodeManifest } from './base-manifest';
export {
    ANNOTATION_KEYWORDS,
    ENGINE_PRIVATE_PATTERN,
    SHELL_BINDING_PATTERN,
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
export {
    SW_ENRICH,
    SW_REVISE,
    createSplicewireIntentRouter,
    type SplicewireIntentHandlers,
    type SwRevisePayload,
    type SwReviseTarget,
} from './intents';
export {
    CitationWidget,
    registerCitationWidget,
    type CitationDescriptor,
    type CitationFormContext,
} from './CitationWidget';

// Re-export the generic seam so consumers of the pre-wired form don't need a
// second import for registry/fetcher plumbing.
export {
    WidgetRegistryContext,
    buildUiSchema,
    createFormIntentBus,
    createWidgetRegistry,
    defaultRegistry,
    mergeUiSchema,
    registerWidget,
    relaxNullableRequired,
    resolveExternalRefs,
    resolveWidget,
} from '@schemastud/seam';
export type {
    FormIntent,
    FormIntentBus,
    FormIntentHandler,
    RegistryEntry,
    SchemaFetcher,
    SchemaNode,
    WidgetRegistry,
    WidgetResolution,
} from '@schemastud/seam';
