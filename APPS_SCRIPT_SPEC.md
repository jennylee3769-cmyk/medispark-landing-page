# Medispark Lead Apps Script Spec

## Goal

랜딩 페이지에서 수집한 고객 정보를 Google Apps Script 웹앱으로 전송하고, Google Sheets `leads` 시트에 저장한다.

## Fixed Rules

- 대표번호: `010-6689-2348`
- 개발자명 고정값: `이정임`
- `developer_name` 값은 프런트엔드와 Apps Script 양쪽에서 모두 보정한다.
- 전화상담, 방문예약, 관심고객 등록은 같은 시트 구조를 사용한다.

## Sheet Name

- `leads`

## Required Columns

1. `created_at`
2. `name`
3. `phone`
4. `lead_type`
5. `interest_type`
6. `visit_datetime`
7. `developer_name`
8. `page_name`
9. `page_url`
10. `device_type`
11. `utm_source`
12. `utm_medium`
13. `utm_campaign`
14. `referrer`
15. `privacy_agreed`

## Allowed `lead_type`

- `phone_call`
- `visit_reservation`
- `info_request`
- `modelhouse_view`

## Web App Contract

### Method

- `POST`

### Content-Type

- `application/json`

### Request Body Example

```json
{
  "name": "홍길동",
  "phone": "01012345678",
  "lead_type": "phone_call",
  "interest_type": "84A",
  "visit_datetime": "2026-06-27 15:00",
  "developer_name": "이정임",
  "page_name": "메디스파크 분양 홍보 랜딩",
  "page_url": "https://example.com",
  "device_type": "mobile",
  "utm_source": "naver",
  "utm_medium": "cpc",
  "utm_campaign": "medispark_open",
  "referrer": "https://search.naver.com",
  "privacy_agreed": true
}
```

### Success Response Example

```json
{
  "ok": true,
  "message": "Lead saved",
  "row": 2
}
```

### Error Response Example

```json
{
  "ok": false,
  "message": "Missing required fields"
}
```

## Validation Rules

- `name`: non-empty
- `phone`: 숫자만 남겼을 때 10자리 이상
- `lead_type`: 허용값 중 하나
- `privacy_agreed`: `true`
- `developer_name`: 비어 있으면 `이정임`으로 대체

## Phone Flow Rule

1. 사용자가 `상담하기` 클릭
2. 이름, 연락처, 동의 체크 입력
3. 프런트엔드가 Apps Script로 저장 요청
4. 저장 성공 여부와 무관하게 사용자가 `전화 연결하기` 클릭 가능
5. `tel:01066892348`로 통화 연결

이유:

- 저장 실패가 전화 연결 자체를 막으면 전환 손실이 커진다.
- 대신 저장 실패 시 재시도 메시지를 보여준다.

## Deployment Steps

1. Google Sheets 생성
2. 시트 이름을 `leads`로 변경
3. 헤더 행 입력
4. Apps Script 프로젝트 생성
5. `Code.gs` 붙여넣기
6. `deploy > new deployment > web app`
7. `Execute as`: Me
8. `Who has access`: Anyone
9. 배포 URL을 프런트엔드 `APPS_SCRIPT_URL`에 반영

## Operational Notes

- 시트는 문자열 위주로 저장한다.
- 시간값 `created_at`은 Apps Script 서버 시각으로 기록한다.
- 전화번호는 저장 전 숫자만 남긴다.
- 운영 규모가 커지면 별도 백업 시트 또는 Slack 알림 연동을 추가할 수 있다.
