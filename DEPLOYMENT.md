# Deploying HireGenie AI

The React frontend and Django backend must be deployed as two public services.
The Vercel frontend cannot call `127.0.0.1:8000`; that address only works on
your own laptop.

## 1. Deploy Backend

Deploy the `backend` service to Render, Railway, or another host that supports
Django. A Render blueprint is included in `render.yaml`.

After deployment, copy the backend URL. It should look like:

```bash
https://hiregenie-ai-backend.onrender.com
```

The API base URL is that URL plus `/api`:

```bash
https://hiregenie-ai-backend.onrender.com/api
```

## 2. Configure Backend Environment

Set these environment variables on the backend host:

```bash
DEBUG=False
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-app.vercel.app
ALLOWED_HOSTS=your-backend-host.onrender.com
```

Also set `DATABASE_URL`, `SECRET_KEY`, and any AI or Google keys you use.

Run migrations on the deployed backend:

```bash
python manage.py migrate
```

The Docker entrypoint runs migrations automatically when deployed with the
provided Dockerfile.

## 3. Configure Vercel Frontend

In Vercel, set this environment variable:

```bash
VITE_API_BASE_URL=https://your-backend-host.onrender.com/api
```

Then redeploy the frontend. Vite reads environment variables at build time, so
changing `VITE_API_BASE_URL` requires a new deployment.

## Common Error

If Vercel shows a backend connection error during registration, check these:

```bash
VITE_API_BASE_URL=https://your-backend-host.onrender.com/api
```

Do not use these in Vercel:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_API_BASE_URL=http://localhost:8000/api
```

`localhost` and `127.0.0.1` only work on your laptop. Production needs the public
backend URL.
