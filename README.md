# REMO — 리모 팀 홈페이지

레인서울 2년차 팀 리모의 Next.js 홈페이지와 관리자 UI입니다. 공개 화면은 Neon에서 콘텐츠를 조회하고, 관리 화면은 인증된 관리자만 변경 API에 접근합니다.

## 화면

- 홈페이지: /
- 관리자 대시보드: /admin/
- 프로젝트: /admin/#projects
- 구성원: /admin/#members
- 파일 보관함: /admin/#files
- 사이트 설정: /admin/#settings
- 로그인 UI: /admin/login/

## 개발 실행

```bash
npm install
cp .env.example .env.local
# .env.local에 Neon URL, Blob 토큰, AUTH_SECRET, 관리자 bcrypt 해시를 입력
psql "$DATABASE_URL" -f db/schema.sql
npm run db:seed
npm run dev
```

프로젝트·구성원 추가/수정/삭제, 팀 소개 편집, 로그인 세션, Blob 업로드 API를 제공합니다.

실제 관리 화면은 `remo_admin` 계정과 `ADMIN_PASSWORD_HASH`로 보호됩니다. 비밀번호 평문은 저장하지 않습니다.

## 배포 전 확인

`npm run build`가 통과한 뒤 GitHub `REMO` 저장소를 Vercel 프로젝트에 연결합니다. `main` 병합은 운영 배포, Pull Request는 Preview 배포가 되도록 설정합니다.

## Vercel 설정

Vercel 프로젝트에 Neon Marketplace integration을 연결하고, private Blob store를 생성한 뒤 환경변수를 Production/Preview에 등록합니다. `vercel.json`은 Next.js가 감지되도록 두었고 별도 빌드 명령을 강제하지 않습니다.

요청한 관리자 ID: `remo_admin`

요청 도메인 Team_com.leinnkorean.com에는 밑줄이 있습니다. HTTPS 연결 전에 도메인을 확정해야 하며, 수정 후보는 team-com.leinnkorean.com입니다. DNS를 변경하거나 도메인을 자동 확정하지 않았습니다.

## 소스 구조

- dist/index.html, dist/styles.css: 공개 홈페이지
- dist/preview.js: 관리자 미리보기 데이터 반영
- dist/admin/: 관리자 UI
- dist/assets/: 이미지
- vercel.json: Vercel 정적 호스팅 설정

원본 생성 이미지: ImageGen으로 만든 오렌지·크롬 조형물. 폰트: Google Fonts Noto Sans KR.
