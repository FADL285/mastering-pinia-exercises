<script setup lang="ts">
import { computed, defineModel, onUnmounted, provide, reactive, Ref, watch } from 'vue'
import { useTabKey } from './injectionKey'

const currentTab = defineModel<number>({
  default: 1,
  required: false,
})

const tabList = reactive(new Map<number, string>())

let currentId = 1 // Unique id for each tab

provide(useTabKey, (title: Ref<string>) => {
  const myId = currentId++
  tabList.set(myId, title.value)

  watch(title, newTitle => {
    tabList.set(myId, newTitle)
  })

  const isVisible = computed(() => currentTab.value === myId)

  onUnmounted(() => {
    tabList.delete(myId)
  })

  return {
    isVisible,
  }
})
</script>

<template>
  <div class="space-x-1 space-y-1">
    <button v-for="[tabId, title] in tabList" :key="tabId" :disabled="currentTab === tabId" @click="currentTab = tabId">
      {{ title }}
    </button>
  </div>

  <slot />
</template>
