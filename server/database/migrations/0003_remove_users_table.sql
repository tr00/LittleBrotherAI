-- Migration: Remove users table and GitHub OAuth
-- Switch to pure session-based anonymous chat system

-- Rename userId to sessionId in chats table
ALTER TABLE "chats" RENAME COLUMN "userId" TO "sessionId";--> statement-breakpoint

-- Alter column type to match session ID length
ALTER TABLE "chats" ALTER COLUMN "sessionId" TYPE varchar(255);--> statement-breakpoint

-- Drop old index on userId
DROP INDEX IF EXISTS "chats_user_id_idx";--> statement-breakpoint

-- Create new index on sessionId
CREATE INDEX "chats_session_id_idx" ON "chats" USING btree ("sessionId");--> statement-breakpoint

-- Drop users table and related constraints
DROP TABLE IF EXISTS "users" CASCADE;--> statement-breakpoint

-- Drop provider enum (no longer needed)
DROP TYPE IF EXISTS "provider";
