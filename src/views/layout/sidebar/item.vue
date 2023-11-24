<template>
  <div :title="title">{{ title }}</div>
</template>

<script>
export default {
  name: 'item',
  props: {
    svgClass: {
      type: String
    },
    title: {
      type: String
    }
  }
};
</script>

<style scoped>

</style>
