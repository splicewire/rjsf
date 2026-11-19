// grammar/base.manifest.json
var base_manifest_default = {
  profile: "base",
  version: 1,
  doc: {
    admitsChildCategories: ["prose"]
  },
  nodes: [
    {
      name: "p",
      description: "A paragraph of inline prose.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: true,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "h2",
      description: "A level-2 heading.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: true,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "h3",
      description: "A level-3 heading.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: true,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "h4",
      description: "A level-4 heading.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: true,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "h5",
      description: "A level-5 heading.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: true,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "h6",
      description: "A level-6 heading.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: true,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "blockquote",
      description: "A block quotation wrapping prose.",
      group: "block",
      category: "prose",
      admitsChildCategories: ["prose"],
      admitsText: false,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "ul",
      description: "An unordered list.",
      group: "block",
      category: "prose",
      admitsChildCategories: ["list_item"],
      admitsText: false,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "ol",
      description: "An ordered list.",
      group: "block",
      category: "prose",
      admitsChildCategories: ["list_item"],
      admitsText: false,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "li",
      description: "A single list item wrapping prose.",
      group: "block",
      category: "list_item",
      admitsChildCategories: ["prose"],
      admitsText: false,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "pre",
      description: "A block of preformatted code.",
      group: "block",
      category: "prose",
      admitsChildCategories: null,
      admitsText: false,
      contentExpression: "text*",
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "hr",
      description: "A horizontal rule.",
      group: "block",
      category: "prose",
      admitsChildCategories: [],
      admitsText: false,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    },
    {
      name: "br",
      description: "A hard line break inside inline content.",
      group: "inline",
      category: null,
      admitsChildCategories: [],
      admitsText: false,
      contentExpression: null,
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      }
    }
  ],
  marks: [
    { name: "strong" },
    { name: "em" },
    { name: "code" },
    {
      name: "link",
      attrsSchema: {
        type: "object",
        properties: {
          href: { type: "string" }
        }
      }
    },
    {
      name: "annotation",
      attrsSchema: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] }
        }
      },
      excludes: ""
    }
  ]
};

// src/base-manifest.ts
var baseNodeManifest = base_manifest_default;

// src/keywords.ts
import { createKeywordVocabulary } from "@schemastud/seam";
var FORM_KEYWORDS = ["x-widget", "x-placeholder"];
var ANNOTATION_KEYWORDS = [
  "x-fragment",
  "x-type",
  "x-filter",
  "x-sort",
  "x-lazy",
  "x-optional",
  "x-dereference",
  "x-migrate",
  "x-migrate-from"
];
var ENGINE_PRIVATE_PATTERN = /^x-sw[a-z]-/;
var SHELL_BINDING_PATTERN = /^x-sw-/;
var splicewireVocabulary = createKeywordVocabulary({
  keywords: ANNOTATION_KEYWORDS,
  patterns: [ENGINE_PRIVATE_PATTERN, SHELL_BINDING_PATTERN]
});
function isEnginePrivateKeyword(keyword) {
  return ENGINE_PRIVATE_PATTERN.test(keyword);
}
function isSplicewireKeyword(keyword) {
  return splicewireVocabulary.isKnownKeyword(keyword);
}

// src/SplicewireForm.tsx
import {
  SchemaForm,
  createFormValidator
} from "@schemastud/seam";
import { jsx } from "react/jsx-runtime";
function createSplicewireValidator() {
  return createFormValidator();
}
var splicewireValidator = createSplicewireValidator();
function SplicewireForm({ validator, ...rest }) {
  return /* @__PURE__ */ jsx(SchemaForm, { validator: validator ?? splicewireValidator, ...rest });
}

// src/intents.ts
var SW_REVISE = "sw:revise";
var SW_ENRICH = "sw:enrich";
function createSplicewireIntentRouter(handlers) {
  return (intent) => {
    switch (intent.type) {
      case SW_REVISE:
        return handlers.onRevise(intent);
      case SW_ENRICH:
        return handlers.onEnrich?.(intent);
      default:
        return void 0;
    }
  };
}

// src/index.ts
import {
  WidgetRegistryContext,
  buildUiSchema,
  createFormIntentBus,
  createWidgetRegistry,
  defaultRegistry,
  mergeUiSchema,
  normalizeNullableRefs,
  registerWidget,
  resolveExternalRefs,
  resolveWidget
} from "@schemastud/seam";

// src/RefineInstructionDialog.tsx
import { useId } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea
} from "@schemastud/ui";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function RefineInstructionDialog({
  open,
  onOpenChange,
  instruction,
  onInstructionChange,
  onConfirm,
  pending = false,
  error,
  title = "Refine content",
  description = "Describe what should change."
}) {
  const instructionId = useId();
  const trimmed = instruction.trim();
  return /* @__PURE__ */ jsx2(
    Dialog,
    {
      open,
      onOpenChange: (next) => {
        if (!pending) onOpenChange(next);
      },
      children: /* @__PURE__ */ jsx2(DialogContent, { children: /* @__PURE__ */ jsxs(
        "form",
        {
          className: "space-y-4",
          onSubmit: (event) => {
            event.preventDefault();
            if (!pending && trimmed) onConfirm({ instruction: trimmed });
          },
          children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx2(DialogTitle, { children: title }),
              /* @__PURE__ */ jsx2(DialogDescription, { children: description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx2("label", { htmlFor: instructionId, className: "text-sm font-medium", children: "Instruction" }),
              /* @__PURE__ */ jsx2(
                Textarea,
                {
                  id: instructionId,
                  value: instruction,
                  onChange: (event) => onInstructionChange(event.target.value),
                  disabled: pending,
                  "aria-describedby": error ? `${instructionId}-error` : void 0
                }
              )
            ] }),
            error && /* @__PURE__ */ jsx2(
              "p",
              {
                id: `${instructionId}-error`,
                role: "alert",
                className: "text-sm text-destructive",
                children: error
              }
            ),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx2(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  disabled: pending,
                  onClick: () => onOpenChange(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx2(Button, { type: "submit", disabled: pending || !trimmed, children: pending ? "Refining\u2026" : "Refine" })
            ] })
          ]
        }
      ) })
    }
  );
}
export {
  ANNOTATION_KEYWORDS,
  ENGINE_PRIVATE_PATTERN,
  FORM_KEYWORDS,
  RefineInstructionDialog,
  SHELL_BINDING_PATTERN,
  SW_ENRICH,
  SW_REVISE,
  SplicewireForm,
  WidgetRegistryContext,
  baseNodeManifest,
  buildUiSchema,
  createFormIntentBus,
  createSplicewireIntentRouter,
  createSplicewireValidator,
  createWidgetRegistry,
  defaultRegistry,
  isEnginePrivateKeyword,
  isSplicewireKeyword,
  mergeUiSchema,
  normalizeNullableRefs,
  registerWidget,
  resolveExternalRefs,
  resolveWidget,
  splicewireValidator,
  splicewireVocabulary
};
//# sourceMappingURL=index.js.map