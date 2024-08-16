import { acceptHMRUpdate, defineStore } from 'pinia'
// // == NOTO: The setup store didn't pass all test cases...
// import { computed, ref } from 'vue'
// export const useDango = defineStore('2.5.1 store-actions', ({ action }) => {
//   const amount = ref(20)
//   const eatenBalls = ref(0)
//   const isEating = ref(false)

//   const finishedSticks = computed(() => Math.floor(eatenBalls.value / 3))

//   const eatDango = action(() => {
//     if (amount.value <= 0) return
//     eatenBalls.value++
//     if (eatenBalls.value % 3 === 0) amount.value--
//   })

//   async function startEating() {
//     if (isEating.value || amount.value <= 0) return

//     isEating.value = true

//     while (amount.value > 0) {
//       await new Promise(resolve => setTimeout(resolve, 300))

//       if (!isEating.value) return

//       eatDango()
//     }

//     isEating.value = false
//   }

//   function stopEating() {
//     isEating.value = false
//   }

//   function $reset() {
//     amount.value = 20
//     eatenBalls.value = 0
//     isEating.value = false
//   }

//   return {
//     amount,
//     eatenBalls,
//     isEating,
//     finishedSticks,
//     eatDango,
//     startEating,
//     stopEating,
//     $reset,
//   }
// })

export const useDango = defineStore('2.5.1 store-actions', {
  state: () => ({
    amount: 20,
    eatenBalls: 0,

    isEating: false,
  }),

  getters: {
    finishedSticks: state => Math.floor(state.eatenBalls / 3),
  },

  actions: {
    eatDango(): void {
      if (this.amount < 1) return
      this.eatenBalls++
      if (this.eatenBalls % 3 === 0) {
        this.amount--
      }
    },

    async startEating() {
      if (this.isEating || this.amount < 1) return

      this.isEating = true
      while (this.amount > 0) {
        await new Promise(resolve => setTimeout(resolve, 300))
        if (!this.isEating) return
        this.eatDango()
      }

      this.isEating = false
    },

    stopEating() {
      this.isEating = false
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDango, import.meta.hot))
}
