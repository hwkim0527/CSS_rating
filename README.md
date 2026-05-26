# 🛡️ HWK sLLM 신용평가 및 XAI 시스템 (CSS_rating)

본 시스템은 미국 P2P업체인 Lending Club의 고객 데이터를 학습데이터를 사용했고, sLLM인 `Qwen2.5-3B-Instruct`에 학습을 시켜, 대출 가능 여부를 결정하는 신용평가시스템을 구축해 보았습니다.

좀 더 시스템을 구체적으로 표현하면, 개인의 신용정보 및 대출 조건을 분석하여 부실가능성(Default Probability)을 정교하게 예측하고, 
산출된 최종 신용 점수(1000점 만점)와 등급(A~F)에 대한 명확한 사유를 5종 XAI(설명가능 AI)로 제공하는 엔터프라이즈급 신용평가 시뮬레이션 플랫폼입니다.

미국 신용관련 데이터로 학습시켰기때문에 미국외 고객에게는 맞지 않을 것으로 판단됩니다.

하지만, 전통적인 신용평가방법보다는 AI 도움을 받는 방법이 신용약자들에게 도움이 될 것으로 판단됩니다.

개인적으로 2019년도, Kaggle에서 처음 시도한 적(https://www.kaggle.com/code/hwkim0527/lendingclub-loananalysis)이 있는데, 그동안 급속한 AI발전으로 엄청난 성능의 평가시스템 개발되고 있고,
앞으로 더 빠른 AI발전으로 새로운 개발 기회가 열릴것 같습니다.

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

## 📊 모델 학습 및 성능 검증 보고서 연동

본 프로젝트의 학습에 피딩된 데이터 명세, 도입된 sLLM 모델 스펙 및 전통적 기계학습 모형 대비 sLLM의 독보적인 예측/설명 성능 우위성의 상세 대조 데이터는 아래의 별도 심층 보고서에서 상세히 확인하실 수 있습니다.

👉 **[모델 학습 및 성능 검증 보고서(학습_및_성능_대조_보고서.md)](file:///F:/project/신용평가시스템개발/학습_및_성능_대조_보고서.md)**

- **학습 데이터**: Lending Club 1.18GB 대용량 신용 이력 원천 데이터셋 (89만 observations)
- **도입 sLLM**: HuggingFace 최첨단 오픈소스 소형 지시 모델 `Qwen2.5-3B-Instruct`
- **핵심 성능 지표**: 전통 기계학습(LightGBM) 대비 **sLLM(QLoRA) ROC-AUC 12.11% 대폭 상승** 검증 완료

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

## ⚡ 실시간 라이브 데모 바로가기

[👉 HWK AI 신용평가 및 XAI 시스템 데모 사이트 접속하기](https://css-rating-service-884062692317.us-central1.run.app)
> [!IMPORTANT]
> GCP Cloud Run 서버리스 환경에 완전 무중단 자동 서빙 배포가 완료되어, 이제 인터넷이 연결된 어떤 장치에서든 상기 링크로 접속하여 직접 정교한 AI 신용 심사를 무제한 시연해 볼 수 있습니다.

---

## 💡 HWK AI 신용평가 시스템 간편 사용 가이드

누구나 웹 브라우저에서 실시간 라이브 데모 페이지에 접속하여 쉽고 정교한 신용 심사 과정을 직접 시뮬레이션해볼 수 있습니다.

### 1. 입력 정보 작성 요령
화면 좌측의 **신용 입력 폼(Credit Score Card Input)**에 아래 항목들을 기입합니다:
- **대출 신청 금액 (Loan Amount)**: 본인이 원하거나 테스트할 대출 원금을 입력합니다. (권장: `$5,000 ~ $40,000`)
- **FICO 신용 점수 (FICO Score)**: 개인 신용등급 평점입니다. (`300 ~ 850` 사이의 표준 점수를 입력합니다. 높을수록 우량군)
- **부채상환비율 (DTI Ratio)**: 연소득 대비 총 연간 부채 비율입니다. (%, 낮을수록 가점 요인, 권장: `10 ~ 35`)
- **연간 총소득 (Annual Income)**: 신청자의 1년 총수입입니다. (예: `$60,000`)
- **대출 금리 및 상환 조건**: 이자율(Int Rate, %) 및 월 상환액(Installment, $)을 필요 조건에 맞추어 기입합니다.

### 2. 5종 XAI 다차원 대시보드 리포트 확인하기
우측 하단의 **`신용 분석 실행`** 버튼을 누르면, 백엔드 AI 모듈이 가동되어 다음과 같은 고급 시각화 보고서가 즉시 생성됩니다:
* **실시간 AI 신용등급 게이지**: 산출된 1000점 만점 신용점수 및 A~F 최종 등급(Grade), 부실 확률(%)을 화려한 다크/네온 게이지로 즉각 제공합니다.
* **SHAP 변수 기여도 폭포 차트**: FICO 점수, DTI, 대출금리 등 어떤 개별 피처가 내 등급 상승에 기여했는지(가점 요소) 또는 하락을 유발했는지(감점 요소)를 기여도 가로막대 차트로 정밀하게 보여줍니다.
* **sLLM 심사역 의견서 (AI Natural Diagnosis)**: 미세조정(Fine-Tuning)된 AI 심사역이 개인의 신용 분석 요약과 리포트 총평을 **3줄 자연어 텍스트**로 타이핑 효과와 함께 자동 작성해 줍니다.
* **행동 교정 처방전 (Counterfactuals)**: 등급을 C에서 B, B에서 A로 한 단계 더 개선하기 위해 현실적으로 필요한 가상 개선 수치(예: *"부채비율(DTI)을 4.5% 낮추거나 신청 대출액을 $1,500 줄이면 신용등급이 상승합니다"*)를 시뮬레이션하여 처방전 카드 형식으로 추천해 줍니다.

---

*본 프로젝트는 HWK 신규사업부의 1차 PoC/프로토타입 범위 완수를 목표로 설계 및 제작되었습니다.*
