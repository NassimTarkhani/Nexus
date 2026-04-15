# NEXUS AI Chat Application Upgrade Plan

## Overview
Transform NEXUS into a premium AI chat experience with advanced theming, OpenRouter integration, admin dashboard, and sophisticated tool management.

## Implementation Phases

### Phase 1: Foundation (Core Infrastructure)
- [x] RLS policy fixes (COMPLETED)
- [ ] Theme system with 3 atmospheres (Dark, Light, Atmospheric)
- [ ] OpenRouter provider integration
- [ ] Free model selector component
- [ ] Global state management improvements

### Phase 2: Model & Provider System
- [ ] Remove all providers except OpenRouter
- [ ] Add free OpenRouter models:
  - meta-llama/llama-3-8b-instruct
  - mistralai/mistral-7b-instruct
  - google/gemma-7b-it
  - deepseek/deepseek-chat
  - nousresearch/nous-hermes-2-mixtral
- [ ] Model selector dropdown in chat input
- [ ] Per-conversation model persistence

### Phase 3: Admin Dashboard
- [ ] User Management (CRUD)
  - List all users
  - Create user
  - Edit user
  - Delete user
  - Role assignment
- [ ] Chat Monitoring
  - View all conversations
  - View messages within conversations
  - Filter by user, date, model
- [ ] Database schema updates for tracking

### Phase 4: Preset System
- [ ] Create preset CRUD operations
- [ ] Preset UI components
- [ ] Preset selector in chat
- [ ] System prompt injection logic
- [ ] Per-user preset persistence

### Phase 5: Enhanced Chat UX
- [ ] Centered chat input (initial state)
- [ ] Smooth animation to bottom (after first message)
- [ ] Spring/ease animations
- [ ] Message fade-in effects
- [ ] Typing indicator

### Phase 6: Tools Section
- [ ] Workflows dropdown panel
- [ ] MCP Tools dropdown panel
- [ ] Tool selector UI (hover behavior)
- [ ] Workflow binding to chat input
- [ ] MCP tool routing
- [ ] Clean separation UI

### Phase 7: Theme System (Visual Polish)
- [ ] Dark theme implementation
- [ ] Light theme implementation
- [ ] Atmospheric theme (custom immersive)
- [ ] Theme switcher component
- [ ] CSS variables system
- [ ] Smooth theme transitions
- [ ] Background gradients per theme
- [ ] Component style adaptation

### Phase 8: Background Animations
- [ ] Floating gradients
- [ ] Motion blobs
- [ ] Ambient light effects
- [ ] Parallax movement
- [ ] Performance optimization
- [ ] React-compatible implementation
- [ ] Theme-aware animations

### Phase 9: Microinteractions
- [ ] Hover transitions
- [ ] Dropdown animations
- [ ] Sidebar collapse animation
- [ ] Message fade-in
- [ ] Typing indicator
- [ ] Theme transition animation

### Phase 10: Architecture & Integration
- [ ] Message routing logic (normal/workflow/MCP)
- [ ] Tool invocation system
- [ ] Streaming responses
- [ ] Model switching
- [ ] Clean separation of concerns

## Technical Decisions

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **AI Provider**: OpenRouter only
- **Theme**: next-themes with custom styles
- **Animations**: Framer Motion
- **State**: Zustand (following better-chatbot pattern)
- **UI**: shadcn/ui components

### Architecture Patterns (from better-chatbot)
1. **Model Provider System**: Custom provider with model info
2. **Tool System**: Separate workflows, MCP, app-default tools
3. **Preset System**: Configurable tool presets per user
4. **Streaming**: AI SDK streaming with tool invocation
5. **File Handling**: Multi-format file upload support

### Database Schema Updates Needed
```sql
-- Add to conversations table
ALTER TABLE conversations ADD COLUMN model_used TEXT;
ALTER TABLE conversations ADD COLUMN workflow_id UUID REFERENCES user_workflows(id);
ALTER TABLE conversations ADD COLUMN mcp_tool_id UUID REFERENCES user_mcp_servers(id);

-- Add to messages table  
ALTER TABLE messages ADD COLUMN workflow_id UUID;
ALTER TABLE messages ADD COLUMN mcp_tool_id UUID;
ALTER TABLE messages ADD COLUMN preset_id UUID;

-- Create presets table
CREATE TABLE user_presets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    temperature DECIMAL(3,2),
    max_tokens INTEGER,
    preferred_model TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create theme preferences
ALTER TABLE user_preferences ADD COLUMN theme_mode TEXT DEFAULT 'dark';
ALTER TABLE user_preferences ADD COLUMN theme_style TEXT DEFAULT 'default';
```

### OpenRouter Free Models Configuration
```typescript
export const FREE_OPENROUTER_MODELS = [
  {
    id: "meta-llama/llama-3-8b-instruct:free",
    name: "Llama 3 8B Instruct",
    provider: "meta-llama",
    free: true
  },
  {
    id: "mistralai/mistral-7b-instruct:free", 
    name: "Mistral 7B Instruct",
    provider: "mistralai",
    free: true
  },
  {
    id: "google/gemma-7b-it:free",
    name: "Gemma 7B IT",
    provider: "google",
    free: true
  },
  {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek Chat",
    provider: "deepseek",
    free: true
  },
  {
    id: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free",
    name: "Nous Hermes 2 Mixtral",
    provider: "nousresearch",
    free: true
  }
];
```

### Message Routing Logic
```typescript
interface ChatRequest {
  model: string;
  messages: Message[];
  system_prompt?: string;
  preset_id?: string;
  workflow_id?: string;
  mcp_tool_schema?: any;
}

// Normal chat
if (!workflow_id && !mcp_tool_schema) {
  // Standard chat completion
}

// Workflow chat
if (workflow_id) {
  // Execute workflow with messages
}

// MCP tool chat
if (mcp_tool_schema) {
  // Execute MCP tool with schema
}
```

## Priority Order for Implementation

### Week 1: Core Foundation
1. Theme system infrastructure
2. OpenRouter integration
3. Model selector component

### Week 2: Database & Backend
1. Database schema updates
2. Preset system backend
3. Admin API routes
4. Message persistence improvements

### Week 3: Frontend Components
1. Enhanced chat input
2. Theme switcher
3. Preset UI
4. Model selector in chat

### Week 4: Tools & Integration
1. Workflows dropdown
2. MCP tools dropdown
3. Tool routing logic
4. Message binding

### Week 5: Admin Dashboard
1. User management UI
2. Chat monitoring UI
3. Role management
4. Filters and search

### Week 6: Polish & Animations
1. Background animations
2. Microinteractions
3. Theme transitions
4. Performance optimization

## Success Criteria

- ✅ Only OpenRouter provider active
- ✅ 5 free models selectable
- ✅ 3 complete themes working
- ✅ Preset system functional
- ✅ Admin dashboard complete
- ✅ Tools section working
- ✅ Smooth animations throughout
- ✅ Production-ready code quality
- ✅ Mobile responsive
- ✅ Performance optimized

## Next Steps

1. Start with theme system setup
2. Create OpenRouter provider
3. Build model selector
4. Continue systematically through phases
