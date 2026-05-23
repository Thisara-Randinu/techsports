# Deployment Guide (Subdirectory: `/warranty`)

This project is configured for embedded hosting under:

- Main site: `https://myofficialdomain.com`
- Warranty portal: `https://myofficialdomain.com/warranty`

## 1) Next.js subdirectory configuration

Implemented in `next.config.ts`:

- `basePath: "/warranty"`
- `assetPrefix: "/warranty"`
- image path: `"/warranty/_next/image"`

All app routes, APIs, and assets resolve under `/warranty`.

## 2) Required routes

The following routes are available under subpath hosting:

- `/warranty`
- `/warranty/admin`
- `/warranty/admin/products`
- `/warranty/dashboard`
- `/warranty/login`
- `/warranty/register`
- `/warranty/api/*`

## 3) Clerk configuration for subpath callbacks

Set these env values:

- `CLERK_SIGN_IN_URL=/warranty/login`
- `CLERK_SIGN_UP_URL=/warranty/register`
- `CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/warranty/dashboard`
- `CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/warranty/dashboard`
- `CLERK_AFTER_SIGN_OUT_URL=/warranty/login`

In Clerk dashboard:

- Allowed callback/redirect origins must include `https://myofficialdomain.com`
- Redirect URLs must include `/warranty/...`

## 4) Static assets / uploads / animations / PDFs

- Next static chunks load from `/warranty/_next/*`
- API-driven assets use prefixed URLs (e.g. `/warranty/api/blob?...`)
- Keep generated PDFs under API routes or public paths prefixed by `/warranty`

## 5) Vercel deployment

1. Import repository in Vercel
2. Framework preset: Next.js
3. Build command: `pnpm build`
4. Output: default (`.next`)
5. Start command: `pnpm start`
6. Add env vars from `.env.example`
7. Set `NEXT_PUBLIC_APP_URL=https://myofficialdomain.com/warranty`

If your company website reverse-proxies to Vercel, map only `/warranty` to this app.

## 6) cPanel deployment

### Option A: Node.js app (recommended)

1. Create Node.js app in cPanel (Node 20+)
2. Upload project
3. Install deps: `pnpm install --frozen-lockfile`
4. Build: `pnpm build`
5. Start: `pnpm start`
6. Configure Apache/Nginx proxy from `/warranty` to Node app port

### Option B: Reverse proxy through existing site

- Keep existing site at `/`
- Proxy `/warranty` traffic to the Next.js app process

## 7) Nginx reverse proxy example

```nginx
location /warranty {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Prefix /warranty;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_read_timeout 300;
    proxy_connect_timeout 60;
    proxy_send_timeout 300;
}
```

## 8) Apache configuration

### `.htaccess` (proxy `/warranty` to Node)

```apache
RewriteEngine On

RewriteCond %{REQUEST_URI} ^/warranty(/.*)?$
RewriteRule ^warranty/(.*)$ http://127.0.0.1:3000/warranty/$1 [P,L]
RewriteRule ^warranty$ http://127.0.0.1:3000/warranty [P,L]

RequestHeader set X-Forwarded-Proto "https"
RequestHeader set X-Forwarded-Prefix "/warranty"
```

### VirtualHost reverse proxy

```apache
ProxyPreserveHost On
ProxyPass /warranty http://127.0.0.1:3000/warranty
ProxyPassReverse /warranty http://127.0.0.1:3000/warranty
```

## 9) Build and run commands

```bash
# install
pnpm install --frozen-lockfile

# build
pnpm build

# start production server
pnpm start
```

### PM2

```bash
pm2 start "pnpm start" --name techsports-warranty
pm2 save
pm2 startup
```

## 10) Docker deployment

```bash
docker build -t techsports-warranty .
docker run -d --name techsports-warranty -p 3000:3000 --env-file .env techsports-warranty
```

Or:

```bash
docker compose up -d --build
```

## 11) SEO / metadata / sitemap

- Root metadata includes canonical base for `/warranty`
- `app/sitemap.ts` generates URLs under `NEXT_PUBLIC_APP_URL` (default includes `/warranty`)
- Ensure production env uses: `NEXT_PUBLIC_APP_URL=https://myofficialdomain.com/warranty`

## 12) Troubleshooting / common fixes

### Blank styles or missing JS

- Confirm `basePath` and `assetPrefix` are `/warranty`
- Verify proxy forwards `/warranty/_next/*`

### API 404s

- Ensure frontend calls `/warranty/api/*` (already handled in code)
- Confirm reverse proxy includes `/warranty/api`

### Clerk redirects to root (`/`)

- Re-check Clerk redirect URLs include `/warranty`
- Re-check `CLERK_*` env variables

### Admin auth prompt not appearing

- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Confirm proxy/middleware is active for `/warranty/admin*`

## 13) Production optimization tips

- Enable gzip/brotli on reverse proxy
- Keep Node app behind Nginx/Apache for TLS termination
- Run with PM2 or container restart policy
- Use Redis and Blob credentials from secure env vars only
- Monitor response times for `/warranty/api/*`
