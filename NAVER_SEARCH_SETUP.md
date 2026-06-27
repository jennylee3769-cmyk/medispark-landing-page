# 네이버 서치어드바이저 등록용 파일 안내

현재 이 프로젝트에 네이버 검색 등록용 기본 파일을 추가했습니다.

- `robots.txt`
- `sitemap.xml`
- `naver-site-verification.html.sample`

기준 도메인:

- `https://jennylee3769-cmyk.github.io/`

## 1. 네이버 서치어드바이저에 등록할 URL

- 대표 URL: `https://jennylee3769-cmyk.github.io/`
- 사이트맵 URL: `https://jennylee3769-cmyk.github.io/sitemap.xml`
- robots URL: `https://jennylee3769-cmyk.github.io/robots.txt`

## 2. 소유확인 방법

네이버 서치어드바이저에서는 보통 아래 방식 중 하나로 소유확인을 진행합니다.

- `meta` 태그 삽입
- HTML 확인 파일 업로드

### meta 태그 방식

네이버에서 아래와 같은 태그를 발급하면 `index.html`의 `<head>` 안에 추가하면 됩니다.

```html
<meta name="naver-site-verification" content="발급받은값">
```

### HTML 파일 업로드 방식

네이버에서 특정 파일명과 내용을 주는 경우:

1. `naver-site-verification.html.sample`을 참고
2. 네이버가 안내한 정확한 파일명으로 새 파일 생성
3. 안내된 인증 문자열로 내용 교체
4. 프로젝트 루트에 업로드 후 배포

## 3. 현재 반영된 검색 수집 기본 설정

- `index,follow` 로봇 메타 추가
- canonical URL 추가
- `robots.txt` 추가
- `sitemap.xml` 추가
- OG/Twitter 썸네일 메타 반영

## 4. 등록 후 확인할 것

1. GitHub Pages에 배포 반영
2. 브라우저에서 아래 주소 직접 확인
   - `/`
   - `/robots.txt`
   - `/sitemap.xml`
3. 네이버 서치어드바이저에서 사이트 등록
4. 사이트맵 제출
5. 수집 요청 실행

## 5. 다음에 바로 할 작업

네이버에서 발급받은 인증 메타값 또는 인증 파일 내용을 주면, 내가 바로 실제 인증용 코드까지 넣어드릴 수 있습니다.
