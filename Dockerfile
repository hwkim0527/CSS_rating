# ==========================================
# STAGE 1: Frontend Build using Node.js
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# 의존성 복사 및 설치
COPY frontend/package*.json ./
RUN npm install

# 소스코드 복사 및 정적 빌드 수행 (클라우드 환경에서 안정적 빌드 보장)
COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Python Backend Serving Runtime
# ==========================================
FROM python:3.11-slim
WORKDIR /app

# LightGBM 가동에 필수적인 시스템 라이브러리(libgomp) 및 C++ 런타임 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 파이썬 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 백엔드 소스코드 및 학습된 모델 아티팩트 복사
COPY credit_system/ ./credit_system/
COPY data_source/ ./data_source/

# 1단계 빌더 스테이지에서 생성된 프론트엔드 dist 정적 리소스를 백엔드가 마운트하는 경로로 안전 복사
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 포트 노출 (GCP Cloud Run 디폴트 포트)
EXPOSE 8080

# 백엔드 서버 구동 (PORT 환경변수를 수신하여 실행)
CMD ["sh", "-c", "uvicorn credit_system.server:app --host 0.0.0.0 --port ${PORT:-8080}"]
