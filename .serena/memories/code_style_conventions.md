# 코드 스타일 및 컨벤션

## 파일 구조
```
src/
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
│   ├── layout/      # 레이아웃 컴포넌트
│   ├── sections/    # 페이지 섹션 컴포넌트
│   └── ui/          # UI 컴포넌트
├── hooks/           # 커스텀 훅
└── utils/           # 유틸리티 함수
```

## 네이밍 컨벤션
- **컴포넌트**: PascalCase (예: `BackgroundSyncIndicator`)
- **파일명**: PascalCase for components, camelCase for others
- **훅**: useXxx pattern (예: `useBackgroundSync`, `useIsPWA`)
- **변수/함수**: camelCase
- **상수**: UPPER_SNAKE_CASE

## TypeScript 스타일
- Strict mode 활성화
- 인터페이스 사용 (interface 키워드)
- 타입 어노테이션 명시적 작성
- JSX는 preserve 모드

## React 패턴
- 함수형 컴포넌트 사용
- 'use client' 지시어 (클라이언트 컴포넌트)
- 커스텀 훅으로 로직 분리
- Props 타입 정의

## CSS/Styling
- Tailwind CSS 클래스 사용
- 컴포넌트별 스타일링
- 반응형 디자인 고려
- sage, sage-dark 등 커스텀 색상 사용