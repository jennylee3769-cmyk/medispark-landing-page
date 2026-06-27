# 배포 직전 다음 단계

## 1. Apps Script URL 연결

파일:

- `config.js`

수정 항목:

- `APPS_SCRIPT_URL`에 배포된 Google Apps Script 웹앱 URL 입력

예시:

```js
window.APP_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec',
  DEVELOPER_NAME: '이정임',
  PAGE_NAME: '메디스파크 분양 홍보 랜딩',
  PHONE_TARGET: '01066892348'
};
```

## 2. 실제 리드 저장 테스트

테스트 순서:

1. 랜딩 페이지 열기
2. 빠른 상담 폼에 이름, 연락처 입력
3. 동의 체크 후 제출
4. 구글시트 `leads` 시트에 한 줄이 추가되는지 확인
5. `developer_name=이정임` 저장 여부 확인
6. 메인 상담 폼, 모달 상담 폼도 각각 1회 테스트

## 3. 최종 점검 항목

- `59A`, `59B` 노출 없음
- 상담 가능 타입은 `84A`, `84B`, `101`만 표시
- 모바일 하단 고정 CTA 정상 노출
- `평면` 메뉴가 실제 평면 섹션으로 이동
- 예정사항 문구 노출 확인
- 개인정보 안내 문구 확인

## 4. 배포 전 주의

- 병원, 교통, 도보권 문구는 공식 공개 기준으로 재검수
- 운영 주체 명칭은 실제 광고/상담 운영 주체 기준으로 최종 확정
- Apps Script 시트 권한과 웹앱 공개 범위 확인
