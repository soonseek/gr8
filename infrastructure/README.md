# gr8 Infrastructure

이 디렉토리는 gr8 프로젝트의 인프라스트럭처 코드를 포함합니다.

## 📁 구조

```
infrastructure/
├── terraform/           # Terraform IaC 코드
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── modules/         # 재사용 가능한 모듈
│   │   ├── vpc/
│   │   ├── ecr/
│   │   ├── rds/
│   │   └── ecs/
│   └── README.md        # Terraform 상세 가이드
└── README.md            # 이 파일
```

## 🚀 빠른 시작

```bash
# Terraform 디렉토리로 이동
cd terraform

# README 확인
cat README.md

# 초기화
terraform init

# 배포 계획
terraform plan

# 배포
terraform apply
```

## ⚠️ 중요

- Terraform 코드를 실행하면 **실제 AWS 비용이 발생**합니다
- 테스트 후 `terraform destroy`로 리소스 삭제 필수
- 자세한 내용은 `terraform/README.md` 참조

## 📊 생성되는 리소스

- VPC, 서브넷, IGW, NAT Gateway
- ECR (Docker 레지스트리)
- RDS PostgreSQL (db.t3.micro)
- ECS Fargate (Serverless containers)
- ALB (Application Load Balancer)
- CloudWatch Logs

## 💰 예상 비용

**월 $80** (상세 내용은 `terraform/README.md` 참조)

---

📖 **상세 가이드**: [terraform/README.md](./terraform/README.md)
