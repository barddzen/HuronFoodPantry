# Huron Helping Hands Food Pantry — Website

## Stack
- **Static HTML/CSS/JS** — no build system, no frameworks
- **Hosting**: AWS S3 + CloudFront (live)
- **Domain**: `www.huronhelpinghands.org` (DNS at SquareSpace)
- **DNS**: Route53 (nameservers set in SquareSpace registrar)
- **Region**: us-east-2 (S3), us-east-1 (ACM/CloudFront)

## Project Structure
```
site/                          # Deploy target — all files here go to S3
├── index.html                 # Home page
├── about.html
├── events.html
├── receiving-goods.html       # "How We Can Help" — food assistance info
├── ways-to-give-monetary.html
├── ways-to-give-current-needs.html
├── ways-to-give-guidelines.html
├── get-involved-volunteers.html
├── get-involved-projects.html # Simply Give campaign
├── get-involved-newsletter.html # Newsletter signup (POSTs to API Gateway)
├── css/style.css              # Shared design system (CSS variables, no !important)
├── js/main.js                 # Nav + footer injection, dropdowns, mobile toggle
└── images/                    # Logo files (webp + originals)

lambda/                        # Lambda function source
├── hhh-newsletter-signup.py   # Newsletter signup handler (Python 3.12)

website/                       # OLD Squarespace code-block snippets (preserved for reference)
docs/                          # Planning documents
```

## Deployment
```bash
# Deploy to S3 (additive — `--delete` is blocked by the global safety guard;
# to prune removed files, run the delete yourself on the admin profile)
aws s3 sync site/ s3://www.huronhelpinghands.org/ --region us-east-2

# Invalidate CloudFront cache (once distribution is created)
aws cloudfront create-invalidation --distribution-id ECK9AA6465NAB --paths "/*"
```

## AWS Resources
- **S3 Bucket**: `www.huronhelpinghands.org` (us-east-2, static website hosting enabled)
- **ACM Certificate**: `arn:aws:acm:us-east-1:019524460192:certificate/e2486401-57b1-41a4-a4d5-705af2fe7247`
  - Covers: `huronhelpinghands.org` + `*.huronhelpinghands.org`
  - Status: ISSUED
- **CloudFront**: `ECK9AA6465NAB` (domain: `d3rfsda8muk9go.cloudfront.net`)
- **DynamoDB Table**: `hhh-newsletter` (us-east-2, PAY_PER_REQUEST, PK: email)
- **Lambda**: `hhh-newsletter-signup` (us-east-2, Python 3.12, 128MB)
- **IAM Role**: `hhh-newsletter-lambda-role` (DynamoDB PutItem + CloudWatch Logs)
- **API Gateway**: `hhh-api` (HTTP API, ID: `hphusllru8`)
  - Endpoint: `https://hphusllru8.execute-api.us-east-2.amazonaws.com/newsletter`
  - Route: `POST /newsletter`

### Pull Newsletter Subscribers
```bash
aws dynamodb scan --table-name hhh-newsletter --region us-east-2 --output table
```

### Route53 Hosted Zone
- **Zone ID**: `Z023946711WSYHRBEF0CT`
- **Records**: A ALIAS (naked + www) → CloudFront, ACM validation CNAME, SPF, DKIM, DMARC
- **Nameservers** (set in SquareSpace):
  - `ns-885.awsdns-46.net`
  - `ns-1441.awsdns-52.org`
  - `ns-417.awsdns-52.com`
  - `ns-1680.awsdns-18.co.uk`

## Architecture Notes
- Navigation and footer are injected by `js/main.js` — single source of truth
- All styles in `css/style.css` using CSS custom properties (`:root` variables)
- No `!important` declarations (those were Squarespace overrides)
- Brand colors: Navy `#1E3A5F`, Red `#C41E3A`
- Font: Source Sans Pro with system stack fallback
- Responsive breakpoints: 768px (mobile nav), 640px, 480px

## Content Guidelines
- Language should be accessible — this serves community members seeking food assistance
- Contact info: 419-616-0088 (general), 419-366-0524 (appointments)
- Email: huronfoodpantry@gmail.com
- Address: 607 S. Main St, Huron, OH 44839
- Hours: Wed 9am-3pm, Thu 10am-2pm
- Service area: Huron, Berlin Heights, 44839 zip code

## Git Remotes
- `origin` — GitHub: https://github.com/barddzen/HuronFoodPantry.git
- `YutzyNAS` — Local NAS: /Volumes/git/HuronFoodPantry.git
