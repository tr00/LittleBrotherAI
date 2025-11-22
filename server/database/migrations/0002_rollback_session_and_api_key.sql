-- Rollback: Remove session-based authentication and API key storage
-- Reverting changes from 0001_add_session_and_api_key.sql

-- Drop unique index on sessionId
DROP INDEX IF EXISTS "users_session_id_idx";--> statement-breakpoint

-- Make GitHub OAuth fields NOT NULL again (restore original constraints)
ALTER TABLE "users" ALTER COLUMN "providerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "provider" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint

-- Drop new columns from users table
ALTER TABLE "users" DROP COLUMN IF EXISTS "apiKeyUpdatedAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "apiKeyIv";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "encryptedApiKey";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "sessionId";
