CREATE TYPE "public"."role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TABLE "chats" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" varchar(200),
	"sessionId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"chatId" varchar(36) NOT NULL,
	"role" "role" NOT NULL,
	"parts" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chats_session_id_idx" ON "chats" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "messages_chat_id_idx" ON "messages" USING btree ("chatId");