# gr8 Production Infrastructure - Terraform

AWS 프로덕션 인프라를 Terraform으로 코드화하여 관리합니다.

## 📋 개요

이 Terraform 설정은 다음 AWS 리소스를 생성합니다:

- **VPC 네트워킹**: 퍼블릭/프라이빗 서브넷, IGW, NAT Gateway
- **ECR**: Docker 이미지 저장소
- **RDS PostgreSQL**: db.t3.micro 인스턴스 (프라이빗 서브넷)
- **ECS Fargate**: Serverless 컨테이너 클러스터
- **ALB**: Application Load Balancer
- **CloudWatch**: 로그 그룹 및 모니터링

## 💰 비용 정보

**월간 예상 비용**: ~$80

- RDS db.t3.micro: ~$15/월
- NAT Gateway: ~$30/월
- ALB: ~$20/월
- ECS Fargate: ~$10/월
- CloudWatch Logs: ~$5/월

⚠️ **terraform apply 실행 후 즉시 비용 발생 시작**
⚠️ **테스트 후 반드시 terraform destroy로 리소스 삭제**

## 🚀 빠른 시작

### 1. 사전 요구사항

- [ ] AWS CLI 설치 및 설정
- [ ] AWS 자격증명 (Access Key, Secret Key)
- [ ] Terraform 1.0+ 설치

### 2. AWS 자격증명 설정

```bash
# AWS CLI 설치
aws configure

# 또는 환경변수 설정
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_DEFAULT_REGION="ap-northeast-2"
```

### 3. Terraform 초기화

```bash
cd infrastructure/terraform

# 프로바이더 초기화
terraform init

# 변수 파일 복사 및 설정
cp terraform.tfvars.example terraform.tfvars

# terraform.tfvars 편집 (필수: db_password 변경)
nano terraform.tfvars
```

### 4. 배포 계획 확인

```bash
# 생성될 리소스 미리보기
terraform plan

# 변경 사항 검토
terraform plan -out=tfplan
```

### 5. 인프라 배포

```bash
# 배포 실행 (약 10-15분 소요)
terraform apply

# 또는 plan 파일 사용
terraform apply tfplan
```

### 6. 출력값 확인

```bash
# 모든 출력값 확인
terraform output

# 특정 출력값 확인
terraform output rds_endpoint
terraform output ecr_repository_url
terraform output alb_dns_name
```

## 📁 프로젝트 구조

```
infrastructure/terraform/
├── main.tf              # 메인 설정 (모듈 호출)
├── variables.tf         # 변수 정의
├── outputs.tf           # 출력값 정의
├── terraform.tfvars     # 변수 값 (git ignore)
├── terraform.tfvars.example  # 변수 예시
├── .gitignore           # git ignore 설정
├── modules/             # 재사용 가능한 모듈
│   ├── vpc/            # VPC 네트워킹
│   ├── ecr/            # ECR 리포지토리
│   ├── rds/            # RDS PostgreSQL
│   └── ecs/            # ECS Fargate + ALB
└── README.md            # 이 파일
```

## 🔧 환경별 설정

**개발 환경 (Development):**
```bash
terraform apply -var="environment=development" -var="db_instance_class=db.t3.micro"
```

**프로덕션 환경 (Production):**
```bash
terraform apply -var="environment=production" -var="db_instance_class=db.t3.micro"
```

## 🗑️ 리소스 삭제

```bash
# 삭제 계획 미리보기
terraform plan -destroy

# 전체 리소스 삭제 (비용 발생 중단)
terraform destroy
```

## 📊 모듈별 세부 정보

### VPC Module (modules/vpc)
- VPC (10.0.0.0/16)
- 2개 퍼블릭 서브넷 (ALB용)
- 2개 프라이빗 서브넷 (RDS, ECS용)
- Internet Gateway
- NAT Gateway (1개, 비용 절감)
- 보안 그룹 (ECS, ALB)

### ECR Module (modules/ecr)
- ECR 리포지토리 (gr8-backend)
- 라이프사이클 정책 (untagged 이미지 30일 후 삭제)
- 이미지 스캔 (push 시 자동)

### RDS Module (modules/rds)
- PostgreSQL 15.4
- db.t3.micro (MVP 사양)
- 20GB GP3 스토리지
- 7일 백업 보관
- 프라이빗 서브넷 배치
- SSM Parameter Store에 비밀번호 저장

### ECS Module (modules/ecs)
- ECS Fargate 클러스터
- Task Definition (0.25 vCPU, 512MB)
- Application Load Balancer
- CloudWatch Logs 로그 그룹
- Health Check (/health)
- Rolling Update 배포

## 🔐 보안 모범 사례

- ✅ RDS를 프라이빗 서브넷에 배치
- ✅ 보안 그룹 최소 권한 원칙
- ✅ SSM Parameter Store에 민감 정보 암호화 저장
- ✅ ECR 이미지 스캔 활성화
- ✅ 스토리지 암호화 활성화

## 🐛 문제 해결

### Terraform init 실패
```bash
# 프로바이더 다운로드 확인
terraform init -upgrade
```

### AWS 자격증명 오류
```bash
# AWS CLI 재설정
aws configure

# 자격증명 확인
aws sts get-caller-identity
```

### RDS 인스턴스 생성 실패
```bash
# VPC와 서브넷 확인
terraform output vpc_id
terraform output private_subnet_ids
```

### ECS 서비스 시작 실패
```bash
# 로그 확인
aws logs tail /ecs/gr8-production --follow

# 태스크 상태 확인
aws ecs describe-tasks --cluster gr8-production
```

## 📚 추가 리소스

- [Terraform AWS Provider 문서](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS Fargate](https://docs.aws.amazon.com/ecs/)
- [AWS RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)

## 🆘 지원

문제가 발생하면:
1. `terraform plan` 출력 확인
2. AWS 콘솔에서 리소스 상태 확인
3. CloudWatch Logs 확인

---

**⚠️ 중요:**
- 테스트 후 `terraform destroy`로 리소스 삭제 필수
- `terraform.tfstate` 파일을 git에 커밋 금지
- 비용 모니터링 권장 (AWS Budget Alerts)
