// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:2 */
import { defineStore, StateTree } from 'pinia'
import { computed, ComputedRef, UnwrapRef } from 'vue'

export function defineReadonlyState<Id extends string, PrivateState extends StateTree, SetupReturn>(
  id: Id,
  privateStateFn: () => PrivateState,
  setup: (privateSTate: PrivateState) => SetupReturn,
) {
  const usePrivateState = defineStore(id + '_private', {
    state: privateStateFn,
  })

  return defineStore(id, () => {
    const privateState = usePrivateState()
    const result = setup(privateState.$state as PrivateState)

    // Initialize an empty object with the correct type
    const privateStateAsGetters: Record<
      keyof UnwrapRef<PrivateState>,
      ComputedRef<UnwrapRef<PrivateState>[keyof UnwrapRef<PrivateState>]>
    > = {} as Record<keyof UnwrapRef<PrivateState>, ComputedRef<UnwrapRef<PrivateState>[keyof UnwrapRef<PrivateState>]>>

    for (const key in privateState.$state) {
      const typedKey = key as keyof UnwrapRef<PrivateState>
      privateStateAsGetters[typedKey] = computed(() => privateState.$state[typedKey])
    }

    return {
      ...privateStateAsGetters,
      ...result,
    }
  })
}
