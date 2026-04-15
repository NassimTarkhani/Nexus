# NEXUS Database Integration - Complete Setup ✅

All database tables have been fully wired to the frontend! Here's what was done and how to use it.

## 🎯 What's Been Done

### 1. **Complete Database Services** (8 Services)
All tables now have full CRUD operations:
- ✅ **Users** - User management
- ✅ **Preferences** - Theme, language, temperature, tool mode
- ✅ **API Keys** - Provider API key storage (encrypted)
- ✅ **Agents** - Custom AI agents
- ✅ **Workflows** - Automated workflows
- ✅ **MCP Servers** - MCP server configurations
- ✅ **Conversations** - Chat conversations
- ✅ **Messages** - Individual chat messages

### 2. **React Hooks** (7 Hooks)
Easy-to-use hooks for all services:
```tsx
usePreferences()    // User preferences
useApiKeys()        // API key management
useAgents()         // Agent CRUD
useWorkflows()      // Workflow CRUD
useMcpServers()     // MCP server CRUD
useConversations()  // Conversation management
useMessages(id)     // Messages for conversation
```

### 3. **Enhanced Authentication**
- ✅ Better error messages for login issues
- ✅ Automatic profile creation with fallback
- ✅ Profile verification on signin
- ✅ Detailed error reporting

### 4. **Database Setup Verification**
- ✅ Setup checker page at `/setup-check`
- ✅ Automatic database validation
- ✅ Step-by-step fix instructions
- ✅ Environment variable checker

## 🚀 Quick Start

### Step 1: Check Database Setup
Visit: **http://localhost:3000/setup-check**

This will verify:
- ✅ Supabase connection
- ✅ All tables exist
- ✅ RLS policies enabled
- ✅ Environment variables set

### Step 2: Run Database Schema (If Needed)
If setup-check shows errors:

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy content from `DATABASE_SCHEMA.sql`
4. Paste and **Run**
5. Verify in **Table Editor**

### Step 3: Sign Up
Go to: **http://localhost:3000/auth/signup**

The signup process now:
- Creates auth user
- Automatically creates profile (with fallback)
- Sets up default preferences
- Verifies everything worked

### Step 4: Sign In
Go to: **http://localhost:3000/auth/signin**

Better error messages will help debug any issues.

## 📚 Usage Examples

### Using Hooks in Components

```tsx
import { useAgents } from '@/src/lib/hooks/useDatabase';

function AgentManager() {
  const {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgent
  } = useAgents();

  const handleCreate = async () => {
    await createAgent({
      name: 'Code Assistant',
      description: 'Helps with coding',
      system_prompt: 'You are a helpful coding assistant',
      provider: 'openai',
      model: 'gpt-4',
      enabled: true,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>
          <h3>{agent.name}</h3>
          <button onClick={() => toggleAgent(agent.id, !agent.enabled)}>
            {agent.enabled ? 'Disable' : 'Enable'}
          </button>
          <button onClick={() => deleteAgent(agent.id)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleCreate}>Create Agent</button>
    </div>
  );
}
```

### Using Services Directly

```tsx
import { apiKeysService } from '@/src/lib/services';

async function saveApiKey(userId: string) {
  await apiKeysService.upsertApiKey({
    user_id: userId,
    provider: 'openai',
    api_key: 'sk-...',
    enabled: true,
  });
}
```

### Managing Preferences

```tsx
import { usePreferences } from '@/src/lib/hooks/useDatabase';

function Settings() {
  const { preferences, updateTheme, updateToolMode } = usePreferences();

  return (
    <div>
      <button onClick={() => updateTheme('dark')}>Dark Mode</button>
      <button onClick={() => updateTheme('light')}>Light Mode</button>
      <button onClick={() => updateToolMode('auto')}>Auto Tools</button>
      <button onClick={() => updateToolMode('manual')}>Manual Tools</button>
    </div>
  );
}
```

### Working with Conversations

```tsx
import { useConversations, useMessages } from '@/src/lib/hooks/useDatabase';

function Chat() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { conversations, createConversation } = useConversations();
  const { messages, createMessage } = useMessages(activeId);

  const handleNewChat = async () => {
    const conv = await createConversation('New Chat');
    setActiveId(conv.id);
  };

  const handleSend = async (text: string) => {
    if (!activeId) return;
    await createMessage('user', text);
    // Then create assistant message...
  };

  return (
    <div>
      <div className="sidebar">
        {conversations.map(conv => (
          <div key={conv.id} onClick={() => setActiveId(conv.id)}>
            {conv.title}
          </div>
        ))}
        <button onClick={handleNewChat}>New Chat</button>
      </div>
      <div className="chat">
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Troubleshooting

### "Invalid login credentials"
1. Visit `/setup-check` to verify setup
2. Check that `DATABASE_SCHEMA.sql` has been run
3. Verify trigger `handle_new_user()` exists in Supabase
4. Try creating account again - signup now has automatic fallback

### "Table does not exist"
1. Run `DATABASE_SCHEMA.sql` in Supabase SQL Editor
2. Refresh Supabase Dashboard
3. Verify all 8 tables appear in Table Editor

### "Row Level Security policy violation"
1. Ensure you're signed in
2. Check RLS policies in Supabase Dashboard
3. Re-run `DATABASE_SCHEMA.sql` if policies are missing

### Profile not created on signup
The signup process now has **automatic fallback**:
1. Tries trigger-based creation first
2. If that fails, creates profile manually
3. Shows clear error if both fail

## 📁 File Structure

```
src/
├── lib/
│   ├── services/          # Database services
│   │   ├── users.ts
│   │   ├── preferences.ts
│   │   ├── apiKeys.ts
│   │   ├── agents.ts
│   │   ├── workflows.ts
│   │   ├── mcpServers.ts
│   │   ├── conversations.ts
│   │   ├── messages.ts
│   │   └── index.ts
│   ├── hooks/
│   │   └── useDatabase.ts # React hooks
│   ├── verifySetup.ts     # Setup verification
│   └── supabase.ts        # Supabase client
├── app/
│   ├── auth/
│   │   ├── signin/        # Enhanced signin
│   │   └── signup/        # Enhanced signup
│   └── setup-check/       # Setup verification page
```

## 📖 Documentation Files

- `DATABASE_SERVICES_GUIDE.md` - Complete service documentation
- `DATABASE_SCHEMA.sql` - Database schema
- `AUTH_SETUP.md` - Authentication setup guide
- `QUICK_START.md` - This file

## 🎉 What's Next?

1. **Migrate Data**: Move existing localStorage data to database
2. **Real-time Updates**: Add Supabase subscriptions for live updates
3. **Optimize Queries**: Add indexes for performance
4. **Add Caching**: Implement query caching
5. **Batch Operations**: Add bulk create/update/delete

## 🆘 Need Help?

1. Check `/setup-check` page first
2. Review `DATABASE_SERVICES_GUIDE.md`
3. Check Supabase Dashboard logs
4. Verify environment variables in `.env`

---

**Everything is now ready to use!** 🚀

Start by visiting `/setup-check` to verify your setup, then begin using the hooks in your components.
