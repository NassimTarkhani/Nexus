# Database Services Usage Guide

## Overview
All database tables are now fully wired to the frontend with complete CRUD operations.

## Available Services

### 1. User Service (`userService`)
Located at: `src/lib/services/users.ts`

**Operations:**
- `getCurrentUser()` - Get current user profile
- `getAllUsers()` - Get all users (admin only)
- `getUserById(userId)` - Get specific user
- `updateUser(userId, updates)` - Update user profile
- `deleteUser(userId)` - Delete user (admin only)
- `isAdmin(userId)` - Check if user is admin

### 2. Preferences Service (`preferencesService`)
Located at: `src/lib/services/preferences.ts`

**Operations:**
- `getPreferences(userId)` - Get user preferences
- `updatePreferences(userId, updates)` - Update preferences
- `updateTheme(userId, theme)` - Update theme (dark/light)
- `updateLanguage(userId, language)` - Update language
- `updateTemperature(userId, temperature)` - Update chat temperature
- `updateToolMode(userId, toolMode)` - Update tool mode (auto/manual)

### 3. API Keys Service (`apiKeysService`)
Located at: `src/lib/services/apiKeys.ts`

**Operations:**
- `getApiKeys(userId)` - Get all API keys
- `getApiKeyByProvider(userId, provider)` - Get API key for specific provider
- `upsertApiKey(apiKey)` - Add or update API key
- `updateApiKey(id, updates)` - Update API key
- `toggleApiKey(id, enabled)` - Enable/disable API key
- `deleteApiKey(id)` - Delete API key
- `getEnabledApiKeys(userId)` - Get only enabled API keys

### 4. Agents Service (`agentsService`)
Located at: `src/lib/services/agents.ts`

**Operations:**
- `getAgents(userId)` - Get all agents
- `getAgentById(id)` - Get specific agent
- `createAgent(agent)` - Create new agent
- `updateAgent(id, updates)` - Update agent
- `deleteAgent(id)` - Delete agent
- `toggleAgent(id, enabled)` - Enable/disable agent
- `getEnabledAgents(userId)` - Get only enabled agents

### 5. Workflows Service (`workflowsService`)
Located at: `src/lib/services/workflows.ts`

**Operations:**
- `getWorkflows(userId)` - Get all workflows
- `getWorkflowById(id)` - Get specific workflow
- `createWorkflow(workflow)` - Create new workflow
- `updateWorkflow(id, updates)` - Update workflow
- `deleteWorkflow(id)` - Delete workflow
- `toggleWorkflow(id, enabled)` - Enable/disable workflow
- `getEnabledWorkflows(userId)` - Get only enabled workflows

### 6. MCP Servers Service (`mcpServersService`)
Located at: `src/lib/services/mcpServers.ts`

**Operations:**
- `getMcpServers(userId)` - Get all MCP servers
- `getMcpServerById(id)` - Get specific MCP server
- `createMcpServer(server)` - Create new MCP server
- `updateMcpServer(id, updates)` - Update MCP server
- `deleteMcpServer(id)` - Delete MCP server
- `toggleMcpServer(id, enabled)` - Enable/disable MCP server
- `getEnabledMcpServers(userId)` - Get only enabled MCP servers
- `updateConnectionStatus(id, status)` - Update connection status

### 7. Conversations Service (`conversationsService`)
Located at: `src/lib/services/conversations.ts`

**Operations:**
- `getConversations(userId)` - Get all conversations
- `getConversationById(id)` - Get specific conversation
- `createConversation(conversation)` - Create new conversation
- `updateConversation(id, updates)` - Update conversation
- `updateTitle(id, title)` - Update conversation title
- `deleteConversation(id)` - Delete conversation
- `archiveConversation(id)` - Archive conversation
- `unarchiveConversation(id)` - Unarchive conversation
- `getArchivedConversations(userId)` - Get only archived
- `getActiveConversations(userId)` - Get only active
- `searchConversations(userId, query)` - Search conversations

### 8. Messages Service (`messagesService`)
Located at: `src/lib/services/messages.ts`

**Operations:**
- `getMessages(conversationId)` - Get all messages
- `getMessageById(id)` - Get specific message
- `createMessage(message)` - Create new message
- `updateMessage(id, updates)` - Update message
- `deleteMessage(id)` - Delete message
- `getMessagesByRole(conversationId, role)` - Filter by role
- `searchMessages(conversationId, query)` - Search messages
- `getLastMessage(conversationId)` - Get last message
- `countMessages(conversationId)` - Count messages

## React Hooks

All services have corresponding React hooks for easy usage in components:

### Available Hooks
- `usePreferences()` - User preferences with real-time updates
- `useApiKeys()` - API keys management
- `useAgents()` - Agents management
- `useWorkflows()` - Workflows management
- `useMcpServers()` - MCP servers management
- `useConversations()` - Conversations management
- `useMessages(conversationId)` - Messages for specific conversation

### Hook Usage Example

```tsx
import { useAgents } from '@/src/lib/hooks/useDatabase';

function MyComponent() {
  const {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgent,
    refresh
  } = useAgents();

  const handleCreate = async () => {
    await createAgent({
      name: 'My Agent',
      description: 'Agent description',
      system_prompt: 'You are a helpful assistant',
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
          <button onClick={() => deleteAgent(agent.id)}>Delete</button>
          <button onClick={() => toggleAgent(agent.id, !agent.enabled)}>
            {agent.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      ))}
      <button onClick={handleCreate}>Create Agent</button>
    </div>
  );
}
```

## Direct Service Usage Example

```tsx
import { agentsService } from '@/src/lib/services';

async function createNewAgent() {
  try {
    const agent = await agentsService.createAgent({
      user_id: 'user-id',
      name: 'My Agent',
      description: 'Agent description',
      system_prompt: 'You are a helpful assistant',
      provider: 'openai',
      model: 'gpt-4',
      enabled: true,
    });
    console.log('Created:', agent);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Important Notes

### Authentication Required
All services require authentication. They automatically use the current user from `useAuthStore()`.

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only access their own data
- Admins can access all users' data (for users table only)
- All operations are automatically scoped to the current user

### Auto-refresh
Hooks automatically fetch data when the user changes and provide a `refresh()` method for manual updates.

### Error Handling
All hooks provide an `error` state. Always check for errors in your components:

```tsx
const { data, loading, error } = useAgents();

if (error) {
  return <div className="text-red-500">Error: {error}</div>;
}
```

## Database Setup Required

Before using these services, ensure you've:

1. ✅ Run `DATABASE_SCHEMA.sql` in your Supabase SQL Editor
2. ✅ Set environment variables in `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ✅ Created at least one admin user
4. ✅ Verified all tables exist in Supabase Dashboard

## Testing the Setup

Run this in your browser console after logging in:

```javascript
import { agentsService } from '@/src/lib/services';

// Test agents service
agentsService.getAgents('user-id')
  .then(agents => console.log('Agents:', agents))
  .catch(error => console.error('Error:', error));
```

## Troubleshooting

### "Invalid login credentials"
- Ensure DATABASE_SCHEMA.sql has been run in Supabase
- Check that the `handle_new_user()` trigger is active
- Verify user exists in both `auth.users` and `public.users` tables

### "Row Level Security policy violation"
- Ensure user is authenticated
- Check RLS policies in Supabase Dashboard
- Verify user_id matches the authenticated user

### "Table does not exist"
- Run DATABASE_SCHEMA.sql in Supabase SQL Editor
- Refresh Supabase Dashboard to see new tables

## Next Steps

1. Update existing components to use these services
2. Replace localStorage with database storage
3. Add real-time subscriptions for live updates
4. Implement data migration from localStorage to database
