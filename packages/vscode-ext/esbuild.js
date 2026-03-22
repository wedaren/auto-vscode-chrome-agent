const esbuild = require('esbuild');
const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const ctx = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'out/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
};

async function main() {
  if (watch) {
    const builder = await esbuild.context(ctx);
    await builder.watch();
    console.log('[esbuild] watching...');
  } else {
    await esbuild.build(ctx);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
