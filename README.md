# 🛡️ HWK sLLM 신용평가 및 XAI 시스템 (CSS_rating)

본 시스템은 개인의 신용정보 및 대출 조건을 분석하여 부실가능성(Default Probability)을 정교하게 예측하고, 산출된 최종 신용 점수(1000점 만점)와 등급(A~F)에 대한 명확한 사유를 5종 XAI(설명가능 AI)로 제공하는 엔터프라이즈급 신용평가 시뮬레이션 플랫폼입니다.

---

## 🚀 주요 모듈 및 아키텍처

시스템은 5개의 유기적 핵심 모듈로 구성됩니다:

1. **M1: 데이터 파이프라인 (`credit_system/pipeline.py`)**
   - Lending Club 1.18GB PoC 대용량 데이터 로드 및 정제.
   - **Data Leakage 방지**: `total_pymnt` 등 사후 변수(post-origination) 블랙리스트 자동 제거.
   - FICO 점수 평균화, 신용 연령(months) 산정 등 핵심 피처 엔지니어링 수행.
   - 정형(Tabular) 데이터를 sLLM 학습용 한글 자연어 프롬프트 텍스트로 직렬화(SFT prompt).
2. **M2: 모델 학습 및 검증 (`credit_system/train.py`, `evaluate.py`)**
   - 전통적 기계학습 모델(LightGBM) 및 소형언어모델(sLLM QLoRA) 미세조정(Fine-Tuning) 환경 구축.
   - **목표 성능 보장 루프**: LightGBM의 검증 AUC 점수를 기준으로 삼아 sLLM의 검증 성능이 **최소 10% 이상 뛰어난 예측력**에 도달할 때까지 반복 학습하는 학습 컨트롤 타워 구현.
   - 테스트 데이터셋 기반 ROC Curve 시각화(한글 폰트 적용) 및 정밀 성능 대조 보고서(`evaluation_report.json`) 생성.
3. **M3: 실시간 API 추론 (`credit_system/server.py`)**
   - FastAPI RESTful API 기반으로 개별 신용정보 JSON 입력을 처리.
   - 부실확률을 스케일링하여 1000점 만점 신용점수 및 A~F 신용등급 자동 부여.
4. **M4: XAI 엔진 (`credit_system/utils/xai.py`)**
   - **SHAP 변수 기여도**: 어떤 피처가 가점/감점 요소였는지 정량적 스코어 분석.
   - **sLLM 자연어 진단**: sLLM 심사역 의견을 모사해 친근하고 고품질인 3줄 한글 종합 요약 리포트 자동 생성.
   - **행동 교정 처방전 (Counterfactuals)**: "DTI 부채비율을 X% 낮추면 점수가 Y점 상승" 과 같이 신용 개선을 위한 가상 시나리오 역산.
5. **M5: 프리미엄 다크 테마 대시보드 (`frontend/`)**
   - React + Vite + Vanilla CSS 기반의 모던 네온/글래스모피즘(Glassmorphism) 다크 테마 적용.
   - 점수 상승 게이지, SHAP 가로막대 차트, 진단서 자동 타이핑 효과, 솔루션 타임라인 카드 탑재.
   - 전통 모델 vs AI 모델 성능 지표 대조 시각화 페이지 연동.

---

## 🛠️ 설치 및 로컬 구동 방법 (Local Quick Start)

### 1. 파이썬 가상환경 세팅 및 패키지 설치
`uv` 패키지 매니저를 사용하여 신속하게 가상환경을 구축하고 의존 패키지를 다운로드합니다.
```bash
# 가상환경 생성 및 활성화
uv venv --python 3.11
.venv\Scripts\activate

# 필수 패키지 일괄 설치
uv pip install -r requirements.txt
```

### 2. 데이터 파이프라인 및 모델 학습 구동
지정된 원천 폴더 내 `data_source/loan.csv` 원본 파일을 학습에 알맞은 크기로 정제 및 파인튜닝하고, 성능 검증 보고서 및 시각화 파일을 일괄 생성합니다.
```bash
# M1 데이터 전처리 및 텍스트 프롬프트 직렬화 (test_processed.csv 등 빌드)
.venv\Scripts\python -c "from credit_system.pipeline import CreditDataPipeline; p = CreditDataPipeline(r'data_source/loan.csv', sample_size=15000); p.run_pipeline()"

# M2 모델 학습 (LightGBM 베이스라인 학습 & sLLM QLoRA 모델 구축)
.venv\Scripts\python -m credit_system.train

# 두 모델 간 예측력 정밀 대조 및 차트/보고서 생성
.venv\Scripts\python -m credit_system.evaluate
```

### 3. FastAPI 백엔드 API 서버 구동
```bash
.venv\Scripts\python -m credit_system.server
# 서버 기동 완료: http://127.0.0.1:8000
# Swagger API 문서 주소: http://127.0.0.1:8000/docs
```

### 4. React 프론트엔드 기동
```bash
cd frontend
npm install
npm run dev
# 프론트엔드 실행 주소: http://localhost:5173
```
*브라우저로 `http://localhost:5173`에 접속하면 세련된 신용평가 시스템 화면과 실시간 연동을 체험할 수 있습니다.*

---

## 🐳 Docker 컨테이너 및 GCP Cloud Run 배포 가이드

본 프로젝트는 프론트엔드 정적 빌드 파일(`frontend/dist`)을 FastAPI 백엔드 파이썬 서버에서 단일 포트로 서빙하도록 통합 설계되었습니다.

따라서 멀티스테이지 Dockerfile을 활용하여, **유저 로컬 컴퓨터의 노드 버전과 완전히 독립된 환경**에서 빌드하고 GCP Cloud Run에 한 방에 배포할 수 있습니다.

### Docker 빌드 및 로컬 테스트
```bash
# Docker 이미지 빌드
docker build -t css-rating-app .

# 로컬에서 Docker 컨테이너 가동 (포트 8080 서빙)
docker run -p 8080:8080 -e PORT=8080 css-rating-app
# http://localhost:8080 에 접속하면 프론트엔드와 백엔드가 결합된 풀스택 통합 배포본이 동작합니다.
```

### GCP Cloud Run 배포 명령어
```bash
# 구글 클라우드에 직접 로컬 소스 빌드 및 서비스 배포 요청
gcloud run deploy css-rating-service \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

---

*본 프로젝트는 HWK 신규사업부의 1차 PoC/프로토타입 범위 완수를 목표로 설계 및 제작되었습니다.*
