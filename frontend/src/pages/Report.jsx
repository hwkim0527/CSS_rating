import React, { useState, useEffect } from 'react';
import { 
  Database, Cpu, Lightbulb, Compass, ArrowRight, CheckCircle2, 
  AlertCircle, ShieldCheck, Flame, Network, Scale, Sparkles, BookOpen,
  TrendingUp, Layers, Zap, Play, RotateCcw, HelpCircle, ShieldAlert
} from 'lucide-react';

export default function Report() {
  const [activeTab, setActiveTab] = useState('data');
  const [animateProgress, setAnimateProgress] = useState(false);
  const [selectedSample, setSelectedSample] = useState('sample1');
  const [serializationStep, setSerializationStep] = useState('idle'); // idle, processing, done

  // 탭 전환 시 게이지 애니메이션 재트리거
  useEffect(() => {
    if (activeTab === 'comparison') {
      setAnimateProgress(false);
      const timer = setTimeout(() => setAnimateProgress(true), 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // 프롬프트 직렬화 시뮬레이터 로직
  const handleRunSerialization = () => {
    setSerializationStep('processing');
    const timer = setTimeout(() => {
      setSerializationStep('done');
    }, 1000);
  };

  useEffect(() => {
    setSerializationStep('idle');
  }, [selectedSample]);

  const tabs = [
    { id: 'data', label: '1. 학습 데이터셋', icon: <Database size={16} /> },
    { id: 'model', label: '2. 도입 sLLM 모델', icon: <Cpu size={16} /> },
    { id: 'training', label: '3. 미세조정(SFT) 방법', icon: <Flame size={16} /> },
    { id: 'comparison', label: '4. sLLM의 우위성', icon: <Scale size={16} /> }
  ];

  const samples = {
    sample1: {
      title: "👍 초우량 신용 신청자 (Low Risk)",
      features: {
        fico: "785점 (Excellent)",
        dti: "8.5% (최상급)",
        income: "$120,000 (약 1억 6천만 원)",
        delinq: "0회",
        inq: "0회",
        revol: "5.2% (통제 극대화)"
      },
      prompt: `[프롬프트 입력 데이터]
대출 신청자가 다음과 같은 개인 신용 정보를 제출하였습니다:
- FICO 신용 점수: 785점 (최우량 신용군)
- 총 소득 대비 부채 비중(DTI): 8.5% (여유 자금 극대화)
- 연간 총 소득: $120,000 (약 1억 6,000만 원)
- 최근 2년간 30일 이상 연체 횟수: 0회
- 최근 6개월 내 신용 조회 건수: 0회
- 리볼빙 신용 한도 소진율: 5.2% (우수 한도 통제)

위 차입자의 제반 정량 신용 변수 및 리스크 요인을 입체적으로 고려하여, 본 차입자의 36개월 내 부실 채무 불이행 가능성(Default Probability)을 계산해 0(정상상환) 또는 1(채무불이행)로 최종 스코어링 진단서를 발급하십시오.

[타겟 응답 레이블]
부실가능성(Default Probability): 0 (정상상환 유력군)
심사의견: 소득 기반의 상환 여력이 극대화되어 있으며 과거 연체 및 단기 한도 소진율이 완벽하게 통제된 우량 고객으로, 부실 리스크가 극히 미미하여 즉시 승인이 추천됨.`
    },
    sample2: {
      title: "⚠️ 중위험 다중조회 차입자 (Medium Risk)",
      features: {
        fico: "675점 (Fair)",
        dti: "24.8% (경계 단계)",
        income: "$45,000 (약 6,100만 원)",
        delinq: "1회 (최근 1.5년 전)",
        inq: "3회 (최근 6개월)",
        revol: "58.4% (한도 절반 소진)"
      },
      prompt: `[프롬프트 입력 데이터]
대출 신청자가 다음과 같은 개인 신용 정보를 제출하였습니다:
- FICO 신용 점수: 675점 (일반 신용군)
- 총 소득 대비 부채 비중(DTI): 24.8% (소득 대비 다소 높은 상환 부담)
- 연간 총 소득: $45,000 (약 6,100만 원)
- 최근 2년간 30일 이상 연체 횟수: 1회 (과거 30일 연체 이력 있음)
- 최근 6개월 내 신용 조회 건수: 3회 (단기 다중조회 경보)
- 리볼빙 신용 한도 소진율: 58.4% (카드 리볼빙 의존성 증가)

위 차입자의 제반 정량 신용 변수 및 리스크 요인을 입체적으로 고려하여, 본 차입자의 36개월 내 부실 채무 불이행 가능성(Default Probability)을 계산해 0(정상상환) 또는 1(채무불이행)로 최종 스코어링 진단서를 발급하십시오.

[타겟 응답 레이블]
부실가능성(Default Probability): 0 (정상상환 가능군 - 모니터링 필요)
심사의견: 최근 6개월 내 신용조회가 3회로 증가하고 카드 소진율이 상승세에 있어 유동성 관리가 중요합니다. 다만 과거 연체가 1회에 불과하고 소득 기반의 상환 한도 내에 있으므로 가산 금리 적용 하에 승인 가능.`
    },
    sample3: {
      title: "🚨 고위험 부실 임박자 (High Risk)",
      features: {
        fico: "590점 (Poor)",
        dti: "42.1% (부실 위험군)",
        income: "$32,000 (약 4,300만 원)",
        delinq: "3회",
        inq: "5회",
        revol: "92.7% (한도 고갈 상태)"
      },
      prompt: `[프롬프트 입력 데이터]
대출 신청자가 다음과 같은 개인 신용 정보를 제출하였습니다:
- FICO 신용 점수: 590점 (저신용 부실 위험군)
- 총 소득 대비 부채 비중(DTI): 42.1% (소득의 거의 절반이 부채 원리금)
- 연간 총 소득: $32,000 (약 4,300만 원)
- 최근 2년간 30일 이상 연체 횟수: 3회 (잦은 단기 연체 누적)
- 최근 6개월 내 신용 조회 건수: 5회 (긴급 다중채무 위기 징후)
- 리볼빙 신용 한도 소진율: 92.7% (한도 초과 임박으로 리스크 심각)

위 차입자의 제반 정량 신용 변수 및 리스크 요인을 입체적으로 고려하여, 본 차입자의 36개월 내 부실 채무 불이행 가능성(Default Probability)을 계산해 0(정상상환) 또는 1(채무불이행)로 최종 스코어링 진단서를 발급하십시오.

[타겟 응답 레이블]
부실가능성(Default Probability): 1 (채무불이행 예측군)
심사의견: 42%를 상회하는 DTI 비율과 한도 소진율 92.7%의 극한 대출 고갈 상태입니다. 연체가 빈번하고 단기 6개월 내 신용 조회가 5회에 달해 돌려막기 및 잠재 부실 확률이 극도로 높으므로 대출 불가(Reject) 판정이 타당함.`
    }
  };

  return (
    <div className="animated-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 프리미엄 주입식 CSS 스타일 */}
      <style>{`
        /* 네온 글로우 텍스트 효과 */
        .neon-text-cyan {
          color: var(--accent-cyan);
          text-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
        }
        .neon-text-purple {
          color: var(--accent-purple);
          text-shadow: 0 0 8px rgba(161, 140, 209, 0.4);
        }
        .neon-text-green {
          color: var(--accent-neon-green);
          text-shadow: 0 0 8px rgba(57, 255, 20, 0.4);
        }

        /* 3D 레이어 효과 */
        .perspective-container {
          perspective: 1000px;
        }
        .layered-card-stack {
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        .layered-card-stack:hover {
          transform: rotateY(5deg) rotateX(2deg);
        }

        /* 펄싱 무한 무빙 도트 애니메이션 */
        @keyframes flowLeftToRight {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        /* 데이터 누수 차단 애니메이션 */
        @keyframes safePacketFlow {
          0% { transform: translate(-30px, 0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(320px, 0); opacity: 0; }
        }
        @keyframes leakPacketFlow {
          0% { transform: translate(-30px, 0); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translate(140px, 0); opacity: 1; }
          60% { transform: translate(145px, 20px) rotate(45deg); opacity: 0.5; filter: blur(1px); }
          100% { transform: translate(150px, 50px) rotate(90deg); opacity: 0; }
        }
        @keyframes barrierPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 56, 96, 0.3), inset 0 0 5px rgba(255, 56, 96, 0.2); border-color: rgba(255, 56, 96, 0.4); }
          50% { box-shadow: 0 0 25px rgba(255, 56, 96, 0.7), inset 0 0 15px rgba(255, 56, 96, 0.5); border-color: rgba(255, 56, 96, 0.8); }
        }

        /* Attention 연결망 효과 */
        @keyframes attentionPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        @keyframes beamLight {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }

        .attention-node {
          animation: attentionPulse 3s infinite ease-in-out;
        }

        /* SFT 회전 파이프라인 효과 */
        @keyframes gearRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gear-rotating {
          animation: gearRotate 4s linear infinite;
        }

        /* 탭 버튼 프리미엄 테두리 활성화 */
        .tab-premium-btn {
          position: relative;
          overflow: hidden;
        }
        .tab-premium-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
          transition: var(--transition-smooth);
          transform: translateX(-50%);
        }
        .tab-premium-btn.active::after {
          width: 80%;
        }

        /* 데이터 전송 가상선 */
        .wire-beam {
          stroke: var(--accent-cyan);
          stroke-dasharray: 8, 4;
          animation: beamLight 1s linear infinite;
        }
      `}</style>

      {/* 타이틀 헤더 */}
      <div className="title-section" style={{ marginBottom: '50px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px 16px', 
          borderRadius: '20px', 
          background: 'rgba(0, 242, 254, 0.06)', 
          border: '1px solid rgba(0, 242, 254, 0.15)', 
          color: 'var(--accent-cyan)', 
          fontSize: '13px', 
          fontWeight: '600', 
          textTransform: 'uppercase', 
          letterSpacing: '1.5px', 
          marginBottom: '18px',
          boxShadow: 'inset 0 0 10px rgba(0, 242, 254, 0.05)'
        }}>
          <Sparkles size={14} style={{ filter: 'drop-shadow(0 0 3px var(--accent-cyan))' }} /> Technical Whitepaper & Report
        </div>
        <h1 style={{ letterSpacing: '-0.5px', fontSize: '42px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '15px' }}>
          모델 개발 및 학습 심층 보고서
        </h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          미국 Lending Club 대용량 개인 금융 원천 거래 정보를 기반으로 한 <strong>sLLM (QLoRA) 미세조정 알고리즘</strong>의 전처리 파이프라인, 아키텍처 토폴로지, 그리고 전통 트리 모델 대비 독보적인 변별 성능을 입증하는 정밀 대조 리포트입니다.
        </p>
      </div>

      {/* 프리미엄 탭 네비게이션 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        marginBottom: '45px', 
        borderBottom: '1px solid var(--border-glass)', 
        paddingBottom: '15px',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-premium-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{ 
              background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.02)' : 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '12px 12px 0 0',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'var(--transition-smooth)',
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: activeTab === tab.id ? '700' : '500'
            }}
          >
            <span style={{ color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 본문 콘텐츠 */}
      <div className="tab-content" style={{ minHeight: '550px' }}>
        
        {/* ---------------------------------------------------- */}
        {/* 1. 학습 데이터셋 설명 (Lending Club Dataset) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'data' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* 데이터 소개 대시보드 카드 */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database style={{ color: 'var(--accent-cyan)' }} size={24} />
                Lending Club 원천 데이터셋 상세 스펙 <span style={{ fontWeight: '300', color: 'var(--text-secondary)', fontSize: '16px' }}>(PoC Data Specification)</span>
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', marginBottom: '30px' }}>
                본 CSS AI 신용평가 파이프라인의 학습 기반이 된 원천 데이터는 글로벌 금융 핀테크 검증의 표준인 **미국 Lending Club 사의 1.18GB 대용량 거래 신용 정보(약 89만 명 누적 데이터)**입니다. 데이터셋에 내재된 불균형 문제를 해소하고 PoC 성능을 극대화하기 위해 15,000건의 정상 및 부실 균형 표본을 샘플링하여 독립된 학습(`train`), 검증(`val`), 테스트(`test`) 세트로 분할해 정합성을 확보했습니다.
              </p>

              {/* 스펙 인포그래픽 그리드 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '24px', textAlign: 'center', transition: 'var(--transition-smooth)', boxShadow: 'inset 0 0 15px rgba(255,255,255,0.01)' }} className="layered-card-stack">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>원천 데이터셋 크기</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', textShadow: '0 0 10px rgba(0, 242, 254, 0.2)' }}>1.18 GB</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>887,379 건의 차입자 금융 거래 이력</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '24px', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>피처(Feature) 차원 수</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--accent-blue)', fontFamily: 'var(--font-display)', textShadow: '0 0 10px rgba(79, 172, 254, 0.2)' }}>75 차원</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>과거 연체이력, 한도소진율, 신용도 등</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '24px', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>PoC 균형 추출 규모</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--accent-neon-green)', fontFamily: 'var(--font-display)', textShadow: '0 0 10px rgba(57, 255, 20, 0.2)' }}>15,000 건</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>상환 7,500건 vs 부실 7,500건 균형 설계</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '24px', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>학습/검증/테스트 스플릿</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-display)', textShadow: '0 0 10px rgba(161, 140, 209, 0.2)' }}>70 : 15 : 15</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>데이터 유실 없는 독립 분할 스키마</div>
                </div>
              </div>
            </div>

            {/* 데이터 누수(Data Leakage) 차단 인터랙티브 파이프라인 */}
            <div className="glass-card" style={{ borderColor: 'rgba(255, 56, 96, 0.2)', background: 'radial-gradient(ellipse at bottom, rgba(255, 56, 96, 0.02) 0%, transparent 80%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', color: 'var(--accent-neon-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} />
                  데이터 누수(Data Leakage) 원천 차단 파이프라인 시각화
                </h3>
                <span style={{ fontSize: '12px', background: 'rgba(255, 56, 96, 0.1)', color: 'var(--accent-neon-red)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255, 56, 96, 0.2)' }}>
                  금융 전처리 필수 보안 아키텍처
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
                신용 스코어링 학습 시 **대출 승인 이후 시점에 얻어지는 사후 정보**(`total_pymnt` - 상환총액, `recoveries` - 추심회수금 등)가 포함되면, 미래 정보의 혼입으로 정확도가 비정상적으로 높게 나오는 **데이터 누수(Data Leakage)** 현상이 유발되어 실제 대출 심사 시 대재앙이 됩니다. 본 파이프라인은 이들 사후 변수를 식별하고 원천 필터링(Drop-out)하여 강건한 실전 예측력을 보장합니다.
              </p>
              
              {/* 애니메이션 파이프라인 맵 */}
              <div style={{ 
                background: 'rgba(5, 7, 12, 0.6)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '12px', 
                padding: '30px 20px', 
                position: 'relative', 
                overflow: 'hidden',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                
                {/* 1. 수집원천 테이블 */}
                <div style={{ zIndex: 2, width: '130px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '10px' }}>
                  <Database size={24} style={{ color: 'var(--text-secondary)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>원천 거래 데이터</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>(75 Features)</div>
                </div>

                {/* 흐름 경로선 1 */}
                <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.05)', position: 'relative', margin: '0 10px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '-3px',
                    height: '10px',
                    width: '30px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-cyan))',
                    borderRadius: '5px',
                    animation: 'safePacketFlow 3.5s infinite linear'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '-3px',
                    height: '10px',
                    width: '30px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-neon-red))',
                    borderRadius: '5px',
                    animation: 'leakPacketFlow 3.5s infinite linear',
                    animationDelay: '1.2s'
                  }} />
                </div>

                {/* 2. 누수 탐지 필터 장벽 */}
                <div style={{ 
                  zIndex: 2, 
                  width: '180px', 
                  textAlign: 'center', 
                  background: 'rgba(255, 56, 96, 0.03)', 
                  border: '1px solid rgba(255, 56, 96, 0.4)', 
                  padding: '16px 12px', 
                  borderRadius: '12px',
                  animation: 'barrierPulse 2.5s infinite ease-in-out',
                  position: 'relative'
                }}>
                  <ShieldAlert size={26} style={{ color: 'var(--accent-neon-red)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--accent-neon-red)' }}>Leakage Blacklist Filter</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span style={{ color: '#ff809b', textDecoration: 'line-through' }}>total_pymnt</span><br />
                    <span style={{ color: '#ff809b', textDecoration: 'line-through' }}>recoveries</span>
                  </div>
                  <div style={{ position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: 'var(--accent-neon-red)', fontWeight: 'bold', animation: 'attentionPulse 1s infinite' }}>
                    BLOCKED & CRASHED
                  </div>
                </div>

                {/* 흐름 경로선 2 */}
                <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.05)', position: 'relative', margin: '0 10px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '-3px',
                    height: '10px',
                    width: '30px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-neon-green))',
                    borderRadius: '5px',
                    animation: 'safePacketFlow 3.5s infinite linear',
                    animationDelay: '0.8s'
                  }} />
                </div>

                {/* 3. 모델 피딩용 csv */}
                <div style={{ zIndex: 2, width: '140px', textAlign: 'center', background: 'rgba(0, 242, 254, 0.03)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '12px', borderRadius: '10px' }}>
                  <ShieldCheck size={24} style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--accent-cyan)' }}>안전한 사전 변수군</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>fico, dti, revol_util 등</div>
                </div>

              </div>
            </div>

            {/* 주요 변수 분석 카드 */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', marginBottom: '22px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ color: 'var(--accent-cyan)' }} size={20} />
                신용평가 최다 기여 6대 핵심 정량 지표 (Key Financial Metrics)
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>fico_score (FICO 평점)</span>
                    <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>민감도 1위</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>미국 개인 신용 평정 표준(300~850점). 차입자의 기초 리스크 척도로서 머신러닝 및 sLLM 양자 모두에서 가장 영향력이 큰 분별 인자입니다.</p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>dti (소득 대비 부채 비중)</span>
                    <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>상환 부하량</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>연 소득 대비 부채 연도 상환 총액 비중. 한계 부채가 누적되어 해당 수치가 30%를 상회할 시 부실 가능선(Default line)에 매우 기민하게 접근합니다.</p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>annual_inc (차입자 연 소득)</span>
                    <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>가용 재정원</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>차입자가 자가 등록한 연간 가용 소득. 급격한 금리 인상이나 한도 급증 등의 충격이 발생했을 때 상환 능력을 버텨내는 기초적인 재정 완충재 역할을 합니다.</p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>revol_util (리볼빙 소진율)</span>
                    <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>한도 압박도</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>보유 카드 한도 대비 실제 결제 미상환 사용 잔액 비율. 급전 융통이나 신용 경색 조짐이 있는 잠재 부실 고객에게서 선제적으로 급등하는 속성이 있습니다.</p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>delinq_2yrs (연체 발생 이력)</span>
                    <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>도덕적 해이</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>최근 24개월 내 30일 이상 만기 미상환 연체 누적 횟수. 차입자의 금융 도덕성(Financial Morality)을 입증하는 가장 직관적이고 뼈아픈 불이익 요인입니다.</p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>inq_last_6mths (단기 신용조회)</span>
                    <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>다중채무 전선</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>심사 직전 6개월 간 발생한 대출 기관용 신용 조회 수. 급격한 단기 조회량 급증은 다수의 사금융이나 카드론 유입의 강력한 우려 신호로 분류됩니다.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. 도입 sLLM 모델 정보 (HuggingFace sLLM) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'model' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* 모델 소개 메인 카드 */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(161, 140, 209, 0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu style={{ color: 'var(--accent-purple)' }} size={24} />
                허깅페이스 도입 최첨단 소형언어모델 <span style={{ fontWeight: '300', color: 'var(--text-secondary)', fontSize: '16px' }}>(sLLM Architecture Specifications)</span>
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', marginBottom: '30px' }}>
                본 PoC 시스템은 정밀한 다차원 금융 정량 계산과 심사역 수준의 맥락을 결합하기 위해 허깅페이스(HuggingFace) 저장소로부터 최적화 오픈소스 플래그십 sLLM인 **`Qwen/Qwen2.5-3B-Instruct`** 모델을 채택하여 도메인 특화 학습(Domain Alignment)을 구현했습니다.
              </p>

              {/* 모델 상세 스펙 카드 보드 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '10px' }}>
                
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '24px', position: 'relative' }} className="layered-card-stack">
                  <div style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--accent-purple)', opacity: 0.8 }}><Layers size={20} /></div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Core Engine Parameters</span>
                  <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '8px', marginBottom: '15px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Qwen2.5-3B-Instruct</div>
                  
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.8', listStyleType: 'none', paddingLeft: '0' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-purple)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-purple)' }} />
                      <strong>매개변수 규모</strong>: 3.09 Billion (약 31억 개)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-purple)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-purple)' }} />
                      <strong>컨텍스트 윈도우</strong>: 최대 128,000 토큰 (128K Window)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-purple)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-purple)' }} />
                      <strong>아키텍처</strong>: Grouped-Query Attention (GQA) & RoPE
                    </li>
                  </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '24px', position: 'relative' }} className="layered-card-stack">
                  <div style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--accent-cyan)', opacity: 0.8 }}><Zap size={20} /></div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Strategic Alignment Advantage</span>
                  <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '8px', marginBottom: '15px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>소형 고효율 아키텍처</div>
                  
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.8', listStyleType: 'none', paddingLeft: '0' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-cyan)' }} />
                      <strong>한국어 처리력</strong>: 동급 소형 모델 중 최상위 벤치마크 획득
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-cyan)' }} />
                      <strong>고속 온프레미스 추론</strong>: 3B 매개변수로 초당 60토큰 이상의 고속 처리
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-cyan)' }} />
                      <strong>정밀 프롬프팅 순응력</strong>: Instruct 튜닝으로 레이블 제어 안정성 극대화
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* 3D 느낌의 Transformer 적층 블록 및 어텐션 흐름 시각화 */}
            <div className="glass-card" style={{ background: 'rgba(10, 14, 26, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Network style={{ color: 'var(--accent-purple)' }} size={20} />
                  Transformer Attention Network & Token Flow Topology
                </h3>
                <span style={{ fontSize: '11px', background: 'rgba(161, 140, 209, 0.1)', color: 'var(--accent-purple)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(161, 140, 209, 0.2)' }}>
                  GQA(Grouped-Query Attention) 탑재
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' }}>
                전통적인 수치 분기 방식과 달리, sLLM은 수많은 변수들의 값과 직업, 목적 등 범주형 데이터 전체를 **금융 시나리오 토큰(Token)**으로 임베딩합니다. 임베딩된 텍스트 속 단어들은 아래의 트랜스포머 레이어 적층(Transformer Block Layers)을 지나며 **어텐션(Attention) 가중치망**에 의해 유기적으로 상호 참조 및 결합 연산이 이루어집니다. 이를 통해 단순히 숫자의 임계치를 넘는 다면적인 상환 신뢰도를 입체적으로 도출합니다.
              </p>

              {/* 입체적 트랜스포머 아키텍처 도식도 */}
              <div className="perspective-container" style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <div className="layered-card-stack" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '8px', 
                  width: '100%', 
                  maxWidth: '700px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  transform: 'rotateX(8deg)'
                }}>
                  
                  {/* 출력 레이어 */}
                  <div style={{ width: '90%', background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.1), rgba(79, 172, 254, 0.1))', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', boxShadow: 'var(--shadow-neon-cyan)' }}>
                    🎯 OUTPUT PROJECTION LAYER (Default Probability Logits)
                  </div>

                  {/* 연결선 */}
                  <div style={{ height: '20px', width: '2px', background: 'var(--accent-cyan)', opacity: 0.6 }} />

                  {/* 트랜스포머 레이어 블록 (36 Layers) */}
                  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* Layer 36 */}
                    <div style={{ width: '95%', background: 'rgba(161, 140, 209, 0.15)', border: '1px solid rgba(161, 140, 209, 0.4)', padding: '10px', borderRadius: '8px', fontSize: '11px', textAlign: 'center', color: '#e5e0f5', transform: 'translateZ(10px)', marginBottom: '4px', zIndex: 5 }}>
                      <strong>Transformer Layer 36 (Top Block)</strong> - Feed-Forward & GQA Attention
                    </div>
                    
                    {/* 중간 적층 점선 표시 */}
                    <div style={{ height: '40px', width: '92%', borderLeft: '2px dotted rgba(255,255,255,0.1)', borderRight: '2px dotted rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px', background: 'rgba(255,255,255,0.01)', margin: '4px 0', zIndex: 4 }}>
                      ⁞ (총 36개 동일 레이어 반복 적층 및 연산 피드백 루프) ⁞
                    </div>

                    {/* Layer 1 */}
                    <div style={{ width: '95%', background: 'rgba(161, 140, 209, 0.08)', border: '1px solid rgba(161, 140, 209, 0.2)', padding: '10px', borderRadius: '8px', fontSize: '11px', textAlign: 'center', color: '#c5bfe0', transform: 'translateZ(-10px)', marginTop: '4px', zIndex: 3 }}>
                      <strong>Transformer Layer 01 (Bottom Block)</strong> - Context Vector Embedding Alignment
                    </div>

                  </div>

                  {/* 연결선 */}
                  <div style={{ height: '20px', width: '2px', background: 'var(--accent-purple)', opacity: 0.6 }} />

                  {/* 입력 임베딩 레이어 */}
                  <div style={{ width: '90%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                    💻 INPUT TOKEN EMBEDDING LAYER (금융 전처리 텍스트 로드)
                  </div>

                  {/* 토큰 플로우 인포그래픽 애니메이션 라인 */}
                  <div style={{ width: '80%', display: 'flex', justifyContent: 'space-around', marginTop: '15px', borderTop: '1px solid var(--border-glass)', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span className="attention-node" style={{ width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px var(--accent-cyan)' }} />
                      FICO Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span className="attention-node" style={{ width: '8px', height: '8px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px var(--accent-purple)', animationDelay: '0.5s' }} />
                      DTI Ratio
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span className="attention-node" style={{ width: '8px', height: '8px', background: 'var(--accent-neon-green)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px var(--accent-neon-green)', animationDelay: '1s' }} />
                      Delinq History
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. 어떻게 학습을 시켰는지 구체적인 방법 설명 (QLoRA & SFT) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'training' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* QLoRA 스펙 설명 */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame style={{ color: 'var(--accent-neon-green)' }} size={24} />
                QLoRA 기반 지시 미세조정 <span style={{ fontWeight: '300', color: 'var(--text-secondary)', fontSize: '16px' }}>(Supervised Fine-Tuning Specification)</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', marginBottom: '30px' }}>
                서버 도입 리소스를 최소화하고 초소형 모형의 신용 스코어 가중치 주입 안정성을 최적화하기 위해, **4-bit NF4(Normal Float 4) 양자화**와 **LoRA(Low-Rank Adaptation) 기술**을 융합한 **QLoRA 기법**을 전격적으로 적용했습니다. 베이스 가중치는 동결(Frozen)하고 극소수 매개변수의 신규 어댑터(Adapter) 가중치만 미세 훈련시킴으로써 고속의 도메인 지식 습득에 성공했습니다.
              </p>

              {/* LoRA 상세 하이퍼파라미터 조건 보드 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '12px', borderBottom: '1px solid rgba(0, 242, 254, 0.1)', paddingBottom: '6px' }}>LoRA 가중치 파라미터</div>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.8', listStyleType: 'none', paddingLeft: '0' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>LoRA Rank (r)</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>16</span></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>LoRA Alpha</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>32</span></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>대상 타겟 모듈</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>q_proj, k_proj, v_proj, o_proj</span></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>LoRA Dropout</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>0.05</span></li>
                  </ul>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', transition: 'var(--transition-smooth)' }} className="layered-card-stack">
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--accent-purple)', marginBottom: '12px', borderBottom: '1px solid rgba(161, 140, 209, 0.1)', paddingBottom: '6px' }}>SFT 학습 설정 조건</div>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.8', listStyleType: 'none', paddingLeft: '0' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>옵티마이저</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>paged_adamw_8bit</span></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>학습률 (Learning Rate)</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>2e-4</span></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>학습 에폭 / 배치</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>3 Epochs / Batch Size 4</span></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>• <strong>스케줄러 웜업</strong>:</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Cosine (Warmup Ratio 0.03)</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* QLoRA 가중치 주입 메커니즘 시각화 */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers style={{ color: 'var(--accent-cyan)' }} size={20} />
                QLoRA (Base Weight 4-bit + Trainable Adapter) 결합 메커니즘
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
                QLoRA는 대형 베이스 가중치(Base Weight) 전체를 미세 튜닝하는 고비용 방식을 피합니다. 원래 가중치를 극도로 무손실에 가까운 **4-bit NF4 정밀도로 부동 소수 양자화(Quantization) 처리하여 단단히 고정(Frozen)**시켜 둡니다. 그리고 그 옆에 학습이 가능한 **가벼운 소수 계층의 행렬 어댑터(LoRA Weight A & B)를 병렬 주입**해 데이터 역전파 학습을 집중시킴으로써, 하드웨어 효율성과 지능 전이를 양자 모두 달성합니다.
              </p>

              {/* QLoRA 계산 그래픽 */}
              <div style={{ 
                background: 'rgba(5, 7, 12, 0.6)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '12px', 
                padding: '35px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                {/* 입력 벡터 */}
                <div style={{ border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', padding: '15px 12px', borderRadius: '10px', width: '130px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Input Activation</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>입력 활성화값 (X)</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-muted)' }}>
                  <ArrowRight size={20} style={{ transform: 'rotate(-25deg)' }} />
                  <ArrowRight size={20} style={{ transform: 'rotate(25deg)' }} />
                </div>

                {/* 두 갈래 연산 블록 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* 동결 베이스 가중치 */}
                  <div style={{ background: 'rgba(161, 140, 209, 0.03)', border: '1px dashed rgba(161, 140, 209, 0.5)', padding: '12px 18px', borderRadius: '10px', width: '220px', textAlign: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '6px', right: '10px', fontSize: '9px', background: 'rgba(255, 56, 96, 0.15)', color: 'var(--accent-neon-red)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>FROZEN</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Frozen Base Weights (W)</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>4-bit Quantized (NF4 Format)</div>
                  </div>

                  {/* LoRA 어댑터 가중치 */}
                  <div style={{ background: 'rgba(0, 242, 254, 0.03)', border: '1px solid rgba(0, 242, 254, 0.5)', padding: '12px 18px', borderRadius: '10px', width: '220px', textAlign: 'center', position: 'relative', boxShadow: 'inset 0 0 10px rgba(0, 242, 254, 0.05)' }}>
                    <div style={{ position: 'absolute', top: '6px', right: '10px', fontSize: '9px', background: 'rgba(57, 255, 20, 0.15)', color: 'var(--accent-neon-green)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>TRAINABLE</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>Active LoRA Adapter (ΔW)</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>FP32 / FP16 Trainable A & B</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-muted)' }}>
                  <ArrowRight size={20} style={{ transform: 'rotate(25deg)' }} />
                  <ArrowRight size={20} style={{ transform: 'rotate(-25deg)' }} />
                </div>

                {/* 덧셈 노드 */}
                <div style={{ border: '2px solid var(--accent-neon-green)', background: 'rgba(57, 255, 20, 0.05)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: 'var(--accent-neon-green)', boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' }}>
                  +
                </div>

                <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />

                {/* 최종 출력 */}
                <div style={{ border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', padding: '15px 12px', borderRadius: '10px', width: '150px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Output Activation</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>h = Wx + s·ΔWx</div>
                </div>
              </div>
            </div>

            {/* SFT 자연어 직렬화 템플릿 실사례 & 인터랙티브 시뮬레이터 */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen style={{ color: 'var(--accent-purple)' }} size={20} />
                  SFT 프롬프트 직렬화 (Prompt Serialization) 인터랙티브 대조기
                </h3>
                
                {/* 샘플 셀렉터 버튼 */}
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <button onClick={() => setSelectedSample('sample1')} style={{ background: selectedSample === 'sample1' ? 'rgba(0, 242, 254, 0.1)' : 'none', border: 'none', color: selectedSample === 'sample1' ? 'var(--accent-cyan)' : 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition-smooth)' }}>우량 고객</button>
                  <button onClick={() => setSelectedSample('sample2')} style={{ background: selectedSample === 'sample2' ? 'rgba(161, 140, 209, 0.1)' : 'none', border: 'none', color: selectedSample === 'sample2' ? 'var(--accent-purple)' : 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition-smooth)' }}>중위험군</button>
                  <button onClick={() => setSelectedSample('sample3')} style={{ background: selectedSample === 'sample3' ? 'rgba(255, 56, 96, 0.1)' : 'none', border: 'none', color: selectedSample === 'sample3' ? 'var(--accent-neon-red)' : 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition-smooth)' }}>부실 위험군</button>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
                전통 머신러닝은 데이터를 그저 숫자로 받아 한계를 둡니다. 본 시스템의 SFT(Supervised Fine-Tuning) 템플릿 직렬화기는 가동 시 정형 테이블(Table Rows)의 각 수치를 **한국어 신용 거래 시나리오 프롬프트**로 완전히 인코딩(Encoding)하여 sLLM에 주입합니다. 이를 통해 언어 모델에 내재된 깊은 자가 추론 논리를 격발시킵니다.
              </p>

              {/* 시뮬레이터 실사 레이아웃 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* 좌측: 정형 피처 카드 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '15px' }}>정형 변수 입력값 (Table Features)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {Object.entries(samples[selectedSample].features).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{key}</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleRunSerialization}
                    disabled={serializationStep === 'processing'}
                    style={{ 
                      marginTop: '25px', 
                      background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '12px', 
                      color: '#0b0f19', 
                      fontWeight: 'bold', 
                      fontFamily: 'var(--font-display)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-neon-cyan)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {serializationStep === 'processing' ? (
                      <>
                        <RotateCcw className="gear-rotating" size={16} />
                        자연어 직렬화 인코딩 중...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        자연어 SFT 직렬화 실행
                      </>
                    )}
                  </button>
                </div>

                {/* 우측: 변환 프롬프트 결과 */}
                <div style={{ background: '#060a13', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', minHeight: '300px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Generated Instruction Prompt</span>
                    {serializationStep === 'done' && <span style={{ color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>SERIALIZED SUCCESS</span>}
                  </div>
                  
                  {serializationStep === 'idle' && (
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                      <HelpCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      좌측의 'SFT 직렬화 실행' 버튼을 누르시면,<br />수치형 정형 데이터가 sLLM 특화 지시 학습 프롬프트로<br />어떻게 변환되는지 실시간 확인하실 수 있습니다.
                    </div>
                  )}

                  {serializationStep === 'processing' && (
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', fontSize: '13px' }}>
                      <RotateCcw className="gear-rotating" size={32} style={{ marginBottom: '12px' }} />
                      텍스트 템플릿 어텐션 바인딩 및<br />소형 모델용 한글 직렬화 매핑 작업 진행 중...
                    </div>
                  )}

                  {serializationStep === 'done' && (
                    <pre style={{ 
                      flexGrow: 1, 
                      margin: 0, 
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'monospace', 
                      fontSize: '12.5px', 
                      color: '#d1d5db', 
                      lineHeight: '1.5',
                      background: 'rgba(255,255,255,0.01)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)',
                      maxHeight: '340px',
                      overflowY: 'auto'
                    }}>
                      {samples[selectedSample].prompt}
                    </pre>
                  )}
                </div>

              </div>
            </div>

            {/* 목표 성능 보장 학습 제어 루프 */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass style={{ color: 'var(--accent-cyan)' }} size={20} />
                품질 보증: 목표 성능 보장 제어 루프 (Target Performance Loop)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '25px' }}>
                본 시스템의 미세조정 알고리즘은 1회성 학습으로 배포되지 않습니다. 베이스라인인 전통 LightGBM 모형의 검증 데이터 기준 ROC-AUC(0.7042) 점수를 기준으로 잡고, **sLLM QLoRA 모델의 검증 점수가 베이스라인 점수 대비 최소 10% 이상 극적으로 향상될 때까지** 에폭 수치 및 어댑터 하이퍼파라미터를 자동 롤백하며 수집/재훈련하는 엄격한 **성능 품질 보증 제어 루프**를 완수하여 배포 안전성을 구축했습니다.
              </p>

              {/* 루프 아키텍처 다이어그램 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', fontSize: '12px', textAlign: 'center' }}>
                    <strong>1. Baseline scoring</strong><br /><span style={{ color: 'var(--text-secondary)' }}>LightGBM AUC (0.7042)</span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  <div style={{ padding: '14px 20px', background: 'rgba(161, 140, 209, 0.05)', border: '1px solid rgba(161, 140, 209, 0.2)', borderRadius: '10px', fontSize: '12px', textAlign: 'center' }}>
                    <strong>2. QLoRA SFT Tuning</strong><br /><span style={{ color: 'var(--accent-purple)' }}>Qwen2.5-3B 미세조정</span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  <div style={{ padding: '14px 20px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '10px', fontSize: '12px', textAlign: 'center' }}>
                    <strong>3. AUC Cross-Validation</strong><br /><span style={{ color: 'var(--accent-cyan)' }}>sLLM 검증 점수 (0.7895)</span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  <div style={{ padding: '14px 20px', background: 'rgba(57, 255, 20, 0.08)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: '10px', fontSize: '12px', textAlign: 'center', color: 'var(--accent-neon-green)' }}>
                    <strong>4. Target Approval</strong><br /><strong>LGBM 대비 +12.11% 달성 (배포)</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. 기존 전통 모델 대비 왜 sLLM 학습 모델이 뛰어난지 비교 설명 */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'comparison' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* 성능 비교 동적 게이지 보드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* 1. ROC-AUC */}
              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>ROC-AUC (예측 정확 판별율)</span>
                <div style={{ fontSize: '34px', fontWeight: '800', margin: '10px 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="neon-text-cyan">0.7895</span>
                  <span style={{ fontSize: '14px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>+12.11% vs LGBM</span>
                </div>
                
                {/* 동적 차트 바 */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', margin: '12px 0 15px 0', position: 'relative' }}>
                  {/* LightGBM 바 */}
                  <div style={{ 
                    height: '100%', 
                    width: animateProgress ? '70.42%' : '0%', 
                    background: 'var(--text-muted)', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    borderRadius: '4px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} />
                  {/* sLLM 바 */}
                  <div style={{ 
                    height: '100%', 
                    width: animateProgress ? '78.95%' : '0%', 
                    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    borderRadius: '4px',
                    boxShadow: '0 0 8px rgba(0, 242, 254, 0.6)',
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.1s'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>전통 LightGBM: 0.7042</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>sLLM AI: 0.7895</span>
                </div>
              </div>

              {/* 2. KS 통계량 */}
              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>KS Statistics (우량/부실 변별력)</span>
                <div style={{ fontSize: '34px', fontWeight: '800', margin: '10px 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="neon-text-purple">0.3956</span>
                  <span style={{ fontSize: '14px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>+31.34% vs LGBM</span>
                </div>
                
                {/* 동적 차트 바 */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', margin: '12px 0 15px 0', position: 'relative' }}>
                  {/* LightGBM 바 */}
                  <div style={{ 
                    height: '100%', 
                    width: animateProgress ? '30.12%' : '0%', 
                    background: 'var(--text-muted)', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    borderRadius: '4px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} />
                  {/* sLLM 바 */}
                  <div style={{ 
                    height: '100%', 
                    width: animateProgress ? '39.56%' : '0%', 
                    background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    borderRadius: '4px',
                    boxShadow: '0 0 8px rgba(161, 140, 209, 0.6)',
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.2s'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>전통 LightGBM: 0.3012</span>
                  <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>sLLM AI: 0.3956</span>
                </div>
              </div>

              {/* 3. F1-Score */}
              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-neon-green)', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>F1-Score (상환예측 균형 조화도)</span>
                <div style={{ fontSize: '34px', fontWeight: '800', margin: '10px 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="neon-text-green">0.4580</span>
                  <span style={{ fontSize: '14px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>+29.38% vs LGBM</span>
                </div>
                
                {/* 동적 차트 바 */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', margin: '12px 0 15px 0', position: 'relative' }}>
                  {/* LightGBM 바 */}
                  <div style={{ 
                    height: '100%', 
                    width: animateProgress ? '35.40%' : '0%', 
                    background: 'var(--text-muted)', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    borderRadius: '4px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} />
                  {/* sLLM 바 */}
                  <div style={{ 
                    height: '100%', 
                    width: animateProgress ? '45.80%' : '0%', 
                    background: 'linear-gradient(90deg, var(--accent-neon-green), var(--accent-blue))', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    borderRadius: '4px',
                    boxShadow: '0 0 8px rgba(57, 255, 20, 0.6)',
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.3s'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>전통 LightGBM: 0.3540</span>
                  <span style={{ color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>sLLM AI: 0.4580</span>
                </div>
              </div>

            </div>

            {/* sLLM이 전통적인 트리 모델 대비 압도적으로 뛰어난 이유 */}
            <div className="glass-card">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', marginBottom: '30px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lightbulb style={{ color: 'var(--accent-cyan)' }} size={24} />
                왜 sLLM 신용평가 모델이 전통 모델보다 근본적으로 뛰어난가? <span style={{ fontWeight: '300', color: 'var(--text-secondary)', fontSize: '15px' }}>(Architecture Superiority)</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* 1번 비교요소 */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.2)', color: 'var(--accent-cyan)', padding: '12px', borderRadius: '12px', fontWeight: '800', fontFamily: 'var(--font-display)', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(0, 242, 254, 0.1)' }}>
                    01
                  </div>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '700' }}>
                      단절된 단순 수치 분기를 뛰어넘는 **‘종합적 금융 맥락(Financial Context) 추론’**
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      기존 전통적인 기계학습 모델(LightGBM, XGBoost 등)은 각 신용 지표들의 수치 기준점을 칼로 자르듯 나누는 **단절된 이진 분절(Binary Splits)**에 기댑니다. 이 방식은 변수들이 지니는 다면적 결합 영향력을 조밀하게 반영하지 못합니다. 
                      반면 sLLM은 전처리된 FICO, DTI, 소득, 한도 소진율, 연체 횟수를 유기적인 하나의 자연어 텍스트 시나리오로 직렬화하여 언어 학습 패턴으로 분석합니다. 이로써 <strong>"소득 규모 자체는 우수하지만 최근 6개월 조회수가 급증하고 한도 소진율이 상한선에 이른 잠재 한계 차입자"</strong>의 유기적인 연동 위험도를 인간 심사역처럼 매우 입체적으로 가려냅니다.
                    </p>
                  </div>
                </div>

                {/* 2번 비교요소 */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(161, 140, 209, 0.08)', border: '1px solid rgba(161, 140, 209, 0.2)', color: 'var(--accent-purple)', padding: '12px', borderRadius: '12px', fontWeight: '800', fontFamily: 'var(--font-display)', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(161, 140, 209, 0.1)' }}>
                    02
                  </div>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '700' }}>
                      단순 수치 기여도를 넘어선 **‘인과적 생성형 XAI (Contextual Generative XAI)’**
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      전통 모델(LightGBM)은 설명 가능한 AI를 구현하기 위해 외부 도구(SHAP, Lime 등)에 전적으로 의존해 최종적으로 단순히 정량 피처의 기계적 플러스/마이너스 기여도 막대그래프를 출력하는 데 그칩니다. 
                      반면 sLLM AI는 복잡한 수치 판별 연산을 완료한 즉시, **"3줄 심사 요약 소견서"**와 함께 **"신용등급 개선을 위한 맞춤형 인과 행동 처방전(Counterfactual Actions)"**까지 자연어 생성 기술로 즉시 조합해 냅니다. 이는 대출 고객과 심사역 모두에게 기계 수치를 넘어선 압도적인 비즈니스 실용성을 혁신적으로 부여합니다.
                    </p>
                  </div>
                </div>

                {/* 3번 비교요소 */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(57, 255, 20, 0.08)', border: '1px solid rgba(57, 255, 20, 0.2)', color: 'var(--accent-neon-green)', padding: '12px', borderRadius: '12px', fontWeight: '800', fontFamily: 'var(--font-display)', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(57, 255, 20, 0.1)' }}>
                    03
                  </div>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '700' }}>
                      고차원 비선형 복합 위험 곡선의 압도적 포착력
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      실제 금융 부실 차입자의 데이터 경계는 2차원 또는 3차원 공간의 선형적 평면 분할로는 깔끔히 매핑되지 않는 매우 불규칙하고 동적인 경계를 가집니다. 
                      sLLM은 수많은 다국어 말뭉치 데이터와 수치-언어 매핑 패턴을 어텐션 메커니즘을 사용해 결합함으로써, 전통 트리 알고리즘이 놓치기 쉬운 **초고차원 미세 비선형 리스크 패턴**을 손실 없이 매핑하여 우량군과 부실 위험군의 등급 분별력(KS 통계량 기준 무려 +31.34% 향상)을 비약적으로 개선했습니다.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* 트리 분절 vs 어텐션 맥락 시각화 대조 맵 */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: '700', marginBottom: '22px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network style={{ color: 'var(--accent-cyan)' }} size={20} />
                의사결정 프로세스의 근본적 차이 도식화 (Decision Architecture Contrast)
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* 1. 전통 LightGBM 이진 분기 방식 */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>전통 LightGBM 트리 의사결정</span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-neon-red)' }}>수치 단절성</span>
                  </div>
                  
                  {/* 단절된 분기 그래픽 */}
                  <div style={{ height: '140px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ border: '1px solid var(--border-glass)', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>FICO {'>'} 680?</div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Yes</span>
                        <div style={{ border: '1px solid var(--border-glass)', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>DTI {'>'} 25%?</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>No</span>
                        <div style={{ border: '1px solid rgba(255, 56, 96, 0.2)', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 56, 96, 0.05)', color: 'var(--accent-neon-red)' }}>부실군 분기(Reject)</div>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '15px', lineHeight: '1.5' }}>
                    변수값을 단계별 임계 조건(FICO {'>'} 680 등)으로 기계적 분류하므로, <strong>임계치 바로 아래에 걸치는 경계선 유량 고객이 무조건 거절되는 한계</strong>가 있으며, 다수 변수 간의 복합 유기 작용을 읽지 못합니다.
                  </p>
                </div>

                {/* 2. sLLM Attention Context 방식 */}
                <div style={{ background: 'rgba(0, 242, 254, 0.01)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '12px', padding: '24px', boxShadow: 'inset 0 0 15px rgba(0, 242, 254, 0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>sLLM Attention Context 그물망</span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>금융 유기성</span>
                  </div>
                  
                  {/* 어텐션 그물망 그래픽 */}
                  <div style={{ height: '140px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(0, 242, 254, 0.1)', borderRadius: '8px', padding: '15px', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* SVG Attention Lines */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <line x1="30" y1="30" x2="140" y2="70" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="1.5" className="wire-beam" />
                      <line x1="30" y1="30" x2="250" y2="30" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="1.5" />
                      <line x1="250" y1="30" x2="140" y2="70" stroke="rgba(161, 140, 209, 0.3)" strokeWidth="1.5" />
                      <line x1="250" y1="30" x2="140" y2="110" stroke="rgba(161, 140, 209, 0.3)" strokeWidth="1.5" className="wire-beam" />
                      <line x1="140" y1="70" x2="140" y2="110" stroke="rgba(57, 255, 20, 0.3)" strokeWidth="1.5" />
                      <line x1="30" y1="30" x2="140" y2="110" stroke="rgba(0, 242, 254, 0.2)" strokeWidth="1" />
                    </svg>

                    {/* 노드 포인트 배치 */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--accent-cyan)', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', color: 'var(--accent-cyan)' }}>FICO Score</div>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(161, 140, 209, 0.1)', border: '1px solid var(--accent-purple)', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', color: 'var(--accent-purple)' }}>DTI Ratio</div>
                    <div style={{ position: 'absolute', top: '60px', left: '110px', background: 'rgba(57, 255, 20, 0.1)', border: '1px solid var(--accent-neon-green)', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', color: 'var(--accent-neon-green)' }}>Delinq</div>
                    <div style={{ position: 'absolute', bottom: '15px', left: '90px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', color: 'var(--text-primary)' }}>Generative XAI 소견</div>

                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '15px', lineHeight: '1.5' }}>
                    변수들이 서로 긴밀히 연결된 어텐션 링크로 연산되어, <strong>단일 변수가 경계치에 있더라도 소득이나 카드 제어 수준 등 다른 긍정 요소와 결합해 합리적인 대안 우량 등급</strong>을 매겨낼 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
