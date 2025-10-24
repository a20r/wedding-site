import { build, context } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outdir = resolve(__dirname, '../dist/assets');
const entry = resolve(__dirname, '../src/scripts/index.ts');

const sharedOptions = {
  entryPoints: [entry],
  bundle: true,
  outdir,
  outbase: 'src/scripts',
  format: 'esm',
  target: 'es2020',
  sourcemap: false,
  minify: true,
  splitting: false,
  treeShaking: true,
  metafile: true
};

await mkdir(outdir, { recursive: true });

const isWatch = process.argv.includes('--watch');

if (isWatch) {
  const ctx = await context(sharedOptions);
  await ctx.watch();
  console.log('esbuild watching src/scripts');
  process.stdin.resume();
} else {
  const result = await build(sharedOptions);
  const kb = (bytes) => (bytes / 1024).toFixed(2);
  const outputs = Object.entries(result.metafile.outputs);
  for (const [file, meta] of outputs) {
    console.log(`Built ${file} (${kb(meta.bytes)} KB)`);
  }
}
