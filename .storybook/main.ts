import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

// The splice per-repo Storybook — the "paid-tier" catalog of the composition architecture
// (component-seams map; ticket 28 repeats the beam stand-up, ticket 23, which repeated the
// schemastud pilot, ticket 08 — one tier over each time: open then free then paid).
//
// This is ONE of several per-repo Storybooks (schemastud and beam have their own); the
// project-neutral portal at ~/Workspaces/storybook composes them via refs — splice is the
// :6008 ref (ticket 12). This config catalogues only THIS repo's source.
//
// TOPOLOGY NOTE — splice differs from beam. The beam repo is an npm WORKSPACE (a root
// package.json above several sub-packages, so its glob fans across every sub-package source).
// The splice repo (~/Workspaces/js/packages/splicewire/splice, own git) is a SINGLE
// standalone package: its source sits directly under the repo root, so .storybook lives
// inside it and the glob is one hop up into the source dir, not two.
//
// Stories are COLOCATED (a story file beside each component) under the source dir.
const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
    addons: [],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    viteFinal: async (cfg) => {
        cfg.plugins ??= [];
        // Tailwind v4 — the packages are headless (tsup libs, no CSS pipeline); the workbench
        // supplies the Tailwind + token layer so bg-primary etc. render skinned. Per-package
        // self-contained token defaults (ticket 07's aspiration) can graduate later.
        cfg.plugins.push(tailwindcss());
        // Dedupe React so any story binds a single React instance (belt-and-braces).
        cfg.resolve ??= {};
        cfg.resolve.dedupe = [...(cfg.resolve.dedupe ?? []), 'react', 'react-dom'];
        return cfg;
    },
};

export default config;
