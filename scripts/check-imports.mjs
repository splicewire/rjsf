import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const forbidden = /(?:from\s*|import\s*)['"](?:@\/|sonner(?:['"/])|axios(?:['"/])|ziggy-js(?:['"/])|@inertiajs\/)/;
function scan(dir) {
    const failures = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) failures.push(...scan(path));
        else if (/\.tsx?$/.test(path)) readFileSync(path, 'utf8').split('\n').forEach((line, index) => {
            if (forbidden.test(line)) failures.push(`${path}:${index + 1}: forbidden host dependency`);
        });
    }
    return failures;
}
const failures = scan(root);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Import boundary passed.');
