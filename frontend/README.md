# NEXUS Frontend Scaffold

A production-grade AI workspace built with Next.js, TypeScript, and Tailwind CSS.

## Features
- **NEXUS Chat**: Better Chatbot-inspired UI with `@` tool mentions and streaming simulations.
- **Visual Workflow Editor**: Drag-and-drop editor using React Flow for building AI pipelines.
- **Multi-Model Support**: UI for configuring multiple LLM providers (OpenAI, Anthropic, etc.).
- **Custom Agents**: Interface for creating and managing specialized AI agents.
- **Supabase Auth**: Integrated authentication flows.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui primitives
- **State**: Zustand
- **Workflows**: React Flow
- **Auth**: Supabase

## Getting Started

### 1. Environment Variables
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

### 2. Installation
```bash
npm install
```

### 3. Development
```bash
npm run dev
```

## Project Structure
- `/src/app`: Next.js pages and layouts
- `/src/components`: Reusable UI components (Chat, Workflow Editor, etc.)
- `/src/lib`: Utilities, mocks, and store definitions
- `/src/hooks`: Custom React hooks

## Next Steps for Backend Integration
1. **Replace Mocks**: Swap `src/lib/mocks.ts` with real API calls to your backend.
2. **Supabase Realtime**: Enable realtime for multi-user collaboration in workflows.
3. **MCP Integration**: Implement the Model Context Protocol (MCP) client in `src/lib/mcpClient.ts`.
4. **Vector DB**: Connect the Chat UI to a RAG pipeline (Supabase Vector or Pinecone).

## Deployment
This project is ready for deployment on **Vercel**. Simply connect your repository and add the environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)
