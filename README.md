# gh-mattpersonalsite

Static personal site for [mt1.co](https://mt1.co), served by GitHub Pages. Plain HTML/CSS/JS, no build step.

- `index.html` – home (strategy, about, writing, photography teaser, contact)
- `photography/` – gallery with lightbox and video
- `blog/` – posts, URLs match the old Squarespace paths (`/blog/<slug>/`)
- `CNAME` – custom domain `mt1.co`

Preview locally: `python3 -m http.server` and open http://localhost:8000.

## Deploy
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. Then point DNS at GitHub Pages
(A records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; `www` CNAME to `mt1co.github.io`) and enable *Enforce HTTPS*.
