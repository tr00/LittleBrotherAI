<script setup lang="ts">
const isDismissed = useSessionStorage('session-warning-dismissed', false)

function dismiss() {
  isDismissed.value = true
}
</script>

<template>
  <UAlert
    v-if="!isDismissed"
    icon="i-lucide-info"
    color="amber"
    variant="soft"
    title="Temporary Session"
    description="Your chats are tied to your browser session and will be lost when you close your browser or your session expires."
    :actions="[{
      label: 'Dismiss',
      color: 'amber',
      variant: 'ghost',
      onClick: dismiss
    }]"
    :close="{ color: 'amber', variant: 'ghost', onClick: dismiss }"
  />
</template>
