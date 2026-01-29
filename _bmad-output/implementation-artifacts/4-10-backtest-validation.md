# Story 4.10: 백테스트 검증 및 에러 핸들링 (Backtest Validation and Error Handling)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 백테스트 실행 중 에러가 발생하면 명확한 에러 메시지를 받고 싶다,
**so that** FR26의 첫 백테스트 성공률 90%+ 목표를 달성하고, 문제를 빠르게 수정하여 백테스트를 성공적으로 완료할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1-1에서 프론트엔드 스타터 템플릿 완료 ✅ (React, TypeScript, Tailwind CSS, Shadcn UI)
- Story 4-1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (API 엔드포인트 구조, 비동기 실행)
- Story 4-2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블)
- Story 4-3에서 전략 실행 엔진 check-passed ✅ (BacktestEngine 구현 예정)
- Story 4-8에서 백테스트 실행 UI check ✅ (4-8-deps-1 보완 Story 생성됨)

**문제:**
- 사용자가 백테스트를 실행할 때 전략에 에러가 있어도 명확한 피드백이 없음
- 어떤 노드에 문제가 있는지 알 수 없음
- 에러 메시지가 기술적이라 이해하기 어려움
- 수정 제안이 없어 사용자가 직접 디버깅해야 함
- FR26: 첫 백테스트 성공률 90%+ 목표를 달성하기 위해 포괄적인 에러 핸들링 필요
- NFR17: 에러 로그 7년 보관 (핀테크 규제 준수) 필요

**해결:**
전략 유효성 검사, 포괄적인 에러 핸들링, 명확한 에러 메시지, 수정 제안 기능 구현

**중요:**
- **FR26 커버**: 첫 백테스트 성공률 90%+ 목표 (엄격한 검증, 명확한 에러 메시지)
- **전략 유효성 검사**: 백테스트 실행 전 연결, 순환 참조, 파라미터, 데이터 가용성 검사
- **명확한 에러 메시지**: 기술적이지 않고 조작 가능한 에러 메시지 제공
- **수정 제안**: 어떤 노드에 문제가 있는지 하이라이트하고 수정 방법 제안
- **NFR17 준수**: 에러 로그 7년 보관 (핀테크 규제 준수)
- **성공률 모니터링**: Datadog/CloudWatch로 FR26 성공률 추적

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 전략 유효성 검사 실행 (백테스트 실행 전)

**Given** 사용자가 백테스트를 실행한다
**When** 전략에 에러가 있다 (예: 순환 참조, 연결 끊김)
**Then** 전략 유효성 검사가 먼저 실행된다
**And** 에러가 명확하게 표시된다
**And** 어떤 노드에 문제가 있는지 하이라이트된다 (노드 ID 표시)
**And** 수정 제안이 제공된다
**And** 백테스트가 실행되지 않는다

**검증 항목:**
1. 모든 노드가 연결되어 있다 (분리된 노드 없음)
2. 순환 참조가 없다 (Loop 노드 제외)
3. 필수 파라미터가 설정되었다
4. 데이터가 충분하다 (요청한 기간의 데이터 존재)

**기술 구현:**
```python
# gr8-backend/app/services/backtest_validator.py
from typing import List, Dict
from pydantic import BaseModel

class ValidationError(BaseModel):
    node_id: str
    error_type: str  # "disconnected", "circular_ref", "missing_param", "insufficient_data"
    message: str
    suggestion: str

class ValidationResult(BaseModel):
    is_valid: bool
    errors: List[ValidationError]

class BacktestValidator:
    def validate_strategy(self, strategy: dict) -> ValidationResult:
        """전략 유효성 검사"""
        errors = []

        # 1. 연결 검증
        disconnected_nodes = self._check_connections(strategy)
        if disconnected_nodes:
            for node_id in disconnected_nodes:
                errors.append(ValidationError(
                    node_id=node_id,
                    error_type="disconnected",
                    message=f"노드 {node_id}가 연결되지 않았습니다",
                    suggestion="이 노드를 다른 노드에 연결하거나 삭제하세요"
                ))

        # 2. 순환 참조 검증 (Loop 노드 제외)
        circular_refs = self._has_circular_reference(strategy)
        if circular_refs:
            for cycle in circular_refs:
                errors.append(ValidationError(
                    node_id=cycle[0],
                    error_type="circular_ref",
                    message=f"순환 참조가 발견되었습니다: {' → '.join(cycle)}",
                    suggestion="Loop 노드를 사용하거나 연결을 끊으세요"
                ))

        # 3. 파라미터 검증
        missing_params = self._check_required_params(strategy)
        if missing_params:
            for node_id, params in missing_params.items():
                errors.append(ValidationError(
                    node_id=node_id,
                    error_type="missing_param",
                    message=f"필수 파라미터가 누락되었습니다: {', '.join(params)}",
                    suggestion="노드 속성 패널에서 파라미터를 설정하세요"
                ))

        # 4. 데이터 가용성 검증
        data_check = self._check_data_availability(strategy)
        if not data_check['is_available']:
            errors.append(ValidationError(
                node_id=strategy.get('id', 'unknown'),
                error_type="insufficient_data",
                message=f"요청한 기간의 데이터가 없습니다: {data_check['missing_periods']}",
                suggestion="다른 기간을 선택하거나 더 짧은 기간으로 설정하세요"
            ))

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors
        )

    def _check_connections(self, strategy: dict) -> List[str]:
        """연결되지 않은 노드 찾기"""
        # 그래프 순회로 연결 검증
        # Story 3-1의 React Flow 그래프 구조 활용
        pass

    def _has_circular_reference(self, strategy: dict) -> List[List[str]]:
        """순환 참조 찾기 (DFS, 제외된 Loop 노드)"""
        # DFS로 순환 찾기 (Loop 노드 타입 제외)
        pass

    def _check_required_params(self, strategy: dict) -> Dict[str, List[str]]:
        """필수 파라미터 검증"""
        # 각 노드 타입별 필수 파라미터 확인
        # Story 3-2의 NodeType 정의 활용
        pass

    def _check_data_availability(self, strategy: dict) -> dict:
        """데이터 가용성 검증 (market_data 테이블 조회)"""
        # Story 4-2의 market_data 테이블 활용
        pass
```

### AC 2: 프론트엔드 에러 표시 UI

**Given** 전략 유효성 검사를 실패했다
**When** ValidationResult.errors가 반환된다
**Then** 에러가 사용자에게 명확하게 표시된다
**And** 에러 유형별로 색상 구분된다 (빨강: critical, 노랑: warning)
**And** 각 에러에 다음 정보가 표시된다:
  - 노드 ID (하이라이트)
  - 에러 메시지 (사용자 친화적 언어)
  - 수정 제안
**And** "문제 해결하기" 버튼이 제공된다 (해당 노드로 스크롤/포커스)

**기술 구현:**
```typescript
// src/components/backtest/ValidationErrorDisplay.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ValidationError {
  node_id: string;
  error_type: string;
  message: string;
  suggestion: string;
}

interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
}

export function ValidationErrorDisplay({ result }: { result: ValidationResult }) {
  if (result.is_valid) return null;

  const focusNode = (nodeId: string) => {
    // React Flow의 setNodes 및 fitView 활용
    // 해당 노드로 스크롤하고 하이라이트
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      reactFlowInstance.setNodes([
        { ...node, style: { ...node.style, border: '2px solid red' } }
      ]);
      reactFlowInstance.fitView({ nodes: [node], padding: 0.2 });
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle className="text-lg font-semibold">
        백테스트를 실행할 수 없습니다
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-4 mt-2">
          <p className="text-sm">다음 문제를 해결한 후 다시 시도하세요:</p>

          {result.errors.map((error, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  노드 {error.node_id}
                </Badge>
                <Badge variant={
                  error.error_type === 'disconnected' ? 'destructive' :
                  error.error_type === 'circular_ref' ? 'destructive' :
                  'default'
                }>
                  {getErrorTypeLabel(error.error_type)}
                </Badge>
              </div>

              <p className="text-sm font-medium">{error.message}</p>

              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  💡 {error.suggestion}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => focusNode(error.node_id)}
                >
                  문제 해결하기
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}

function getErrorTypeLabel(errorType: string): string {
  const labels = {
    disconnected: '연결 끊김',
    circular_ref: '순환 참조',
    missing_param: '파라미터 누락',
    insufficient_data: '데이터 부족'
  };
  return labels[errorType] || errorType;
}
```

### AC 3: 백엔드 에러 핸들링 및 로깅 (NFR17)

**Given** 백테스트 실행 중 에러가 발생한다
**When** API 에러, 데이터 에러, 또는 시스템 에러가 발생한다
**Then** 사용자에게 친절한 에러 메시지가 표시된다
**And** 에러 로그가 서버에 기록된다
**And** NFR17: 에러 로그는 7년 보관된다 (핀테크 규제 준수)
**And** 재시도 옵션이 제공된다
**And** 에러 유형별로 분류된다 (validation_error, api_error, data_error, system_error)

**기술 구현:**
```python
# gr8-backend/app/services/error_handler.py
import logging
from datetime import datetime
from typing import Optional
import structlog

# PinTech 규제 준수: 7년 보관
ERROR_LOG_RETENTION_YEARS = 7

class ErrorClassifier:
    """에러 유형 분류"""
    VALIDATION_ERROR = "validation_error"  # 전략 유효성 검사 실패
    API_ERROR = "api_error"              # 외부 API 실패 (Binance)
    DATA_ERROR = "data_error"            # 데이터 불일치/부족
    SYSTEM_ERROR = "system_error"        # 시스템 내부 에러

class BacktestErrorHandler:
    def __init__(self):
        # structlog로 구조화된 로깅
        self.logger = structlog.get_logger()

    def handle_error(
        self,
        error: Exception,
        context: dict,
        user_id: Optional[str] = None
    ) -> dict:
        """에러 처리 및 로깅"""

        # 에러 분류
        error_type = self._classify_error(error)

        # 에러 로그 (NFR17: 7년 보관)
        self._log_error(error, error_type, context, user_id)

        # 사용자 친화적 메시지 생성
        user_message = self._generate_user_message(error, error_type)

        return {
            "error_type": error_type,
            "message": user_message,
            "retryable": error_type in [ErrorClassifier.API_ERROR, ErrorClassifier.SYSTEM_ERROR],
            "timestamp": datetime.utcnow().isoformat()
        }

    def _classify_error(self, error: Exception) -> str:
        """에러 유형 분류"""
        if isinstance(error, ValidationError):
            return ErrorClassifier.VALIDATION_ERROR
        elif "API" in str(error) or "Binance" in str(error):
            return ErrorClassifier.API_ERROR
        elif "data" in str(error).lower() or "market" in str(error).lower():
            return ErrorClassifier.DATA_ERROR
        else:
            return ErrorClassifier.SYSTEM_ERROR

    def _log_error(
        self,
        error: Exception,
        error_type: str,
        context: dict,
        user_id: Optional[str]
    ):
        """에러 로그 (NFR17: 7년 보관, PinTech 규제 준수)"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "error_type": error_type,
            "error_message": str(error),
            "error_class": type(error).__name__,
            "user_id": user_id,
            "context": context,
            "retention_years": ERROR_LOG_RETENTION_YEARS  # 7년
        }

        # 구조화된 로그 기록 (CloudWatch/ELK로 전송)
        self.logger.error(
            "backtest_error",
            **log_entry
        )

        # DB에도 저장 (long-term retention)
        # error_logs 테이블에 7년 보관
        self._store_error_log(log_entry)

    def _generate_user_message(self, error: Exception, error_type: str) -> str:
        """사용자 친화적 에러 메시지 생성"""
        messages = {
            ErrorClassifier.VALIDATION_ERROR: "전략 설정에 문제가 있습니다. 위의 오류 메시지를 참고하여 수정해주세요.",
            ErrorClassifier.API_ERROR: "거래소 API 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
            ErrorClassifier.DATA_ERROR: "시장 데이터를 가져오는 중 문제가 발생했습니다. 다른 기간을 선택해주세요.",
            ErrorClassifier.SYSTEM_ERROR: "시스템 에러가 발생했습니다. 관리자에게 문의해주세요."
        }
        return messages.get(error_type, "알 수 없는 에러가 발생했습니다.")

    def _store_error_log(self, log_entry: dict):
        """에러 로그 DB 저장 (7년 보관)"""
        # error_logs 테이블에 INSERT
        # retention_period = 7 years
        pass

# FastAPI 엔드포인트에서 사용
# app/api/routers/backtest.py
@router.post("/")
async def execute_backtest(
    request: BacktestExecutionRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    error_handler = BacktestErrorHandler()

    try:
        # 1. 전략 유효성 검사
        validator = BacktestValidator()
        validation_result = validator.validate_strategy(request.strategy)

        if not validation_result.is_valid:
            return {
                "status": "failed",
                "error_type": "validation_error",
                "errors": validation_result.errors
            }

        # 2. 백테스트 실행
        # ... 실행 로직 ...

    except Exception as e:
        # 에러 처리 및 로깅 (NFR17)
        error_response = error_handler.handle_error(
            error=e,
            context={
                "strategy_id": request.strategy_id,
                "backtest_params": request.params
            },
            user_id=current_user.wallet_address
        )

        return {
            "status": "failed",
            **error_response
        }
```

### AC 4: FR26 성공률 모니터링 (Datadog/CloudWatch)

**Given** FR26: 첫 백테스트 성공률 90%+ 목표가 있다
**When** 백테스트 기능이 개발된다
**Then** 포괄적인 에러 핸들링이 구현된다
**And** 사용자 입력 검증이 강화된다
**And** 전략 유효성 검사가 엄격하다
**And** 에러 메시지가 명확하고 조작 가능하다
**And** FR26: 성공률이 모니터링된다 (Datadog/CloudWatch)

**기술 구현:**
```python
# gr8-backend/app/monitoring/backtest_metrics.py
import boto3

class BacktestMetrics:
    """FR26 성공률 모니터링"""

    def __init__(self):
        self.cloudwatch = boto3.client('cloudwatch')

    def record_backtest_attempt(self, success: bool, error_type: Optional[str] = None):
        """백테스트 시도 기록 (CloudWatch metric)"""

        # FR26: 성공률 추적
        self.cloudwatch.put_metric_data(
            Namespace='gr8/backtest',
            MetricData=[{
                'MetricName': 'BacktestAttempt',
                'Value': 1,
                'Unit': 'Count'
            }]
        )

        if success:
            self.cloudwatch.put_metric_data(
                Namespace='gr8/backtest',
                MetricData=[{
                    'MetricName': 'BacktestSuccess',
                    'Value': 1,
                    'Unit': 'Count'
                }]
            )
        else:
            self.cloudwatch.put_metric_data(
                Namespace='gr8/backtest',
                MetricData=[{
                    'MetricName': 'BacktestFailure',
                    'Value': 1,
                    'Unit': 'Count'
                }]
            )

            # 에러 유형별 분류
            if error_type:
                self.cloudwatch.put_metric_data(
                    Namespace='gr8/backtest',
                    MetricData=[{
                        'MetricName': f'BacktestFailure_{error_type}',
                        'Value': 1,
                        'Unit': 'Count'
                    }]
                )

    def setup_success_rate_alarm(self):
        """FR26: 성공률 < 90% 시 경보"""
        self.cloudwatch.put_metric_alarm(
            AlarmName='gr8-backtest-low-success-rate',
            AlarmDescription='FR26 첫 백테스트 성공률 90%+ 목표 미달 경보',
            ActionsEnabled=True,
            OKActions=['arn:aws:sns:...:notifications'],  # 성공 시 SNS
            AlarmActions=['arn:aws:sns:...:alerts'],       # 실패 시 SNS
            MetricName='BacktestSuccessRate',
            Namespace='gr8/backtest',
            Statistic='Average',
            Period=300,  # 5분
            EvaluationPeriods=1,
            Threshold=90,
            ComparisonOperator='LessThanThreshold'
        )

# 백엔드 API에서 메트릭 기록
metrics = BacktestMetrics()

@router.post("/")
async def execute_backtest(...):
    try:
        # 백테스트 실행
        result = await service.execute_backtest(...)

        # FR26: 성공 기록
        metrics.record_backtest_attempt(success=True)

        return result

    except Exception as e:
        # FR26: 실패 기록
        error_type = error_handler._classify_error(e)
        metrics.record_backtest_attempt(success=False, error_type=error_type)

        raise
```

### AC 5: 에러 로그 DB 스키마 (NFR17)

**Given** NFR17: 에러 로그는 7년 보관된다 (핀테크 규제 준수)
**When** 에러가 발생한다
**Then** 에러 로그가 DB에 저장된다
**And** 7년 후 자동 삭제된다
**And** 에러 로그 쿼리 API가 제공된다 (관리자용)

**기술 구현:**
```python
# Alembic migration
# alembic/versions/xxx_create_error_logs_table.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'error_logs',
        sa.Column('id', sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column('timestamp', sa.TIMESTAMP, nullable=False, index=True),
        sa.Column('error_type', sa.String(50), nullable=False, index=True),
        sa.Column('error_message', sa.Text, nullable=False),
        sa.Column('error_class', sa.String(200)),
        sa.Column('user_id', sa.String(50)),
        sa.Column('context', sa.JSON),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now()),

        # NFR17: 7년 자동 삭제 (PinTech 규제 준수)
        sa.CheckConstraint("created_at >= NOW() - INTERVAL '7 years'")
    )

    # 인덱스 (쿼리 성능)
    op.create_index('ix_error_logs_timestamp', 'error_logs', ['timestamp'])
    op.create_index('ix_error_logs_error_type', 'error_logs', ['error_type'])
    op.create_index('ix_error_logs_user_id', 'error_logs', ['user_id'])

    # 7년 보관 정책 (PostgreSQL 파티셔닝 또는 주기적 삭제)
    # option 1: pg_cron 확장 사용
    # option 2: AWS Lambda 주기적 실행
```

---

## Tasks / Subtasks

### Task 1: BacktestValidator 구현 (AC: #1)
- [ ] Subtask 1.1: BacktestValidator 클래스 생성 (app/services/backtest_validator.py)
- [ ] Subtask 1.2: validate_strategy() 메서드 구현
- [ ] Subtask 1.3: _check_connections() 연결 검증 구현
- [ ] Subtask 1.4: _has_circular_reference() 순환 참조 검증 구현
- [ ] Subtask 1.5: _check_required_params() 파라미터 검증 구현
- [ ] Subtask 1.6: _check_data_availability() 데이터 가용성 검증 구현

### Task 2: 백엔드 API 통합 (AC: #1, #3)
- [ ] Subtask 2.1: POST /api/v1/backtests 엔드포인트에 BacktestValidator 통합
- [ ] Subtask 2.2: ValidationResult Pydantic 스키마 구현
- [ ] Subtask 2.3: 밸리데이션 실패 시 400 에러 반환
- [ ] Subtask 2.4: 에러 응답 형식 표준화

### Task 3: 프론트엔드 ValidationErrorDisplay 컴포넌트 (AC: #2)
- [ ] Subtask 3.1: ValidationErrorDisplay.tsx 컴포넌트 생성
- [ ] Subtask 3.2: 에러 유형별 색상 구분 (Badge, Alert)
- [ ] Subtask 3.3: "문제 해결하기" 버튼 구현 (노드 포커스)
- [ ] Subtask 3.4: React Flow integration (노드 하이라이트)

### Task 4: BacktestErrorHandler 구현 (AC: #3)
- [ ] Subtask 4.1: BacktestErrorHandler 클래스 생성 (app/services/error_handler.py)
- [ ] Subtask 4.2: ErrorClassifier 에러 유형 분류 구현
- [ ] Subtask 4.3: handle_error() 메서드 구현
- [ ] Subtask 4.4: _log_error() 에러 로깅 구현 (structlog)
- [ ] Subtask 4.5: _generate_user_message() 사용자 메시지 생성

### Task 5: 에러 로그 DB 스키마 (AC: #5)
- [ ] Subtask 5.1: error_logs 테이블 Alembic migration 생성
- [ ] Subtask 5.2: NFR17: 7년 보관 정책 구현 (CheckConstraint)
- [ ] Subtask 5.3: 인덱스 생성 (timestamp, error_type, user_id)
- [ ] Subtask 5.4: 7년 자동 삭제 작업 (pg_cron 또는 Lambda)
- [ ] Subtask 5.5: alembic upgrade head 실행

### Task 6: FR26 성공률 모니터링 (AC: #4)
- [ ] Subtask 6.1: BacktestMetrics 클래스 생성 (app/monitoring/backtest_metrics.py)
- [ ] Subtask 6.2: record_backtest_attempt() 메서드 구현
- [ ] Subtask 6.3: CloudWatch metric 전송 (BacktestAttempt, BacktestSuccess, BacktestFailure)
- [ ] Subtask 6.4: setup_success_rate_alarm() 알람 설정 (< 90% 경보)
- [ ] Subtask 6.5: 백엔드 API에 메트릭 기록 통합

### Task 7: 단위 테스트 작성
- [ ] Subtask 7.1: BacktestValidator 연결 검증 테스트
- [ ] Subtask 7.2: BacktestValidator 순환 참조 검증 테스트
- [ ] Subtask 7.3: BacktestValidator 파라미터 검증 테스트
- [ ] Subtask 7.4: BacktestErrorHandler 에러 분류 테스트
- [ ] Subtask 7.5: ValidationErrorDisplay 컴포넌트 테스트 (Mock 데이터)
- [ ] Subtask 7.6: pytest 실행 및 커버리지 확인 (> 80% 목표)

### Task 8: 통합 테스트 (백테스트 검증 시나리오)
- [ ] Subtask 8.1: 연결 끊김 전략 백테스트 → 실패 검증
- [ ] Subtask 8.2: 순환 참조 전략 백테스트 → 실패 검증
- [ ] Subtask 8.3: 파라미터 누락 전략 백테스트 → 실패 검증
- [ ] Subtask 8.4: 정상 전략 백테스트 → 성공 검증
- [ ] Subtask 8.5: 에러 로그 저장 검증 (error_logs 테이블)

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스트 검증 및 에러 핸들링을 구현**합니다. 완료되면:
- **전략 유효성 검사**: 백테스트 실행 전 연결, 순환 참조, 파라미터, 데이터 검사
- **명확한 에러 메시지**: 사용자 친화적, 조작 가능한 에러 메시지
- **수정 제안**: 어떤 노드에 문제가 있는지 하이라이트 및 수정 방법 제안
- **FR26 만족**: 첫 백테스트 성공률 90%+ (엄격한 검증, 포괄적인 에러 핸들링)
- **NFR17 준수**: 에러 로그 7년 보관 (핀테크 규제 준수)
- **성공률 모니터링**: Datadog/CloudWatch로 FR26 성공률 추적

### 📚 Story 4.1 (백테스팅 엔진 아키텍처) & Story 4.8 (백테스트 실행 UI)에서 배운 패턴

**비동기 실행 아키텍처** [Source: 4-1-backtest-engine-architecture.md]:
```python
# FastAPI BackgroundTasks for 백그라운드 실행
from fastapi import BackgroundTasks

@router.post("/")
async def execute_backtest(
    request: BacktestExecutionRequest,
    background_tasks: BackgroundTasks
):
    # 전략 유효성 검사 (Story 4.10 추가)
    validator = BacktestValidator()
    validation_result = validator.validate_strategy(request.strategy)

    if not validation_result.is_valid:
        return {"status": "failed", "errors": validation_result.errors}

    # 백그라운드에서 실행
    background_tasks.add_task(
        service.execute_backtest,
        backtest_id=backtest_id
    )
```

**FR26 성공률 90%+ 전략** [Source: 4-8-backtest-ui.md line 634-637]:
- 예상 소요 시간 표시 (사용자 기대치 관리)
- 포괄적인 에러 핸들링
- 명확하고 조작 가능한 에러 메시지

### 🏗️ 핵심 구현 전략

**1. 전략 유효성 검사 (사전 예방)**
```python
# 백테스트 실행 전 4가지 검증
class BacktestValidator:
    1. 연결 검증: 모든 노드가 연결되어 있는가?
    2. 순환 참조 검증: Loop 노드 제외하고 순환이 없는가?
    3. 파라미터 검증: 필수 파라미터가 모두 설정되었는가?
    4. 데이터 가용성 검증: 요청한 기간의 데이터가 있는가?
```

**2. 명확하고 조작 가능한 에러 메시지**
```typescript
// 기술적인 에러 → 사용자 친화적 메시지
{
  "error_type": "circular_ref",
  "message": "순환 참조가 발견되었습니다: RSI → Buy → RSI",
  "suggestion": "Loop 노드를 사용하거나 연결을 끊으세요"
}

// UI: "문제 해결하기" 버튼 → 해당 노드로 포커스
```

**3. NFR17: 에러 로그 7년 보관 (PinTech 규제 준수)**
```python
# 1. 구조화된 로그 (structlog)
# 2. CloudWatch/ELK로 전송 (실시간 모니터링)
# 3. DB에 7년 보관 (long-term retention)
# 4. 7년 후 자동 삭제 (CheckConstraint + pg_cron)

error_logs 테이블:
- timestamp (indexed)
- error_type (indexed)
- error_message
- error_class
- user_id (indexed)
- context (JSON)
- created_at
- CHECK: created_at >= NOW() - INTERVAL '7 years'
```

**4. FR26 성공률 모니터링**
```python
# CloudWatch Metrics
- BacktestAttempt (총 시도 횟수)
- BacktestSuccess (성공 횟수)
- BacktestFailure (실패 횟수)
- BacktestFailure_validation_error (밸리데이션 실패)
- BacktestFailure_api_error (API 실패)
- BacktestFailure_data_error (데이터 실패)
- BacktestFailure_system_error (시스템 실패)

# CloudWatch Alarm
- BacktestSuccessRate < 90% → SNS 경보
```

### 📊 데이터 흐름

```
1. 사용자가 "백테스트 실행" 클릭
   ↓
2. POST /api/v1/backtests
   ↓
3. 전략 유효성 검사 (BacktestValidator)
   ├─ 연결 검증 ❌ → 에러 반환 (노드 하이라이트 + 수정 제안)
   ├─ 순환 참조 검증 ❌ → 에러 반환
   ├─ 파라미터 검증 ❌ → 에러 반환
   └─ 데이터 가용성 검증 ❌ → 에러 반환
   ↓
4. 검증 통과 ✅
   ↓
5. 백그라운드에서 백테스트 실행
   ├─ 에러 발생 → BacktestErrorHandler.handle_error()
   │   ├─ 에러 분류 (validation_error, api_error, data_error, system_error)
   │   ├─ 에러 로그 (structlog + DB, NFR17: 7년 보관)
   │   └─ 사용자 메시지 생성
   ↓
6. FR26: CloudWatch metric 기록
   ├─ BacktestAttempt += 1
   └─ success ? BacktestSuccess += 1 : BacktestFailure += 1
   ↓
7. 결과 반환 (성공 또는 에러)
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1-1: 프론트엔드 스타터 템플릿 (React, TypeScript, Tailwind CSS)
- ✅ Story 3-1: React Flow 에디터 (그래프 구조, 노드 연결)
- ✅ Story 3-2: 노드 타입 정의 (필수 파라미터)
- ✅ Story 4-1: 백테스팅 엔진 아키텍처 설계 (API 구조)
- ✅ Story 4-2: 과거 시장 데이터 수집 (market_data 테이블)
- ⚠️ Story 4-3: 전략 실행 엔진 (BacktestEngine) - **선행 필수**
- ⚠️ Story 4-8: 백테스트 실행 UI - **선행 필수**

**후속 Stories:**
- Epic 4 완료 (마지막 Story)

**파일 생성/수정 목록:**
1. `gr8-backend/app/services/backtest_validator.py` - 🆕 새로 생성
2. `gr8-backend/app/services/error_handler.py` - 🆕 새로 생성
3. `gr8-backend/app/monitoring/backtest_metrics.py` - 🆕 새로 생성
4. `gr8-backend/alembic/versions/xxx_create_error_logs_table.py` - 🆕 새로 생성
5. `gr8-backend/app/api/routers/backtest.py` - ✅ 수정 (BacktestValidator 통합)
6. `gr8-frontend/src/components/backtest/ValidationErrorDisplay.tsx` - 🆕 새로 생성
7. `gr8-frontend/src/components/backtest/BacktestProgressModal.tsx` - ✅ 수정 (에러 표시)
8. `tests/unit/test_backtest_validator.test.py` - 🆕 새로 생성
9. `tests/unit/test_error_handler.test.py` - 🆕 새로 생성

### ⚠️ 중요 고려사항

**1. FR26 성공률 90%+ 달성 전략**
- **엄격한 사전 검증**: 백테스트 실행 전 모든 에러 사전 차단
- **명확한 에러 메시지**: 사용자가 직접 문제를 이해하고 수정 가능
- **수정 제안**: 어떻게 고치는지 구체적으로 안내
- **성공률 모니터링**: Datadog/CloudWatch로 실시간 추적

**2. NFR17: 에러 로그 7년 보관 (PinTech 규제 준수)**
- **구조화된 로그**: structlog로 JSON 형식 로그
- **중앙 집중식 로깅**: CloudWatch Logs 또는 ELK Stack
- **장기 보관**: DB에 7년 보관 (legal requirement)
- **자동 삭제**: 7년 지난 로그 자동 삭제 (pg_cron 또는 Lambda)

**3. 에러 유형별 분류**
- **validation_error**: 전략 유효성 검사 실패 (사용자 실수)
- **api_error**: Binance API 실패 (일시적 문제)
- **data_error**: 데이터 불일치/부족 (기간 설정 문제)
- **system_error**: 시스템 내부 에러 (관리자 개입 필요)

**4. 사용자 경험 고려**
- **친절한 언어**: 기술 용어 최소화, 이해하기 쉬운 메시지
- **조작 가능성**: "문제 해결하기" 버튼으로 직접 노드로 이동
- **색상 구분**: 에러 유형별로 시각적 구분 (빨강, 노랑)
- **재시도 옵션**: 일시적 에러의 경우 재시도 버튼 제공

**5. React Flow integration**
- **노드 하이라이트**: 에러 노드 테두리 빨간색
- **fitView**: 해당 노드로 자동 스크롤
- **setNodes**: 노드 스타일 일시적 변경 (하이라이트 효과)

**6. 성공률 모니터링**
- **CloudWatch metric**: BacktestSuccessRate = (BacktestSuccess / (BacktestSuccess + BacktestFailure)) * 100
- **Alarm**: 성공률 < 90% 시 SNS 경보
- **Dashboard**: 에러 유형별 분류 대시보드

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.10 요구사항 분석 (epics.md)
2. Story 4.1, 4.8 문서 분석 (아키텍처, 실행 UI)
3. Architecture.md에서 NFR17, FR26 분석
4. Git 커밋 히스토리 분석 (최근 작업 패턴)
5. 5개 AC 정의 (전략 유효성 검사, 에러 표시 UI, 에러 핸들링, FR26 모니터링, 에러 로그 DB)
6. 8개 Task/40개 Subtask 정의
7. Dev Notes 작성 (FR26 전략, NFR17 준수, 데이터 흐름)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- 전략 유효성 검사 (연결, 순환 참조, 파라미터, 데이터)
- 명확한 에러 메시지 (사용자 친화적, 조작 가능)
- 수정 제안 (노드 하이라이트, "문제 해결하기" 버튼)
- 에러 핸들링 (에러 분류, 로깅, 재시도)
- NFR17 준수 (에러 로그 7년 보관)
- FR26 만족 (성공률 90%+, CloudWatch 모니터링)

📋 **다음 단계:**
- Story 4-10 개발 시작 (BacktestValidator, 에러 핸들러, FR26 모니터링)
- Epic 4 완료 (마지막 Story)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-10-backtest-validation.md` - This story file

**Backend Files to Create (est. 4 files)**
- `gr8-backend/app/services/backtest_validator.py` - 🆕 새로 생성
- `gr8-backend/app/services/error_handler.py` - 🆕 새로 생성
- `gr8-backend/app/monitoring/backtest_metrics.py` - 🆕 새로 생성
- `gr8-backend/alembic/versions/xxx_create_error_logs_table.py` - 🆕 새로 생성

**Backend Files to Modify (est. 1 file)**
- `gr8-backend/app/api/routers/backtest.py` - ✅ 수정 (BacktestValidator 통합)

**Frontend Files to Create (est. 1 file)**
- `gr8-frontend/src/components/backtest/ValidationErrorDisplay.tsx` - 🆕 새로 생성

**Frontend Files to Modify (est. 1 file)**
- `gr8-frontend/src/components/backtest/BacktestProgressModal.tsx` - ✅ 수정 (에러 표시)

**Test Files (est. 2 files)**
- `tests/unit/test_backtest_validator.test.py` - 🆕 새로 생성
- `tests/unit/test_error_handler.test.py` - 🆕 새로 생성

**Total:** 9-11 files to create/modify
