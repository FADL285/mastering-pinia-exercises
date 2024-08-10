import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Do not change this value, you will need it
const DANGO_PRICE = 350

// Define discount rates in a Map <threshold, rate>
const discountRates = new Map<number, number>([
  [10, 0.2],
  [5, 0.15],
  [3, 0.1],
])

export const useDangoShop = defineStore('2.4.1 store-getters', () => {
  const amount = ref(0)

  const hasDiscount = computed(() => amount.value >= 3)

  const totalPrice = computed(() => Math.ceil(amount.value * DANGO_PRICE))

  const priceAfterDiscount = computed(() => {
    let discount = 0
    for (const [threshold, rate] of discountRates) {
      if (amount.value >= threshold) {
        discount = rate
        break
      }
    }

    return Math.ceil(totalPrice.value * (1 - discount))
  })

  const totalDiscountAmount = computed(() => totalPrice.value - priceAfterDiscount.value)

  return {
    amount,
    totalPrice,
    hasDiscount,
    priceAfterDiscount,
    totalDiscountAmount,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDangoShop, import.meta.hot))
}
