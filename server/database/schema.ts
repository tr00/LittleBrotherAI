import {
  pgTable,
  varchar,
  pgEnum,
  timestamp,
  index,
  json
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

const timestamps = {
  createdAt: timestamp().defaultNow().notNull()
}

export const roleEnum = pgEnum('role', ['user', 'assistant'])

export const chats = pgTable(
  'chats',
  {
    id: varchar({ length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar({ length: 200 }),
    sessionId: varchar({ length: 255 }).notNull(),
    ...timestamps
  },
  table => [index('chats_session_id_idx').on(table.sessionId)]
)

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages)
}))

export const messages = pgTable(
  'messages',
  {
    id: varchar({ length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    chatId: varchar({ length: 36 })
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),
    role: roleEnum().notNull(),
    parts: json(),
    ...timestamps
  },
  table => [index('messages_chat_id_idx').on(table.chatId)]
)

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))
