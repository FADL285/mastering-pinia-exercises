import { useClipboard } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

const DEFAULT_COLORS = ['#00c9ff', '#92fe9d']
const DEFAULT_ANGLE = 90

export const useGradientGenerator = defineStore('gradient-generator', () => {
  const colors = ref<string[]>([...DEFAULT_COLORS])
  const angle = ref(DEFAULT_ANGLE)

  const gradient = computed(() => `linear-gradient(${angle.value}deg , ${colors.value.join(', ')})`)
  const gradientCSS = computed(() => `background-image: ${gradient.value};`)

  function addRandomColor() {
    colors.value.push(randomColor())
  }

  function removeColor(index: number) {
    if (colors.value.length <= 2 || index < 0 || index >= colors.value.length) return
    colors.value.splice(index, 1)
  }

  const { copy } = useClipboard()
  function copyToClipboard() {
    copy(gradientCSS.value)
  }

  function randomize(steps = 2) {
    colors.value = Array.from({ length: steps }, randomColor)
  }

  function $reset() {
    colors.value = [...DEFAULT_COLORS]
    angle.value = DEFAULT_ANGLE
  }

  return {
    colors,
    angle,
    gradient,
    gradientCSS,
    addRandomColor,
    removeColor,
    copyToClipboard,
    randomize,
    $reset,
  }
})

/**
 * Utility function for generating a random color
 */
function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    // the input also does lowercase so this is more consistent
    .toLowerCase()
    .padStart(6, '0')}`
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGradientGenerator, import.meta.hot))
}
