# Little Brother AI - Project Summary

## Overview

**Little Brother AI** is an AI monitoring and trust-building system designed to detect sandbagging, inconsistency, and adversarial behavior in Large Language Models (LLMs) through real-time monitoring. The tagline is: "Build trust in your LLM by direct feedback from its little brother."

**Current State**: The project is in early development phase, built on the Nuxt AI Chatbot Template. It provides a fully functional AI chat interface with Chain-of-Thought visualization, but the core monitoring and detection features are not yet implemented.

## Technology Stack

### Frontend

- **Nuxt 4** (v4.2.1) - Vue.js-based full-stack framework
- **Vue 3** with TypeScript
- **Nuxt UI** (v4.1.0) - Component library built on Tailwind CSS
- **Tailwind CSS** - Utility-first CSS framework
- **Nuxt MDC** (v0.18.2) - Markdown component rendering

### AI & Streaming

- **Vercel AI SDK v5** (v5.0.90) - Core AI streaming functionality
- **@ai-sdk/vue** (v2.0.90) - Vue integration
- **@ai-sdk/gateway** (v2.0.7) - Unified API for multiple AI providers
- **shiki-stream** (v0.1.3) - Streaming syntax highlighting

### Backend & Database

- **Nitro** - Nuxt's server engine with OpenAPI support
- **PostgreSQL** - Primary database
- **Drizzle ORM** (v0.44.7) - Type-safe ORM
- **drizzle-kit** (v0.31.6) - Database migration tool

## Project Structure

```
├── app/                          # Frontend application
│   ├── components/               # Vue components
│   │   ├── DashboardNavbar.vue
│   │   ├── Logo.vue
│   │   ├── ModelSelect.vue
│   │   ├── Reasoning.vue         # Displays AI reasoning/thinking
│   │   ├── prose/                # Markdown rendering components
│   │   └── tool/                 # AI tool components
│   ├── composables/              # Vue composables
│   │   ├── useChats.ts           # Chat grouping logic
│   │   ├── useHighlighter.ts     # Syntax highlighting
│   │   └── useModels.ts          # AI model selection
│   ├── layouts/default.vue       # Main layout with sidebar
│   ├── pages/
│   │   ├── index.vue             # Home page with chat prompt
│   │   └── chat/[id].vue         # Individual chat page
│   └── app.config.ts             # App configuration
├── server/                       # Backend API
│   ├── api/
│   │   ├── chats.get.ts          # List all chats
│   │   ├── chats.post.ts         # Create new chat
│   │   └── chats/
│   │       ├── [id].get.ts       # Get single chat
│   │       ├── [id].post.ts      # Send message (AI streaming)
│   │       └── [id].delete.ts    # Delete chat
│   └── database/
│       ├── schema.ts             # Database schema
│       └── migrations/           # SQL migrations
├── shared/                       # Shared utilities
│   └── utils/tools/              # AI tool definitions
│       ├── weather.ts            # Weather tool schema
│       └── chart.ts              # Chart tool schema
└── research/                     # Research papers on CoT monitoring
```

## Key Features (Current Implementation)

### 1. AI Chat Interface

- Real-time streaming responses from AI models
- Support for multiple AI providers:
  - OpenAI GPT-4.5-nano
  - Anthropic Claude Haiku 4.5
  - Google Gemini 2.5 Flash
- Unified access through Vercel AI Gateway
- Word-based smooth streaming for natural response flow

### 2. Chain-of-Thought Visualization

- **Reasoning Display** - Shows AI's thinking process (`app/components/Reasoning.vue:*`)
- Support for OpenAI's reasoning effort and Google's thinking config
- Collapsible "Thoughts" component showing reasoning steps
- Markdown cleaning for readable thought display

### 3. Chat Management

- Create, read, and delete chats
- Automatic title generation using GPT-4o-mini (`server/api/chats.post.ts:*`)
- Chat history organized by date (Today, Yesterday, Last Week, Last Month, etc.)
- Persistent storage in PostgreSQL
- Chat prefetching for first 10 chats (performance optimization)

### 4. AI Tools

- **Weather Tool**: Mock weather data with 5-day forecast (`shared/utils/tools/weather.ts:*`)
- **Chart Tool**: Line chart visualization with multiple series support (`shared/utils/tools/chart.ts:*`)
- Tool invocation states (input-streaming, input-available, output-available, output-error)
- Custom UI components for each tool (`app/components/tool/`)

### 5. Advanced UI Features

- Collapsible sidebar with chat history
- Command palette for quick navigation (search)
- Keyboard shortcuts (e.g., 'c' for new chat)
- Light/dark mode with customizable themes
- Theme customization (primary color, neutral color)
- View transitions for smooth navigation
- Responsive design for mobile/desktop

### 6. Code Highlighting

- Streaming syntax highlighting with Shiki
- Support for Vue, JS, TS, CSS, HTML, JSON, YAML, Markdown, Bash
- Theme-aware highlighting (Material Theme Palenight/Lighter)
- JavaScript regex engine for performance

## Architecture

### Data Flow

```
User Input → Vue Component → Nuxt API Route → AI Gateway → AI Provider
                ↓                   ↓              ↓
         UI Updates ← Streaming ← Database ← Response Stream
```

### Message Streaming Flow

1. User sends message via `UChatPrompt` component
2. `Chat` class (AI SDK) manages state and transport
3. POST to `/api/chats/[id]` with model and messages (`server/api/chats/[id].post.ts:*`)
4. Server uses `streamText()` with AI Gateway
5. Response streams back as UI message parts:
   - Text parts (rendered with MDC/Markdown)
   - Reasoning parts (displayed in collapsible)
   - Tool invocations (weather/chart components)
6. Messages saved to database on completion

### Database Schema

```
chats (id, title, createdAt)
  ↓ (one-to-many, cascade delete)
messages (id, chatId, role, parts, createdAt)
```

Schema defined in `server/database/schema.ts:*`

### AI Gateway Integration

- Single API key (`AI_GATEWAY_API_KEY`) for all providers
- Model selection via dropdown (stored in cookie)
- Gateway routes to appropriate provider (OpenAI/Anthropic/Google)
- Automatic retries, load balancing, fallbacks

## Intended Features (Not Yet Implemented)

Based on README and research papers, the project aims to implement:

- **Sandbagging detection** - Identify when models intentionally perform poorly
- **Inconsistency detection** - Find contradictions in AI responses
- **Adversarial behavior monitoring** - Detect malicious or deceptive actions
- **Real-time monitoring** - Continuous oversight of AI behavior

## Notable Technical Aspects

### Performance Optimizations

- Chat prefetching (first 10 chats cached)
- Force-cache strategy for chat data
- Shiki JavaScript regex engine (lightweight)
- View transition API for smooth navigation

### Type Safety

- Full TypeScript coverage
- Drizzle ORM for database type inference
- Zod schemas for runtime validation
- Type-safe tool invocations

### Research Foundation

- Based on cutting-edge AI safety research
- Focus on Chain-of-Thought monitorability
- Papers from 2024-2025 on sandbagging, CoT monitoring
- References from major AI safety researchers (OpenAI, Anthropic, Google DeepMind)

### Privacy & Security

- Cascade deletes prevent orphaned data
- Local database storage for chat history

## Development Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- pnpm package manager

### Environment Variables Required

```
DATABASE_URL=postgresql://...
AI_GATEWAY_API_KEY=...  (Vercel AI Gateway)
OPENAI_API_KEY=...  (for title generation)
```

### Installation

```bash
pnpm install  # Also runs database migrations
pnpm dev      # Start dev server
```

### Key Commands

- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript checks
- `pnpm db:generate` - Generate new migration
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio

## Recent Development Activity

Based on git status (branch: `website`):

- Recent focus on CI/CD fixes and database migrations
- New API endpoint being developed: `server/api/save-key.post.ts` (likely for API key management)
- Database migration for API keys: `server/database/migrations/0001_add_api_key.sql`

## Current State vs. Vision

**Current State**: Fully functional AI chatbot with modern UI, multi-provider support, and CoT visualization

**Vision**: AI monitoring system for detecting adversarial behavior, sandbagging, and inconsistencies

**The Gap**: The monitoring, detection, and "little brother" oversight features are not yet implemented. The research papers suggest the theoretical foundation exists, but the practical implementation is still in the template/prototype phase.

## Summary

Little Brother AI is an ambitious AI safety project currently in its foundational phase. It leverages a production-ready Nuxt AI chatbot template as its base infrastructure and is backed by current academic research on Chain-of-Thought monitoring. The technical implementation is solid with modern best practices (TypeScript, Drizzle ORM, Vercel AI SDK, full type safety), but the core monitoring and detection features that define its mission are yet to be built. The presence of research papers and the focus on reasoning visualization suggest this project aims to bridge the gap between AI safety research and practical tooling for monitoring LLM behavior.
