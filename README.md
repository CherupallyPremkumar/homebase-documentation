# Homebase Documentation

> **Solo Developer Hub** for the Homebase E-commerce Project  
> Live at: [docs.premkumar.me](https://docs.premkumar.me)

## 🎯 Purpose

A centralized documentation and task management system designed for solo developers working on complex projects. This app helps you organize:

- 📝 **Documentation** - Technical decisions and architecture notes
- 🎯 **Current Plan** - Active work and immediate priorities  
- 🚀 **Future Plans** - Roadmap and upcoming features
- ✅ **Tasks** - Day-to-day todos and action items

## 🏗️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Tailwind Vite Plugin
- **Icons:** Lucide React
- **Storage:** localStorage (client-side persistence)
- **Deployment:** GitHub Pages

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Project Structure

```
homebase-documentation/
├── src/
│   ├── App.tsx           # Main app with category system
│   ├── lib/utils.ts      # Utility functions (cn)
│   └── index.css         # Global styles + Tailwind
├── public/
│   └── CNAME             # Custom domain config
├── .github/workflows/
│   └── deploy.yml        # GitHub Pages deployment
└── ARCHITECTURE.md       # Package management roadmap
```

## 🎨 Features

- **Category System:** Switch between Documentation, Current Plan, Future Plans, and Tasks
- **Persistent Storage:** All items saved to localStorage
- **Dark Mode Support:** Respects system preferences
- **Responsive Design:** Works on all screen sizes
- **Auto-Deploy:** Pushes to GitHub Pages on every commit

## 📚 Related Projects

- [homebase-user-ui](https://github.com/CherupallyPremkumar/homebase-user-ui) - Customer-facing e-commerce UI
- [homebase-shared](https://github.com/CherupallyPremkumar/homebase-shared) - Shared code between frontend apps
- [handmade](https://github.com/CherupallyPremkumar/handmade-backend) - Java backend (Modular Monolith)

## 🔧 Architecture Decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the package management evolution strategy:
- **Phase 1 (Current):** Git URL dependencies
- **Phase 2 (Future):** GitHub Packages
- **Phase 3 (Long-term):** Monorepo with Turborepo/Nx

## 📄 License

MIT

---

**Built with ❤️ by a solo developer managing a full-stack e-commerce platform**
