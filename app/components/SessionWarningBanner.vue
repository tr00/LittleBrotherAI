<script setup lang="ts">
const isDismissed = useState('session-warning-dismissed', () => false)

function dismiss() {
  isDismissed.value = true
}
</script>

<template>
  <UAlert
    v-if="!isDismissed"
    icon="i-lucide-info"
    color="warning"
    variant="soft"
    title="Temporary Session"
    description="Your chats are tied to your browser session and will be lost when you close your browser or your session expires."
    :actions="[{
      label: 'Dismiss',
      color: 'warning',
      variant: 'ghost',
      onClick: dismiss
    }]"
    :close="{ color: 'warning', variant: 'ghost', onClick: dismiss }"
  />
</template>
