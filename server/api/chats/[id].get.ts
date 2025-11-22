export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { id } = getRouterParams(event)

  const chat = await useDrizzle().query.chats.findFirst({
    where: (chat, { eq, and }) =>
      and(eq(chat.id, id as string), eq(chat.sessionId, session.id)),
    with: {
      messages: {
        orderBy: (message, { asc }) => asc(message.createdAt)
      }
    }
  })

  return chat
})
