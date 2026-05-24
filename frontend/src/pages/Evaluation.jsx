import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, TrendingUp, HelpCircle, Activity, ChevronRight, RefreshCw, BarChart2 } from 'lucide-react';

export default function Evaluation() {
  // 입력 폼 상태 정의 (기본 예시 값 세팅)
  const [formData, setFormData] = useState({
    loan_amnt: 12000,
    term: 36,
    int_rate: 11.49,
    installment: 395,
    grade: 'B',
    sub_grade: 'B4',
    emp_length: 6,
    home_ownership: 'MORTGAGE',
    annual_inc: 65000,
    verification_status: 'Source Verified',
    purpose: 'debt_consolidation',
    addr_state: 'NY',
    dti: 16.8,
    delinq_2yrs: 0,
    fico_score: 710,
    inq_last_6mths: 1,
    open_acc: 12,
    pub_rec: 0,
    revol_bal: 14200,
    revol_util: 42.5,
    total_acc: 26,
    credit_age_months: 154
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('shap');
  const [typedDiagnosis, setTypedDiagnosis] = useState('');
  
  // 자연어 진단서 타이핑 효과
  useEffect(() => {
    if (result && result.xai_report && result.xai_report.natural_diagnosis) {
      setTypedDiagnosis('');
      let fullText = result.xai_report.natural_diagnosis;
      let index = 0;
      let tempText = '';
      
      const interval = setInterval(() => {
        if (index < fullText.length) {
          tempText += fullText.charAt(index);
          setTypedDiagnosis(tempText);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 15); // 타이핑 속도 조절
      
      return () => clearInterval(interval);
    }
  }, [result]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = ['loan_amnt', 'term', 'int_rate', 'installment', 'emp_length', 'annual_inc', 'dti', 'delinq_2yrs', 'fico_score', 'inq_last_6mths', 'open_acc', 'pub_rec', 'revol_bal', 'revol_util', 'total_acc', 'credit_age_months'].includes(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('API 서버 통신 에러가 발생했습니다.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('백엔드 API 서버 uvicorn이 실행 중이지 않거나 에러가 났습니다. 모킹 데이터로 데모를 작동합니다.');
      
      // 모킹 백업 응답 데이터 세팅 (E2E 보장 안전 장치)
      setTimeout(() => {
        const mockScore = formData.fico_score > 740 ? 912 : (formData.fico_score < 660 ? 435 : 742);
        const mockGrade = mockScore >= 900 ? 'A' : (mockScore >= 800 ? 'B' : (mockScore >= 700 ? 'C' : (mockScore >= 600 ? 'D' : 'E')));
        setResult({
          score: mockScore,
          grade: mockGrade,
          default_probability: mockScore >= 800 ? 1.45 : (mockScore >= 700 ? 5.12 : 22.84),
          xai_report: {
            shap_contributions: [
              { feature: 'fico_score', name_kr: 'FICO 신용 점수', value: `${formData.fico_score} 점`, impact: formData.fico_score >= 700 ? 45.2 : -52.4 },
              { feature: 'dti', name_kr: '부채상환비율(DTI)', value: `${formData.dti} %`, impact: formData.dti < 18 ? 22.4 : -35.2 },
              { feature: 'annual_inc', name_kr: '연간 소득', value: `${formData.annual_inc.toLocaleString()} 달러`, impact: formData.annual_inc > 50000 ? 18.5 : -14.2 },
              { feature: 'inq_last_6mths', name_kr: '최근 6개월 신용조회', value: `${formData.inq_last_6mths} 건`, impact: formData.inq_last_6mths <= 1 ? 12.1 : -28.4 },
              { feature: 'revol_util', name_kr: '한도 대비 신용 사용률', value: `${formData.revol_util} %`, impact: formData.revol_util < 40 ? 14.2 : -21.8 }
            ],
            counterfactuals: [
              { action: '신용 조회 최소화', description: `향후 6개월간 추가 신용 조회를 차단하여 최근 조회 건수를 0건으로 낮출 경우`, score_up: 24, target_score: mockScore + 24 },
              { action: '신용카드 사용 비율 조정', description: `리볼빙 및 신용카드 한도 대비 실사용 잔액 비율을 현재 ${formData.revol_util}%에서 20% 이하로 선결제해 유지할 경우`, score_up: 18, target_score: mockScore + 18 }
            ],
            natural_diagnosis: `종합 평가 결과, 신청자분의 AI 신용 점수는 ${mockScore}점이며 등급은 ${mockGrade}등급에 해당합니다. 과거 2년간 연체 기록이 전무하고 주택담보대출 이력이 성실하여 가점 혜택을 크게 득하셨습니다. 다만 최근 6개월 이내 ${formData.inq_last_6mths}회의 잦은 신용조회와 소득 대비 다소 높은 리볼빙 카드 사용량(${formData.revol_util}%)은 심사 과정에서 높은 비중의 감점 요소로 분석됩니다. 조언해 드린 처방책에 따라 리볼빙 한도 소진율을 20% 이내로 내리신다면 3개월 내에 상위 신용 우량 등급으로 진입하실 수 있을 것으로 예측됩니다.`
          }
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setTypedDiagnosis('');
  };

  // 등급별 스타일 CSS 클래스 추출
  const getGradeClass = (g) => {
    return g ? g.toLowerCase() : 'c';
  };

  // 원형 게이지 스크롤 팩터 계산
  const getStrokeDashoffset = (score) => {
    const radius = 94;
    const circumference = 2 * Math.PI * radius;
    // score 0~1000 기준으로 프로그레스바 맵핑
    const pct = score / 1000.0;
    return circumference - (pct * circumference);
  };

  return (
    <div className="animated-fade-in">
      <div className="title-section">
        <h1>sLLM 개인 신용 평가 진단 및 XAI</h1>
        <p>인공지능 소형언어모델(sLLM)과 SHAP 기법을 융합하여 부실 리스크를 정밀 진단하고 명쾌한 개선 행동 강령을 제시합니다.</p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield className="text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            개인 신용 정보 입력 폼
          </h3>
          
          <div className="form-grid">
            {/* 기본정보 */}
            <div className="form-group">
              <label>연간 총 소득 (Annual Income, $)</label>
              <input type="number" name="annual_inc" value={formData.annual_inc} onChange={handleChange} required className="form-input" min="1000" />
            </div>
            <div className="form-group">
              <label>FICO 신용 점수 범위 (300~850)</label>
              <input type="range" name="fico_score" min="300" max="850" value={formData.fico_score} onChange={handleChange} className="form-input" style={{ padding: '5px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>300 (최저)</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{formData.fico_score} 점</span>
                <span>850 (최고)</span>
              </div>
            </div>
            <div className="form-group">
              <label>재직 기간 (Employment Length)</label>
              <select name="emp_length" value={formData.emp_length} onChange={handleChange} className="form-input">
                <option value="0">1년 미만</option>
                <option value="1">1 년</option>
                <option value="3">3 년</option>
                <option value="5">5 년</option>
                <option value="6">6 년</option>
                <option value="10">10년 이상</option>
              </select>
            </div>
            
            {/* 대출조건 */}
            <div className="form-group">
              <label>신청 대출 금액 ($)</label>
              <input type="number" name="loan_amnt" value={formData.loan_amnt} onChange={handleChange} required className="form-input" min="500" />
            </div>
            <div className="form-group">
              <label>대출 적용 금리 (%)</label>
              <input type="number" name="int_rate" step="0.01" value={formData.int_rate} onChange={handleChange} required className="form-input" min="1" max="50" />
            </div>
            <div className="form-group">
              <label>월 상환 원리금 ($)</label>
              <input type="number" name="installment" value={formData.installment} onChange={handleChange} required className="form-input" min="1" />
            </div>

            {/* 신용거래이력 */}
            <div className="form-group">
              <label>부채상환비율 (DTI, %)</label>
              <input type="number" name="dti" step="0.1" value={formData.dti} onChange={handleChange} required className="form-input" min="0" max="100" />
            </div>
            <div className="form-group">
              <label>카드 한도 대비 소진율 (Revolving Util, %)</label>
              <input type="number" name="revol_util" step="0.1" value={formData.revol_util} onChange={handleChange} required className="form-input" min="0" max="150" />
            </div>
            <div className="form-group">
              <label>최근 6개월 신용 조회 횟수 (Inquiries)</label>
              <input type="number" name="inq_last_6mths" value={formData.inq_last_6mths} onChange={handleChange} required className="form-input" min="0" max="20" />
            </div>

            {/* 기타 정보 */}
            <div className="form-group">
              <label>주거 형태 (Home Ownership)</label>
              <select name="home_ownership" value={formData.home_ownership} onChange={handleChange} className="form-input">
                <option value="MORTGAGE">주택담보대출 보유</option>
                <option value="RENT">월세(임차)</option>
                <option value="OWN">자가 소유</option>
                <option value="OTHER">기타 주거</option>
              </select>
            </div>
            <div className="form-group">
              <label>대출 신청 목적 (Purpose)</label>
              <select name="purpose" value={formData.purpose} onChange={handleChange} className="form-input">
                <option value="debt_consolidation">부채 통합 (대환대출)</option>
                <option value="credit_card">신용카드 결제 대금 대환</option>
                <option value="home_improvement">주택 수리 및 인테리어</option>
                <option value="major_purchase">목돈 구입</option>
                <option value="other">기타 목적</option>
              </select>
            </div>
            <div className="form-group">
              <label>총 신용거래 개월 수 (Credit Age)</label>
              <input type="number" name="credit_age_months" value={formData.credit_age_months} onChange={handleChange} required className="form-input" min="12" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '220px' }}>
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  실시간 AI 채점 중...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  신용등급 진단 시작
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* 평가 완료 결과 화면 */
        <div className="grid-result" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
          
          {/* 좌측 카드: 신용점수 및 등급 게이지 */}
          <div className="glass-card text-center" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '25px', color: 'var(--text-secondary)' }}>
              AI 평가 최종 스코어
            </h3>
            
            <div className="score-circle-container">
              <svg className="score-circle-svg" width="200" height="200">
                <defs>
                  <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-cyan)" />
                    <stop offset="100%" stopColor="var(--accent-blue)" />
                  </linearGradient>
                </defs>
                <circle className="score-circle-bg" cx="100" cy="100" r="94" />
                <circle 
                  className="score-circle-bar" 
                  cx="100" 
                  cy="100" 
                  r="94" 
                  strokeDasharray="590.6" 
                  strokeDashoffset={getStrokeDashoffset(result.score)}
                />
              </svg>
              <div className="score-center-text">
                <div className="score-value">{result.score}</div>
                <div className="score-label">Points</div>
              </div>
            </div>
            
            <div style={{ margin: '20px 0' }}>
              <span className={`grade-badge ${getGradeClass(result.grade)}`}>
                등급: {result.grade} 등급
              </span>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="text-secondary" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>부실 상환 이탈율(확률):</span>
                <span style={{ fontWeight: 'bold', color: result.score >= 700 ? 'var(--accent-cyan)' : 'var(--accent-neon-red)' }}>
                  {result.default_probability}%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                * 본 점수는 10B 이하 미세조정 sLLM 예측 로짓 및 대출 상환 성공 데이터에 근거해 산출된 종합 건전성 지표입니다.
              </p>
            </div>
            
            <button onClick={handleReset} className="btn-primary" style={{ width: '100%', marginTop: '25px', background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', boxShadow: 'none' }}>
              <RefreshCw size={16} />
              다른 조건으로 평가
            </button>
          </div>
          
          {/* 우측 카드: 5종 XAI 분석 탭 대시보드 */}
          <div className="glass-card">
            <div className="tabs-header">
              <button 
                onClick={() => setActiveTab('shap')} 
                className={`tab-btn ${activeTab === 'shap' ? 'active' : ''}`}
              >
                <BarChart2 size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
                ① SHAP 변수별 가점/감점 요인
              </button>
              <button 
                onClick={() => setActiveTab('diagnosis')} 
                className={`tab-btn ${activeTab === 'diagnosis' ? 'active' : ''}`}
              >
                <Sparkles size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
                ② sLLM 자연어 진단 리포트
              </button>
              <button 
                onClick={() => setActiveTab('counterfactual')} 
                className={`tab-btn ${activeTab === 'counterfactual' ? 'active' : ''}`}
              >
                <TrendingUp size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
                ③ 행동 교정 처방전
              </button>
            </div>
            
            <div className="tabs-content" style={{ minHeight: '350px' }}>
              
              {/* 1. SHAP 기여도 탭 */}
              {activeTab === 'shap' && (
                <div className="animated-fade-in">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--text-primary)' }}>
                    각 신용 정보가 등급 점수에 미친 영향력 기여도 정량화
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                    초록색 막대(<span style={{ color: '#10b981', fontWeight: 'bold' }}>+</span>)는 상환 성공 예측에 기여하여 점수를 상승시킨 긍정 요인이고, 
                    빨간색 막대(<span style={{ color: '#ef4444', fontWeight: 'bold' }}>-</span>)는 부실 발생 확률을 높여 점수를 깎아내린 주요 감점 요인입니다.
                  </p>
                  
                  <div className="shap-bar-container">
                    {result.xai_report.shap_contributions.map((item, idx) => {
                      const isPositive = item.impact >= 0;
                      // 최대 영향력을 기준으로 백분율 넓이 계산
                      const maxImpact = Math.max(...result.xai_report.shap_contributions.map(x => Math.abs(x.impact)));
                      const widthPercent = maxImpact > 0 ? (Math.abs(item.impact) / maxImpact) * 90 : 10;
                      
                      return (
                        <div key={idx} className="shap-bar-row">
                          <div className="shap-feature-name" title={item.feature}>
                            {item.name_kr}
                          </div>
                          
                          <div className="shap-bar-track">
                            <div 
                              className={`shap-bar-fill ${isPositive ? 'positive' : 'negative'}`}
                              style={{ 
                                width: `${widthPercent}%`,
                                marginLeft: isPositive ? '0' : 'auto', // 시각적으로 0점 기준 좌우 정렬
                                float: isPositive ? 'left' : 'right'
                              }}
                            />
                          </div>
                          
                          <div className="shap-value-text" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
                            {isPositive ? '+' : ''}{item.impact.toFixed(1)}점 ({item.value})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* 2. sLLM 자연어 진단서 탭 */}
              {activeTab === 'diagnosis' && (
                <div className="animated-fade-in">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
                    소형언어모델(sLLM) 심사역 종합 소견
                  </h4>
                  <div 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid var(--border-glass)', 
                      borderRadius: '12px', 
                      padding: '24px', 
                      lineHeight: '1.8', 
                      fontSize: '15px', 
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      whiteSpace: 'pre-line',
                      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {typedDiagnosis}
                    <span 
                      style={{ 
                        display: typedDiagnosis.length < (result.xai_report.natural_diagnosis?.length || 0) ? 'inline-block' : 'none',
                        width: '3px',
                        height: '15px',
                        background: 'var(--accent-cyan)',
                        marginLeft: '3px',
                        animation: 'blink 0.8s infinite'
                      }}
                    />
                  </div>
                  
                  <style>{`
                    @keyframes blink {
                      0%, 100% { opacity: 0; }
                      50% { opacity: 1; }
                    }
                  `}</style>
                </div>
              )}
              
              {/* 3. 반사실 행동 처방 탭 */}
              {activeTab === 'counterfactual' && (
                <div className="animated-fade-in">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--text-primary)' }}>
                    행동 기반 점수 향상 솔루션 (반사실 처방책)
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                    "만일 ~한다면 점수가 Z만큼 상승할 것이다"의 최적화 역산 시뮬레이션을 수행했습니다. 아래 솔루션을 적용하여 높은 등급으로 진입하세요.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {result.xai_report.counterfactuals.map((scenario, idx) => (
                      <div 
                        key={idx} 
                        className="glass-card" 
                        style={{ 
                          background: 'rgba(0, 242, 254, 0.03)', 
                          borderColor: 'rgba(0, 242, 254, 0.15)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '20px'
                        }}
                      >
                        <div style={{ flexGrow: 1, paddingRight: '20px' }}>
                          <h5 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronRight size={16} />
                            {scenario.action}
                          </h5>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {scenario.description}
                          </p>
                        </div>
                        
                        <div style={{ textAlign: 'center', minWidth: '110px' }}>
                          <div style={{ color: 'var(--accent-neon-green)', fontWeight: '800', fontSize: '24px' }}>
                            +{scenario.score_up}점
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            예상: {scenario.target_score}점
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
