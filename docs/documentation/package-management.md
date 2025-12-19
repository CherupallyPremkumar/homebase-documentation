---
title: Package Management Strategy
category: documentation
order: 1
---

# Package Management Strategy

## Current Approach (Phase 1)

We're using **Git URL dependencies** for `@homebase/shared`:

```json
"@homebase/shared": "git+https://github.com/CherupallyPremkumar/homebase-shared.git#v1.0.0"
```

### Why Git URLs?
- ✅ Zero cost
- ✅ No infrastructure setup
- ✅ Easy for rapid iteration
- ❌ Slow builds (compiles on install)
- ❌ Poor caching
- ❌ Manual version tagging

## Future Evolution

### Phase 2: GitHub Packages
When build times exceed 3 minutes or team grows beyond 3 developers.

**Benefits:**
- Fast installs (pre-built artifacts)
- Immutable versions
- Better caching
- Aligns with Maven workflows

### Phase 3: Monorepo
When frontend projects become tightly coupled.

**Tools:** Turborepo or Nx

**Benefits:**
- Atomic commits across projects
- Shared configuration
- Instant feedback
