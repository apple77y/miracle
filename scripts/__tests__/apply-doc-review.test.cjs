const { execFileSync, spawnSync } = require('node:child_process');
const { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');

const script = join(__dirname, '..', 'apply-doc-review.cjs');
let root;

function write(path, content) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function apply(edits, findings = [], format = (json) => json) {
  write('review.json', format(JSON.stringify({ edits, findings })));
  return spawnSync(process.execPath, [script, 'review.json'], { cwd: root, encoding: 'utf8' });
}

const correction = {
  path: '.notes/nested/guide.md',
  before: 'Run npm start.',
  after: 'Build and serve the static export.',
  evidence: 'next.config.ts sets output to export.',
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'miracle-doc-review-'));
  write(correction.path, '# Guide\n\nRun npm start.\n');
  write('.github/workflows/weekly-doc-sync.md', 'Run npm start.');
  write('src/page.tsx', 'Run npm start.');
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  write('untracked.md', 'Run npm start.');
});

afterEach(() => rmSync(root, { recursive: true }));

test('updates existing nested Markdown and reports the supporting evidence', () => {
  const result = apply([correction], ['Review the workflow separately.']);
  expect(result.status).toBe(0);
  expect(readFileSync(join(root, correction.path), 'utf8'))
    .toBe('# Guide\n\nBuild and serve the static export.\n');
  expect(result.stdout).toContain(correction.evidence);
  expect(result.stdout).toContain('Review the workflow separately.');
});

test.each(['.github/workflows/weekly-doc-sync.md', 'src/page.tsx', 'untracked.md', '../outside.md'])(
  'refuses a review that attempts to edit %s without writing earlier corrections',
  (path) => {
    const result = apply([correction, { ...correction, path }]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('outside the editable Markdown scope');
    expect(readFileSync(join(root, correction.path), 'utf8')).toContain('Run npm start.');
  },
);

test('refuses a correction when the quoted text has multiple matches', () => {
  write(correction.path, 'Run npm start.\nRun npm start.\n');
  const result = apply([correction]);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('does not match exactly once');
});

test.each([
  (json) => `I’ll verify the documents.\n\n${json}`,
  (json) => `I’ll verify the documents.\n\n\`\`\`json\n${json}\n\`\`\``,
  (json) => `I’ll verify the documents.\nBEGIN_DOC_REVIEW\n${json}\nEND_DOC_REVIEW\nDone.`,
])('accepts the final JSON even when Copilot emits progress text', (format) => {
  const result = apply([correction], [], format);
  expect(result.status).toBe(0);
  expect(readFileSync(join(root, correction.path), 'utf8')).toContain(correction.after);
});
