const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test('background script uses action fallback and polling restore', () => {
  const source = read('public/background.js');
  assert.match(source, /const action = ext\?\.action \?\? ext\?\.browserAction;/);
  assert.match(source, /void restorePollingIfNeeded\(\);/);
});

test('content script uses browser\/chrome alias', () => {
  const source = read('public/content.js');
  assert.match(source, /const ext =/);
  assert.match(source, /typeof browser !== "undefined"/);
  assert.match(source, /ext\.storage\.local\.set/);
  assert.match(source, /ext\.runtime\.sendMessage/);
});

test('popup source has no direct chrome namespace usage', () => {
  const files = [
    'src/App.tsx',
    'src/main.tsx',
    'src/hooks/useAnalysis.ts',
    'src/hooks/useCanvasUrl.ts',
    'src/lib/storage.ts',
  ];

  for (const file of files) {
    const source = read(file);
    assert.ok(!/\bchrome\./.test(source), `${file} should not call chrome.* directly`);
    assert.ok(!/typeof chrome/.test(source), `${file} should not branch on chrome directly`);
  }
});
