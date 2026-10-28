# GA4 설정

이 사이트의 사용자 행동 이벤트는 `assets/analytics.js`에 구현되어 있습니다.

## 활성화

`index.html`의 다음 메타 태그에 실제 GA4 웹 데이터 스트림의 측정 ID를 입력합니다.

```html
<meta name="ga4-measurement-id" content="G-XXXXXXXXXX">
```

ID가 비어 있으면 Google로 데이터가 전송되지 않습니다. 이때도 이벤트는 `window.dataLayer`에 남으므로 브라우저 개발자 도구나 자동 테스트에서 확인할 수 있습니다.

## 주요 이벤트

현재 디자인 데모에서는 GA4 관리 화면에서 `routine_start_click`만 주요 이벤트로 설정합니다. 실제 주문 기능을 연결한 뒤 `begin_checkout`과 `purchase`를 별도로 구현하고 주요 이벤트로 지정해야 합니다.

## 검증

1. GA4 측정 ID를 입력합니다.
2. GA4 DebugView 또는 Tag Assistant를 엽니다.
3. CTA, 섭취 방식 탭, 구성 선택, 수량, FAQ, 안내 모달을 각각 조작합니다.
4. 이벤트 중복 여부와 숫자 파라미터의 타입을 확인합니다.


