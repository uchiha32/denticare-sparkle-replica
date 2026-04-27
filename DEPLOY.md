# Deploying Denticare to IONOS — Step-by-Step Guide

## Files Changed in This Update
| File | What Changed |
|---|---|
| `vite.config.ts` | Removed Netlify + Cloudflare plugins, now uses standard Vite + React |
| `server.js` | NEW — Express server that serves the built app |
| `package.json` | Added `express`, removed `@tanstack/react-start`, `@netlify/...`, `@cloudflare/...`, `@lovable.dev/...` |
| `.env.example` | Template for environment variables |
| `.gitignore` | Cleaned up |
| `netlify.toml` | DELETE this file from your repo |
| `wrangler.jsonc` | DELETE this file from your repo |
| `bunfig.toml` | DELETE this file from your repo |
| `bun.lockb` | DELETE this file — use npm instead |

---

## Local Setup (Test Before Deploying)

```bash
# 1. Clone your repo and apply the changed files
git clone https://github.com/hades216/denticare-sparkle-replica.git
cd denticare-sparkle-replica

# 2. Install dependencies
npm install

# 3. Create your .env file with real Supabase credentials
cp .env.example .env
# Edit .env and fill in your actual VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Build the frontend
npm run build

# 5. Test the server locally
npm start
# Visit http://localhost:3000
```

---

## Deploy to IONOS VPS (Recommended)

### Option A — Manual via SSH

```bash
# On IONOS VPS, install Node.js 18+ if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 to keep your app alive
npm install -g pm2

# Upload your project (excluding node_modules and dist) via SFTP/SCP
# Then SSH into your server:
ssh user@your-ionos-vps-ip

cd /var/www/denticare   # or wherever you uploaded

# Set environment variables
export VITE_SUPABASE_URL=your_url
export VITE_SUPABASE_ANON_KEY=your_key

npm install
npm run build
pm2 start server.js --name denticare
pm2 save
pm2 startup   # follow the printed command to auto-start on reboot
```

### Option B — IONOS Node.js App Hosting

1. In IONOS control panel → **Node.js Hosting**
2. Set **startup file** to: `server.js`
3. Set **Node.js version** to: `18` or higher
4. Add environment variables in the panel:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Upload project files via SFTP (exclude `node_modules/` and `dist/`)
6. In IONOS SSH terminal:
   ```bash
   npm install
   npm run build
   ```
7. IONOS will run `npm start` → which runs `node server.js`

---

## Supabase Notes

- Your Supabase database migrations are in `/supabase/` — run them via the Supabase dashboard or CLI
- The app connects to Supabase directly from the browser using the anon key — no backend proxy needed
- Make sure your Supabase project's **allowed URLs** include your IONOS domain

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen / 404 on refresh | Make sure `server.js` catch-all route is present |
| Supabase connection errors | Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly |
| Port already in use | Set `PORT` environment variable to a different port |
| Build fails | Run `npm install` first, then `npm run build` |