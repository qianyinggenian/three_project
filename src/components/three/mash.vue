<template>
  <div></div>
</template>

<script>
import mesh05 from '@/components/three/methods/mesh05';
export default {
  name: 'index',
  data () {
    return {};
  },
  mixins: [mesh05],
  mounted () {
    this.initThree();
  },
  methods: {
    ...mesh05
  }
};
</script>

<style scoped>

</style>
