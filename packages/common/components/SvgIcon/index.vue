<template functional>
  <svg class="svg-icon" :class="props.className" aria-hidden="true">
    <use :xlink:href="`#icon-${props.name}`"></use>
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
