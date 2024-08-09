<script lang="ts">
import { ref,provide, inject, type InjectionKey } from 'vue'

const depthSymbol = Symbol('depth') as InjectionKey<number>
</script>

<script setup lang="ts">

const depth = inject(depthSymbol, 0)
provide(depthSymbol, depth + 1)

const collapsed = ref(depth > 0)

interface TreeEntry {
  name: string
  children: TreeEntry[]
}

defineProps<{
  entry: TreeEntry
}>()
</script>

<template>
  <span v-if="entry.children.length <= 0">
    {{ entry.name }}
  </span>
  <button v-else @click="collapsed = !collapsed">
    {{ entry.name }} {{ collapsed ? '>' : 'v' }}
  </button>
  <ul v-if="!collapsed && entry.children.length">
    <li v-for="item in entry.children">
      <TreeFile :entry="item" /> 
    </li>
  </ul>
</template>
