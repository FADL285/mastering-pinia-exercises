import { computed, ref, type ComputedRef, shallowRef } from 'vue'
import { useDataFetchingStore } from './data-fetching-store'

type _MutationKeys<TParams extends readonly any[], TResult> = readonly (
  | string
  | ((context: { variables: TParams; result: TResult }) => string)
)[]

export interface UseMutationsOptions<TResult = unknown, TParams extends readonly unknown[] = readonly []> {
  /**
   * Mutator function that will be called when `mutate()` is called
   */
  mutation: (...args: TParams) => Promise<TResult>
  /**
   * keys related to the data the mutation affects. If the mutation is successful, it will invalidate the query with the
   * same key and refetch it
   */
  keys?: _MutationKeys<TParams, TResult>
}

export interface UseMutationReturn<
  TResult = unknown,
  TParams extends readonly unknown[] = readonly [],
  TError = Error,
> {
  data: ComputedRef<TResult | undefined>
  error: ComputedRef<TError | null>
  isFetching: ComputedRef<boolean>

  mutate: (...params: TParams) => Promise<TResult>
}

export function useMutation<TResult, TParams extends readonly unknown[], TError = Error>({
  mutation,
  keys,
}: UseMutationsOptions<TResult, TParams>): UseMutationReturn<TResult, TParams, TError> {
  const store = useDataFetchingStore()

  const data = shallowRef<TResult | undefined>(undefined)
  const error = shallowRef<TError | null>(null)
  const isFetching = ref(false)

  let pendingPromise: Promise<TResult> | null = null
  function mutate(...args: TParams) {
    isFetching.value = true

    const promise = (pendingPromise = mutation(...args)
      .then(result => {
        if (promise === pendingPromise) {
          data.value = result
          error.value = null

          if (keys) {
            keys.forEach(key => {
              const keyString = typeof key === 'function' ? key({ variables: args, result }) : key
              store.invalidateEntry(keyString, true)
            })
          }
        }

        return result
      })
      .catch(err => {
        if (promise === pendingPromise) {
          error.value = err
        }

        throw err
      })
      .finally(() => {
        if (promise === pendingPromise) {
          isFetching.value = false
        }
      }))

    return promise
  }

  // TODO: implement
  return {
    data: computed(() => data.value),
    isFetching: computed(() => isFetching.value),
    error: computed(() => error.value),
    mutate,
  }
}
