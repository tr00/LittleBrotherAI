export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // If no session ID exists, create one
  if (!session.id) {
    const newSessionId = crypto.randomUUID()
    console.log('[Session Middleware] Creating new session:', newSessionId)
    await setUserSession(event, {
      ...session,
      id: newSessionId
    })
  } else {
    console.log('[Session Middleware] Existing session:', session.id)
  }
})
