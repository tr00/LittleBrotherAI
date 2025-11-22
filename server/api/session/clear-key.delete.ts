export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // Clear the API key from session
  await setUserSession(event, {
    ...session,
    openRouterApiKey: undefined
  })

  return {
    success: true,
    message: 'API key cleared successfully'
  }
})
