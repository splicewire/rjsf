import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vitest/config';

// Portal scroll-lock uses CommonJS React imports that Vite dedupe cannot rewrite.
// Pin the renderer and testing library to the same instance as the foundation UI.
const require = createRequire(import.meta.url);
const foundationRequire = createRequire(import.meta.resolve('@schemastud/ui'));
// Published foundation packages omit dev dependencies; fall back to this package's test library.
const testingLibrary = (() => {
    try { return foundationRequire.resolve('@testing-library/react'); }
    catch { return require.resolve('@testing-library/react'); }
})();
const react = dirname(foundationRequire.resolve('react/package.json'));
const reactDom = dirname(foundationRequire.resolve('react-dom/package.json'));
export default defineConfig({
    resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
            'react/jsx-runtime': join(react, 'jsx-runtime.js'),
            'react/jsx-dev-runtime': join(react, 'jsx-dev-runtime.js'),
            'react-dom/client': join(reactDom, 'client.js'),
            'react-dom': reactDom,
            react,
            '@testing-library/react': testingLibrary,
        },
    },
    test: {
        environment: 'jsdom',
        server: { deps: { inline: true } },
    },
});
