<div align="center">

# 🛡️ Portfolio CMS

### Full Stack Developer & Cyber Security Researcher — portfolio, services & live resume generator

A modern portfolio + freelance-services website with a complete **admin panel**, a **contact inbox**,
**GitHub project sync** and **PDF resumes generated live from your data**.

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

**🌐 Live demo:** _coming soon_ &nbsp;·&nbsp; [Features](#-features) · [Quick start](#-quick-start) · [Deploy](#-deploy) · [Theming](#-theming)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/manthandhrana/portfolio)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🌍 Public website
- Hero with typing roles, availability badge & floating tech chips
- About, **Services with INR pricing** and one-click "Get a quote"
- Skills by category with levels + animated logo marquee
- Experience & education timelines, certifications
- Projects with filters, GitHub ⭐ / forks and a searchable `/projects` page
- **Security Research** — CVEs, bug bounties, CTFs, write-ups
- Testimonials, contact form, WhatsApp button
- Light / dark mode, fully responsive (`rem` everywhere), SEO meta

</td>
<td width="50%" valign="top">

### 🔐 Admin panel (`/admin`)
- Manage **every** section — profile, services, skills, experience, education, projects, research, certificates, testimonials
- **Contact inbox** — unread badge, star, status, private notes, reply by email / WhatsApp
- **GitHub sync** — import public repos as projects, refresh stars & forks
- **Resume Builder** — multiple PDF variants (Full Stack, Security, UI/UX…), each with its own headline, sections, filters & colour
- Image uploads, icon picker, reordering, show/hide and include-in-resume toggles

</td>
</tr>
</table>

### 📄 Live resume PDFs
Update your experience once in the admin panel — every resume PDF and the website update instantly.
Visitors pick the variant they need from a **Download Resume** menu (`/api/resume/<variant>`).

### 🛡️ Security
httpOnly + `SameSite=Strict` JWT cookie · bcrypt · login & contact rate-limits · honeypot ·
CSRF header check · Helmet CSP · NoSQL-operator stripping · image-only uploads (no SVG) ·
password change revokes all other sessions.

---

## 🧱 Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, React Router 7, react-icons, Fontsource (Inter, Space Grotesk, JetBrains Mono) |
| Backend | Node.js, Express 5, Mongoose, PDFKit, Multer, Helmet, express-rate-limit, Nodemailer |
| Database | MongoDB (Atlas free tier works) |

---

## 🚀 Quick start

> Requires **Node.js 20.12+** and a MongoDB database.

```bash
git clone https://github.com/manthandhrana/portfolio.git
cd portfolio
npm run install:all
cp server/.env.example server/.env   # then set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev
```

| URL | What |
| --- | --- |
| http://localhost:5173 | Website |
| http://localhost:5173/admin | Admin panel (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`) |
| http://localhost:5000/api/health | API health check |

The first start fills an empty database with **sample content** — replace it from the admin panel.
`npm run seed:reset` reloads the samples (admin account and messages are kept).

---

## ☁️ Deploy

One service serves both the website and the API.

**Render (one click):** press the **Deploy to Render** button above, then fill `MONGODB_URI`,
`ADMIN_EMAIL` and `ADMIN_PASSWORD`. `JWT_SECRET` is generated for you. Allow `0.0.0.0/0` in
MongoDB Atlas → Network Access.

**Any Node host / VPS:**

```bash
npm run install:all && npm run build
NODE_ENV=production TRUST_PROXY=1 npm start
```

> ⚠️ Uploaded images live in `server/uploads`. Free hosting tiers wipe the disk on redeploy —
> attach a persistent disk (Render Disk / Railway Volume) or use a VPS.

<details>
<summary><b>Environment variables</b></summary>

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ (prod) | 32+ random characters |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first start | Creates the first admin account |
| `TRUST_PROXY` | behind a proxy | `1` on Render / Railway / Nginx |
| `GITHUB_TOKEN` | optional | Raises GitHub API limit for project sync |
| `SMTP_*`, `NOTIFY_EMAIL` | optional | Email notification for new messages |

</details>

---

## 🎨 Theming

Every colour, font, radius and spacing value lives in **`client/src/styles/global.css`** as CSS variables.
Change two lines to re-brand the entire site and admin panel:

```css
:root {
  --primary: #7c5cff;
  --accent: #00d9b5;
}
```

---

## 📁 Project structure

```
portfolio/
├── client/                     React + Vite
│   └── src/
│       ├── styles/global.css   🎨 theme tokens
│       ├── components/site/    public sections
│       ├── admin/              admin panel (resources.jsx describes each content type)
│       └── lib/icons.jsx       icon registry for skills & services
└── server/                     Express API
    └── src/
        ├── models/             Mongoose schemas
        ├── routes/             public · auth · admin · resume
        ├── services/           resumePdf · github · mailer
        └── seed/               sample content
```

---

<div align="center">

Made with ❤️ by **[Manthan Dhrana](https://github.com/manthandhrana)**

</div>
