## Live URLs

- **Client:** https://assignment8-supernova413.vercel.app
- **Server:** https://platescout-lily.onrender.com
- **Server health check:** https://platescout-lily.onrender.com/api/health

## Local setup

1. Clone the repo
2. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI` + `JWT_SECRET`
3. From the root: `npm install` (client) and `cd server && npm install` (server)
4. Two terminals: `npm run dev` (root, client) + `npm run dev` (server)
5. Open http://localhost:5173

## What I learned during deployment

In this project I learnt a way to deploy a website that uses a database by using Vercel and Render. I think it's cool that although there's quite a few steps to do so, you are able to do it for free and fairly quickly if you don't care about the website url extension. The part of the project I spent the most time debugging was step E. After completing it I tried to verify this part "Register a new user → success → /profile renders → user appears in Atlas with $2a$10$ hash" but got a network error. I spent ages trying to figure out the issue before realizing that the next step "6. Vite environment variable usage" fixed that. If I was to do it again, I'd read further in the instructions if I got stuck.