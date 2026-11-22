# Miracle Flower Website

미라클 플라워 웹사이트 프로젝트입니다.  
Next.js App Router 기반이며, 정적 배포(`output: 'export'`)를 사용합니다.

## 서비스 정보

- 운영 사이트: `https://miracle-flower.vercel.app`
- 서비스 성격: 성남 분당 기반 플라워 스튜디오 소개 및 상담 유입용 사이트
- 핵심 목표:
  - 브랜드 신뢰도 전달
  - 작품/서비스 소개
  - 전화/이메일/지도 기반 문의 전환

## 대상 사용자

- 꽃다발/선물/행사 장식을 찾는 일반 고객
- 기념일/행사용 꽃을 준비하는 고객
- 매장 위치/운영 시간/연락처를 빠르게 확인하려는 모바일 사용자

## 콘텐츠 원칙

- 문구 톤: 과장보다 신뢰, 친절하고 명확한 안내
- 정보 우선순위: 연락처/위치/운영 정보가 첫 화면 동선에서 바로 보이도록 유지
- 다국어: 한국어 우선, 영어는 동일 의미를 유지하는 범위에서 간결하게 제공

## 주요 특징

- 정적 사이트 빌드 및 배포 최적화
- 다국어 지원(한국어/영어)
- SEO 메타데이터 + JSON-LD 구조화 데이터
- 모바일 섹션 탐색, 플로팅 상담 버튼, 섹션 기반 랜딩 페이지

<!-- development-reference:start -->

## 개발 환경 및 기술 스택

| 항목 | 버전 |
| --- | --- |
| Node.js | `v24.15.0` |
| npm | `11.12.1` |
| `next` | `16.4.6` |
| `react` | `19.1.0` |
| `typescript` | `5.8.3` |
| `tailwindcss` | `4.1.11` |
| `react-intl` | `7.1.11` |
| `jest` | `30.2.0` |
| `@testing-library/react` | `16.3.0` |
| `@vercel/analytics` | `1.6.1` |
| `@vercel/speed-insights` | `1.3.1` |

## npm 스크립트

| 실행 명령 | package.json 정의 |
| --- | --- |
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm run export` | `next build` |
| `npm start` | `next start` |
| `npm run serve` | `npx serve@latest out` |
| `npm run lint` | `eslint src --ext .js,.jsx,.ts,.tsx` |
| `npm run lint:fix` | `eslint src --ext .js,.jsx,.ts,.tsx --fix` |
| `npm run typegen` | `next typegen` |
| `npm run type-check` | `npm run typegen && tsc --noEmit` |
| `npm run lint-staged` | `lint-staged` |
| `npm run prepare` | `husky` |
| `npm test` | `NODE_ENV=test jest` |
| `npm run test:watch` | `jest --watch` |
| `npm run test:coverage` | `jest --coverage` |

## 프로젝트 경로

- `messages/en.json`
- `messages/ko.json`
- `src/app/`
- `src/app/guide/page.tsx`
- `src/app/occasion/page.tsx`
- `src/app/page.tsx`
- `src/components/`
- `src/components/layout/`
- `src/components/sections/`
- `src/components/ui/`
- `src/utils/`

<!-- development-reference:end -->

개발 서버는 `npm run dev`로 실행합니다. 정적 사이트를 로컬에서 확인하려면 `npm run build`로 `out/`을 만든 뒤 `npm run serve`를 실행합니다. `npm start`는 현재 정적 내보내기 설정에서 지원되지 않습니다.

## 배포/CI

- Vercel 배포 사용 (Production URL: `https://miracle-flower.vercel.app`)
- GitHub Actions: `.github/workflows/ci-checks.yml`
  - lint
  - type-check
  - test

## 개발 문서 동기화

[Weekly documentation sync](.github/workflows/weekly-doc-sync.md)는 매주 월요일 오전 9시 17분(한국 시간)에 실행됩니다. OpenAI Codex가 `main`에서 Git으로 추적하는 모든 `.md` 파일을 코드와 대조합니다. 수정할 내용이 있으면 근거가 된 코드 경로를 본문에 적어 검토용 PR을 올립니다. `.github/workflows/` 아래의 Markdown에서 발견한 사항은 사람이 워크플로와 생성 파일을 함께 고칠 수 있도록 실행 결과에 기록합니다.

수동으로 확인하려면 GitHub **Actions → Weekly documentation sync → Run workflow**에서 `main`을 선택합니다. README의 버전, npm 명령, 소스 경로만 갱신하려면 로컬에서 `node scripts/sync-docs.cjs`를 실행합니다.

Codex를 실행하려면 [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급한 API 키를 **Settings → Secrets and variables → Actions**에 `OPENAI_API_KEY` 시크릿으로 등록합니다. 워크플로는 GPT‑6.2 Sol과 `medium` 추론 수준을 사용하며, 사용량은 OpenAI API 프로젝트에 청구됩니다. [Codex 자동화 인증 안내](https://github.github.com/gh-aw/engines/codex/)

PR 생성에는 **Settings → Actions → General → Workflow permissions**의 **Allow GitHub Actions to create and approve pull requests** 설정이 필요합니다. 생성된 PR의 CI가 승인 대기 상태이면 PR에서 **Approve and run workflows**를 선택합니다.

## 운영 체크리스트

- 배포 전:
  - 주요 랜딩 섹션(Hero/Services/Gallery/Contact) 레이아웃 확인
  - 연락처 링크(`tel:`, `mailto:`), 외부 지도 링크 동작 확인
  - 한국어/영어 전환 시 핵심 문구/버튼 텍스트 확인
- 배포 후:
  - 운영 URL 접속 확인
  - `sitemap`/메타 반영 확인
  - 주요 문의 동선 클릭 테스트

## 테스트 현황

- 컴포넌트/유틸/라우트(`sitemap`) 테스트는 `src/**/__tests__`에 위치
- 문서 동기화 테스트는 `scripts/__tests__/`에 위치

## 참고

- 정적 배포 모드이므로 request-time dynamic API 사용 시 제약이 있습니다.
- 일부 npm deprecated 경고는 테스트 도구의 하위 의존성에서 발생할 수 있습니다.
