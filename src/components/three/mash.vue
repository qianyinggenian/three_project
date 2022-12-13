<template>
  <div></div>
</template>

<script>
import mesh from '@/components/three/methods/mesh14';
export default {
  name: 'index',
  data () {
    return {};
  },
  mixins: [mesh],
  mounted () {
    this.initThree();
  },
  methods: {
    ...mesh
  }
};
</script>

<style scoped>

</style>
