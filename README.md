# Miracle Flower Website

미라클 플라워 웹사이트 프로젝트입니다.  
`Next.js 16` App Router 기반이며, 정적 배포(`output: 'export'`)를 사용합니다.

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

## Tech Stack

- Next.js 16 (`app/` router)
- TypeScript (strict)
- Tailwind CSS v4
- react-intl (ko/en)
- Jest + Testing Library
- Vercel Analytics / Speed Insights

## 주요 특징

- 정적 사이트 빌드 및 배포 최적화
- 다국어 지원(한국어/영어)
- SEO 메타데이터 + JSON-LD 구조화 데이터
- 모바일 하단 네비게이션, 섹션 기반 랜딩 페이지
- 오프라인 페이지(`/offline`)

## 프로젝트 구조

```text
src/
  app/
    layout.tsx
    page.tsx
    guide/page.tsx
    occasion/page.tsx
    offline/page.tsx
    sitemap.ts
  components/
    layout/
    sections/
    ui/
  hooks/
  utils/
messages/
```

## Scripts

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 타입 생성 + 타입 체크
npm run type-check

# 린트
npm run lint

# 테스트
npm run test
```

## 개발 환경

- Node.js: `.nvmrc` 기준 사용
- 패키지 매니저: npm

## 배포/CI

- Vercel 배포 사용 (Production URL: `https://miracle-flower.vercel.app`)
- GitHub Actions: `.github/workflows/ci-checks.yml`
  - lint
  - type-check
  - test

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

- 단위 테스트는 `src/**/__tests__`에 위치
- 현재 컴포넌트/유틸/라우트(`sitemap`) 테스트 포함

## 참고

- 정적 배포 모드이므로 request-time dynamic API 사용 시 제약이 있습니다.
- 일부 npm deprecated 경고는 테스트 도구의 하위 의존성에서 발생할 수 있습니다.
