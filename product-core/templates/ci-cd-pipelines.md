# CI/CD Pipeline Templates

## GitHub Actions - Full Stack

### 1. Complete CI/CD Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18.x'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ==================== Code Quality Check ====================
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting
        run: npm run format:check
  
  # ==================== Type Check ====================
  typecheck:
    name: TypeScript Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
  
  # ==================== Unit Test ====================
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
  
  # ==================== E2E Test ====================
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpass
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
      
      redis:
        image: redis:alpine
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        run: |
          npm run db:test:setup
        env:
          DB_HOST: localhost
          DB_PORT: 3306
          DB_USER: root
          DB_PASSWORD: testpass
          DB_NAME: test_db
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DB_HOST: localhost
          REDIS_HOST: localhost
  
  # ==================== Security Scan ====================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Audit dependencies
        run: npm audit --audit-level=moderate
  
  # ==================== Build ====================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build packages
        run: npm run build:packages
      
      - name: Build API
        run: npm run build:api
      
      - name: Build Web
        run: npm run build:web
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            apps/api/dist
            apps/web/dist
          retention-days: 7
  
  # ==================== Docker Build ====================
  docker:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
      
      - name: Build and push API image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./apps/api/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Build and push Web image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./apps/web/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
  
  # ==================== Deploy to Staging ====================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [docker]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - name: Deploy to staging
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
            docker-compose exec api npm run db:migrate
  
  # ==================== Deploy to Production ====================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [docker, e2e]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://app.example.com
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /app
            
            # Backup database
            docker-compose exec db mysqldump -u root -p$DB_PASSWORD $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql
            
            # Deploy
            docker-compose pull
            docker-compose up -d
            docker-compose exec api npm run db:migrate
            
            # Health check
            sleep 10
            curl -f https://app.example.com/health || exit 1
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        if: always()
        with:
          status: ${{ job.status }}
          text: 'Production deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# ==================== Template ====================
.node_template: &node_template
  image: node:${NODE_VERSION}
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - apps/*/node_modules/
  before_script:
    - npm ci

# ==================== Lint ====================
lint:
  <<: *node_template
  stage: lint
  script:
    - npm run lint
    - npm run format:check
  only:
    - merge_requests
    - main
    - develop

# ==================== Test ====================
test:unit:
  <<: *node_template
  stage: test
  script:
    - npm run test:ci
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

test:e2e:
  <<: *node_template
  stage: test
  services:
    - mysql:8.0
    - redis:alpine
  variables:
    MYSQL_ROOT_PASSWORD: testpass
    MYSQL_DATABASE: test_db
    DB_HOST: mysql
    REDIS_HOST: redis
  script:
    - npm run db:test:setup
    - npm run test:e2e
  dependencies:
    - test:unit

# ==================== Build ====================
build:
  <<: *node_template
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - apps/api/dist/
      - apps/web/dist/
    expire_in: 1 week
  only:
    - main
    - develop

# ==================== Docker ====================
docker:build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA -f apps/api/Dockerfile .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
  only:
    - main

# ==================== Deploy ====================
deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $PROD_USER@$PROD_HOST "
        cd /app &&
        docker-compose pull &&
        docker-compose up -d &&
        docker-compose exec api npm run db:migrate
      "
  environment:
    name: production
    url: https://app.example.com
  when: manual
  only:
    - main
```

---

## Performance Monitoring Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * *'  # 2:00 AM daily
  workflow_dispatch:

jobs:
  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://app.example.com
            https://app.example.com/dashboard
          uploadArtifacts: true
          temporaryPublicStorage: true
  
  load-test:
    name: Load Testing
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load/script.js
          cloud: true
          token: ${{ secrets.K6_CLOUD_TOKEN }}
```

---

## Summary

CI/CD Best Practices:

✅ **Automate Everything** - From lint to deployment  
✅ **Fast Feedback** - Complete within 5-10 minutes  
✅ **Parallel Execution** - Leverage resources effectively  
✅ **Environment Isolation** - Staging → Production  
✅ **Security First** - Scanning, auditing, encryption  
✅ **Observability** - Monitoring, logging, alerts  

**Automate everything, deploy with confidence.**
