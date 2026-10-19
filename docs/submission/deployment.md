# Cati SRL — Production Deployment Details

**Project**: Cati SRL: AI Self-Regulated Learning Companion  
**Hackathon**: Next Byte Hacks V5  
**Platform**: Vercel (Edge Network + Serverless Lambdas)  
**Git Repository**: [dulch29/cati-srl](https://github.com/dulch29/cati-srl)  

---

## Live Production URLs

| Scope | Live URL |
| :--- | :--- |
| **Primary Production Domain** | [https://cati-srl.vercel.app](https://cati-srl.vercel.app) |
| **Canonical Team Alias** | [https://cati-srl-biblio3115-1431s-projects.vercel.app](https://cati-srl-biblio3115-1431s-projects.vercel.app) |
| **Git Branch Target** | [https://cati-srl-git-master-biblio3115-1431s-projects.vercel.app](https://cati-srl-git-master-biblio3115-1431s-projects.vercel.app) |

---

## Deployment Configuration

- **Framework**: Next.js 16 (Turbopack + App Router + Partial Prerendering)
- **Node.js Runtime**: 24.x
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Region**: `iad1` (Washington, D.C., USA)
- **Automatic Deployments**: Enabled (Pushes to `master` trigger automatic Vercel builds)

### Active Environment Variables (Configured on Vercel)

| Variable | Target | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Production, Preview, Dev | Powers Phase 2 AI Metacognitive Analysis, Misconception Detection & Quest Generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Dev | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Dev | Supabase Anonymous Client Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Dev | Supabase Admin Service Key |

---

## Instant Demo Access

Judges and evaluators can test the complete loop without manual registration:
1. Open [https://cati-srl.vercel.app](https://cati-srl.vercel.app).
2. Click **"Try 2-Minute Demo Flow"** or **"Launch App"**.
3. Auto-fills a real-world Python recursion reflection demonstrating overconfidence diagnosis, knowledge graph recalculation, and micro-quest generation.
