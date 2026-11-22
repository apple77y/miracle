const { spawnSync, execFileSync } = require('node:child_process');
const { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');

const script = join(__dirname, '..', 'sync-docs.cjs');
const start = '<!-- development-reference:start -->';
const end = '<!-- development-reference:end -->';
let root;

function write(file, content = '') {
  const path = join(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function syncDocs() {
  return spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'miracle-sync-docs-'));
  write('README.md', `# Intro\n\n${start}\nOld reference\n${end}\n\nKeep this note.\n`);
  write('.nvmrc', 'v24.15.0\n');
  write('package.json', JSON.stringify({
    packageManager: 'npm@11.12.1',
    scripts: { start: 'next start', build: 'next build', 'check-links': 'node check-links.js' },
    dependencies: { next: '^16.0.0' },
  }));
  write('package-lock.json', JSON.stringify({ packages: { 'node_modules/next': { version: '16.4.6' } } }));
  write('src/app/guide/page.tsx');
  write('src/components/ui/Button.tsx');
  write('messages/ko.json');
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', 'src', 'messages'], { cwd: root });
  write('src/app/local/page.tsx');
});

afterEach(() => rmSync(root, { recursive: true }));

test('refreshes tracked paths, npm scripts and resolved versions while preserving surrounding Markdown', () => {
  const result = syncDocs();
  expect(result.status).toBe(0);
  const markdown = readFileSync(join(root, 'README.md'), 'utf8');

  expect(markdown).toContain('| `npm run check-links` | `node check-links.js` |');
  expect(markdown).toContain('| `npm start` | `next start` |');
  expect(markdown).toContain('| `next` | `16.4.6` |');
  expect(markdown).toContain('`v24.15.0`');
  expect(markdown).toContain('`11.12.1`');
  expect(markdown).toContain('`src/app/guide/page.tsx`');
  expect(markdown).toContain('`src/components/ui/`');
  expect(markdown).toContain('`messages/ko.json`');
  expect(markdown).not.toContain('src/app/local/page.tsx');
  expect(markdown).not.toContain('Old reference');
  expect(markdown.startsWith('# Intro\n\n')).toBe(true);
  expect(markdown.endsWith('\n\nKeep this note.\n')).toBe(true);

  expect(syncDocs().status).toBe(0);
  expect(readFileSync(join(root, 'README.md'), 'utf8')).toBe(markdown);
});

test('fails without rewriting the README if the generated block is ambiguous', () => {
  const markdown = `${start}\n${start}\nOld reference\n${end}\n`;
  write('README.md', markdown);

  const result = syncDocs();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('development-reference');
  expect(readFileSync(join(root, 'README.md'), 'utf8')).toBe(markdown);
});
