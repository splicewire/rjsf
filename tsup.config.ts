import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: [
        'react',
        'react-dom',
        '@rjsf/core',
        '@rjsf/shadcn',
        '@rjsf/utils',
        '@rjsf/validator-ajv8',
        '@rushing/rjsf-registry',
    ],
});
