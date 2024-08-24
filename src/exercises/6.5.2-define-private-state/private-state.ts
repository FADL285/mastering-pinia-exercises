// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any: 2 */
import { defineStore, StateTree } from 'pinia'

export function definePrivateState<
  Id extends string,
  PrivateState extends StateTree,
  SetupReturn,
>(
  id: Id,
  privateStateFn: () => PrivateState,
  setup: (privateSTate: PrivateState) => SetupReturn,
) {
  const usePrivateState = defineStore(id + '_private', {
    state: privateStateFn,
  })

  return defineStore(id, () => {
    const privateState = usePrivateState()
    return setup(privateState.$state as PrivateState)
  })
}
