import { optimize } from 'svgo';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const src = 'src/icons/raw';
const out = 'src/icons';

for (const file of readdirSync(src).filter(f => f.endsWith('.svg'))) {
    const { data } = optimize(readFileSync(`${src}/${file}`, 'utf8'), {
        plugins: [
            { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
            'removeDimensions',
            { name: 'convertColors', params: { currentColor: true } },
        ],
    });
    writeFileSync(`${out}/${file.toLowerCase()}`, data);
}