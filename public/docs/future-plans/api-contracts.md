---
title: API Contract Documentation
category: future-plans
order: 3
priority: high
---

# API Contract Documentation

## Goal
Create comprehensive API documentation for frontend-backend contracts.

## Approach

### OpenAPI/Swagger
- Generate from Spring Boot annotations
- Host Swagger UI for interactive docs
- Auto-generate TypeScript types

### Benefits
- 📝 Single source of truth
- 🔄 Auto-sync between frontend/backend
- ✅ Type safety
- 🧪 Easy testing

## Implementation
1. Add Springdoc OpenAPI dependency
2. Annotate REST controllers
3. Generate TypeScript types
4. Integrate into CI/CD

## Tools
- Springdoc OpenAPI
- openapi-typescript-codegen
- Swagger UI

## Estimated Effort
3-4 days
