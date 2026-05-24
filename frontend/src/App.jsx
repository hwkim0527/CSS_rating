import React, { useState } from 'react';
import { Shield, Sparkles, Activity } from 'lucide-react';
import Evaluation from './pages/Evaluation';
import Comparison from './pages/Comparison';

export default function App() {
  const [currentPage, setCurrentPage] = useState('evaluation');

  return (
    <div className="app-container">
      {/* 프리미엄 네비게이션 헤더 */}
      <header className="app-header">
        <div className="logo-container">
          <Shield style={{ color: 'var(--accent-cyan)', filter: 'drop-shadow(var(--shadow-neon-cyan))' }} size={28} />
          <span>NRcapital <span style={{ fontWeight: '300', color: 'var(--text-secondary)' }}>CSS</span></span>
        </div>
        
        <nav className="nav-links">
          <button 
            onClick={() => setCurrentPage('evaluation')} 
            className={`nav-link ${currentPage === 'evaluation' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Sparkles size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            AI 신용등급 진단
          </button>
          <button 
            onClick={() => setCurrentPage('comparison')} 
            className={`nav-link ${currentPage === 'comparison' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Activity size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            모델 예측력 대조
          </button>
        </nav>
      </header>

      {/* 대시보드 페이지 뷰어 */}
      <main className="dashboard-container">
        {currentPage === 'evaluation' ? <Evaluation /> : <Comparison />}
      </main>

      {/* 푸터 영역 */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '20px 0', textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)', fontSize: '13px' }}>
        <p>© 2026 NRcapital 신규사업본부. sLLM 기반 신용평가 및 XAI 시스템 PoC Prototype. All rights reserved.</p>
      </footer>
    </div>
  );
}
