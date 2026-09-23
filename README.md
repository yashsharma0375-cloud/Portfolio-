# Portfolio Website

A full-stack portfolio: static HTML/CSS/JS frontend, an Express + MongoDB API
for project data and contact messages.

```
portfolio/
├── frontend/          # index.html, style.css, script.js — deploy to Vercel/Netlify
└── backend/           # Express API — deploy to Render (or Railway/Fly.io)
    ├── server.js
    ├── models/
    ├── routes/
    └── seed.js
```

## 1. Customize the content

- `frontend/index.html` — swap "Alex Rivera", the bio, skills, and social
  links for your own. Replace `/resume.pdf` with a real file or remove the button.
- `frontend/script.js` — update `FALLBACK_PROJECTS` (used if the API is
  unreachable) and `API_BASE` once you know your backend's deployed URL.
- Projects shown on the live site come from MongoDB via `seed.js` — edit the
  `sample` array there with your real projects.

## 2. Run it locally

**Database:** create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
cluster, add a database user, allow access from your IP (or `0.0.0.0/0` for
simplicity during setup), and copy the connection string.

**Backend:**
```bash
cd backend
cp .env.example .env      # paste your MONGO_URI into .env
npm install
npm run seed               # loads sample projects into the database
npm run dev                # starts the API on http://localhost:5000
```

**Frontend:** just open `frontend/index.html` in a browser, or serve it:
```bash
cd frontend
npx serve .
```
With the backend running locally, `script.js` auto-detects `localhost` and
points at `http://localhost:5000/api` — the project list and contact form
should both work immediately.

## 3. Deploy

**Backend → Render**
1. Push this repo to GitHub.
2. On [render.com](https://render.com): New → Web Service → connect the repo,
   root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables: `MONGO_URI` (your Atlas string) and
   `FRONTEND_ORIGIN` (your Vercel URL, once you have it — `*` works to start).
5. Deploy. Note the resulting URL, e.g. `https://your-api.onrender.com`.
6. Run `npm run seed` once (locally, pointed at the same `MONGO_URI`) to
   populate production data.

**Frontend → Vercel**
1. On [vercel.com](https://vercel.com): New Project → import the repo → set
   root directory to `frontend` → Framework preset: "Other" (static).
2. Deploy.
3. Back in `frontend/script.js`, replace `YOUR-BACKEND-URL` with your real
   Render URL, commit, and Vercel will redeploy automatically.

(Netlify works the same way — drag-and-drop the `frontend` folder or connect
the repo with base directory `frontend` and no build command.)

**CORS:** once both are live, set `FRONTEND_ORIGIN` on Render to your exact
Vercel URL (not `*`) so only your site can call the API.

## 4. Notes on the API

- `GET /api/projects` — public, powers the "Work" section.
- `POST /api/projects` — adds a project. Not authenticated in this starter;
  add a simple API-key check or a login before your Render URL goes public,
  or you'll get spam entries.
- `POST /api/contact` — public, receives the contact form.
- `GET /api/contact` — lists messages; same caveat as above — lock this down
  before deploying, since it currently returns everyone's contact submissions
  to anyone who requests it.

A minimal API-key guard, if you want one fast:
```js
// add near the top of routes/projects.js and routes/contact.js's write/read routes
function requireKey(req, res, next) {
  if (req.headers["x-api-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
```
then pass `x-api-key: <your key>` from wherever you manage projects (Postman,
a small admin script, etc.).
