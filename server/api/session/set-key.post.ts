export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const apiKey = body.apiKey

  // Validate API key format
  if (!apiKey || typeof apiKey !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'API key is required'
    })
  }

  if (!apiKey.startsWith('sk-or-')) {
    throw createError({
      statusCode: 400,
      message:
        'Invalid OpenRouter API key format. Key should start with "sk-or-"'
    })
  }

  // Test the API key with OpenRouter auth endpoint
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw createError({
        statusCode: 401,
        message: error.error?.message || 'Invalid API key'
      })
    }
  } catch (error) {
    // If it's already a createError, re-throw it
    if (
      error
      && typeof error === 'object'
      && 'statusCode' in error
      && error.statusCode === 401
    ) {
      throw error
    }
    // Otherwise it's a network error
    throw createError({
      statusCode: 500,
      message: 'Failed to validate API key with OpenRouter'
    })
  }

  // Store the API key in session
  const session = await getUserSession(event)
  await setUserSession(event, {
    ...session,
    openRouterApiKey: apiKey
  })

  return {
    success: true,
    message: 'API key stored successfully'
  }
})
