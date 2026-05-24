const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak, TableOfContents
} = require('docx');

// ---- Helpers ----
const FONT = "맑은 고딕";
const border = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: border, bottom: border, left: border, right: border };

const p = (text, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 80, line: 320 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  ...opts.paraOpts,
  children: [new TextRun({ text, font: FONT, size: opts.size || 22, bold: opts.bold, italics: opts.italics, color: opts.color })]
});

const bullet = (text, ref = "bul", level = 0) => new Paragraph({
  numbering: { reference: ref, level },
  spacing: { before: 40, after: 40, line: 300 },
  children: [new TextRun({ text, font: FONT, size: 22 })]
});

const num = (text, ref) => new Paragraph({
  numbering: { reference: ref, level: 0 },
  spacing: { before: 40, after: 40, line: 300 },
  children: [new TextRun({ text, font: FONT, size: 22 })]
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  children: [new TextRun({ text, font: FONT, size: 32, bold: true, color: "1F3A5F" })]
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 280, after: 140 },
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: "2C5282" })]
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 },
  children: [new TextRun({ text, font: FONT, size: 23, bold: true, color: "2D3748" })]
});

const cell = (text, opts = {}) => new TableCell({
  borders: cellBorders,
  width: { size: opts.w || 2340, type: WidthType.DXA },
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
  verticalAlign: VerticalAlign.CENTER,
  children: (Array.isArray(text) ? text : [text]).map(t =>
    new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text: t, font: FONT, size: opts.size || 20, bold: opts.bold })]
    })
  )
});

const headerCell = (text, w) => cell(text, { w, fill: "2C5282", bold: true, align: AlignmentType.CENTER, size: 20 });

// ---- Tables ----
const moduleTable = new Table({
  columnWidths: [1500, 2600, 2600, 2660],
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell("모듈", 1500),
        headerCell("입력", 2600),
        headerCell("핵심 처리", 2600),
        headerCell("출력", 2660),
      ]
    }),
    new TableRow({ children: [
      cell("M1\n데이터\n파이프라인", { w: 1500, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("원천 CSV/Parquet (raw_data/)", { w: 2600 }),
      cell("스키마 검증·결측치 처리·범주형 인코딩·피처엔지니어링·텍스트직렬화·train/val/test 분할", { w: 2600 }),
      cell("학습용 데이터셋 (processed_data/)", { w: 2660 }),
    ]}),
    new TableRow({ children: [
      cell("M2\n모델 관리\n학습", { w: 1500, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("HuggingFace 모델 ID, 하이퍼파라미터, 학습 데이터셋", { w: 2600 }),
      cell("모델 다운로드·LoRA/QLoRA 어댑터 학습·체크포인트 저장·실험 로깅", { w: 2600 }),
      cell("학습된 어댑터·평가 메트릭·MLflow 로그", { w: 2660 }),
    ]}),
    new TableRow({ children: [
      cell("M3\n추론·\n점수산출", { w: 1500, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("개인 신용정보·개인정보 JSON", { w: 2600 }),
      cell("프롬프트 직렬화·sLLM 추론·부실확률→1000점 척도 변환·신용등급 부여", { w: 2600 }),
      cell("부실가능성 점수, 신용등급(A~F), 신뢰구간", { w: 2660 }),
    ]}),
    new TableRow({ children: [
      cell("M4\n설명가능성\n(XAI)", { w: 1500, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("개인 데이터 + M3 점수", { w: 2600 }),
      cell("SHAP·LIME·어텐션 시각화·LLM 자가설명·반사실 시나리오 생성", { w: 2600 }),
      cell("4가지 형식의 설명 리포트(HTML/PDF)", { w: 2660 }),
    ]}),
  ]
});

const phaseTable = new Table({
  columnWidths: [1200, 1400, 4000, 2760],
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  rows: [
    new TableRow({ tableHeader: true, children: [
      headerCell("단계", 1200),
      headerCell("기간", 1400),
      headerCell("주요 산출물", 4000),
      headerCell("검증 게이트", 2760),
    ]}),
    new TableRow({ children: [
      cell("Phase 0\n기획·인프라", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("1~2주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("요구사항 정의서·GPU 인프라 셋업·Git/MLflow/DVC 환경·코드 컨벤션", { w: 4000 }),
      cell("PoC 환경 동작, GPU 가용", { w: 2760 }),
    ]}),
    new TableRow({ children: [
      cell("Phase 1\n데이터 파이프라인", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("3~5주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("M1 모듈 구현·Lending Club 데이터 정제·post-origination 변수 차단·텍스트 직렬화 템플릿", { w: 4000 }),
      cell("재현 가능한 학습셋, 누수 0건", { w: 2760 }),
    ]}),
    new TableRow({ children: [
      cell("Phase 2\n베이스라인", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("6~7주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("LightGBM/XGBoost 베이스라인·AUC/KS/PSI 측정·비교 기준 확정", { w: 4000 }),
      cell("AUC ≥ 0.70 (정량 기준)", { w: 2760 }),
    ]}),
    new TableRow({ children: [
      cell("Phase 3\nsLLM 학습", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("8~12주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("M2 모듈·HF 모델 자동 다운로드·QLoRA 학습 파이프라인·하이퍼파라미터 튜닝", { w: 4000 }),
      cell("베이스라인 대비 AUC 우위 or 동등", { w: 2760 }),
    ]}),
    new TableRow({ children: [
      cell("Phase 4\n추론·점수화", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("13~14주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("M3 모듈·점수 변환 로직(부실확률→1000점)·등급체계·API 서버", { w: 4000 }),
      cell("API 응답 < 2초, 등급분포 합리성", { w: 2760 }),
    ]}),
    new TableRow({ children: [
      cell("Phase 5\nXAI", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("15~17주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("M4 모듈·SHAP/LIME/어텐션/LLM자가설명/반사실 5종 설명", { w: 4000 }),
      cell("설명 일관성·법규 부합성 검토", { w: 2760 }),
    ]}),
    new TableRow({ children: [
      cell("Phase 6\n통합·검증", { w: 1200, bold: true, fill: "EDF2F7", align: AlignmentType.CENTER }),
      cell("18~20주차", { w: 1400, align: AlignmentType.CENTER }),
      cell("E2E 통합테스트·성능/안정성·모델 모니터링(드리프트)·문서화", { w: 4000 }),
      cell("UAT 통과, 컴플라이언스 검토 완료", { w: 2760 }),
    ]}),
  ]
});

const riskTable = new Table({
  columnWidths: [2200, 1600, 1600, 3960],
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  rows: [
    new TableRow({ tableHeader: true, children: [
      headerCell("리스크", 2200),
      headerCell("발생가능성", 1600),
      headerCell("영향도", 1600),
      headerCell("완화 방안", 3960),
    ]}),
    new TableRow({ children: [
      cell("데이터 누수 (post-origination 변수 혼입)", { w: 2200 }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("M1에 변수 블랙리스트 강제 적용, 자동 검증 테스트 포함", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("미국(LC) ↔ 한국 데이터 도메인 갭", { w: 2200 }),
      cell("높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("PoC=LC, 본운영=KCB/NICE 데이터 추가 통합 단계 별도 수립", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("sLLM이 트리모델 대비 열위", { w: 2200 }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("베이스라인 병행 운영, 하이브리드(앙상블) 옵션 확보", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("개인정보·신용정보 유출", { w: 2200 }),
      cell("저", { w: 1600, align: AlignmentType.CENTER }),
      cell("매우 높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("학습 데이터 가명처리, 접근통제, 학습 결과물에 PII 비유출 검증", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("LLM 환각(hallucination) 기반 점수 왜곡", { w: 2200 }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("출력 형식 강제(JSON schema), 후처리 검증, 신뢰구간 함께 산출", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("규제 변경(AI 기본법·신정법 개정)", { w: 2200 }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("법무팀 정기 검토, 설명가능성 산출물 표준화로 대응력 확보", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("모델 드리프트(시간 경과로 성능 저하)", { w: 2200 }),
      cell("높음", { w: 1600, align: AlignmentType.CENTER, fill: "FED7D7" }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("PSI 모니터링·분기 재학습 자동화·챔피언/챌린저 운영", { w: 3960 }),
    ]}),
    new TableRow({ children: [
      cell("GPU 비용·인프라 한계", { w: 2200 }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("중", { w: 1600, align: AlignmentType.CENTER }),
      cell("QLoRA 4bit 양자화, 학습은 클라우드 스팟·추론은 온프레미스 분리", { w: 3960 }),
    ]}),
  ]
});

const xaiTable = new Table({
  columnWidths: [1800, 3200, 2680, 1680],
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  rows: [
    new TableRow({ tableHeader: true, children: [
      headerCell("XAI 방법", 1800),
      headerCell("설명 방식", 3200),
      headerCell("대상", 2680),
      headerCell("도구", 1680),
    ]}),
    new TableRow({ children: [
      cell("① SHAP", { w: 1800, bold: true, align: AlignmentType.CENTER }),
      cell("각 변수가 점수에 얼마나 +/- 영향을 줬는지 기여도 정량화", { w: 3200 }),
      cell("심사역·리스크관리자", { w: 2680 }),
      cell("shap", { w: 1680, align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      cell("② LIME", { w: 1800, bold: true, align: AlignmentType.CENTER }),
      cell("국소적 선형 근사로 개별 의사결정 요인 추출", { w: 3200 }),
      cell("심사역", { w: 2680 }),
      cell("lime", { w: 1680, align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      cell("③ 어텐션 시각화", { w: 1800, bold: true, align: AlignmentType.CENTER }),
      cell("sLLM이 어느 입력 토큰(변수)에 주목했는지 히트맵으로 표시", { w: 3200 }),
      cell("모델 개발자·내부감사", { w: 2680 }),
      cell("BertViz, captum", { w: 1680, align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      cell("④ LLM 자가 설명", { w: 1800, bold: true, align: AlignmentType.CENTER }),
      cell("\"왜 이 점수인가\"를 sLLM이 자연어로 설명 (소비자 친화)", { w: 3200 }),
      cell("최종 소비자·민원 대응", { w: 2680 }),
      cell("prompt template", { w: 1680, align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      cell("⑤ 반사실 설명", { w: 1800, bold: true, align: AlignmentType.CENTER }),
      cell("\"X가 Y였다면 점수는 Z만큼 변함\" 시나리오 (개선 가이드)", { w: 3200 }),
      cell("최종 소비자·신용상담", { w: 2680 }),
      cell("DiCE, alibi", { w: 1680, align: AlignmentType.CENTER }),
    ]}),
  ]
});

const stackTable = new Table({
  columnWidths: [2200, 7240],
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  rows: [
    new TableRow({ tableHeader: true, children: [
      headerCell("계층", 2200),
      headerCell("권장 스택", 7240),
    ]}),
    new TableRow({ children: [
      cell("언어·런타임", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("Python 3.11+, CUDA 12.x", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("데이터 처리", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("pandas, polars, pyarrow, scikit-learn, pydantic(스키마)", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("모델·학습", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("transformers, peft(LoRA/QLoRA), trl(SFT/DPO), bitsandbytes, accelerate, datasets", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("베이스라인", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("LightGBM, XGBoost, scikit-learn(LogReg)", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("XAI", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("shap, lime, captum, DiCE, BertViz", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("서빙", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("FastAPI, vLLM(추론최적화), Uvicorn, Docker", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("실험·버전관리", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("MLflow, DVC, Weights & Biases(선택), Git", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("모니터링", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("Evidently AI(드리프트), Prometheus + Grafana", { w: 7240 }),
    ]}),
    new TableRow({ children: [
      cell("인프라(권장)", { w: 2200, bold: true, fill: "EDF2F7" }),
      cell("학습: A100 40GB×1 또는 RTX 4090×2 / 추론: A10·L4 또는 양자화 후 RTX 4090", { w: 7240 }),
    ]}),
  ]
});

const schemaTable = new Table({
  columnWidths: [2400, 1800, 5240],
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  rows: [
    new TableRow({ tableHeader: true, children: [
      headerCell("범주", 2400),
      headerCell("대표 변수", 1800),
      headerCell("설명·처리 방침", 5240),
    ]}),
    new TableRow({ children: [
      cell("기본정보", { w: 2400, bold: true, fill: "EDF2F7" }),
      cell("emp_length, home_ownership, annual_inc, verification_status", { w: 1800 }),
      cell("범주형 인코딩, 결측치는 별도 카테고리", { w: 5240 }),
    ]}),
    new TableRow({ children: [
      cell("대출조건", { w: 2400, bold: true, fill: "EDF2F7" }),
      cell("loan_amnt, term, int_rate, installment, grade, sub_grade, purpose", { w: 1800 }),
      cell("학습 피처 사용 가능 (신청시점 변수)", { w: 5240 }),
    ]}),
    new TableRow({ children: [
      cell("신용이력", { w: 2400, bold: true, fill: "EDF2F7" }),
      cell("dti, delinq_2yrs, earliest_cr_line, fico_range_*, inq_last_6mths, open_acc, pub_rec, revol_util, total_acc", { w: 1800 }),
      cell("핵심 예측 피처. earliest_cr_line은 신용연령으로 변환", { w: 5240 }),
    ]}),
    new TableRow({ children: [
      cell("타겟 변수", { w: 2400, bold: true, fill: "FFF5B7" }),
      cell("loan_status", { w: 1800 }),
      cell("이진 매핑: 부실=Charged Off/Default/Late 31-120일, 정상=Fully Paid, 제외=Current/In Grace/Late <31일", { w: 5240 }),
    ]}),
    new TableRow({ children: [
      cell("⚠ 사용금지 (data leakage)", { w: 2400, bold: true, fill: "FED7D7" }),
      cell("total_pymnt, total_rec_*, recoveries, last_pymnt_*, out_prncp, collection_recovery_fee, hardship_*", { w: 1800 }),
      cell("대출 실행 이후 발생 변수 — 학습 피처로 사용 시 가짜 성능 발생. M1에서 강제 차단", { w: 5240 }),
    ]}),
  ]
});

// ---- Lists & numbering refs ----
const numberingConfig = {
  config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
    ]},
    { reference: "goals", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]},
    { reference: "criteria", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1)", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]},
    { reference: "deliv", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]},
  ]
};

// ---- Content ----
const children = [];

// Title page
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 2400, after: 200 },
  children: [new TextRun({ text: "신용평가시스템 개발 계획서", font: FONT, size: 52, bold: true, color: "1F3A5F" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 800 },
  children: [new TextRun({ text: "sLLM 기반 부실가능성 예측 및 설명 시스템", font: FONT, size: 28, color: "4A5568" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 400, after: 100 },
  children: [new TextRun({ text: "NR캐피탈 신규사업 — 신용평가시스템 개발", font: FONT, size: 22, color: "2D3748" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [new TextRun({ text: "작성일: 2026-05-22", font: FONT, size: 20, color: "718096" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "버전: v1.0 (개발 계획 초안)", font: FONT, size: 20, color: "718096" })]
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

// 1. 개요
children.push(h1("1. 개요 및 사업 목표"));
children.push(h2("1.1 사업 배경"));
children.push(p("본 사업은 개인 신용정보를 기반으로 부실가능성(default probability)을 산출하고, 그 산출 근거를 다각도로 설명하는 신용평가시스템을 자체 개발하는 데 목적이 있다. 기존 외부 신용평가사(KCB·NICE) 의존도를 낮추고, 당사의 대출 포트폴리오 특성에 최적화된 내부 평가 모델을 보유함으로써 심사 정확도 향상과 리스크 관리 고도화를 동시에 달성한다."));
children.push(h2("1.2 핵심 기능 (4대 요구사항)"));
children.push(num("원천 데이터(raw)를 지정 폴더에 입력하면 자동으로 학습용 데이터로 변환하는 데이터 파이프라인 기능", "goals"));
children.push(num("HuggingFace에 공개된 우수한 sLLM(소형 언어모델)을 지정하면 자동 다운로드 후 즉시 학습용 데이터로 파인튜닝을 수행하는 모델 학습 기능", "goals"));
children.push(num("개인의 신용정보·개인정보를 입력하면 부실가능성을 점수(score)로 산출하여 제공하는 추론 기능", "goals"));
children.push(num("산출된 점수를 다양한 방법(통계적 기여도·시각화·자연어·반사실 시나리오)으로 설명하는 XAI(설명가능 AI) 기능", "goals"));
children.push(h2("1.3 성공 기준 (Acceptance Criteria)"));
children.push(num("베이스라인(LightGBM) 대비 ROC-AUC 동등 이상 (목표 0.75↑, 최소 0.70)", "criteria"));
children.push(num("Lending Club PoC 데이터에서 KS 통계량 0.30↑", "criteria"));
children.push(num("단건 추론 응답 시간 2초 이내 (양자화 후 추론 기준)", "criteria"));
children.push(num("4종 이상의 설명 방식이 동일 의사결정에 대해 일관된 결론 제시", "criteria"));
children.push(num("재현 가능한 학습 파이프라인 (동일 시드·동일 데이터 → 동일 결과)", "criteria"));

// 2. 시스템 아키텍처
children.push(h1("2. 시스템 아키텍처"));
children.push(h2("2.1 전체 구성도"));
children.push(p("시스템은 4개의 핵심 모듈과 공통 인프라(스토리지·실험관리·모니터링)로 구성된다. 사용자는 ① 원천 데이터를 raw_data/ 폴더에 적재 → ② config 파일에서 HuggingFace 모델 ID 지정 → ③ 학습 명령 실행 → ④ 학습 완료 후 추론 API로 개인 데이터 입력 → ⑤ 점수와 설명 리포트 수령의 순서로 사용한다."));
children.push(p(""));
children.push(p("[데이터 흐름]", { bold: true }));
children.push(bullet("raw_data/ → M1(데이터 파이프라인) → processed_data/"));
children.push(bullet("processed_data/ + HF Model ID → M2(모델 관리·학습) → trained_adapter/"));
children.push(bullet("개인 신용정보 JSON + trained_adapter/ → M3(추론) → 점수·등급"));
children.push(bullet("점수·입력데이터 → M4(XAI) → 설명 리포트 (5종)"));
children.push(h2("2.2 모듈 매트릭스"));
children.push(moduleTable);

// 3. 모듈별 상세 설계
children.push(h1("3. 모듈별 상세 설계"));

children.push(h2("3.1 M1 — 데이터 파이프라인 (원천 → 학습용 변환)"));
children.push(h3("3.1.1 기능"));
children.push(bullet("raw_data/ 폴더 감시(파일 시스템 watcher 또는 CLI trigger)"));
children.push(bullet("CSV·Parquet·Excel 등 다양한 입력 포맷 자동 인식"));
children.push(bullet("pydantic 기반 스키마 검증 (필수 컬럼·타입 체크)"));
children.push(bullet("결측치 처리(범주형은 'Unknown' 카테고리, 수치형은 중앙값 또는 -1 플래그)"));
children.push(bullet("이상치 제거 (IQR·도메인 룰)"));
children.push(bullet("피처 엔지니어링 (신용연령, DTI 변환, 비율 변수 생성 등)"));
children.push(bullet("타겟 변수 이진 매핑 (부실/정상)"));
children.push(bullet("⚠ post-origination 변수 강제 차단 (블랙리스트)"));
children.push(bullet("Tabular → Text 직렬화 (sLLM 학습용 프롬프트 변환)"));
children.push(bullet("train/validation/test 분할 (시간 분할 권장, 8:1:1)"));
children.push(bullet("processed_data/ 폴더에 결과 저장 + 메타데이터(version, schema_hash)"));
children.push(h3("3.1.2 Tabular → Text 직렬화 템플릿 (예시)"));
children.push(p("[자연어 직렬화 예]", { bold: true }));
children.push(p("\"이 대출 신청자는 연소득 55,000달러이며 임차주거에 거주합니다. 신청 대출 금액은 2,500달러, 기간 36개월, 금리 13.56%입니다. DTI(부채상환비율)는 18.24%이며 FICO 점수 구간은 670-674입니다. 최근 6개월간 신용조회는 1건이고, 보유 신용계좌 9개 중 모두 정상입니다. 대출 목적은 부채 통합입니다.\""));
children.push(h3("3.1.3 핵심 인터페이스"));
children.push(bullet("CLI: python -m credit_system.pipeline ingest --input raw_data/ --output processed_data/"));
children.push(bullet("API: PipelineRunner(config).process() → ProcessedDataset"));

children.push(h2("3.2 M2 — 모델 관리 및 학습 (HuggingFace 통합)"));
children.push(h3("3.2.1 기능"));
children.push(bullet("config.yaml 또는 CLI에서 HuggingFace model_id 입력 (예: meta-llama/Llama-3.2-3B-Instruct)"));
children.push(bullet("huggingface_hub로 모델·토크나이저 자동 다운로드 및 캐시"));
children.push(bullet("라이선스 자동 점검(상업이용 가능 여부 경고)"));
children.push(bullet("QLoRA 4bit 양자화 적용 (메모리 절감)"));
children.push(bullet("LoRA 어댑터 학습 (target_modules는 모델별 자동 추론)"));
children.push(bullet("trl SFTTrainer로 instruction-tuning 방식 학습"));
children.push(bullet("학습 중 평가 메트릭 자동 측정 (loss, AUC on val set)"));
children.push(bullet("MLflow에 실험·하이퍼파라미터·메트릭·아티팩트 로깅"));
children.push(bullet("체크포인트 저장 및 best model 자동 선택"));
children.push(h3("3.2.2 모델 선정 기준 (특정 모델명 비지정)"));
children.push(p("모델 생태계는 빠르게 진화하므로 특정 모델명을 박제하지 않고, 다음 조건을 만족하는 모델을 우선 후보로 한다."));
children.push(bullet("파라미터 규모: 1B ~ 7B (학습·서빙 비용 균형)"));
children.push(bullet("라이선스: 상업 이용 가능 (Apache 2.0, MIT, Llama Community License 등)"));
children.push(bullet("LoRA/QLoRA 지원 및 PEFT 호환"));
children.push(bullet("토크나이저: 한국어 및 영어 모두 양호한 처리"));
children.push(bullet("우대: 금융·instruction-tuned variant 또는 한국어 특화 모델"));
children.push(bullet("PoC 단계 후보군 예시: Qwen 계열, Llama 계열, Phi 계열, 한국어 sLLM(SOLAR·EEVE 등) — 시점별 벤치마크에 따라 갱신"));
children.push(h3("3.2.3 핵심 인터페이스"));
children.push(bullet("CLI: python -m credit_system.train --model_id <HF_ID> --dataset processed_data/ --output trained_adapter/"));
children.push(bullet("config: model_id, lr, epochs, batch_size, lora_r, lora_alpha, max_seq_len"));

children.push(h2("3.3 M3 — 추론 및 점수 산출"));
children.push(h3("3.3.1 기능"));
children.push(bullet("개인 신용정보·개인정보 JSON 입력 (M1 스키마와 동일)"));
children.push(bullet("M1 직렬화 템플릿으로 자연어 프롬프트 변환"));
children.push(bullet("학습된 sLLM 어댑터로 부실확률 산출 (출력 JSON schema 강제)"));
children.push(bullet("확률 → 1000점 척도 변환 (예: 부실확률 1% = 950점, 30% = 350점, 로지스틱 매핑)"));
children.push(bullet("신용등급 부여 (A: 900↑, B: 800-899, C: 700-799, D: 600-699, E: 500-599, F: 499↓)"));
children.push(bullet("Monte Carlo dropout 또는 캘리브레이션으로 신뢰구간 산출"));
children.push(bullet("FastAPI 기반 REST 엔드포인트 제공"));
children.push(h3("3.3.2 출력 스키마 (예시 JSON)"));
children.push(p("{ \"score\": 742, \"grade\": \"C\", \"default_probability\": 0.087, \"confidence_interval_95\": [0.071, 0.104], \"model_version\": \"v0.3-qwen-3b-lora\", \"explanation_url\": \"/explain/req_abc123\" }"));

children.push(h2("3.4 M4 — 설명가능성 (XAI)"));
children.push(h3("3.4.1 5종 설명 방식"));
children.push(xaiTable);
children.push(h3("3.4.2 통합 리포트"));
children.push(bullet("HTML 대시보드: 5종 설명을 탭으로 통합 제공"));
children.push(bullet("PDF 리포트: 민원·심사 보고용 인쇄 양식"));
children.push(bullet("JSON API: 외부 시스템 연동용 구조화 데이터"));

// 4. 기술 스택
children.push(h1("4. 기술 스택 및 인프라"));
children.push(stackTable);

// 5. 개발 단계
children.push(h1("5. 개발 단계 및 일정"));
children.push(p("총 20주(약 5개월) 일정으로 7단계 진행. 각 단계는 검증 게이트 통과 시에만 다음 단계로 진행한다."));
children.push(phaseTable);

// 6. 데이터 스키마
children.push(h1("6. 데이터 스키마 (PoC: Lending Club 기반)"));
children.push(p("data_source/loan.csv (Lending Club 2007-2018, 약 89만건·150여개 변수)를 PoC 데이터로 사용한다. 본 시스템의 학습용 데이터 스키마는 아래와 같이 정의한다."));
children.push(schemaTable);
children.push(p(""));
children.push(p("※ 본운영 단계에서는 한국 신용정보(KCB/NICE, 4대보험, 카드대금, 통신비 등)와 변수체계가 상이하므로, 별도의 도메인 매핑·통합 단계가 필요하다. 본 계획서는 PoC/프로토타입 단계까지를 1차 범위로 한다.", { bold: true, color: "8B0000" }));

// 7. 규제·컴플라이언스
children.push(h1("7. 규제 및 컴플라이언스"));
children.push(h2("7.1 적용 법규"));
children.push(bullet("개인정보 보호법 (개인정보 수집·이용·제공·파기)"));
children.push(bullet("신용정보의 이용 및 보호에 관한 법률 (신용정보 수집·평가모형 검증·자동화된 평가에 대한 설명요구권)"));
children.push(bullet("정보통신망 이용촉진 및 정보보호 등에 관한 법률"));
children.push(bullet("AI 기본법 (향후 시행 시): 고위험 AI 시스템 분류 가능성"));
children.push(bullet("금감원 「개인신용평가체계 모범규준」"));
children.push(h2("7.2 필수 준수 사항"));
children.push(bullet("학습 데이터 가명·익명처리 (개인식별정보 분리)"));
children.push(bullet("자동화된 평가 결과에 대한 설명요구권 대응 → M4(XAI)로 충족"));
children.push(bullet("평가모형의 합리성 검증 자료 보존 (성능지표·검증보고서)"));
children.push(bullet("차별금지 변수(성별·인종·종교 등) 학습 피처 배제"));
children.push(bullet("정기적 모형 검증 및 재학습 이력 관리"));

// 8. 리스크
children.push(h1("8. 리스크 분석 및 완화 방안"));
children.push(riskTable);

// 9. 산출물
children.push(h1("9. 산출물 목록"));
children.push(num("요구사항 정의서 (RFP·SRS)", "deliv"));
children.push(num("시스템 아키텍처 설계서", "deliv"));
children.push(num("모듈별 상세 설계서 (M1~M4)", "deliv"));
children.push(num("데이터 파이프라인 코드 + 단위테스트", "deliv"));
children.push(num("학습 파이프라인 코드 (HF 통합 + QLoRA)", "deliv"));
children.push(num("추론 서버 코드 (FastAPI + Docker 이미지)", "deliv"));
children.push(num("XAI 모듈 코드 + 리포트 템플릿", "deliv"));
children.push(num("베이스라인 모델 vs sLLM 성능 비교 보고서", "deliv"));
children.push(num("모형 검증 보고서 (AUC/KS/PSI/캘리브레이션)", "deliv"));
children.push(num("운영 매뉴얼·재학습 SOP", "deliv"));
children.push(num("컴플라이언스 체크리스트 및 법무 검토서", "deliv"));
children.push(num("최종 시연용 데모 (Lending Club PoC 결과)", "deliv"));

// 10. 후속 과제
children.push(h1("10. PoC 이후 후속 과제 (Out of Scope)"));
children.push(p("아래 항목은 본 계획서 1차 범위에 포함되지 않으며, PoC 성공 시 별도 사업으로 추진한다."));
children.push(bullet("한국 신용정보(KCB·NICE) API 연동 및 변수 통합"));
children.push(bullet("당사 보유 내부 데이터(상환이력·연체이력) 학습 통합"));
children.push(bullet("운영 시스템(코어뱅킹·여신심사시스템) 연동"));
children.push(bullet("법무·금감원 사전협의 및 모형 승인 절차"));
children.push(bullet("실시간 데이터 파이프라인(스트리밍·CDC) 구축"));
children.push(bullet("멀티 모델 앙상블 및 챔피언/챌린저 운영체계"));

children.push(p(""));
children.push(p(""));
children.push(p("— 끝 —", { align: AlignmentType.CENTER, bold: true, color: "718096" }));

// ---- Build doc ----
const doc = new Document({
  numbering: numberingConfig,
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "1F3A5F", font: FONT },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "2C5282", font: FONT },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, color: "2D3748", font: FONT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "신용평가시스템 개발 계획서 v1.0", font: FONT, size: 18, color: "718096" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "- ", font: FONT, size: 18, color: "718096" }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: "718096" }),
          new TextRun({ text: " -", font: FONT, size: 18, color: "718096" })
        ]
      })] })
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("F:/Google_Driver/DK/NRcapital/신규사업/신용평가시스템개발/신용평가시스템_개발계획서.docx", buf);
  console.log("Done.");
});
