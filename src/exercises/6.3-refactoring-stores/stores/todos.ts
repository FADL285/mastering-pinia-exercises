import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { type TodoItem } from '@/api/todos'

// 🚨 Do not change the name of the store or the exported variables

export const useTodosStore = defineStore('6.3-todos', () => {
  const list = skipHydrate(useLocalStorage<TodoItem[]>('6.3-todos', []))

  const finishedList = computed(() => list.value.filter(todo => todo.finished))
  const unfinishedList = computed(() => list.value.filter(todo => !todo.finished))

  function add(text: string) {
    if (!text) return

    list.value.push({
      id: crypto.randomUUID(),
      text,
      finished: false,
      createdAt: Date.now(),
      // anonymous user
      createdBy: null,
    })
  }

  function update(updatedTodo: TodoItem) {
    const index = list.value.findIndex(todo => todo.id === updatedTodo.id)
    if (index > -1) {
      list.value.splice(index, 1, updatedTodo)
    }
  }

  function remove(todoId: string) {
    const index = list.value.findIndex(todo => todo.id === todoId)
    if (index > -1) {
      list.value.splice(index, 1)
    }
  }

  return {
    list,
    finishedList,
    unfinishedList,
    
    add,
    update,
    remove,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
