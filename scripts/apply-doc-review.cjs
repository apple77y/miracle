const { execFileSync } = require('node:child_process');
const { lstatSync, readFileSync, writeFileSync } = require('node:fs');

const tracked = new Set(
  execFileSync('git', ['ls-files', '-z', '--', '*.md'], { encoding: 'utf8' })
    .split('\0')
    .filter((path) => path && !path.startsWith('.github/workflows/')),
);

const response = readFileSync(process.argv[2], 'utf8').trim();
const fenced = response.match(/^```(?:json)?\r?\n([\s\S]*)\r?\n```$/);
const review = JSON.parse(fenced ? fenced[1] : response);
if (!Array.isArray(review?.edits) || !Array.isArray(review?.findings) ||
    !review.findings.every((finding) => typeof finding === 'string')) {
  throw new Error('Expected a documentation review with edits and findings arrays.');
}

const updates = new Map();
for (const edit of review.edits) {
  const { path, before, after, evidence } = edit ?? {};
  if (!tracked.has(path) || !lstatSync(path).isFile()) {
    throw new Error(`File outside the editable Markdown scope: ${JSON.stringify(path)}`);
  }
  if (typeof before !== 'string' || !before.trim() ||
      typeof after !== 'string' || typeof evidence !== 'string' || !evidence.trim()) {
    throw new Error(`Invalid documentation correction for ${path}.`);
  }

  const current = updates.get(path) ?? readFileSync(path, 'utf8');
  const offset = current.indexOf(before);
  if (offset === -1 || current.indexOf(before, offset + 1) !== -1) {
    throw new Error(`The quoted text in ${path} does not match exactly once.`);
  }

  updates.set(path, current.slice(0, offset) + after + current.slice(offset + before.length));
}

for (const [path, markdown] of updates) {
  if (readFileSync(path, 'utf8') !== markdown) writeFileSync(path, markdown);
}

console.log('## 문서 검토 결과\n');
for (const { path, evidence } of review.edits) console.log(`- \`${path}\` — ${evidence}`);
for (const finding of review.findings) console.log(`- ${finding}`);
if (!review.edits.length && !review.findings.length) {
  console.log('Copilot이 추가로 제안한 문서 수정 사항이 없습니다.');
}
