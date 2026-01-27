# 📅 교대근무 스케줄러 - 프로젝트 진행 현황

> 불규칙 교대근무자를 위한 모바일 최적화 스케줄 관리 앱

## 📌 프로젝트 개요

### 목표

- 교대근무 스케줄 입력 시간 **5분 → 30초**로 단축 (90% 감소)
- 네이버 캘린더 자동 동기화
- 모바일 우선 설계

### 배포

- **Frontend**: https://hb-shift-calendar.vercel.app/
- **Backend**: Supabase (Seoul 리전)

---

## 🛠️ 기술 스택

### Frontend

| 기술         | 버전                | 용도          |
| ------------ | ------------------- | ------------- |
| React Router | v7 (Framework Mode) | 라우팅 & SSR  |
| TypeScript   | 5.x                 | 타입 안정성   |
| Tailwind CSS | v4                  | 스타일링      |
| date-fns     | 4.x                 | 날짜 유틸리티 |
| npm          | -                   | 패키지 매니저 |

### Backend

| 기술               | 용도                                |
| ------------------ | ----------------------------------- |
| Supabase           | PostgreSQL DB, Auth, Edge Functions |
| Deno               | Edge Functions 런타임 (v1)          |
| Naver OAuth 2.0    | 소셜 로그인                         |
| Naver Calendar API | 캘린더 동기화                       |

### Infrastructure

| 서비스         | 용도                 |
| -------------- | -------------------- |
| Vercel         | Frontend 배포        |
| Supabase Cloud | Backend (Seoul 리전) |

---

## ✅ 완료된 작업

### Phase 1: 프로젝트 기반 구축

- [x] React Router v7 프로젝트 초기화
- [x] Tailwind CSS v4 설정 (`@theme` 블록으로 커스텀 색상)
- [x] ESLint + Prettier 설정
- [x] 폴더 구조 설계

### Phase 2: 캘린더 UI 구현

- [x] `CalendarProvider` - 상태 관리 (currentDate, selectedShift, schedule)
- [x] `CalendarGrid` - 월별 캘린더 그리드
- [x] `MonthNavigation` - 월 이동 네비게이션
- [x] `ShiftSelector` - 근무 타입 선택 UI
- [x] `useSwipePaint` - 터치 스와이프 페인팅 (다중 날짜 선택)
- [x] 근무 타입별 색상 시스템 (Day/Swing/GY/휴무)

### Phase 3: Supabase 백엔드 연동

- [x] Supabase 프로젝트 생성 (Seoul 리전)
- [x] DB 스키마 설계 및 마이그레이션
  - `shift_types` 테이블 (사용자별 커스텀 근무 타입)
  - `schedules` 테이블 (날짜별 스케줄)
  - RLS 정책 설정
- [x] Supabase 클라이언트 연결

### Phase 4: 네이버 OAuth 인증

- [x] Edge Function 생성 (`naver-auth`)
  - 네이버 토큰 교환
  - 사용자 정보 조회
  - Supabase Auth 사용자 생성/조회
  - `hashed_token` 반환
- [x] `AuthProvider` - 인증 상태 관리
- [x] `LoginPage` - 로그인 페이지 (네이버 공식 버튼 PNG)
- [x] `auth.callback` 라우트 - OAuth 콜백 처리
- [x] CSRF 방지 (`state` 검증)
- [x] `Header` 컴포넌트 - 로그아웃 버튼
- [x] 로그인 상태에 따른 페이지 분기

---

## 📐 기술적 결정 사항

### 1. OCR 대신 수동 입력 최적화

- **배경**: OCR 검토 (AWS Textract, Google Vision)
- **문제**: 한국어 표 인식 부정확, 개발 비용 높음
- **결정**: 터치 UX 최적화로 입력 시간 단축
- **결과**: 스와이프 페인팅으로 30초 내 입력 가능

### 2. 가상 이메일 전략

- **배경**: Supabase Auth는 이메일 필수
- **문제**: 네이버 이메일은 선택 동의 항목
- **결정**: `naver_{id}@naver.local` 형식 사용
- **장점**: 이메일 동의 여부와 무관하게 동작

### 3. Edge Function JWT 검증

- **배경**: `verify_jwt` 설정
- **문제**: 로그인 전에는 JWT가 없음
- **결정**: `naver-auth` 함수는 `verify_jwt = false`
- **향후**: 인증 필요한 함수는 `verify_jwt = true`

### 4. Deno 버전

- **문제**: Deno 2에서 Edge Function 배포 실패
- **원인**: Supabase CLI와 호환성 문제
- **결정**: `deno_version = 1` 사용

### 5. 날짜 타입

- **선택지**: `TIMESTAMPTZ` vs `DATE`
- **결정**: `DATE` 타입 사용
- **이유**: 교대근무는 "날짜" 개념, 타임존 복잡도 회피

---

## 📁 프로젝트 구조

```
shift-calendar/
├── app/
│   ├── routes/
│   │   ├── _index.tsx          # 메인 (로그인 분기)
│   │   └── auth.callback.tsx   # OAuth 콜백
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   └── calendar/
│   │       ├── CalendarGrid.tsx
│   │       ├── MonthNavigation.tsx
│   │       └── ShiftSelector.tsx
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── CalendarProvider.tsx
│   ├── hooks/
│   │   ├── useCalendar.ts
│   │   └── useSwipePaint.ts
│   ├── utils/
│   │   └── supabase.ts
│   ├── types/
│   │   └── calendarTypes.ts
│   ├── constants/
│   │   └── shift.ts
│   ├── app.css
│   ├── root.tsx
│   └── routes.ts
├── public/
│   └── images/
│       └── naver_login_btn.png
├── supabase/
│   ├── functions/
│   │   └── naver-auth/
│   │       ├── index.ts
│   │       └── deno.json
│   ├── migrations/
│   │   └── [timestamp]_create_shift_tables.sql
│   └── config.toml
├── .env
├── package.json
└── README.md
```

---

## 🔜 앞으로 할 작업

### Phase 5: 스케줄 CRUD

- [ ] 스케줄 저장 기능 (로컬 → Supabase)
- [ ] 저장/초기화 버튼 연동
- [ ] 월별 스케줄 조회 (loader 활용)
- [ ] Optimistic UI 업데이트

### Phase 6: 네이버 캘린더 동기화

- [ ] 네이버 캘린더 API 연동 Edge Function
- [ ] iCalendar 형식 변환 (RFC 5545)
- [ ] `naver_event_id` 기반 동기화 상태 추적
- [ ] 동기화 버튼 UI

### Phase 7: 배포 및 심사

- [ ] Vercel 환경변수 설정
- [ ] 프로덕션 배포
- [ ] 네이버 개발자 센터 심사 제출

### Phase 8: 추가 기능 (선택)

- [ ] 오프라인 모드 (PWA)
- [ ] 다크 모드
- [ ] 근무 통계
- [ ] 팀원 스케줄 공유

---

## ⚙️ 환경 변수

### Frontend (`.env`)

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
VITE_NAVER_CLIENT_ID=xxx
```

### Supabase Edge Functions (Secrets)

```bash
supabase secrets set NAVER_CLIENT_ID=xxx
supabase secrets set NAVER_CLIENT_SECRET=xxx
```

> ⚠️ `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`는 Edge Function에 자동 주입됨

---

## 🗄️ 데이터베이스 스키마

### shift_types

| 컬럼          | 타입 | 설명                    |
| ------------- | ---- | ----------------------- |
| id            | UUID | PK                      |
| user_id       | UUID | FK → auth.users         |
| name          | TEXT | 근무 타입명             |
| short_label   | TEXT | 짧은 라벨 (D, S, G, 휴) |
| color         | TEXT | 배경색                  |
| text_color    | TEXT | 텍스트색                |
| display_order | INT  | 정렬 순서               |

### schedules

| 컬럼            | 타입        | 설명                    |
| --------------- | ----------- | ----------------------- |
| id              | UUID        | PK                      |
| user_id         | UUID        | FK → auth.users         |
| date            | DATE        | 날짜                    |
| shift_type_id   | UUID        | FK → shift_types        |
| naver_event_id  | TEXT        | 네이버 캘린더 이벤트 ID |
| naver_synced_at | TIMESTAMPTZ | 동기화 시각             |

---

## 📚 참고 문서

- [React Router v7 Docs](https://reactrouter.com/)
- [Supabase Docs](https://supabase.com/docs)
- [네이버 로그인 버튼 가이드](https://developers.naver.com/docs/login/bi/bi.md)

---

## 📝 변경 이력

| 날짜       | 내용                         |
| ---------- | ---------------------------- |
| 2026-01-09 | Phase 1~2 완료 (캘린더 UI)   |
| 2026-01-19 | Phase 3 완료 (Supabase 연동) |
| 2026-01-27 | Phase 4 완료 (네이버 OAuth)  |
