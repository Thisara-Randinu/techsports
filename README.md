# TechSports Warranty Portal

This project is a Next.js App Router application designed to run as an embedded portal under a company website subdirectory.

## Subdirectory hosting

The app is configured to run under:

- `https://myofficialdomain.com/warranty`

Key routes:

- `/warranty`
- `/warranty/admin`
- `/warranty/admin/products`
- `/warranty/dashboard`
- `/warranty/login`
- `/warranty/register`
- `/warranty/api/*`

## Local development

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Then open:

- `http://localhost:3000/warranty`

## Production

```bash
corepack pnpm build
corepack pnpm start
```

See `/DEPLOYMENT.md` for full Vercel, cPanel, Nginx, Apache, PM2, Docker, Clerk, SEO, and troubleshooting guidance.
