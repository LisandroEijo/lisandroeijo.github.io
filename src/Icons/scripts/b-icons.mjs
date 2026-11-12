import { optimize } from 'svgo';
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';

const src = 'src/Icons/raw';
const out = 'src/Icons';
const files = readdirSync(src).filter(f => f.endsWith('.svg'));
const outputs = new Map();

for (const file of files) {
    const output = file.toLowerCase();
    const existing = outputs.get(output);
    if (existing) {
        throw new Error(`Icon files "${existing}" and "${file}" both generate "${output}"`);
    }
    outputs.set(output, file);
}

for (const file of files) {
    const { data } = optimize(readFileSync(`${src}/${file}`, 'utf8'), {
        plugins: [
            'preset-default',
            'removeDimensions',
            { name: 'convertColors', params: { currentColor: true } },
        ],
    });
    writeFileSync(`${out}/${file.toLowerCase()}`, data);
}

for (const entry of readdirSync(out, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.svg') && !outputs.has(entry.name.toLowerCase())) {
        unlinkSync(`${out}/${entry.name}`);
    }
}