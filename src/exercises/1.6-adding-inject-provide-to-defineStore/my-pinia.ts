import { EffectScope, InjectionKey, Plugin, effectScope, inject } from 'vue'

export function defineStore<R>(fn: () => R) {
  function useStore() {
    const globalEffect = inject(effectKey)
    const stores = inject(storesKey)

    if (!globalEffect || !stores) {
      throw new Error('You must use useStore() inside a setup function')
    }

    if (!stores.has(fn)) {
      const effect = globalEffect.run(() => effectScope())!
      const store = effect.run(() => fn())!

      stores.set(fn, store)
    }

    return stores.get(fn) as R
  }

  return useStore
}

const effectKey = Symbol('effect') as InjectionKey<EffectScope>
const storesKey = Symbol('stores') as InjectionKey<WeakMap<() => unknown, unknown>>

// Keep this exported
export const appPlugin: Plugin = app => {
  const globalEffect = effectScope(true)
  const stores = new WeakMap<() => unknown, unknown>()
  app.provide(effectKey, globalEffect)
  app.provide(storesKey, stores)
}
