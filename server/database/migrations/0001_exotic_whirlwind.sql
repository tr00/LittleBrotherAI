ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "chats" RENAME COLUMN "userId" TO "sessionId";--> statement-breakpoint
DROP INDEX "chats_user_id_idx";--> statement-breakpoint
CREATE INDEX "chats_session_id_idx" ON "chats" USING btree ("sessionId");--> statement-breakpoint
DROP TYPE "public"."provider";