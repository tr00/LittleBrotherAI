export function useApiKey() {
  const hasApiKey = useState<boolean>('hasApiKey', () => false)
  const isCheckingKey = useState<boolean>('isCheckingKey', () => false)

  /**
   * Check if user has an API key stored in their session
   */
  async function checkApiKeyStatus() {
    isCheckingKey.value = true
    try {
      const { hasKey } = await $fetch('/api/session/get-key-status', {
        method: 'GET'
      })
      hasApiKey.value = hasKey
      return hasKey
    } catch (error) {
      console.error('Failed to check API key status:', error)
      hasApiKey.value = false
      return false
    } finally {
      isCheckingKey.value = false
    }
  }

  /**
   * Set and validate the API key
   */
  async function setApiKey(key: string) {
    try {
      await $fetch('/api/session/set-key', {
        method: 'POST',
        body: { apiKey: key }
      })
      hasApiKey.value = true
    } catch (error) {
      // Re-throw with a user-friendly message
      const err = error as { data?: { message?: string }, message?: string }
      throw new Error(
        err?.data?.message
        || err?.message
        || 'Failed to validate API key. Please check your key and try again.'
      )
    }
  }

  /**
   * Clear the API key from the session
   */
  async function clearApiKey() {
    try {
      await $fetch('/api/session/clear-key', {
        method: 'DELETE'
      })
      hasApiKey.value = false
    } catch (error) {
      console.error('Failed to clear API key:', error)
      throw new Error('Failed to clear API key')
    }
  }

  return {
    hasApiKey,
    isCheckingKey,
    checkApiKeyStatus,
    setApiKey,
    clearApiKey
  }
}
