---
title: Architecture Overview
category: documentation
order: 2
---

# Homebase Architecture

## Backend: Modular Monolith

Using **Chenile Framework** for Java backend.

### Key Modules
- Product Management
- Catalog Management  
- Inventory Management
- Pricing Engine
- Order Management

### Why Modular Monolith?
- ✅ Solo developer friendly
- ✅ Simpler deployment
- ✅ Easy to migrate to microservices later
- ✅ Shared database transactions

## Frontend Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **State:** React Query + Context
- **Routing:** React Router v6

## Deployment

- **Backend:** Spring Boot JAR
- **Frontend:** GitHub Pages (static)
- **Database:** H2 (dev) → PostgreSQL (prod)
