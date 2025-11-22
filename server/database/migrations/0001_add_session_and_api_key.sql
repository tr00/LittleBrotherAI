-- Migration: Add session-based authentication and API key storage
-- Adds support for anonymous users via sessionId
-- Makes GitHub OAuth fields nullable
-- Adds encrypted API key storage fields

-- Add new columns to users table
ALTER TABLE "users" ADD COLUMN "sessionId" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "encryptedApiKey" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "apiKeyIv" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "apiKeyUpdatedAt" timestamp;--> statement-breakpoint

-- Make GitHub OAuth fields nullable (for anonymous users)
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "provider" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "providerId" DROP NOT NULL;--> statement-breakpoint

-- Add unique constraint on sessionId
CREATE UNIQUE INDEX "users_session_id_idx" ON "users" USING btree ("sessionId");
