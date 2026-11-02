const assert = require('node:assert/strict');

async function main() {
  assert.equal(process.versions.node, '26.13.0');
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash('runtime-smoke-fixture', 4);
  assert.equal(await bcrypt.compare('runtime-smoke-fixture', hash), true);
  const { nodeProfilingIntegration } = require('@sentry/profiling-node');
  assert.equal(typeof nodeProfilingIntegration(), 'object');
  const sharp = require('sharp');
  const image = await sharp({ create: { width: 1, height: 1, channels: 3, background: '#000000' } }).png().toBuffer();
  assert.ok(image.length > 0);
  await import('@xenova/transformers');
  require('../dist/app.module');
  console.log(`Runtime smoke passed on Node ${process.versions.node}: bcrypt, profiling, sharp, transformers, application module`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
