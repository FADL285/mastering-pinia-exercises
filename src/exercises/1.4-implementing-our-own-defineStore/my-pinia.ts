import { effectScope } from 'vue'

const stores = new WeakMap<() => unknown, unknown>()

const globalEffectScope = effectScope(true)

export function defineStore<R>(fn: () => R) {
  function useStore() {
    if (!stores.has(fn)) {
      const store = globalEffectScope.run(() => effectScope().run(fn))

      stores.set(fn, store)
    }

    return stores.get(fn) as R
  }

  return useStore
}
