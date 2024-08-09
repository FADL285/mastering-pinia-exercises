import { ComputedRef, InjectionKey, Ref } from 'vue'

export const useTabKey: InjectionKey<
  (title: Ref<string>) => {
    isVisible: ComputedRef<boolean>
  }
> = Symbol('useTab')
