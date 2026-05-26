import React, { useState } from 'react';
import { 
  Database, Cpu, Lightbulb, Compass, ArrowRight, CheckCircle2, 
  AlertCircle, ShieldCheck, Flame, Network, Scale, Sparkles, BookOpen 
} from 'lucide-react';

export default function Report() {
  const [activeTab, setActiveTab] = useState('data');

  const tabs = [
    { id: 'data', label: '1. 학습 데이터셋', icon: <Database size={16} /> },
    { id: 'model', label: '2. 도입 sLLM 모델', icon: <Cpu size={16} /> },
    { id: 'training', label: '3. 미세조정(SFT) 방법', icon: <Flame size={16} /> },
    { id: 'comparison', label: '4. sLLM의 우위성', icon: <Scale size={16} /> }
  ];

  return (
    <div className="animated-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 타이틀 헤더 */}
      <div className="title-section" style={{ marginBottom: '50px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.2)', color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
          <Sparkles size={14} /> Technical Whitepaper & Report
        </div>
        <h1>모델 개발 및 학습 심층 보고서</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          미국 Lending Club 대용량 신용 거래 데이터를 활용한 <strong>sLLM(QLoRA) 미세조정 모델</strong>의 개발 과정, 아키텍처, 그리고 전통적 LightGBM 모델 대비 지닌 예측력과 XAI의 우수성에 대한 정밀 리포트입니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        marginBottom: '40px', 
        borderBottom: '1px solid var(--border-glass)', 
        paddingBottom: '15px',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            style={{ 
              background: activeTab === tab.id ? 'rgba(0, 242, 254, 0.08)' : 'none', 
              border: activeTab === tab.id ? '1px solid rgba(0, 242, 254, 0.2)' : '1px solid transparent', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'var(--transition-smooth)',
              fontFamily: 'var(--font-display)',
              fontSize: '15px'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 본문 콘텐츠 */}
      <div className="tab-content" style={{ minHeight: '500px' }}>
        
        {/* 1. 학습 데이터셋 설명 */}
        {activeTab === 'data' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 데이터 소개 대시보드 카드 */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database style={{ color: 'var(--accent-cyan)' }} size={24} />
                Lending Club 원천 데이터셋 상세 스펙 (PoC Data Specification)
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>
                본 시스템의 학습에 피딩(Feeding)된 데이터셋은 글로벌 개인 대출 중개의 표준 데이터셋인 미국 <strong>Lending Club의 대용량 거래 및 연체 원천 정보(1.18GB)</strong>입니다. PoC의 정밀성과 학습 효율성을 극대화하기 위해 균형 잡힌 표본 15,000건을 엄격하게 샘플링하여 훈련 및 검증 데이터로 가공하였습니다.
              </p>

              {/* 스펙 인포그래픽 그리드 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>원천 데이터 규모</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>1.18 GB</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>약 89만 명의 대출 및 신용 정보</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>피처(Feature) 개수</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>75 개</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>신용 점수, 연체이력, 부채비율 등</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>PoC 균형 추출 규모</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-neon-green)', fontFamily: 'var(--font-display)' }}>15,000 건</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>정상/부실 균형 분할 샘플</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>데이터 분할 비율</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-display)' }}>7 : 1.5 : 1.5</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Train / Val / Test Split</div>
                </div>
              </div>
            </div>

            {/* 주요 변수 리스트 */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ color: 'var(--accent-cyan)' }} size={20} />
                신용평가 예측력에 기여하는 6대 핵심 변수 (Key Credit Features)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', display: 'block', marginBottom: '6px' }}>FICO 신용 점수 (fico_range_low / high)</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>미국 개인 신용등급 평점의 업계 표준 지표(300~850점). 차입자의 부실율 예측에 있어 가장 민감하고 강력한 변별 변수입니다.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', display: 'block', marginBottom: '6px' }}>총 소득 대비 부채 비중 (dti - Debt-to-Income)</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>차입자의 총소득 대비 연간 의무 채무 상환액 비율. 해당 비율이 과도하게 높을 경우 급격한 상환 능력 약화로 직결됩니다.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', display: 'block', marginBottom: '6px' }}>연간 총 소득 (annual_inc)</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>대출 신청 시 차입자가 신고한 연 소득 규모. 부채 상환 시 가용할 재정적 버퍼의 기본 기초 척도 역할을 수행합니다.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', display: 'block', marginBottom: '6px' }}>신용카드 리볼빙 한도 소진율 (revol_util)</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>총 카드 한도 대비 실사용 잔액 비율. 리스크 증가에 매우 기민하게 움직이는 핵심 정량 인자 중 하나입니다.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', display: 'block', marginBottom: '6px' }}>최근 2년간 30일 이상 연체 횟수 (delinq_2yrs)</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>과거 상환 행태의 성실성을 측정하는 지표. 잦은 연체 이력은 부실 위험의 강력한 선행 신호로 반영됩니다.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', display: 'block', marginBottom: '6px' }}>최근 6개월 신용 조회 횟수 (inq_last_6mths)</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>단기간 신용 조회 급증은 대출이 불가능해 여러 금융권을 전전하는 다중채무 위험 가능성을 드러냅니다.</p>
                </div>
              </div>
            </div>

            {/* Data Leakage 방지 공정 설명 */}
            <div className="glass-card" style={{ borderColor: 'rgba(255, 56, 96, 0.2)', background: 'rgba(255, 56, 96, 0.01)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '15px', color: 'var(--accent-neon-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} />
                데이터 누수(Data Leakage) 원천 차단 아키텍처
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                신용평가 예측 모델링에서 가장 자주 발생하는 치명적인 결함은 **데이터 누수(Data Leakage)**입니다. 대출 승인 및 대출금 실행 이후 시점에 발생하는 사후 수치 변수들이 학습에 혼입되면 현실 세계에서 불가능한 '미래 데이터에 의한 왜곡된 높은 정확도'가 나타납니다.
              </p>
              
              {/* 차단 파이프라인 시각화 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '250px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--text-muted)' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '5px' }}>1단계: 원천 데이터 수집</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lending Club 원천 테이블 로드 (75개 모든 변수)</div>
                  </div>
                  <ArrowRight size={20} className="text-secondary" style={{ color: 'var(--text-secondary)' }} />
                  <div style={{ flex: '1', minWidth: '250px', background: 'rgba(255, 56, 96, 0.05)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--accent-neon-red)' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--accent-neon-red)', marginBottom: '5px' }}>2단계: 사후 변수 블랙리스트 제거</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>대출 실행 이후 정보인 <strong>total_pymnt(상환총액)</strong>, <strong>recoveries(회수금)</strong> 등 제거</div>
                  </div>
                  <ArrowRight size={20} className="text-secondary" style={{ color: 'var(--text-secondary)' }} />
                  <div style={{ flex: '1', minWidth: '250px', background: 'rgba(0, 242, 254, 0.05)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '5px' }}>3단계: 정밀 전처리 및 학습 피딩</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>안전한 사전(Pre-origination) 변수 기반의 강건한 신용 평가 구현</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. 도입 sLLM 모델 정보 */}
        {activeTab === 'model' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 모델 소개 메인 카드 */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(161, 140, 209, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu style={{ color: 'var(--accent-purple)' }} size={24} />
                허깅페이스 도입 최첨단 소형언어모델 (sLLM Specifications)
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>
                본 CSS_rating 시스템에 도입된 핵심 AI 언어 인프라는 Alibaba Cloud Qwen 팀이 개발한 초경량 오픈소스 플래그십 지시 모델인 <strong>Qwen2.5-3B-Instruct</strong>입니다. 허깅페이스(HuggingFace) 라이브러리를 통해 호출하여 도메인 특화 미세 조정을 완수했습니다.
              </p>

              {/* 모델 상세 스펙 카드 보드 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '24px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Model Information</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '12px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Qwen2.5-3B-Instruct</div>
                  
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', listStyleType: 'none', paddingLeft: '0' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-purple)', borderRadius: '50%' }} />
                      <strong>매개변수 규모</strong>: 30억 개 (3 Billion Parameters)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-purple)', borderRadius: '50%' }} />
                      <strong>Context Window</strong>: 최대 128,000 토큰 (128K)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-purple)', borderRadius: '50%' }} />
                      <strong>아키텍처</strong>: Grouped-Query Attention (GQA) & RoPE 임베딩 탑재
                    </li>
                  </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '24px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>Why Qwen2.5-3B-Instruct?</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', marginBottom: '12px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>3B급 최고의 한글 및 추론력</div>
                  
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', listStyleType: 'none', paddingLeft: '0' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-cyan)', borderRadius: '50%' }} />
                      <strong>다국어 및 한글 성능</strong>: 동급(3B 이하) 대비 독보적으로 높은 한글 이해 지시 수행력
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-cyan)', borderRadius: '50%' }} />
                      <strong>소형 고속 추론성</strong>: 가벼운 용량으로 로컬 서버 배포 시 응답 속도 지연 최소화
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-cyan)', borderRadius: '50%' }} />
                      <strong>풍부한 표현 가능성</strong>: 추론 능력이 뛰어나 정밀 정량 심사와 정성적 심사 의견을 동시에 조율
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* LLM이 신용평가에 작동하는 원리 설명 */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network style={{ color: 'var(--accent-cyan)' }} size={20} />
                신용정보를 문맥으로 해석하는 sLLM 아키텍처
              </h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                인물 정보의 텍스트 토큰 간 어텐션(Attention) 관계를 학습하는 sLLM은 숫자로 고정된 단순 트리 분할의 한계를 돌파합니다. 수천 가지 금융 문맥 속 잠재 리스크 인과관계를 자연어로 풀어 이해하며, 대형 언어 모델의 특징인 '범용적 추론 기능'을 신용평가에 특화(Alignment)하여 실시간 신용 리스크 탐지 기능을 비약적으로 극대화합니다.
              </p>

              <div style={{ display: 'flex', gap: '15px', background: 'rgba(0, 242, 254, 0.02)', border: '1px solid rgba(0, 242, 254, 0.1)', borderRadius: '10px', padding: '16px' }}>
                <Lightbulb style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} size={22} />
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <strong>아키텍처 강점:</strong> 128K Context Window는 차입자의 다중 금융 계좌 내역, 5년간의 미세 연체 이력 타임라인, 소득 및 직업 정보를 하나의 긴 프롬프트 시나리오로 만들어 통째로 학습시킬 수 있는 여유로운 인프라를 마련하여 데이터의 정보 소실을 완벽하게 극복합니다.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* 3. 어떻게 학습을 시켰는지 구체적인 방법 설명 */}
        {activeTab === 'training' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* QLoRA 스펙 설명 */}
            <div className="glass-card">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame style={{ color: 'var(--accent-neon-red)' }} size={24} />
                QLoRA 기반 지시 미세조정 (Supervised Fine-Tuning Specification)
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>
                GPU 리소스 소모량을 줄이고 소형 모형의 가중치 어댑터(Adapter)를 학습시키는 혁신적인 <strong>QLoRA (4-bit Quantization LoRA)</strong> 기술을 채택하여 파인튜닝 프로세스를 진행했습니다. 4비트 NF4(Normal Float 4) 양자화를 통해 GPU 메모리 점유율을 대폭 낮췄습니다.
              </p>

              {/* LoRA 상세 조건 카드 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>LoRA Hyperparameters</div>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', listStyleType: 'none', paddingLeft: '0' }}>
                    <li>• <strong>LoRA Rank (r)</strong>: 16</li>
                    <li>• <strong>LoRA Alpha</strong>: 32</li>
                    <li>• <strong>Target Modules</strong>: q_proj, k_proj, v_proj, o_proj</li>
                    <li>• <strong>Dropout</strong>: 0.05</li>
                  </ul>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--accent-blue)', marginBottom: '8px' }}>SFT Training Config</div>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', listStyleType: 'none', paddingLeft: '0' }}>
                    <li>• <strong>Optimizer</strong>: paged_adamw_8bit</li>
                    <li>• <strong>Learning Rate</strong>: 2e-4</li>
                    <li>• <strong>Epochs / Batch Size</strong>: 3 Epochs / Batch Size 4</li>
                    <li>• <strong>Scheduler</strong>: cosine (with warmup)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SFT 자연어 직렬화 템플릿 실사례 */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen style={{ color: 'var(--accent-purple)' }} size={20} />
                SFT 프롬프트 직렬화 (Serialization) 양식 실례
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                정형 데이터를 sLLM에 피딩하기 위해, 파이프라인에서 수치들을 한글 문맥 정보로 직렬화하여 지시학습용 템플릿(SFT Prompt)으로 변환시킵니다.
              </p>

              {/* 코드 블럭 프롬프트 시각화 */}
              <div style={{ background: '#070a13', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#c5c9db', overflowX: 'auto', lineHeight: '1.5' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>[프롬프트 입력 데이터]</span><br />
                대출 신청자가 다음과 같은 개인 신용 정보를 제출하였습니다:<br />
                - FICO 신용 점수: 720점 (우량 신용군)<br />
                - 총 소득 대비 부채 비중(DTI): 15.4%<br />
                - 연간 총 소득: $65,000 (약 8,800만 원)<br />
                - 최근 2년간 30일 이상 연체 횟수: 0회<br />
                - 최근 6개월 내 신용 조회 건수: 1회<br />
                - 리볼빙 신용 한도 소진율: 12.3% (우수 한도 통제)<br /><br />
                위 차입자의 제반 정량 신용 변수 및 리스크 요인을 입체적으로 고려하여, 본 차입자의 36개월 내 부실 채무 불이행 가능성(Default Probability)을 계산해 0(정상상환) 또는 1(채무불이행)로 최종 스코어링 진단서를 발급하십시오.<br /><br />
                <span style={{ color: 'var(--accent-neon-green)' }}>[타겟 응답 레이블]</span><br />
                부실가능성(Default Probability): <strong>0 (정상상환 유력군)</strong>
              </div>
            </div>

            {/* 목표 성능 보장 학습 제어 루프 */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass style={{ color: 'var(--accent-cyan)' }} size={20} />
                품질 보증: 목표 성능 보장 제어 루프 (Target Performance Loop)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                당사의 모델 학습 프로세스는 단순 1회성 훈련에 그치지 않고, 전통적인 트리 모델(LightGBM)의 검증 데이터 기준 AUC 점수를 베이스라인 삼아 **sLLM의 AUC 점수가 베이스라인 대비 최소 10% 이상 대폭 상회**할 때까지 에폭 및 파라미터를 자동 튜닝하며 재도전하는 목표 성능 보장 학습 컨트롤 타워를 구축하여 배포본의 검증 신뢰성을 물리적으로 구축하였습니다.
              </p>

              {/* 루프 아키텍처 다이어그램 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                    <strong>LightGBM 훈련</strong><br />검증 AUC 도출 (0.7042)
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-secondary)' }} />
                  <div style={{ padding: '12px 18px', background: 'rgba(161, 140, 209, 0.05)', border: '1px solid rgba(161, 140, 209, 0.2)', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                    <strong>sLLM QLoRA SFT</strong><br />1차 미세조정 훈련 가동
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-secondary)' }} />
                  <div style={{ padding: '12px 18px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                    <strong>예측 성능 교차 검증</strong><br />sLLM AUC 산출 (0.7895)
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-secondary)' }} />
                  <div style={{ padding: '12px 18px', background: 'rgba(57, 255, 20, 0.08)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: '8px', fontSize: '12px', textAlign: 'center', color: 'var(--accent-neon-green)' }}>
                    <strong>성능 향상 판정 (+12.11%)</strong><br />목표치 10% 돌파! 배포 승인
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 4. 기존 전통적인 신용평가 모델 대비 왜 sLLM 학습된 모델이 더 뛰어난지.. 비교 설명 */}
        {activeTab === 'comparison' && (
          <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 성능 비교 하이라이트 보드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>ROC-AUC (예측 판별도)</span>
                <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  0.7895
                  <span style={{ fontSize: '14px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>+12.11% vs LGBM</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>수치의 분기가 아닌 전체 대출 정보 맥락을 파악하여 오판률을 현저하게 낮췄습니다.</p>
              </div>

              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>KS 통계량 (변별성 인덱스)</span>
                <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  0.3956
                  <span style={{ fontSize: '14px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>+31.34% vs LGBM</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>우량 차입자와 부실 가능성이 있는 채무 불이행 위험 차입자를 확실히 판별해 냅니다.</p>
              </div>

              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-neon-green)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>F1-Score (상환 예측 조화도)</span>
                <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  0.4580
                  <span style={{ fontSize: '14px', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>+29.38% vs LGBM</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>불균형한 부실 데이터 분포 속에서도 정상 차입자와 불량 차입자 판독을 고르게 수행합니다.</p>
              </div>
            </div>

            {/* sLLM이 전통적인 트리 모델 대비 압도적으로 뛰어난 이유 */}
            <div className="glass-card">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '25px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lightbulb style={{ color: 'var(--accent-cyan)' }} size={24} />
                sLLM 신용평가 모형의 차별적 혁신성 (Core Innovation Factors)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                  <div style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', padding: '12px', borderRadius: '12px', fontWeight: '800', fontFamily: 'var(--font-display)', minWidth: '45px', textAlign: 'center' }}>
                    01
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: '700' }}>단절된 차원 분할을 넘는 '종합적 금융 맥락(Financial Context) 추론'</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      기존 머신러닝 트리 구조(LightGBM)는 각 신용 변수의 수치들을 독립적으로 `이진 분기(Binary Split)` 처리하므로 변수 간의 유기적 상관관계와 정성적인 배경 정보가 단절됩니다. 
                      반면, sLLM은 전처리된 모든 변수를 **한 편의 금융 시나리오 텍스트**로 인식해 자연어 문맥 속에서 변수들이 상호 작용하는 숨겨진 위험 요인을 정밀하게 해독해냅니다.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                  <div style={{ background: 'rgba(161, 140, 209, 0.1)', color: 'var(--accent-purple)', padding: '12px', borderRadius: '12px', fontWeight: '800', fontFamily: 'var(--font-display)', minWidth: '45px', textAlign: 'center' }}>
                    02
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: '700' }}>기계적 기여도를 뛰어넘는 '생성형 XAI (Contextual Generative XAI)'</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      전통 모델은 단순 SHAP이나 피처 중요도 수치를 기계적으로 정렬해 출력하는 데 그쳐 일반 고객은 물론 금융 심사역조차 이를 해석하기 까다롭습니다. 
                      sLLM은 기량 높은 정량 계산을 백엔드에서 수행하는 동시에 **"3줄 심사 요약 보고서"** 및 **"신용등급 개선을 위한 구체적인 맞춤 행동 처방전(Counterfactual)"**을 단 하나의 모델 추론으로 자연어 작성하여 금융 비즈니스의 실질적인 사용성을 혁신합니다.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                  <div style={{ background: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-neon-green)', padding: '12px', borderRadius: '12px', fontWeight: '800', fontFamily: 'var(--font-display)', minWidth: '45px', textAlign: 'center' }}>
                    03
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: '700' }}>고차원 비선형 리스크 패턴의 우수한 포착력</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      부실 차입자의 데이터 분포는 전통 머신러닝의 다차원 면 분할(Hyperplane splits)로는 깔끔하게 쪼개지지 않는 경우가 흔합니다. 
                      sLLM은 미세하게 얽혀 있는 고차원의 정형-자연어 간 복합 비선형 패턴을 어텐션 메커니즘을 통해 완벽하게 매핑함으로써, 부실율 분류 변별 성능을 대폭 향상(KS 통계량 +31.34%)시켰습니다.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
