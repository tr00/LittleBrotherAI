# Session-Only OpenRouter API Key Integration

## Overview

Switch from centralized Vercel AI Gateway to user-provided OpenRouter API keys stored in browser sessions.

**Key Design Principle**:

- No user authentication required
- API keys stored only in session (not database)
- Chats stored in database but become inaccessible after session expires
- Pure anonymous, ephemeral experience

## Architecture

### Session Storage

- **API Key**: Stored in `session.data.openRouterApiKey` (in-memory, encrypted by nuxt-auth-utils)
- **Session ID**: Used to associate chats with session
- **Lifetime**: Expires when browser closes or session times out
- **No persistence**: API keys never written to database

### Chat Persistence

- Chats stored in database with `sessionId` (not userId)
- After session expires: chats exist in DB but user can't access them
- Cleanup: Background job to delete old orphaned chats (optional, future feature)

### No User Table or Authentication

- ✅ GitHub OAuth completely removed
- ✅ Users table dropped from database
- ✅ All operations session-based
- ✅ No user records or authentication

## Implementation Steps

### Phase 1: Session API Key Management

1. **Create `server/api/session/set-key.post.ts`**
   - Accept OpenRouter API key in request body
   - Validate key format (starts with `sk-or-`)
   - Test key with minimal OpenRouter API call
   - Store in session: `session.data.openRouterApiKey = key`
   - Return success/error

2. **Create `server/api/session/get-key-status.get.ts`**
   - Check if `session.data.openRouterApiKey` exists
   - Return `{ hasKey: boolean }`
   - Don't return the actual key

3. **Create `server/api/session/clear-key.delete.ts`**
   - Remove `session.data.openRouterApiKey`
   - Return success

### Phase 2: OpenRouter Integration

4. **Install OpenRouter SDK**

  (already done)
   ```bash
   pnpm add @ai-sdk/openrouter
   ```

5. **Modify `server/api/chats/[id].post.ts`**
   - Get API key from session: `session.data.openRouterApiKey`
   - If no key: return 403 error "API key required"
   - Replace `gateway()` calls with `openrouter()`
   - Pass user's API key to OpenRouter
   - Use session.id for chat association (not userId)

6. **Modify `server/api/chats.post.ts`**
   - Use `session.id` instead of `user.id`
   - Create chat associated with session

7. **Modify `server/api/chats.get.ts`**
   - Filter chats by `session.id` instead of `user.id`
   - Only return chats from current session

8. **Update `app/composables/useModels.ts`**
   - Replace AI Gateway models with OpenRouter models
   - Hardcode 10-15 popular models (see list below)

### Phase 3: Frontend UI

9. **Create `app/components/ApiKeySetup.vue`**
   - Full-page prompt for first-time users
   - Password input field for API key
   - "Test & Continue" button
   - Link to OpenRouter signup: https://openrouter.ai
   - Error handling for invalid keys

10. **Create `app/components/ApiKeySettings.vue`**
    - Modal/dropdown for managing API key
    - Show "API key is set" status (don't show key)
    - "Update key" and "Clear key" buttons
    - Warn: "Clearing key will end your session"

11. **Create `app/composables/useApiKey.ts`**
    - `hasApiKey` reactive state
    - `setApiKey(key)` function
    - `clearApiKey()` function
    - `checkApiKeyStatus()` on app load

12. **Update `app/pages/index.vue`**
    - Check API key status on mount
    - Show `ApiKeySetup` if no key
    - Show chat interface if key exists

13. **Update `app/components/DashboardNavbar.vue`**
    - Add settings button for API key management
    - Show "API Key Settings" option

14. **Add session warning banner**
    - "Your chats are temporary and will be lost after this session"
    - Dismissible but reappears on new sessions

### Phase 4: Cleanup & Testing

15. **Remove AI Gateway dependencies**
    - Remove `AI_GATEWAY_API_KEY` from env vars
    - Remove gateway imports from code
    - Update `.env.example`

16. **Update documentation**
    - README: Explain session-only approach
    - Add OpenRouter setup instructions
    - Document model list

17. **Test flows**
    - Set key → chat → works
    - Invalid key → error handling
    - Clear key → can't chat
    - Close browser → chats gone (new session)

## Recommended OpenRouter Models

**Tier 1 - Fast & Cheap:**

- `openai/gpt-4o-mini`
- `anthropic/claude-3-5-haiku`
- `google/gemini-2.0-flash-exp`

**Tier 2 - Balanced:**

- `openai/gpt-4o`
- `anthropic/claude-3-5-sonnet`
- `google/gemini-exp-1206`

**Tier 3 - Powerful:**

- `openai/o1`
- `anthropic/claude-opus-4-20250514`
- `google/gemini-pro-1.5`

**Tier 4 - Open Source:**

- `meta-llama/llama-3.3-70b-instruct`
- `deepseek/deepseek-r1`

## Files to Create/Modify

**Backend** (6 files):

- Create: `server/api/session/set-key.post.ts`
- Create: `server/api/session/get-key-status.get.ts`
- Create: `server/api/session/clear-key.delete.ts`
- Modify: `server/api/chats/[id].post.ts`
- Modify: `server/api/chats.post.ts`
- Modify: `server/api/chats.get.ts`

**Frontend** (6 files):

- Create: `app/components/ApiKeySetup.vue`
- Create: `app/components/ApiKeySettings.vue`
- Create: `app/composables/useApiKey.ts`
- Modify: `app/pages/index.vue`
- Modify: `app/components/DashboardNavbar.vue`
- Modify: `app/composables/useModels.ts`

**Config** (3 files):

- Modify: `package.json` (add @ai-sdk/openrouter)
- Modify: `README.md`
- Modify: `.env.example`

## User Experience Flow

1. User visits site → automatic session created
2. User sees "Enter your OpenRouter API key to start"
3. User enters key → validated via test call
4. User chats → all requests use their key
5. User closes browser → session expires
6. User returns → new session, must re-enter key, old chats gone

## Security Guarantees

✓ API keys stored only in session (encrypted by nuxt-auth-utils)  
✓ Keys never written to database or logs  
✓ Keys validated before acceptance  
✓ Each session isolated (can't access other sessions' chats)  
✓ HTTPS-only transmission  
✓ No persistent user data (privacy-focused)

## Trade-offs

**Pros**:

- ✅ Simplest possible implementation
- ✅ No database encryption complexity
- ✅ No user authentication needed
- ✅ Maximum privacy (ephemeral sessions)
- ✅ No API key persistence = no key management burden

**Cons**:

- ❌ Users re-enter key every session
- ❌ Chats lost after session (orphaned in DB)
- ❌ No cross-device sync
- ❌ Database accumulates orphaned chats (need cleanup job)

## Future Enhancements

1. **Optional GitHub login** for persistent API keys (Phase 5+)
2. **Chat cleanup job** to delete orphaned chats older than 7 days
3. **Export chat history** before session ends
4. **Local storage** for API key (less secure but more convenient)

## Open Questions

None - plan is ready for implementation.
