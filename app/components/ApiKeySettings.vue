<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false })

const newApiKey = ref('')
const loading = ref(false)
const error = ref('')
const isUpdating = ref(false)

const { clearApiKey, setApiKey } = useApiKey()

function startUpdate() {
  isUpdating.value = true
  newApiKey.value = ''
  error.value = ''
}

function cancelUpdate() {
  isUpdating.value = false
  newApiKey.value = ''
  error.value = ''
}

async function handleUpdate() {
  if (!newApiKey.value.trim()) {
    error.value = 'Please enter your API key'
    return
  }

  if (!newApiKey.value.startsWith('sk-or-')) {
    error.value = 'Invalid OpenRouter API key format. Keys should start with "sk-or-"'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await setApiKey(newApiKey.value.trim())
    isUpdating.value = false
    newApiKey.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to validate API key'
  } finally {
    loading.value = false
  }
}

async function handleClear() {
  if (!confirm('Are you sure you want to clear your API key? This will end your session and you will lose access to your current chats.')) {
    return
  }

  loading.value = true
  try {
    await clearApiKey()
    isOpen.value = false
    // Reload the page to show the API key setup screen
    window.location.reload()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ body: 'space-y-4' }">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-key" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">
            API Key Settings
          </h3>
        </div>
      </template>

      <div v-if="!isUpdating" class="space-y-4">
        <UAlert
          icon="i-lucide-check-circle"
          color="primary"
          variant="soft"
          title="API Key Status"
          description="Your OpenRouter API key is currently set and active."
        />

        <div class="flex flex-col gap-2">
          <UButton
            color="neutral"
            variant="outline"
            block
            icon="i-lucide-refresh-cw"
            @click="startUpdate"
          >
            Update API Key
          </UButton>

          <UButton
            color="warning"
            variant="outline"
            block
            icon="i-lucide-trash-2"
            :loading="loading"
            @click="handleClear"
          >
            Clear API Key
          </UButton>
        </div>

        <UAlert
          icon="i-lucide-alert-triangle"
          color="warning"
          variant="soft"
          title="Warning"
          description="Clearing your API key will end your current session. You will need to re-enter your key to continue chatting."
        />
      </div>

      <div v-else class="space-y-4">
        <form class="space-y-4" @submit.prevent="handleUpdate">
          <UFormGroup
            label="New OpenRouter API Key"
            help="Your API key is stored only in your browser session"
            :error="error"
          >
            <UInput
              v-model="newApiKey"
              type="password"
              placeholder="sk-or-v1-..."
              size="lg"
              :disabled="loading"
              autocomplete="off"
            />
          </UFormGroup>

          <div class="flex gap-2">
            <UButton
              type="submit"
              size="lg"
              class="flex-1"
              :loading="loading"
              :disabled="!newApiKey.trim()"
            >
              {{ loading ? 'Validating...' : 'Update Key' }}
            </UButton>

            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="lg"
              :disabled="loading"
              @click="cancelUpdate"
            >
              Cancel
            </UButton>
          </div>
        </form>
      </div>

      <template #footer>
        <div class="text-xs text-muted">
          <p>Your API key is encrypted and stored only in your browser session. It is never saved to our servers or database.</p>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
