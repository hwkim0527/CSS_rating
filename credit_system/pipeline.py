import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

class CreditDataPipeline:
    def __init__(self, raw_data_path, output_dir=None, sample_size=50000, seed=42):
        """
        신용평가 데이터 파이프라인 초기화
        raw_data_path: loan.csv 파일의 절대 경로 또는 상대 경로
        output_dir: 처리된 데이터가 저장될 디렉토리
        sample_size: 대용량 데이터 분석을 위한 PoC 샘플 크기 (None 이면 전체 처리)
        seed: 재현성을 위한 난수 시드
        """
        self.raw_data_path = raw_data_path
        self.output_dir = output_dir or os.path.dirname(raw_data_path)
        self.sample_size = sample_size
        self.seed = seed
        
        # 사후 변수(Data Leakage) 블랙리스트 정의 - 대출 실행 이후에 발생하는 변수로 반드시 차단
        self.leakage_blacklist = [
            'total_pymnt', 'total_pymnt_inv', 'total_rec_prncp', 'total_rec_int',
            'total_rec_late_fee', 'recoveries', 'collection_recovery_fee',
            'last_pymnt_d', 'last_pymnt_amnt', 'next_pymnt_d', 'last_credit_pull_d',
            'out_prncp', 'out_prncp_inv', 'hardship_flag', 'debt_settlement_flag',
            'funded_amnt_inv', 'funded_amnt', 'pymnt_plan', 'url', 'id', 'member_id',
            'policy_code', 'issue_d', 'zip_code'
        ]
        
        # 핵심 피처 정의 (기존의 주요 예측 변수들)
        self.numeric_features = [
            'loan_amnt', 'int_rate', 'installment', 'annual_inc', 'dti', 
            'delinq_2yrs', 'fico_score', 'inq_last_6mths', 'open_acc', 
            'pub_rec', 'revol_bal', 'revol_util', 'total_acc', 'credit_age_months'
        ]
        
        self.categorical_features = [
            'term', 'grade', 'sub_grade', 'emp_length', 'home_ownership', 
            'verification_status', 'purpose', 'addr_state'
        ]

    def _parse_emp_length(self, val):
        """emp_length 문자열을 수치로 변환"""
        if pd.isna(val):
            return -1
        val_str = str(val).strip().lower()
        if '10+' in val_str:
            return 10
        elif '< 1' in val_str or 'less than 1' in val_str:
            return 0
        else:
            # 숫지만 추출
            digits = ''.join([c for c in val_str if c.isdigit()])
            return int(digits) if digits else -1

    def _parse_revol_util(self, val):
        """revol_util 퍼센트 문자열을 실수로 변환"""
        if pd.isna(val):
            return np.nan
        val_str = str(val).replace('%', '').strip()
        try:
            return float(val_str)
        except ValueError:
            return np.nan

    def _parse_int_rate(self, val):
        """int_rate 퍼센트 문자열을 실수로 변환 (필요시)"""
        if pd.isna(val):
            return np.nan
        if isinstance(val, (int, float)):
            return float(val)
        val_str = str(val).replace('%', '').strip()
        try:
            return float(val_str)
        except ValueError:
            return np.nan

    def _parse_credit_age(self, earliest_cr_line, ref_date='2016-01-01'):
        """earliest_cr_line으로부터 신용 연령(개월수) 계산"""
        if pd.isna(earliest_cr_line):
            return 0
        try:
            ref_dt = pd.to_datetime(ref_date)
            # Lending Club 데이터 포맷: "Dec-1999" 또는 "1999-12-01"
            cr_dt = pd.to_datetime(earliest_cr_line, errors='coerce')
            if pd.isna(cr_dt):
                return 0
            # 개월 수 차이 계산
            delta = ref_dt.to_period('M') - cr_dt.to_period('M')
            return max(0, delta.n)
        except Exception:
            return 0

    def load_and_clean_data(self):
        """데이터 로드 및 정제"""
        print(f"데이터 파일 읽는 중: {self.raw_data_path}")
        
        # 1. 대용량 파일이므로 chunk로 읽어서 샘플링하거나 nrows 사용
        if self.sample_size:
            # 임의 샘플링을 위해 pandas read_csv의 skiprows를 정교하게 쓸 수도 있으나,
            # PoC 단계의 빠른 피드백을 위해 최초 nrows + 균형 샘플링 혼합
            # 대량의 데이터 중 일부를 먼저 로드한 뒤 Target 기준으로 다운샘플링
            df = pd.read_csv(self.raw_data_path, nrows=self.sample_size * 5, low_memory=False)
        else:
            df = pd.read_csv(self.raw_data_path, low_memory=False)
            
        print(f"로드 완료: {df.shape[0]} 행, {df.shape[1]} 열")
        
        # 컬럼명 소문자 표준화 및 언더바 처리 (유저 설명 문서의 컬럼명 포맷 유연성 확보)
        df.columns = [c.replace(' ', '_').lower() for c in df.columns]
        
        # 타겟 매핑 변수 확인 (loan_status 또는 loanstatus)
        target_col = 'loan_status'
        if target_col not in df.columns:
            # 다른 표기법 확인
            alternatives = [c for c in df.columns if 'status' in c or 'target' in c]
            if alternatives:
                target_col = alternatives[0]
            else:
                raise ValueError("loan_status 컬럼을 찾을 수 없습니다.")

        print(f"타겟 컬럼 '{target_col}' 기준 이진 매핑 수행 중...")
        # 2. 타겟 이진 분류 매핑 (부실: 1, 정상: 0, 그 외 제외)
        # 정상: Fully Paid
        # 부실: Charged Off, Default, Late (31-120 days)
        # 제외: Current, In Grace Period, Late (16-30 days), Does not meet the credit policy...
        def map_target(status):
            if pd.isna(status):
                return -1
            status_str = str(status).strip()
            if status_str in ['Fully Paid', 'Does not meet the credit policy. Status:Fully Paid']:
                return 0
            elif status_str in ['Charged Off', 'Default', 'Late (31-120 days)', 'Does not meet the credit policy. Status:Charged Off']:
                return 1
            else:
                return -1 # 제외 대상
                
        df['target'] = df[target_col].apply(map_target)
        df = df[df['target'] != -1].copy()
        print(f"정상/부실 필터링 후 행 수: {df.shape[0]} (부실 비중: {df['target'].mean()*100:.2f}%)")
        
        # 3. Data Leakage 방지를 위해 블랙리스트 변수 제거
        cols_to_drop = [c for c in self.leakage_blacklist if c in df.columns]
        # target_col도 leakage는 아니지만 학습 피처에서 제외해야 함
        if target_col in df.columns:
            cols_to_drop.append(target_col)
        df = df.drop(columns=cols_to_drop, errors='ignore')
        
        # 4. 피처 엔지니어링
        # A. FICO 점수 평균
        fico_low_col = 'fico_range_low' if 'fico_range_low' in df.columns else 'ficorangelow'
        fico_high_col = 'fico_range_high' if 'fico_range_high' in df.columns else 'ficorangehigh'
        if fico_low_col in df.columns and fico_high_col in df.columns:
            df['fico_score'] = (df[fico_low_col] + df[fico_high_col]) / 2.0
            df = df.drop(columns=[fico_low_col, fico_high_col], errors='ignore')
        else:
            df['fico_score'] = 680.0 # default median
            
        # B. earliest_cr_line -> 신용 연령(개월수)
        earliest_cr_col = 'earliest_cr_line' if 'earliest_cr_line' in df.columns else 'earliestcrline'
        df['credit_age_months'] = df[earliest_cr_col].apply(self._parse_credit_age)
        df = df.drop(columns=[earliest_cr_col], errors='ignore')
        
        # C. emp_length 정제
        emp_len_col = 'emp_length' if 'emp_length' in df.columns else 'emplength'
        df['emp_length_num'] = df[emp_len_col].apply(self._parse_emp_length)
        # 원래 emp_length 컬럼명 유지
        df = df.drop(columns=[emp_len_col], errors='ignore')
        df = df.rename(columns={'emp_length_num': 'emp_length'})
        
        # D. revol_util, int_rate 정제
        revol_col = 'revol_util' if 'revol_util' in df.columns else 'revolutil'
        df['revol_util'] = df[revol_col].apply(self._parse_revol_util)
        
        int_rate_col = 'int_rate' if 'int_rate' in df.columns else 'intrate'
        df['int_rate'] = df[int_rate_col].apply(self._parse_int_rate)
        
        # E. term 문자열 숫자로 정제
        term_col = 'term' if 'term' in df.columns else 'term'
        def parse_term(t):
            if pd.isna(t):
                return 36
            digits = ''.join([c for c in str(t) if c.isdigit()])
            return int(digits) if digits else 36
        df['term'] = df[term_col].apply(parse_term)

        # 5. 균형 샘플링 수행 (대규모 데이터셋 불균형 해결 및 PoC 속도 향상)
        if self.sample_size and len(df) > self.sample_size:
            pos = df[df['target'] == 1]
            neg = df[df['target'] == 0]
            
            # 부실 1, 정상 0의 비율을 1:2 혹은 1:3 정도로 균형 잡히도록 샘플링
            n_pos = min(len(pos), int(self.sample_size * 0.3))
            n_neg = min(len(neg), self.sample_size - n_pos)
            
            pos_sampled = pos.sample(n=n_pos, random_state=self.seed)
            neg_sampled = neg.sample(n=n_neg, random_state=self.seed)
            
            df = pd.concat([pos_sampled, neg_sampled]).sample(frac=1, random_state=self.seed).reset_index(drop=True)
            print(f"균형 샘플링 완료: {df.shape[0]} 행 (부실: {n_pos}건, 정상: {n_neg}건)")

        # 6. 결측치 및 최종 피처 정리
        for col in self.numeric_features:
            if col in df.columns:
                median_val = df[col].median()
                df[col] = df[col].fillna(median_val)
            else:
                # 없는 경우 기본값 채우기
                df[col] = 0.0
                
        for col in self.categorical_features:
            if col in df.columns:
                df[col] = df[col].fillna('Unknown').astype(str)
            else:
                df[col] = 'Unknown'
                
        # 최종적으로 모델에 필요한 피처 및 target만 보존
        final_cols = self.numeric_features + self.categorical_features + ['target']
        df = df[final_cols].copy()
        
        return df

    def serialize_to_text(self, row):
        """
        Tabular 행 데이터를 sLLM 학습용 한글 자연어 텍스트 프롬프트로 직렬화
        """
        # 주거 형태 번역/매핑
        home_map = {'RENT': '월세(임차)', 'OWN': '자가 소유', 'MORTGAGE': '주택담보대출 보유', 'OTHER': '기타 주거'}
        home_status = home_map.get(str(row['home_ownership']).upper(), '기타 주거')
        
        # 대출 목적 번역/매핑
        purpose_map = {
            'debt_consolidation': '부채 통합(대환)', 'credit_card': '신용카드 대금 상환', 
            'home_improvement': '주택 개량', 'other': '기타 목적', 'major_purchase': '주요 물품 구입',
            'small_business': '소규모 사업 자금', 'car': '자동차 구입', 'medical': '의료비',
            'moving': '이사 비용', 'vacation': '휴가 비용', 'house': '주택 구입', 
            'wedding': '결혼 자금', 'renewable_energy': '친환경 에너지 투자'
        }
        loan_purpose = purpose_map.get(str(row['purpose']).lower(), '기타 목적')
        
        # 재직 기간 설명
        emp_len = int(row['emp_length'])
        emp_desc = f"{emp_len}년" if emp_len > 0 else ("10년 이상" if emp_len == 10 else "1년 미만 또는 미상")
        
        # FICO 등급
        fico = float(row['fico_score'])
        
        # 소득 대비 부채 비율
        dti = float(row['dti'])
        
        text = (
            f"이 대출 신청자는 연소득 {row['annual_inc']:,.0f}달러이며, 재직 기간은 {emp_desc}입니다. "
            f"주거 형태는 {home_status}이며, 신용카드 대금 등을 검증한 결과 소득 검증 여부는 {row['verification_status']}입니다. "
            f"신청한 대출 금액은 {row['loan_amnt']:,.0f}달러, 대출 기간은 {row['term']}개월이며, 적용 금리는 {row['int_rate']:.2f}%입니다. "
            f"매월 납입해야 하는 상환 원리금은 {row['installment']:,.0f}달러입니다. "
            f"FICO 신용 점수는 {fico:.0f}점이고, 총 신용 연령은 {row['credit_age_months']:.0f}개월(약 {row['credit_age_months']/12:.1f}년)입니다. "
            f"총 부채상환비율(DTI)은 {dti:.2f}%입니다. "
            f"최근 6개월간 신용조회 건수는 {row['inq_last_6mths']:.0f}건이고, 과거 2년간 30일 이상 연체 이력은 {row['delinq_2yrs']:.0f}건입니다. "
            f"현재 보유하고 있는 개설된 신용계좌 수는 {row['open_acc']:.0f}개이고, 전체 신용 한도 대비 사용률(revol_util)은 {row['revol_util']:.2f}%입니다. "
            f"기존 대출 및 연체 등의 법적 공공기록(pub_rec) 건수는 {row['pub_rec']:.0f}건입니다. "
            f"이번 대출의 신청 목적은 {loan_purpose}입니다."
        )
        return text

    def run_pipeline(self):
        """전체 파이프라인 구동 및 학습용/검증용 데이터 저장"""
        df_cleaned = self.load_and_clean_data()
        
        print("Tabular -> 한글 텍스트 직렬화(SFT 프롬프트 변환) 수행 중...")
        # sLLM을 위한 텍스트 컬럼 생성
        df_cleaned['text_prompt'] = df_cleaned.apply(self.serialize_to_text, axis=1)
        
        # Train / Val / Test 분할 (8:1:1)
        train_df, temp_df = train_test_split(df_cleaned, test_size=0.2, random_state=self.seed, stratify=df_cleaned['target'])
        val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=self.seed, stratify=temp_df['target'])
        
        print(f"데이터 분할 완료: Train {train_df.shape[0]}, Val {val_df.shape[0]}, Test {test_df.shape[0]}")
        
        # 결과 저장
        os.makedirs(self.output_dir, exist_ok=True)
        
        train_df.to_csv(os.path.join(self.output_dir, 'train_processed.csv'), index=False, encoding='utf-8')
        val_df.to_csv(os.path.join(self.output_dir, 'val_processed.csv'), index=False, encoding='utf-8')
        test_df.to_csv(os.path.join(self.output_dir, 'test_processed.csv'), index=False, encoding='utf-8')
        
        print(f"정제된 데이터셋이 {self.output_dir} 디렉토리에 정상 저장되었습니다.")
        
        # 검증 결과 리턴
        return {
            'train_size': len(train_df),
            'val_size': len(val_df),
            'test_size': len(test_df),
            'blacklist_removed': len(self.leakage_blacklist)
        }

if __name__ == '__main__':
    # 로컬 수동 테스트용 진입점
    raw_path = r"data_source/loan.csv"
    pipeline = CreditDataPipeline(raw_path, sample_size=1000)
    res = pipeline.run_pipeline()
    print("수동 테스트 결과:", res)
