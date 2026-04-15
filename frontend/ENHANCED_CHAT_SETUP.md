# Enhanced Chat Input UX - Installation Guide

## Overview
The enhanced chat input UX has been implemented with the following features:
1. **Centered input** when no messages (like ChatGPT)
2. **Smooth animation** sliding to bottom after first message
3. **Welcome screen** with gradient icon and suggested prompts
4. **Auto-resizing textarea** that grows with content
5. **Model selector** integrated into input header
6. **Beautiful styling** with glassmorphism and theme support

## New Components Created

### 1. EnhancedChatInput.tsx
- Main input component with centered/bottom positioning
- Model selector integration
- Auto-resize textarea
- Send/Stop controls
- Suggested prompts when empty
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### 2. EnhancedMessageList.tsx
- Message rendering with animations
- Markdown support with syntax highlighting
- User/Assistant message distinction
- Streaming indicator with animated dots
- Auto-scroll to latest message
- Timestamps and model info

### 3. EnhancedChatWindow.tsx
- Main orchestrator component
- State management for messages and streaming
- API integration with abort support
- Toast notifications for user feedback

### 4. ui/textarea.tsx
- Shadcn/ui compatible textarea component

## Required Dependencies

Run the following command to install missing dependencies:

```bash
npm install sonner remark-gfm react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter
```

### Dependencies Breakdown:
- **sonner**: Toast notifications (already used in better-chatbot)
- **remark-gfm**: GitHub Flavored Markdown support
- **react-syntax-highlighter**: Code syntax highlighting in markdown
- **@types/react-syntax-highlighter**: TypeScript types

Note: `motion` package is already installed (replaces framer-motion)

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd frontend
npm install sonner remark-gfm react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter
```

### Step 2: Add Toaster to Layout
Update `src/app/layout.tsx` to include the Toaster component:

```tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Step 3: Use EnhancedChatWindow
Replace your current chat implementation with the new component:

**Option A: Direct replacement in a page**
```tsx
// src/app/chat/page.tsx
import { EnhancedChatWindow } from "@/src/components/EnhancedChatWindow";

export default function ChatPage() {
  return <EnhancedChatWindow />;
}
```

**Option B: Test alongside existing chat**
Create a new page to test:
```tsx
// src/app/chat-new/page.tsx
import { EnhancedChatWindow } from "@/src/components/EnhancedChatWindow";

export default function NewChatPage() {
  return <EnhancedChatWindow />;
}
```

### Step 4: Update API Route (if needed)
The component expects the `/api/chat` endpoint to:
- Accept: `{ messages, model, stream: true }`
- Return: SSE stream with `data: ` prefixed JSON chunks
- Chunks: `{ content: "..." }` with incremental text
- End with: `data: [DONE]`

This should already be compatible with the enhanced chat API we created earlier.

## Features Demonstrated

### When No Messages (Centered State)
- ✅ Vertically centered input box
- ✅ Welcome message: "What can I help you create today?"
- ✅ Gradient Sparkles icon with bounce animation
- ✅ 4 suggested prompts in a grid
- ✅ Model selector visible in header
- ✅ Hint text: "Press Enter to send"

### After First Message (Bottom State)
- ✅ Smooth spring animation sliding input to bottom
- ✅ Welcome message fades out
- ✅ Suggested prompts fade out
- ✅ Messages appear in scrollable area above
- ✅ Auto-scroll to latest message
- ✅ Streaming indicator while AI responds

### Input Interactions
- ✅ Focus: Blue glow effect on border
- ✅ Typing: Auto-resize up to 300px height
- ✅ Enter: Send message (disabled while streaming)
- ✅ Shift+Enter: New line in textarea
- ✅ Stop button: Abort streaming response

### Message Rendering
- ✅ User messages: Indigo gradient background, right-aligned
- ✅ AI messages: Dark zinc background, left-aligned
- ✅ Markdown: Full support with GFM (tables, strikethrough, etc.)
- ✅ Code blocks: Syntax highlighted with VS Code Dark+ theme
- ✅ Inline code: Styled appropriately per message type
- ✅ Links: Open in new tab with proper styling
- ✅ Lists: Proper bullet/number formatting
- ✅ Timestamps: Show time for each message

### Animations
- ✅ Input position: Spring physics (stiffness: 300, damping: 30)
- ✅ Messages: Fade in + slide up with stagger
- ✅ Welcome elements: Sequential entrance animations
- ✅ Streaming dots: Pulsing animation with delay
- ✅ Icon bounce: Scale animation on mount

## Theming Support

The component uses CSS variables from global.css:
- `bg-zinc-950`: Main background
- `bg-zinc-900`: Input background
- `border-zinc-800`: Borders
- `text-zinc-100/500/600`: Text colors
- `bg-indigo-600`: Primary accent (user messages, buttons)
- `bg-emerald-600`: AI avatar gradient
- `bg-purple-600`: Icon gradient

These automatically adapt to the theme system (dark/light/atmospheric).

## API Integration

The component calls `/api/chat` with:
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "New question" }
  ],
  "model": "meta-llama/llama-3.2-3b-instruct:free",
  "stream": true
}
```

Expected response stream:
```
data: {"content": "Hello"}
data: {"content": " there"}
data: {"content": "!"}
data: [DONE]
```

## Testing Checklist

After installation, test:
- [ ] Input is centered on empty page
- [ ] Suggested prompts are clickable and fill input
- [ ] Model selector shows 5 free OpenRouter models
- [ ] Pressing Enter sends message
- [ ] Input slides smoothly to bottom after first message
- [ ] User message appears with indigo background
- [ ] Streaming dots show while AI is thinking
- [ ] AI response streams in character by character
- [ ] Markdown renders correctly (try code blocks)
- [ ] Syntax highlighting works in code blocks
- [ ] Stop button aborts streaming
- [ ] Toast notifications appear for errors
- [ ] Auto-scroll follows new messages
- [ ] Textarea auto-resizes as you type
- [ ] Shift+Enter creates new line without sending

## Troubleshooting

### Import errors for 'motion'
If you see errors about framer-motion:
- Confirm `"motion": "^12.35.0"` is in package.json
- The imports use `"motion/react"` not `"framer-motion"`
- Run `npm install` to ensure it's installed

### Type errors for react-markdown
If you see type errors:
- Install `@types/react-syntax-highlighter`
- Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Missing Textarea component
- Should be created at `src/components/ui/textarea.tsx`
- If missing, copy from shadcn/ui docs

### API not streaming
- Verify `/api/chat` returns SSE format
- Check browser Network tab for streaming response
- Ensure `stream: true` is in request body

### Messages not appearing
- Check browser console for errors
- Verify user is authenticated (useAuth hook)
- Check API response in Network tab

## Next Steps

Once this is working:
1. **Add Preset Selector** - Dropdown to choose system prompts
2. **Add Tools Dropdown** - Workflows and MCP tools integration
3. **Add Background Animations** - Floating gradient blobs
4. **Add Microinteractions** - Button hovers, transitions
5. **Build Admin Dashboard** - User management and monitoring

## File Locations

```
frontend/src/components/
├── EnhancedChatInput.tsx      # Main input with centering logic
├── EnhancedMessageList.tsx    # Message rendering
├── EnhancedChatWindow.tsx     # Orchestrator component
└── ui/
    └── textarea.tsx            # Textarea component
```

## Architecture

```
EnhancedChatWindow (State Management)
├── EnhancedMessageList (if hasMessages)
│   └── MessageBubble × N
│       ├── Avatar (User/Bot)
│       ├── Markdown Content
│       └── Timestamp
└── EnhancedChatInput (Centered → Bottom)
    ├── Welcome Message (if !hasMessages)
    ├── ModelSelector (in header)
    ├── Textarea (auto-resize)
    ├── Send/Stop Button
    └── Suggested Prompts (if !hasMessages)
```

The input position changes based on `hasMessages` state:
- **false**: `position: fixed, top: 50%, left: 50%, translate: -50%`
- **true**: `position: relative` (flows in document)

Animation handled by motion variants with spring physics.
