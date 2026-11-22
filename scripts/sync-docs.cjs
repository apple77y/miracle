const { execFileSync } = require('node:child_process');
const { readFileSync, writeFileSync } = require('node:fs');

const start = '<!-- development-reference:start -->';
const end = '<!-- development-reference:end -->';
const packages = [
  'next', 'react', 'typescript', 'tailwindcss', 'react-intl', 'jest',
  '@testing-library/react', '@vercel/analytics', '@vercel/speed-insights',
];

function code(value) {
  const ticks = (value.match(/`+/g) ?? []).reduce(
    (longest, run) => Math.max(longest, run.length), 0,
  );
  const fence = '`'.repeat(ticks + 1);
  const padding = ticks ? ' ' : '';
  return fence + padding + value.replaceAll('|', '\\|').replace(/\r?\n/g, ' ') + padding + fence;
}

function tableRow(label, value) {
  return `| ${code(label)} | ${code(value)} |`;
}

function buildReference() {
  const { scripts, packageManager } = JSON.parse(readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const nodeVersion = readFileSync('.nvmrc', 'utf8').trim();
  const tracked = execFileSync('git', ['ls-files', '-z', '--', 'src', 'messages'], {
    encoding: 'utf8',
  }).split('\0').filter(Boolean);

  const versions = packages.flatMap((name) => {
    const version = lock.packages[`node_modules/${name}`]?.version;
    return version ? [tableRow(name, version)] : [];
  });
  const projectPaths = new Set();

  for (const path of tracked) {
    const [root, area, group, child] = path.split('/');
    if (root === 'messages' || /^src\/app\/(?:.*\/)?(?:page|route)\.[jt]sx?$/.test(path)) {
      projectPaths.add(path);
    } else {
      projectPaths.add(group ? `${root}/${area}/` : path);
      if (area === 'components' && child && group !== '__tests__') {
        projectPaths.add(`${root}/${area}/${group}/`);
      }
    }
  }

  return [
    '## 개발 환경 및 기술 스택',
    '',
    '| 항목 | 버전 |',
    '| --- | --- |',
    `| Node.js | ${code(nodeVersion)} |`,
    `| npm | ${code(packageManager.slice('npm@'.length))} |`,
    ...versions,
    '',
    '## npm 스크립트',
    '',
    '| 실행 명령 | package.json 정의 |',
    '| --- | --- |',
    ...Object.entries(scripts).map(([name, command]) =>
      tableRow(['start', 'test'].includes(name) ? `npm ${name}` : `npm run ${name}`, command)),
    '',
    '## 프로젝트 경로',
    '',
    ...[...projectPaths].sort().map((path) => `- ${code(path)}`),
  ];
}

const original = readFileSync('README.md', 'utf8');
const newline = original.includes('\r\n') ? '\r\n' : '\n';
const lines = original.split(newline);
const first = lines.indexOf(start);
const last = lines.indexOf(end);

if (first < 0 || last <= first || first !== lines.lastIndexOf(start) || last !== lines.lastIndexOf(end)) {
  throw new Error('README.md must contain one ordered pair of development-reference markers.');
}

const updated = [...lines.slice(0, first + 1), '', ...buildReference(), '', ...lines.slice(last)]
  .join(newline);
if (original !== updated) writeFileSync('README.md', updated);
