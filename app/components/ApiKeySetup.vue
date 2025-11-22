<script setup lang="ts">
const apiKey = ref('')
const loading = ref(false)
const error = ref('')

const { setApiKey } = useApiKey()

async function handleSubmit() {
  if (!apiKey.value.trim()) {
    error.value = 'Please enter your API key'
    return
  }

  if (!apiKey.value.startsWith('sk-or-')) {
    error.value = 'Invalid OpenRouter API key format. Keys should start with "sk-or-"'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await setApiKey(apiKey.value.trim())
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to validate API key. Please check your key and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="api-key-setup" :ui="{ body: 'p-0 sm:p-0' }">
    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-6 sm:gap-8 py-8 max-w-2xl">
        <div class="text-center space-y-3">
          <div class="flex justify-center">
            <div class="p-4 rounded-full bg-primary/10">
              <UIcon name="i-lucide-key" class="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
            Welcome to Little Brother AI
          </h1>

          <p class="text-lg text-muted">
            To get started, please enter your OpenRouter API key
          </p>
        </div>

        <UCard :ui="{ body: 'space-y-4' }">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <UFormGroup
              label="OpenRouter API Key"
              help="Your API key is stored only in your browser session and never saved to our servers"
              :error="error"
            >
              <UInput
                v-model="apiKey"
                type="password"
                placeholder="sk-or-v1-..."
                size="xl"
                :disabled="loading"
                autocomplete="off"
                class="w-full"
              />
            </UFormGroup>

            <UButton
              type="submit"
              size="xl"
              block
              :loading="loading"
              :disabled="!apiKey.trim()"
            >
              {{ loading ? 'Validating...' : 'Test & Continue' }}
            </UButton>
          </form>

          <UDivider label="Need an API key?" />

          <div class="space-y-3">
            <p class="text-sm text-muted">
              Don't have an OpenRouter API key yet? Create a free account to get started.
            </p>

            <UButton
              to="https://openrouter.ai/keys"
              target="_blank"
              color="neutral"
              variant="outline"
              block
              icon="i-lucide-external-link"
              trailing
            >
              Get API Key from OpenRouter
            </UButton>
          </div>
        </UCard>

        <UAlert
          icon="i-lucide-info"
          color="primary"
          variant="soft"
          title="Privacy Notice"
          description="Your chats are temporary and tied to your browser session. They will be lost when you close your browser or your session expires."
        />
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
