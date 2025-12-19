---
title: Migrate to GitHub Packages
category: future-plans
order: 1
priority: high
---

# Phase 2: GitHub Packages Migration

## Goal
Move from Git URL dependencies to GitHub Packages for `@homebase/shared`.

## Trigger Conditions
- Build times exceed 3 minutes
- Team size grows beyond 3 developers
- Need for better version management

## Implementation Steps

1. **Setup GitHub Packages**
   - Configure `.npmrc` in consuming projects
   - Add publish workflow to `homebase-shared`

2. **Update CI/CD**
   - Publish to GitHub Packages on tag push
   - Update consuming projects to pull from registry

3. **Benefits**
   - ⚡ Faster installs (pre-built artifacts)
   - 🔒 Immutable versions
   - 📦 Better caching
   - 🤝 Aligns with Maven workflows

## Estimated Effort
2-3 days
