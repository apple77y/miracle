# 개발 명령어 가이드

## 개발 서버 실행
```bash
npm run dev  # 개발 서버 시작 (Turbopack 사용)
```

## 빌드 및 배포
```bash
npm run build     # 프로덕션 빌드 (린트 + 타입체크 + 빌드)
npm run export    # 정적 사이트 빌드 및 export
npm run start     # 프로덕션 서버 시작
npm run serve     # 정적 파일 서빙
```

## 코드 품질 관리
```bash
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정
npm run type-check   # TypeScript 타입 검사
```

## 테스팅
```bash
npm test            # Jest 테스트 실행
npm run test:watch  # 와치 모드로 테스트
npm run test:coverage  # 커버리지 포함 테스트
```

## Git 관련
```bash
git add .
git commit -m "message"  # husky로 pre-commit 훅 실행
git push
```

## macOS 시스템 명령어
```bash
ls -la              # 파일 목록 (숨김 파일 포함)
find . -name "*.tsx" -type f  # 파일 검색
grep -r "pattern" src/        # 텍스트 검색
cd /path/to/dir     # 디렉토리 이동
```