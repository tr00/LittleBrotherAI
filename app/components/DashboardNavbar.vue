<script setup lang="ts">
const isSettingsOpen = ref(false)
const { hasApiKey } = useApiKey()
</script>

<template>
  <UDashboardNavbar
    class="sticky lg:absolute top-0 inset-x-0 border-b-0 z-10 bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none pointer-events-none"
    :ui="{ left: 'pointer-events-auto', right: 'pointer-events-auto' }"
  >
    <template #right>
      <UTooltip v-if="hasApiKey" text="API Key Settings">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-key"
          @click="isSettingsOpen = true"
        />
      </UTooltip>

      <UColorModeButton />

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-plus"
        to="/"
        class="lg:hidden"
      />
    </template>
  </UDashboardNavbar>

  <ApiKeySettings v-model:open="isSettingsOpen" />
</template>
