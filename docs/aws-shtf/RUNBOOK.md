# Huron Helping Hands Food Pantry — AWS Disaster Recovery Runbook

**Last Audit:** 2026-03-04
**AWS Account:** 019524460192
**Region:** us-east-2 (exception: ACM certificate in us-east-1)

---

## Resource Inventory

### DynamoDB Tables (1 total)

| Table | PK | GSIs | Items | DeletionProtection | PITR | Billing |
|-------|-----|------|-------|--------------------|------|---------|
| `hhh-newsletter` | `email` (S) HASH | None | 0 | true | ENABLED | PAY_PER_REQUEST |

### Lambda Functions (1 total)

Single-purpose newsletter signup function.

| Function | Handler | Runtime | Arch | Timeout | Memory | Env Vars |
|----------|---------|---------|------|---------|--------|----------|
| `hhh-newsletter-signup` | `hhh-newsletter-signup.lambda_handler` | python3.12 | x86_64 | 10s | 128 MB | None |

- **Role:** `arn:aws:iam::019524460192:role/hhh-newsletter-lambda-role`
- **Code size:** 777 bytes
- **CodeSha256:** `EQhUzZlFwDJjXWOC6gKVYb0iKiRoFIDPsf5cOr0P5/M=`

### API Gateway (HTTP API v2)

| Property | Value |
|----------|-------|
| API ID | `hphusllru8` |
| Name | `hhh-api` |
| Type | HTTP API (v2) |
| Protocol | HTTP |
| Endpoint | `https://hphusllru8.execute-api.us-east-2.amazonaws.com` |
| Stage | `$default` (auto-deploy) |

#### CORS Configuration

```json
{
  "AllowHeaders": ["content-type"],
  "AllowMethods": ["POST", "OPTIONS"],
  "AllowOrigins": ["https://www.huronhelpinghands.org"]
}
```

#### Routes

| Method | Path | Auth | Integration |
|--------|------|------|-------------|
| `POST` | `/newsletter` | None | `gb7ula6` → Lambda `hhh-newsletter-signup` (AWS_PROXY) |

### S3 Bucket

#### `www.huronhelpinghands.org` (us-east-2)

| Property | Value |
|----------|-------|
| Region | us-east-2 |
| Website Hosting | Enabled |
| Index Document | `index.html` |
| Error Document | `index.html` |
| Public Access Block | Not configured (all public) |
| Bucket Policy | `PublicReadGetObject` (`s3:GetObject` for `*`) |
| Contents | Static website (HTML, CSS, JS) deployed from `website/` |

### CloudFront

| Property | Value |
|----------|-------|
| Distribution ID | `ECK9AA6465NAB` |
| Domain | `d3rfsda8muk9go.cloudfront.net` |
| Alias | `www.huronhelpinghands.org` |
| Origin | `www.huronhelpinghands.org.s3-website.us-east-2.amazonaws.com` (custom origin, http-only) |
| DefaultRootObject | `index.html` |
| ViewerProtocol | redirect-to-https |
| Compress | true |
| Cache | MinTTL=0, DefaultTTL=86400, MaxTTL=31536000 |
| Custom Error | None |
| Certificate | `arn:aws:acm:us-east-1:019524460192:certificate/e2486401-57b1-41a4-a4d5-705af2fe7247` |
| SSLSupportMethod | sni-only |
| MinProtocolVersion | TLSv1.2_2021 |
| PriceClass | PriceClass_100 |
| Comment | Huron Helping Hands Food Pantry |

### Route 53

**No hosted zone in AWS** — DNS for `huronhelpinghands.org` is managed externally. The CNAME or A record pointing `www.huronhelpinghands.org` to `d3rfsda8muk9go.cloudfront.net` must be configured at the external DNS provider.

### ACM (us-east-1)

| Property | Value |
|----------|-------|
| ARN | `arn:aws:acm:us-east-1:019524460192:certificate/e2486401-57b1-41a4-a4d5-705af2fe7247` |
| Domain | `huronhelpinghands.org` |
| SANs | `huronhelpinghands.org`, `*.huronhelpinghands.org` |
| Status | ISSUED |
| Type | AMAZON_ISSUED |
| KeyAlgorithm | RSA-2048 |
| NotAfter | 2026-09-17 |
| Validation | DNS |

### IAM Role

#### `hhh-newsletter-lambda-role`
- **RoleId:** `AROAQJC57T2QBX6GS3D5A`
- **ARN:** `arn:aws:iam::019524460192:role/hhh-newsletter-lambda-role`
- **Trust:** `lambda.amazonaws.com` → `sts:AssumeRole`
- **Managed Policies:**
  1. `AWSLambdaBasicExecutionRole` (CloudWatch Logs)
- **Inline Policies (1):**
  1. `hhh-newsletter-dynamo-write`:
     - DynamoDB: `PutItem` on `arn:aws:dynamodb:us-east-2:019524460192:table/hhh-newsletter`

---

## Dependency Order (Rebuild Sequence)

```
1. ACM Certificate (us-east-1)    (must be issued before CloudFront — needs DNS validation)
2. IAM Role + Policies            (independent, needed before Lambda)
3. DynamoDB Table                 (independent, needed before Lambda works)
4. Lambda Function                (needs IAM role, DynamoDB)
5. API Gateway + Integration      (needs Lambda ARN)
6. S3 Bucket + Website Hosting    (independent)
7. CloudFront Distribution        (needs S3 origin, ACM cert)
8. External DNS Records           (needs CloudFront domain for CNAME/A)
9. Deploy Frontend to S3          (needs S3 bucket)
```

---

## Rebuild Commands

### 1. ACM Certificate (us-east-1)

```bash
# Request wildcard certificate — MUST be in us-east-1 for CloudFront
aws acm request-certificate \
  --domain-name huronhelpinghands.org \
  --subject-alternative-names "*.huronhelpinghands.org" \
  --validation-method DNS \
  --key-algorithm RSA_2048 \
  --region us-east-1

# Note the CertificateArn from output — needed for CloudFront config
# Get the DNS validation records:
# aws acm describe-certificate --certificate-arn <ARN> --region us-east-1 --query 'Certificate.DomainValidationOptions'
# Add the CNAME validation records at the external DNS provider
# Wait for status ISSUED before creating CloudFront distribution
```

### 2. IAM Role

```bash
# Create trust policy
cat > /tmp/hhh-lambda-trust.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name hhh-newsletter-lambda-role \
  --assume-role-policy-document file:///tmp/hhh-lambda-trust.json \
  --region us-east-2

# Attach managed policy for CloudWatch Logs
aws iam attach-role-policy \
  --role-name hhh-newsletter-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Inline policy: DynamoDB PutItem
aws iam put-role-policy \
  --role-name hhh-newsletter-lambda-role \
  --policy-name hhh-newsletter-dynamo-write \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["dynamodb:PutItem"],
        "Resource": "arn:aws:dynamodb:us-east-2:019524460192:table/hhh-newsletter"
      }
    ]
  }'
```

### 3. DynamoDB Table

```bash
# hhh-newsletter (no GSI, email as PK)
aws dynamodb create-table \
  --table-name hhh-newsletter \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-2
```

### 4. Lambda Function

```bash
# Package Lambda code
cd lambda
zip function.zip hhh-newsletter-signup.py

# Create Lambda function
aws lambda create-function \
  --function-name hhh-newsletter-signup \
  --runtime python3.12 \
  --architectures x86_64 \
  --handler hhh-newsletter-signup.lambda_handler \
  --role arn:aws:iam::019524460192:role/hhh-newsletter-lambda-role \
  --memory-size 128 \
  --timeout 10 \
  --zip-file fileb://function.zip \
  --region us-east-2
```

### 5. API Gateway + Integration

```bash
# Create HTTP API with CORS
API_ID=$(aws apigatewayv2 create-api \
  --name hhh-api \
  --protocol-type HTTP \
  --cors-configuration '{
    "AllowHeaders": ["content-type"],
    "AllowMethods": ["POST", "OPTIONS"],
    "AllowOrigins": ["https://www.huronhelpinghands.org"]
  }' \
  --region us-east-2 \
  --query 'ApiId' --output text)

echo "API ID: $API_ID"

# Create Lambda integration
INT_ID=$(aws apigatewayv2 create-integration \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:us-east-2:019524460192:function:hhh-newsletter-signup \
  --payload-format-version 2.0 \
  --region us-east-2 \
  --query 'IntegrationId' --output text)

# Create POST /newsletter route
aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key 'POST /newsletter' \
  --target "integrations/$INT_ID" \
  --region us-east-2

# Create $default stage with auto-deploy
aws apigatewayv2 create-stage \
  --api-id $API_ID \
  --stage-name '$default' \
  --auto-deploy \
  --region us-east-2

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \
  --function-name hhh-newsletter-signup \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-2:019524460192:$API_ID/*" \
  --region us-east-2

echo "API Endpoint: https://$API_ID.execute-api.us-east-2.amazonaws.com"
```

**Note:** After creating the API Gateway, update the newsletter signup form in `website/get-involved-newsletter.html` with the new API endpoint URL if the API ID changes.

### 6. S3 Bucket + Website Hosting

```bash
# Create bucket
aws s3api create-bucket \
  --bucket www.huronhelpinghands.org \
  --region us-east-2 \
  --create-bucket-configuration LocationConstraint=us-east-2

# Enable website hosting
aws s3 website s3://www.huronhelpinghands.org \
  --index-document index.html \
  --error-document index.html

# Set public-read bucket policy
aws s3api put-bucket-policy --bucket www.huronhelpinghands.org --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::www.huronhelpinghands.org/*"
  }]
}'
```

### 7. CloudFront Distribution

```bash
cat > /tmp/hhh-cloudfront-config.json << 'EOF'
{
  "CallerReference": "hhh-rebuild",
  "Aliases": {
    "Quantity": 1,
    "Items": ["www.huronhelpinghands.org"]
  },
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-www.huronhelpinghands.org",
      "DomainName": "www.huronhelpinghands.org.s3-website.us-east-2.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-www.huronhelpinghands.org",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "<ACM_CERT_ARN_FROM_STEP_1>",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "PriceClass": "PriceClass_100",
  "Enabled": true,
  "Comment": "Huron Helping Hands Food Pantry"
}
EOF

# Replace the ACM ARN placeholder with the actual cert ARN from step 1
# Then create the distribution:
aws cloudfront create-distribution \
  --distribution-config file:///tmp/hhh-cloudfront-config.json

# Note the Distribution ID and Domain Name from output — needed for DNS
# Wait for status "Deployed" before testing (5-15 minutes)
```

### 8. External DNS Records

DNS for `huronhelpinghands.org` is NOT managed in AWS Route 53. Configure these records at the external DNS provider:

| Name | Type | Value |
|------|------|-------|
| `www.huronhelpinghands.org` | CNAME | `d3rfsda8muk9go.cloudfront.net` (or new CloudFront domain from step 7) |
| ACM validation record | CNAME | (get from `aws acm describe-certificate` output in step 1) |

### 9. Deploy Frontend to S3

```bash
# Sync website files to S3
aws s3 sync website/ s3://www.huronhelpinghands.org/ --delete --region us-east-2

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <CLOUDFRONT_DISTRIBUTION_ID> \
  --paths "/*"
```

---

## Source File Locations

| Component | Source Path |
|-----------|------------|
| Lambda (newsletter signup) | `lambda/hhh-newsletter-signup.py` |
| Website pages | `website/*.html` |
| Site content | `site/` |

---

## Data Recovery

### DynamoDB

Newsletter subscriptions table. Currently no PITR and no DeletionProtection — low-risk data that can be re-collected.

```bash
# If PITR were enabled, restore like this:
aws dynamodb restore-table-to-point-in-time \
  --source-table-name hhh-newsletter \
  --target-table-name hhh-newsletter-restore \
  --restore-date-time "2026-03-04T00:00:00Z" \
  --region us-east-2
```

### Website Content

All HTML files are in git — redeploy from `website/` folder.

---

## Drift Report

**Initial audit — 2026-03-04**

### Observations
1. ~~**PITR is DISABLED** on `hhh-newsletter` table~~ **RESOLVED: PITR enabled (Mar 4, 2026)**
2. ~~**DeletionProtection is OFF** on `hhh-newsletter` table~~ **RESOLVED: DeletionProtection enabled (Mar 4, 2026)**
3. ~~**CORS AllowOrigins is `*`** on API Gateway~~ **RESOLVED: Restricted to `https://www.huronhelpinghands.org` (Mar 4, 2026)**
4. **DNS managed externally** — no Route 53 hosted zone; ACM validation relies on external DNS provider
5. ~~**PriceClass_All** on CloudFront~~ **RESOLVED: Changed to PriceClass_100 (Mar 4, 2026)**

### Drift Update — 2026-03-11

Automated drift detection found **1** items. See full report:
`/Users/davidyutzy/Development/aws/drift-reports/huronhelpinghands-2026-03-11.md`

Key findings:
| `hhh-newsletter` | ENABLED | true | PAY_PER_REQUEST |
| `huronhelpinghands.org.` | A | d3rfsda8muk9go.cloudfront.net. |
| `huronhelpinghands.org.` | NS | ns-885.awsdns-46.net. |
| `huronhelpinghands.org.` | SOA | ns-885.awsdns-46.net. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400 |
| `huronhelpinghands.org.` | TXT | "v=spf1 -all" |
| `_2533e75d68a08d0430200a55b9d94884.huronhelpinghands.org.` | CNAME | _6b4c812a0738045b7a14bc45904b50a3.jkddzztszm.acm-validations.aws. |
| `_dmarc.huronhelpinghands.org.` | TXT | "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s" |
| `_domainkey.huronhelpinghands.org.` | TXT | "v=DKIM1; p=" |
| `www.huronhelpinghands.org.` | A | d3rfsda8muk9go.cloudfront.net. |
| `ECK9AA6465NAB` | d3rfsda8muk9go.cloudfront.net | www.huronhelpinghands.org, huronhelpinghands.org | Enabled |

