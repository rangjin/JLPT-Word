# JLPT Word

1인 프로젝트 / 2025.06 ~ 2025.07

일본어 JLPT 단어장을 PDF로 제공하고, 실시간 퀴즈 기능으로 암기 상태를 점검할 수 있는 백엔드 서비스

## 프로젝트 개요
> 단어 등록 → 유저 암기 상태 저장 → PDF & 퀴즈 제공

본 프로젝트는 JLPT 레벨별 단어를 관리자(Admin)가 등록·수정하고, 일반 사용자(User)는 개인별 암기 여부를 기록하며 학습할 수 있도록 설계되었습니다.
단어 리스트를 무작위 셔플 PDF로 내려받을 수 있어 오프라인 학습을 지원하며, 또한 WebSocket 기반 퀴즈 게이트웨이를 통해 실시간 문제 풀이가 가능합니다.

---
## 주요 기능
| 기능                | 설명                                                        |
|-------------------|------------------------------------------------------------|
| JWT 인증       | 이메일·비밀번호 로그인 → Access / Refresh Token 발급                 |
| JLPT 단어 CRUD | 관리자만 단어 추가·수정·삭제 (JLPT1 ~ JLPT5)                         |
| 암기 상태 관리   | 사용자 memorizedWordIds 배열에 외운 단어 ID 저장 / 해제               |
| PDF 다운로드    | 선택 레벨의 전체 / 미암기 / 암기완료 단어를 무작위 셔플하여 PDF 생성         |
| 실시간 퀴즈     | WebSocket 연결로 랜덤 단어 퀴즈, 정답 여부 저장                         |

---
## 빌드 및 실행
```
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (.env)
MONGO_URI=...
JWT_SECRET=...

# 3. 개발 서버 실행
npm run dev
```
---

## 시스템 아키텍처
![Image](https://github.com/user-attachments/assets/37a676a7-1f57-4fc3-8f2a-e55d9d55f163)

## 사용 기술
- **Node.js & Express.js**: REST API 서버, 웹소켓 통신 처리
- **WebSocket (ws)**: 단어 문제 실시간 제공
- **PDFKit**: 단어장 PDF 파일 제공
- **JWT**: 사용자 인증
- **MongoDB**: 사용자 & 단어 & 암기 상태 정보 저장
- **Redis**: 단어 문제 세션 관리
- **Cloud Type**: 무중단 배포
- **GitHub Actions**: CI / CD 파이프라인 구축