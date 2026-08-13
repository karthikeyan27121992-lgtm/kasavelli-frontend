# Kasavelli — Frontend (Angular)

Angular 17 frontend for the Kasavelli silver jewellery e-commerce platform.

## Tech Stack
- Angular 17 (standalone components)
- RxJS + Angular HttpClient
- JWT authentication

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (points to localhost:8000)
npm start
```

App available at `http://localhost:4200`

## Environment Configuration

Edit [`src/environments/environment.ts`](src/environments/environment.ts) for local dev:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  razorpayKeyId: 'YOUR_RAZORPAY_KEY_ID'
};
```

Edit [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts) for production:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_RENDER_APP.onrender.com/api',
  razorpayKeyId: 'YOUR_RAZORPAY_KEY_ID'
};
```

> `environment.prod.ts` is listed in `.gitignore` — set these values before deploying.

## Deploy to Cloudflare Pages (free)

1. Push this repo to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → **Create project → Connect GitHub**
3. Set:
   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Build output directory | `dist/silver-jewellery-frontend` |
4. Before deploying, update `src/environments/environment.prod.ts` with your Render backend URL
5. Push and Cloudflare auto-deploys on every commit

The `src/_redirects` file is bundled into the build output and tells Cloudflare Pages to route all paths to `index.html` (required for Angular client-side routing).

## Build

```bash
# Production build
npm run build

# Output: dist/silver-jewellery-frontend/
```
