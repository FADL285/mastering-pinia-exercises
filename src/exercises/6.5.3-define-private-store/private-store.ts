// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:2 */

import { defineStore, SetupStoreDefinition } from 'pinia'

export function definePrivateStore<Id extends string, PrivateStore, SetupReturn>(
  id: Id,
  privateStoreSetup: () => PrivateStore,
  setup: (privateStore: ReturnType<SetupStoreDefinition<string, PrivateStore>>) => SetupReturn,
) {
  const usePrivateStore = defineStore(id + '_private', privateStoreSetup)

  return defineStore(id, () => {
    const privateStore = usePrivateStore()

    return setup(privateStore)
  })
}
