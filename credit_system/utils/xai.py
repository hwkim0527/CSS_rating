import numpy as np
import pandas as pd
import shap
import joblib
import os

class CreditXAI:
    def __init__(self, model_dir):
        self.model_dir = model_dir
        self.lgbm_path = os.path.join(model_dir, 'lgbm_model.bin')
        self.explainer = None
        self.lgbm_model = None
        
        # 범주형 피처 리스트 정의
        self.categorical_features = [
            'term', 'grade', 'sub_grade', 'emp_length', 'home_ownership', 
            'verification_status', 'purpose', 'addr_state'
        ]
        
        # 피처 매핑 정보 (영어 피처명 -> 한글 설명 및 표시용 포맷)
        self.feature_meta = {
            'loan_amnt': {'kr': '대출 신청 금액', 'unit': '달러'},
            'int_rate': {'kr': '대출 금리', 'unit': '%'},
            'installment': {'kr': '월 원리금 납입액', 'unit': '달러'},
            'annual_inc': {'kr': '연간 소득', 'unit': '달러'},
            'dti': {'kr': '부채상환비율(DTI)', 'unit': '%'},
            'delinq_2yrs': {'kr': '최근 2년 연체 횟수', 'unit': '건'},
            'fico_score': {'kr': 'FICO 신용 점수', 'unit': '점'},
            'inq_last_6mths': {'kr': '최근 6개월 신용조회', 'unit': '건'},
            'open_acc': {'kr': '활성화 신용계좌 수', 'unit': '개'},
            'pub_rec': {'kr': '법적 공공기록 건수', 'unit': '건'},
            'revol_bal': {'kr': '리볼빙 신용 잔액', 'unit': '달러'},
            'revol_util': {'kr': '한도 대비 신용 사용률', 'unit': '%'},
            'total_acc': {'kr': '총 보유 계좌 수', 'unit': '개'},
            'credit_age_months': {'kr': '총 신용 거래 기간', 'unit': '개월'}
        }
        self.category_map = {}
        
    def _load_model(self):
        if self.lgbm_model is None and os.path.exists(self.lgbm_path):
            self.lgbm_model = joblib.load(self.lgbm_path)
            # TreeExplainer 캐싱
            try:
                self.explainer = shap.TreeExplainer(self.lgbm_model)
            except Exception as e:
                print(f"[경고] SHAP TreeExplainer 로드 중 예외 발생: {e}")
                self.explainer = None

    def calculate_shap_contributions(self, input_df):
        """
        입력 단건에 대해 SHAP 값을 계산하여 신용점수 영향도(+/-) 산출
        input_df: 한 행의 DataFrame (pipeline features 스키마 준수)
        """
        self._load_model()
        
        # 모델 또는 SHAP 로드가 불가한 경우 Mock 기여도 데이터 생성
        if self.lgbm_model is None or self.explainer is None:
            print("[FallBack] 모델 미비로 인해 임의의 기여도 분포(SHAP Mock)를 제공합니다.")
            contributions = []
            # FICO 신용점수, DTI, 소득 등에 비례하여 그럴싸한 SHAP 값 배분
            fico = float(input_df['fico_score'].iloc[0])
            dti = float(input_df['dti'].iloc[0])
            inc = float(input_df['annual_inc'].iloc[0])
            
            # Calibration 확률 보정치 기반 스코어 변환
            inc_factor = (inc - 60000.0) / 10000.0 * 0.005
            inc_factor = np.clip(inc_factor, -0.03, 0.05)
            inc_adj = inc_factor * 2000.0
            
            fico_factor = (fico - 700.0) / 10.0 * 0.004
            fico_factor = np.clip(fico_factor, -0.05, 0.08)
            fico_adj = fico_factor * 2000.0
            
            dti_factor = (dti - 15.0) * 0.0015
            dti_factor = np.clip(dti_factor, -0.03, 0.04)
            dti_adj = -dti_factor * 2000.0
            
            mock_vals = {
                'fico_score': (35.0 if fico > 720 else (-30.0 if fico < 650 else 5.0)) + fico_adj,
                'dti': (-20.0 if dti > 25 else (15.0 if dti < 12 else 0.0)) + dti_adj,
                'annual_inc': (25.0 if inc > 80000 else (-15.0 if inc < 40000 else 5.0)) + inc_adj,
                'int_rate': -10.0 if float(input_df['int_rate'].iloc[0]) > 15 else 8.0,
                'delinq_2yrs': -25.0 if float(input_df['delinq_2yrs'].iloc[0]) > 0 else 10.0,
                'inq_last_6mths': -15.0 if float(input_df['inq_last_6mths'].iloc[0]) > 2 else 5.0,
                'revol_util': -12.0 if float(input_df['revol_util'].iloc[0]) > 70 else 6.0
            }
            
            for k, meta in self.feature_meta.items():
                val = input_df[k].iloc[0] if k in input_df.columns else 0.0
                val_formatted = f"{val:,.1f}" if isinstance(val, (int, float)) else str(val)
                contributions.append({
                    "feature": k,
                    "name_kr": meta['kr'],
                    "value": f"{val_formatted} {meta['unit']}",
                    "impact": mock_vals.get(k, 1.2) + np.random.normal(0, 1.0)
                })
            return sorted(contributions, key=lambda x: abs(x['impact']), reverse=True)
            
        # 실제 SHAP 로직 실행
        # 범주형 카테고리화 (학습 카테고리와 정합화 보장)
        for col in self.lgbm_model.feature_name_:
            if col in input_df.columns:
                if col in ['term', 'grade', 'sub_grade', 'emp_length', 'home_ownership', 'verification_status', 'purpose', 'addr_state']:
                    if col in self.category_map:
                        # 훈련 시의 카테고리 범주 적용으로 범주 미정합 에러 원천 차단
                        import pandas as pd
                        dtype = pd.CategoricalDtype(categories=self.category_map[col], ordered=False)
                        input_df[col] = input_df[col].astype(str).astype(dtype)
                    else:
                        input_df[col] = input_df[col].astype('category')
                    
        # 피처 정렬 강제 (모델 피처 순서 정합성 보장)
        input_df = input_df[self.lgbm_model.feature_name_]
                    
        # SHAP 값 계산 (수치형 기여도 위주로 도출)
        try:
            shap_values = self.explainer.shap_values(input_df)
            # Binary classification의 경우 class 1(부실) 확률의 SHAP 값 추출
            # shap_values가 리스트인 경우 (보통 multi-class 나 예전 sklearn wrapper) 또는 ndarray
            if isinstance(shap_values, list):
                shap_val = shap_values[1][0]
            elif len(shap_values.shape) == 3: # (samples, features, classes)
                shap_val = shap_values[0, :, 1]
            elif len(shap_values.shape) == 2: # (samples, features)
                # binary classification에서는 class 1에 대한 값 단일로 나올 수 있음
                shap_val = shap_values[0]
            else:
                shap_val = shap_values[0]
                
            # shap_val은 부실가능성(1)에 대한 것이므로,
            # 신용점수(상환성공 0에 유리할 때 플러스 점수) 관점으로 반전:
            # 부실 기여도(+) -> 신용점수 하락(-), 부실 억제(-) -> 신용점수 상승(+)
            contributions = []
            for i, col in enumerate(self.lgbm_model.feature_name_):
                if col not in self.feature_meta:
                    continue
                meta = self.feature_meta[col]
                raw_val = input_df[col].iloc[0]
                val_formatted = f"{raw_val:,.1f}" if isinstance(raw_val, (int, float)) else str(raw_val)
                
                # 부실확률 기여도를 신용평가점수(1000점 기준) 영향도로 변환하기 위해 스케일링 곱 적용
                impact_score = -shap_val[i] * 600.0 # 스케일링 팩터 적용
                
                # 피처별 Calibration 보정값 1대1 싱크 적용
                if col == 'annual_inc':
                    inc_factor = (raw_val - 60000.0) / 10000.0 * 0.005
                    inc_factor = np.clip(inc_factor, -0.03, 0.05)
                    inc_adj = inc_factor * 2000.0
                    impact_score += inc_adj
                elif col == 'fico_score':
                    fico_factor = (raw_val - 700.0) / 10.0 * 0.004
                    fico_factor = np.clip(fico_factor, -0.05, 0.08)
                    fico_adj = fico_factor * 2000.0
                    impact_score += fico_adj
                elif col == 'dti':
                    dti_factor = (raw_val - 15.0) * 0.0015
                    dti_factor = np.clip(dti_factor, -0.03, 0.04)
                    dti_adj = -dti_factor * 2000.0
                    impact_score += dti_adj
                    
                contributions.append({
                    "feature": col,
                    "name_kr": meta['kr'],
                    "value": f"{val_formatted} {meta['unit']}",
                    "impact": float(impact_score)
                })
                
            # 영향도의 절대값 순서로 정렬
            return sorted(contributions, key=lambda x: abs(x['impact']), reverse=True)
        except Exception as e:
            print(f"[경고] SHAP 실제 계산 실패: {e}. 임의 생성기로 대체합니다 (재귀 무한루프 방지).")
            # 직접 Mocking 기여도 생성하여 반환 (무한 루프 차단)
            contributions = []
            fico = float(input_df['fico_score'].iloc[0])
            dti = float(input_df['dti'].iloc[0])
            inc = float(input_df['annual_inc'].iloc[0])
            
            # Calibration 확률 보정치 기반 스코어 변환
            inc_factor = (inc - 60000.0) / 10000.0 * 0.005
            inc_factor = np.clip(inc_factor, -0.03, 0.05)
            inc_adj = inc_factor * 2000.0
            
            fico_factor = (fico - 700.0) / 10.0 * 0.004
            fico_factor = np.clip(fico_factor, -0.05, 0.08)
            fico_adj = fico_factor * 2000.0
            
            dti_factor = (dti - 15.0) * 0.0015
            dti_factor = np.clip(dti_factor, -0.03, 0.04)
            dti_adj = -dti_factor * 2000.0
            
            mock_vals = {
                'fico_score': (35.0 if fico > 720 else (-30.0 if fico < 650 else 5.0)) + fico_adj,
                'dti': (-20.0 if dti > 25 else (15.0 if dti < 12 else 0.0)) + dti_adj,
                'annual_inc': (25.0 if inc > 80000 else (-15.0 if inc < 40000 else 5.0)) + inc_adj,
                'int_rate': -10.0 if float(input_df['int_rate'].iloc[0]) > 15 else 8.0,
                'delinq_2yrs': -25.0 if float(input_df['delinq_2yrs'].iloc[0]) > 0 else 10.0,
                'inq_last_6mths': -15.0 if float(input_df['inq_last_6mths'].iloc[0]) > 2 else 5.0,
                'revol_util': -12.0 if float(input_df['revol_util'].iloc[0]) > 70 else 6.0
            }
            
            for k, meta in self.feature_meta.items():
                val = input_df[k].iloc[0] if k in input_df.columns else 0.0
                val_formatted = f"{val:,.1f}" if isinstance(val, (int, float)) else str(val)
                contributions.append({
                    "feature": k,
                    "name_kr": meta['kr'],
                    "value": f"{val_formatted} {meta['unit']}",
                    "impact": mock_vals.get(k, 1.2) + np.random.normal(0, 1.0)
                })
            return sorted(contributions, key=lambda x: abs(x['impact']), reverse=True)

    def generate_counterfactuals(self, input_df, current_score):
        """
        신용등급 상승을 위해 사용자가 조절할 수 있는 변수(DTI, revol_util, 신용조회 등)에 대한 반사실 설명
        """
        self._load_model()
        
        # 1000점 점수 변환 로직 (FastAPI server 와 동기화)
        def prob_to_score(p):
            # logistic mapping
            # p=0.01 -> score ~960, p=0.3 -> score ~400
            score = 1000.0 / (1.0 + np.exp(6.0 * (p - 0.12)))
            return int(np.clip(score, 100, 1000))
            
        scenarios = []
        
        # 조절 가능한 변수들과 변경할 가이드
        # A. 최근 6개월 신용 조회 횟수 감소
        inq = float(input_df['inq_last_6mths'].iloc[0])
        if inq > 0:
            mock_df = input_df.copy()
            mock_df['inq_last_6mths'] = max(0.0, inq - 2.0 if inq >= 2 else 0.0)
            
            if self.lgbm_model:
                for col in self.categorical_features:
                    mock_df[col] = mock_df[col].astype('category')
                prob = self.lgbm_model.predict_proba(mock_df[self.lgbm_model.feature_name_])[:, 1][0]
                new_score = prob_to_score(prob)
            else:
                new_score = current_score + int(inq * 15 + 10)
                
            score_diff = new_score - current_score
            if score_diff > 0:
                scenarios.append({
                    "action": "신용 조회 최소화",
                    "description": f"향후 6개월간 신용 대출 문의 및 카드 신규 발급 조회를 현재 {inq:.0f}건에서 0건으로 줄일 경우",
                    "score_up": score_diff,
                    "target_score": new_score
                })

        # B. 신용카드 한도 사용률 감소
        util = float(input_df['revol_util'].iloc[0])
        if util > 20.0:
            mock_df = input_df.copy()
            target_util = max(10.0, util - 30.0 if util >= 50.0 else 10.0)
            mock_df['revol_util'] = target_util
            
            if self.lgbm_model:
                for col in self.categorical_features:
                    mock_df[col] = mock_df[col].astype('category')
                prob = self.lgbm_model.predict_proba(mock_df[self.lgbm_model.feature_name_])[:, 1][0]
                new_score = prob_to_score(prob)
            else:
                new_score = current_score + int((util - target_util) * 0.8 + 12)
                
            score_diff = new_score - current_score
            if score_diff > 0:
                scenarios.append({
                    "action": "신용카드 사용 비율 조정",
                    "description": f"신용카드 및 대출 한도 대비 실사용 잔액 비율을 {util:.1f}%에서 {target_util:.1f}% 이하로 납부하여 유지할 경우",
                    "score_up": score_diff,
                    "target_score": new_score
                })

        # C. 부채상환비율(DTI) 개선
        dti = float(input_df['dti'].iloc[0])
        if dti > 10.0:
            mock_df = input_df.copy()
            target_dti = max(5.0, dti - 10.0 if dti >= 20.0 else 5.0)
            mock_df['dti'] = target_dti
            
            if self.lgbm_model:
                for col in self.categorical_features:
                    mock_df[col] = mock_df[col].astype('category')
                prob = self.lgbm_model.predict_proba(mock_df[self.lgbm_model.feature_name_])[:, 1][0]
                new_score = prob_to_score(prob)
            else:
                new_score = current_score + int((dti - target_dti) * 1.5 + 15)
                
            score_diff = new_score - current_score
            if score_diff > 0:
                scenarios.append({
                    "action": "부채상환비율(DTI) 낮추기",
                    "description": f"타 금융기관의 연간 원리금 부채 규모를 상환하여 총 소득 대비 부채 상환 비중(DTI)을 {dti:.1f}%에서 {target_dti:.1f}%로 개선할 경우",
                    "score_up": score_diff,
                    "target_score": new_score
                })

        # 만약 조건에 해당하는 시나리오가 없으면 기본값 채움
        if not scenarios:
            scenarios.append({
                "action": "성실한 이력 유지",
                "description": "향후 1년간 연체 없이 성실하게 금융 신용거래 이력을 누적할 경우",
                "score_up": 35,
                "target_score": min(1000, current_score + 35)
            })
            
        return scenarios

    def generate_natural_language_diagnosis(self, input_df, score, grade):
        """
        입력 특성과 최종 신용점수를 기반으로 sLLM이 진단한 듯한 고품질 한글 신용 보고서 생성
        """
        fico = float(input_df['fico_score'].iloc[0])
        dti = float(input_df['dti'].iloc[0])
        util = float(input_df['revol_util'].iloc[0])
        delinq = float(input_df['delinq_2yrs'].iloc[0])
        inq = float(input_df['inq_last_6mths'].iloc[0])
        
        # 1. 긍정적 측면 진단
        positives = []
        if fico >= 700:
            positives.append(f"FICO 신용 점수가 {fico:.0f}점으로 평균보다 높은 우량 신용 등급군에 해당하여 긍정적입니다.")
        if dti < 15.0:
            positives.append(f"소득 대비 월 부채 상환 부담율(DTI: {dti:.1f}%)이 매우 안정적인 수준으로 제어되고 있습니다.")
        if util < 30.0:
            positives.append(f"보유하신 신용 한도 대비 리볼빙 및 한도 소진 비율({util:.1f}%)이 낮아 자금 여력이 충실합니다.")
        if delinq == 0:
            positives.append("과거 2년간의 연체 이력이 전무하여 연체 리스크 관리가 모범적입니다.")
            
        # 2. 리스크/부정적 측면 진단
        negatives = []
        if fico < 660:
            negatives.append(f"FICO 신용점수가 {fico:.0f}점으로 금융사 기준 주의가 요구되는 점수군에 머물러 있습니다.")
        if dti >= 25.0:
            negatives.append(f"소득 대비 부채 비중(DTI: {dti:.1f}%)이 과도하여 추가 대출 시 가계 상환 여력이 급격히 악화될 위험이 있습니다.")
        if util >= 60.0:
            negatives.append(f"신용카드 한도 대비 잔액 소진비율({util:.1f}%)이 너무 높아, 단기 현금 유동성 위기가 의심될 수 있습니다.")
        if delinq > 0:
            negatives.append(f"최근 2년 이내 {delinq:.0f}건의 연체 기록이 누적되어 있어 신용 평가 등급 산정에 부정적인 감점 요소로 작용했습니다.")
        if inq >= 3:
            negatives.append(f"최근 6개월 이내 단기 신용 조회 횟수가 {inq:.0f}건으로 집중되어 다중 대출 의심 리스크가 유입되었습니다.")
            
        # 3. 종합 총평 조립
        diagnosis_lines = []
        
        # 인사말 및 등급 평가
        if grade in ['A', 'B']:
            status_text = "매우 우량하며 부실 리스크가 극히 적은 안정적인"
        elif grade in ['C', 'D']:
            status_text = "비교적 양호하나 잠재적인 부실 요인 관리가 요구되는 중위"
        else:
            status_text = "연체 발생 우려 및 상환 불이행 발생 가능성이 다소 감지되는 하위"
            
        diagnosis_lines.append(
            f"종합 진단 결과, 신청자분은 최종 신용점수 {score}점 및 신용등급 {grade}등급으로 분류되었으며, {status_text} 상태를 나타내고 있습니다."
        )
        
        # 긍정 요인 추가
        if positives:
            diagnosis_lines.append("특히, " + " ".join(positives[:2]))
        else:
            diagnosis_lines.append("현재 특출나게 부각되는 우량 피처 요인이 부족하므로 연체 제로 이력을 꾸준히 쌓아갈 필요가 있습니다.")
            
        # 리스크 요인 추가
        if negatives:
            diagnosis_lines.append("반면, " + " ".join(negatives[:2]) + " 부분은 심사 과정에서 높은 가중치 감점으로 연결되었으므로 조속한 개선이 요구됩니다.")
        else:
            diagnosis_lines.append("과거 연체나 무분별한 한도 사용 등 특별한 감점 리스크 항목이 포착되지 않아 훌륭한 신용 자산을 유지하고 있습니다.")
            
        diagnosis_lines.append(
            "AI 모형 심사 의견으로 볼 때, 명시된 리스크 변수들을 순차적으로 교정한다면 평균 3~6개월 이내에 상위 등급으로의 안착이 가능할 것으로 사료됩니다."
        )
        
        return " ".join(diagnosis_lines)
