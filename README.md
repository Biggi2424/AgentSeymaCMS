## Neyraq Cloud – Portal (Product Build)

- Next.js App Router + Prisma + Postgres (no demo shortcuts, no fake data in UI).
- DB schema lives in `prisma/schema.prisma` and matches `db/schema.sql` (agents, tickets, deployments, catalog, API keys, …).
- Seeds provide reproducible, realistic tenants/users/devices/tickets/deployments/catalog data.

### Environment

- `.env` must include `DATABASE_URL` pointing to a reachable Postgres instance.
- `AUTH_SECRET` should be set (cookie HMAC). The default in dev is insecure.

### Prisma / DB

```
npm run prisma -- db push   # sync schema to DATABASE_URL
npm run prisma -- generate  # build client
npm run seed                # seed Postgres with product-grade fixtures
```

### Seeded data (after `npm run seed`)

Tenants
- Aurora Personal Workspace (slug `aurora-personal`)
- Helios Manufacturing GmbH (slug `helios-manufacturing`)

Users (all auth_provider=local, passwords hashed via scrypt)
- Personal: `user@personal.local` / `ChangeMe!2025` (tenant_type=user, persona_role=user)
- Company admin: `admin@helios.local` / `AdminHelios#2025` (tenant_type=company, persona_role=company_admin)
- Company agent: `agent@helios.local` / `AgentHelios#2025` (tenant_type=company, persona_role=company_agent)

Artifacts
- Agents: 1 personal (`AURORA-LAPTOP`), 2 company (`HEL-CAD-051`, `HEL-EDGE-007`) with events/tags.
- Tickets: VPN/connectivity, patch validation, onboarding, personal backup check.
- Packages: CAD Suite 2024.4, Windows Hardening Baseline.
- Deployments: CAD rollout (ring), Factory baseline refresh.
- Device groups: Design Laptops, Factory Floor - Line A.
- Catalog items/requests: VPN access, CAD add-ons, laptop health check.
- API keys: ServiceNow sync (company), PowerBI usage export (personal).

### Key commands

```
npm run dev       # start Next.js (uses DATABASE_URL)
npm run lint      # lint
```

### Notes

- Auth: login/registration work against `users` with server-side validation; sessions stored in an HTTP-only cookie.
- Actions (tickets, deployments, catalog requests, agent commands, profile/password updates) all persist to Postgres—no stubs.
