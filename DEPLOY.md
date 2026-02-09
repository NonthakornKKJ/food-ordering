# Deploy quick guide

This file contains quick commands to push your repository and short deployment notes.

1. Initialize git and push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
# replace with your repo URL
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

2. Local test commands

Backend

```bash
cd Backend
npm install
# create .env from Backend/.env.example (do NOT commit .env)
npm start
```

Frontend

```bash
cd Frontend
npm install
npm run dev
```

3. Recommended free deployment flow

- Database: MongoDB Atlas (free cluster)
- Backend: Railway (deploy `Backend` folder; set env vars `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`)
- Frontend: Vercel or Netlify (deploy `Frontend` folder/build; set `VITE_API_URL` to your backend URL)

4. Environment variables (example names)

- Backend: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`
- Frontend (Vite): `VITE_API_URL` (must start with `VITE_`)

5. Notes

- Never commit real secrets. Use `.env.example` for placeholders only.
- After deploying backend, update `VITE_API_URL` in frontend hosting settings and re-deploy the frontend.
