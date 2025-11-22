export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  console.log('[Create Chat] Session:', session)
  console.log('[Create Chat] Session ID:', session.id)

  const { input } = await readBody(event)
  const db = useDrizzle()

  if (!session.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No session ID found'
    })
  }

  const [chat] = await db
    .insert(tables.chats)
    .values({
      title: '',
      sessionId: session.id
    })
    .returning()
  if (!chat) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create chat'
    })
  }

  await db.insert(tables.messages).values({
    chatId: chat.id,
    role: 'user',
    parts: [{ type: 'text', text: input }]
  })

  return chat
})
