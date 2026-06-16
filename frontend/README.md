# HireGenie AI Frontend

React + Vite frontend for HireGenie AI, an AI-assisted career preparation
workspace for students.

## Features

- Public landing page with product overview, pricing, and FAQ sections.
- Authentication pages for login, registration, and password recovery.
- Protected dashboard shell with sidebar navigation and top search bar.
- Student modules for resume analysis, resume building, mock interviews,
  coding practice, aptitude tests, roadmaps, jobs, certificates, and analytics.
- Tailwind CSS design system with dark/light theme support.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Environment

Create a `.env` file when local configuration is needed:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

The app defaults to the backend URL configured in `src/api/axios.js` when
environment values are not provided.
