# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# 🚀 TaskFlow: Collaborative Task & Project Management

## ✨ Features

TaskFlow is designed to be the single source of truth for all team assignments, offering granular control and real-time status updates.

## 📋 Core Task Management

- Structured Tasks: Define tasks with specific Priority (HIGH, MEDIUM, LOW) and Stage (TODO, IN_PROGRESS, COMPLETED).

- Sub-Tasks: Break down complex tasks into manageable SubTask units.

- Due Dates: Assign clear deadlines for all major tasks.

- Dynamic Routing: Seamless URL-based editing and viewing for individual task resources.

## 🤝 Team & Collaboration

- Multi-User Assignment: Assign tasks to one or more Users via the teamUsers relationship.

- Activity Feed: Comprehensive logging of all actions (Activity model) including assignments, progress updates, and comments (ActivityType).

- Management Hierarchy: Define user hierarchy with a managerId for organizational structure.

## 🔔 Integrated Notification System

- Targeted Notices: Send specific Notice objects to individual users or groups (teamRecipients).

- Read Status Tracking: Efficiently track which users have read which notices using the dedicated noticesRead relation, allowing for "Mark All Read" functionality.

- Multiple Notice Types: Support for different communication needs (ALERT, MESSAGE).

## 🛠️ Tech Stack

This project leverages the power of modern frameworks and tools for a robust, type-safe, and highly scalable application.

| Area      |  Technology  |                                                                      Purpose |
| :-------- | :----------: | ---------------------------------------------------------------------------: |
| Framework |  SvelteKit   | Full-stack web development framework for fast, reactive UI and server logic. |
| Database  |  PostgreSQL  |                      Robust, reliable, and feature-rich relational database. |
| ORM       |    Prisma    |    Next-generation Node.js and TypeScript ORM for type-safe database access. |
| Language  |  TypeScript  |     Strong typing across the entire stack (Client, Server, Database models). |
| Styling   | Tailwind CSS | Utility-first CSS framework for rapid, responsive UI development (Inferred). |

## 🤝 Contributing

We welcome contributions to TaskFlow! Please follow these steps:

1. Fork the repository.

2. Create a new feature branch (git checkout -b feature/new-feature).

3. Commit your changes (git commit -m 'feat: added a new feature').

4. Push to the branch (git push origin feature/new-feature).

5. Open a Pull Request.
