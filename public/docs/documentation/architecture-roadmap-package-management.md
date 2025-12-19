---
title: 'Architecture Roadmap: Package Management'
category: documentation
order: 1
priority: high
---
# Architecture Roadmap: Package Management

This document outlines the strategic evolution of our frontend architecture, specifically regarding shared library management.

## Current State: Phase 1 (Git Dependencies)
**Implementation**: `git+https://github.com/CherupallyPremkumar/homebase-shared.git#v1.0.0`
- **Pros**: Zero cost, no infra setup, easy for rapid iteration.
- **Cons**: Slow builds (compiles on install), poor caching, requires manual tagging.
- **Verdict**: Suitable for current MVP stage.

## Future State: Phase 2 (Private Registry)
**Trigger**: When build times exceed 3 minutes or team size grows > 3 devs.
**Implementation**: GitHub Packages (NPM Registry).
- **Strategy**:
    1. Configure `homebase-shared` CI to `npm publish` to GitHub Packages on tag push.
    2. Configure consumers (UI, Todo) with `.npmrc` to pull `@homebase` scope from GitHub.
- **Benefits**:
    - **Speed**: Downloads pre-built artifacts (seconds vs minutes).
    - **Stability**: Immutable versions.
    - **Standardization**: align with Java/Maven workflows.

## End State: Phase 3 (Monorepo)
**Trigger**: Heavy coupling between Frontend projects.
**Implementation**: Turborepo / Nx.
- **Strategy**: Merge all repos into one. Unified config and atomic commits.
