# Homebase Documentation

> **Collaborative Documentation Platform** for the Homebase E-commerce Project  
> Live at: [docs.premkumar.me](https://docs.premkumar.me)

## 🌟 Open Collaboration

**Anyone can contribute!** This is a community-driven documentation platform where contributors can:

- ✏️ **Edit & improve** existing documentation
- ➕ **Create new** documents and guides
- 💬 **Comment & discuss** via GitHub Issues
- 📸 **Upload images** and diagrams
- 📜 **View version history** of all changes

All you need is a GitHub account and a Personal Access Token with `repo` scope.

## 🎯 Purpose

A centralized documentation and task management system designed for collaborative development. This app helps teams organize:

- 📝 **Documentation** - Technical decisions and architecture notes
- 🎯 **Current Plan** - Active work and immediate priorities  
- 🚀 **Future Plans** - Roadmap and upcoming features
- ✅ **Tasks** - Day-to-day todos and action items

## ✨ Features

### 🔍 **Search**
- Fuzzy search across all documents
- Keyboard shortcut: `Cmd/Ctrl + K`
- Search by title, content, and category

### 📚 **Version History**
- View all commits for each document
- See who changed what and when
- Preview previous versions
- Compare changes over time

### 💬 **Comments & Discussions**
- GitHub Issues integration
- Markdown support in comments
- User avatars and timestamps
- Threaded discussions per document

### 🖼️ **Image Upload**
- Direct upload to GitHub repository
- Automatic markdown insertion
- Supports all image formats
- 5MB file size limit

### 📊 **PlantUML Diagrams**
- Render UML diagrams from code
- Sequence, class, and activity diagrams
- Automatic SVG generation

### 🎨 **GeeksforGeeks-Inspired Design**
- Professional green accent theme
- Clean, readable typography
- Responsive layout
- Mobile-friendly

## 🏗️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Typography Plugin
- **Icons:** Lucide React
- **Markdown:** ReactMarkdown + remark-gfm
- **Search:** Fuse.js (fuzzy search)
- **Diagrams:** PlantUML
- **Storage:** GitHub Repository (via GitHub API)
- **Deployment:** GitHub Pages

## 🚀 Getting Started

### For Contributors

1. Visit [docs.premkumar.me](https://docs.premkumar.me)
2. Click "Authenticate" in the header
3. Create a GitHub Personal Access Token with `repo` scope
4. Start editing, creating, and commenting!

### For Developers

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
│   ├── components/          # React components
│   │   ├── SearchModal.tsx
│   │   ├── VersionHistoryModal.tsx
│   │   ├── CommentsSection.tsx
│   │   └── ...
│   ├── services/
│   │   └── github.ts        # GitHub API integration
│   ├── hooks/               # Custom React hooks
│   └── docs/                # Markdown documentation files
├── public/
│   ├── images/              # Uploaded images
│   └── CNAME                # Custom domain config
└── .github/workflows/
    └── deploy.yml           # Auto-deployment

```

## 🔐 Authentication

This app uses GitHub Personal Access Tokens for authentication. Each contributor uses their own token, which means:

- ✅ All changes are attributed to the correct author
- ✅ Full GitHub commit history is maintained
- ✅ No central authentication server needed
- ✅ Secure via GitHub's OAuth system

**Required Token Scope:** `repo` (full control of private repositories)

## 📚 Related Projects

- [homebase-user-ui](https://github.com/CherupallyPremkumar/homebase-user-ui) - Customer-facing e-commerce UI
- [homebase-shared](https://github.com/CherupallyPremkumar/homebase-shared) - Shared code between frontend apps
- [handmade](https://github.com/CherupallyPremkumar/handmade-backend) - Java backend (Modular Monolith)

## 🤝 Contributing

1. **Authenticate** with your GitHub token
2. **Edit** existing documents or create new ones
3. **Comment** on documents to discuss improvements
4. **Upload** images and diagrams to enhance documentation
5. All changes are automatically committed to GitHub with your name!

## 📄 License

MIT

---

**Built with ❤️ for collaborative documentation**
