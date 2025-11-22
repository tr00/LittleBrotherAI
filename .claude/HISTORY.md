# Development History

## 2025-11-22 - Complete Removal of User Authentication

### Final Design: Pure Anonymous Session-Only

After multiple iterations, the project has been simplified to a **pure anonymous, session-only** architecture with no user authentication whatsoever.

**Final Architecture**:

- No user accounts or authentication
- API keys stored only in browser sessions
- Chats associated with session IDs
- All data ephemeral (lost when session expires)

### Evolution Summary

**Iteration 1**: Persistent BYOK with database encryption

- Encrypted API keys in database
- Session-based anonymous users with GitHub login option
- Complex merge logic for session → GitHub transitions
- ❌ Too complex, rolled back

**Iteration 2**: Session-only BYOK, keep GitHub auth

- API keys in session only
- Keep GitHub OAuth for future features
- Keep users table for potential persistence
- ❌ Still too complex, authentication not needed

**Iteration 3 (Final)**: Pure anonymous

- No authentication at all
- No users table
- Session-only everything
- ✅ Simplest possible architecture

### Changes Made in This Session

#### 1. Removed GitHub OAuth Completely

**Deleted**:

- `server/routes/auth/github.get.ts` - OAuth callback handler

**Updated**:

- `.env` - Removed `NUXT_OAUTH_GITHUB_CLIENT_ID` and `NUXT_OAUTH_GITHUB_CLIENT_SECRET`

#### 2. Removed Users Table from Database

**Schema Changes** (`server/database/schema.ts`):

- ❌ Removed entire `users` table definition
- ❌ Removed `usersRelations`
- ❌ Removed `providerEnum` (GitHub provider enum)
- ✅ Changed `chats.userId` → `chats.sessionId`
- ✅ Changed index from `chats_user_id_idx` → `chats_session_id_idx`
- ✅ Removed user relation from `chatsRelations`

**Migration** (`server/database/migrations/0003_remove_users_table.sql`):

- Renamed `chats.userId` column to `chats.sessionId`
- Altered column type to `varchar(255)` (session ID length)
- Dropped old `chats_user_id_idx` index
- Created new `chats_session_id_idx` index
- Dropped `users` table with CASCADE
- Dropped `provider` enum

#### 3. Updated All API Endpoints

**Modified Files**:

- `server/api/chats.get.ts`:
  - Changed from `eq(tables.chats.userId, session.user?.id || session.id)`
  - To `eq(tables.chats.sessionId, session.id)`

- `server/api/chats.post.ts`:
  - Changed from `userId: session.user?.id || session.id`
  - To `sessionId: session.id`

- `server/api/chats/[id].get.ts`:
  - Changed WHERE clause to use `sessionId` instead of `userId`

- `server/api/chats/[id].delete.ts`:
  - Changed WHERE clause to use `sessionId` instead of `userId`

- `server/api/chats/[id].post.ts`:
  - Changed chat lookup to use `sessionId` instead of `userId`
  - Removed user-specific system prompt (no more `session.user?.username`)

#### 4. Removed GitHub UI Components

**Modified** (`app/layouts/default.vue`):

- Removed `const { loggedIn, openInPopup } = useUserSession()`
- Removed `watch(loggedIn, ...)` watcher
- Removed footer template with GitHub login button
- Removed `<UserMenu>` component usage

**Result**: Sidebar footer is now empty (ready for API key settings UI)

### Current Database Schema

```sql
-- Enums
CREATE TYPE "role" AS ENUM('user', 'assistant');

-- Tables
CREATE TABLE "chats" (
  "id" varchar(36) PRIMARY KEY,
  "title" varchar(200),
  "sessionId" varchar(255) NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "messages" (
  "id" varchar(36) PRIMARY KEY,
  "chatId" varchar(36) NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  "role" "role" NOT NULL,
  "parts" json,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX "chats_session_id_idx" ON "chats" ("sessionId");
CREATE INDEX "messages_chat_id_idx" ON "messages" ("chatId");
```

### Files Removed/Modified

**Deleted**:

- `server/routes/auth/github.get.ts`
- `server/utils/encryption.ts` (from earlier rollback)
- `server/utils/session.ts` (from earlier rollback)

**Modified**:

- `.env` - Removed GitHub OAuth credentials
- `server/database/schema.ts` - Removed users table, updated chats
- `server/api/chats.get.ts` - Use sessionId
- `server/api/chats.post.ts` - Use sessionId
- `server/api/chats/[id].get.ts` - Use sessionId
- `server/api/chats/[id].delete.ts` - Use sessionId
- `server/api/chats/[id].post.ts` - Use sessionId, removed user context
- `app/layouts/default.vue` - Removed GitHub login UI

**Migrations Applied**:

- `0002_rollback_session_and_api_key.sql` (from earlier rollback)
- `0003_remove_users_table.sql` (this session)

### Architecture Now

```
User visits → Session created (nuxt-auth-utils)
          → session.id used for all operations
          → Chats stored with sessionId
          → Session expires → chats orphaned in DB
          → No user accounts, no authentication
```

**Data Flow**:

1. Browser gets automatic session from nuxt-auth-utils
2. User enters OpenRouter API key → stored in `session.data.openRouterApiKey`
3. User creates chat → stored with `sessionId: session.id`
4. User sends messages → filtered by `sessionId`
5. Browser closes → session expires, API key gone, chats inaccessible

### Next Steps

Ready to implement the session-only OpenRouter integration (see updated PLAN.md):

1. **Phase 1**: Session API key management endpoints
2. **Phase 2**: OpenRouter integration (replace AI Gateway)
3. **Phase 3**: Frontend UI for API key setup
4. **Phase 4**: Testing and cleanup

### Benefits of Final Architecture

✅ **Simplicity**: No user management, no auth flow, no merge logic  
✅ **Privacy**: Nothing persistent, ephemeral sessions only  
✅ **Speed**: Fastest possible implementation  
✅ **Security**: API keys never stored in database  
✅ **Maintenance**: Minimal code to maintain

### Trade-offs Accepted

❌ Users re-enter API key every session  
❌ Chats lost after session expires  
❌ No cross-device access  
❌ Orphaned chats accumulate in database (need cleanup job later)

---

## Ready for Session-Only OpenRouter Implementation

The codebase is now fully prepared for the session-only OpenRouter API key approach. All authentication code has been removed, database schema simplified, and all endpoints updated to use session IDs.
