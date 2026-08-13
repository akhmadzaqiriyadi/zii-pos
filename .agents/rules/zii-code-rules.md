# ZII POS Workspace Code Rules

## Monorepo Architecture
- Package manager & runtime: **Bun** (Bun Workspaces)
- Root scripts: `bun dev`, `bun run lint`, `bun run lint:fix`, `bun db:generate`, `bun db:push`
- Apps: `@zii/web` (Next.js 16 App Router), `@zii/api` (Express TS + Scalar API Reference)
- Packages: `@zii/db` (Prisma ORM), `@zii/types` (Shared TypeScript Types)

## Frontend Rules (`@zii/web`)
- Feature-driven domain architecture (`src/features/<feature>/components`, `hooks`, `services`)
- Design System: **Custom Radix UI Primitives + Tailwind CSS**
- Helper: `cn()` from `@/lib/cn` (`clsx` + `tailwind-merge`)
- Do NOT use shadcn/ui library components directly. Use custom Radix primitives in `@/components/ui/`
- Every interactive element MUST have an explicit `type="button"` attribute to pass Biome linter rules.

## Backend Rules (`@zii/api`)
- Modular Layered Architecture (`src/modules/<module>/controller`, `service`, `routes`)
- OpenAPI Documentation: **Scalar API Reference** mounted at `/docs`
- Logger: **Pino Logger** (`src/utils/logger`)
- Multi-Tenant: Extract `x-tenant-id` header in `tenantMiddleware`

## Quality Check
- Before declaring task complete, always run `bun run lint` and verify builds.
