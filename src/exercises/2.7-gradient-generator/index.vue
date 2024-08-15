<script lang="ts" setup>
import { useGradientGenerator } from './gradient-generator'

const gradient = useGradientGenerator()
</script>

<template>
  <h1 class="mb-5">Gradient Generator</h1>

  <div class="my-2 space-x-1">
    <button data-test="btn-reset" @click="gradient.$reset">Reset</button>
    <button data-test="btn-randomize" @click="gradient.randomize(2 + Math.floor(Math.random() * 2))">Randomize</button>
    <button data-test="btn-clipboard" @click="gradient.copyToClipboard">Copy to Clipboard</button>
  </div>

  <p>
    <strong>Gradient:</strong>
    <code>{{ gradient.gradientCSS }}</code>
  </p>

  <div class="rounded gradient-preview"></div>

  <div class="flex py-1 my-2">
    <label class="flex items-center">
      <span>Angle: </span>
      <input
        v-model="gradient.angle"
        data-test="angle-value-range"
        class="mx-3"
        type="range"
        step="1"
        min="0"
        max="360"
      />
    </label>
    <input v-model="gradient.angle" data-test="angle-value-number" type="number" min="0" max="360" />
  </div>

  <div class="flex flex-wrap">
    <!-- Display a swatch of each color in the gradient -->
    <div v-for="(_color, index) in gradient.colors" :key="index" class="flex flex-col items-center group">
      <input v-model="gradient.colors[index]" class="w-12 h-10 p-1 m-1" type="color" />

      <!-- Should remove color when this button is clicked -->
      <button
        class="invisible w-5 h-5 p-0 group-hover:visible"
        data-test="btn-remove-color"
        title="Remove this color"
        :disabled="gradient.colors.length <= 2"
        @click="gradient.removeColor(index)"
      >
        -
      </button>
    </div>

    <button class="w-12 h-10 p-1 m-1" data-test="btn-add-color" title="Add Color" @click="gradient.addRandomColor">
      +
    </button>
  </div>
</template>

<style scoped>
.gradient-preview {
  aspect-ratio: 2 / 1;
  background-image: v-bind('gradient.gradient');
  min-height: 75px;
}
</style>
