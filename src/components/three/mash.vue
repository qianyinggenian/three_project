<template>
  <div></div>
</template>

<script>
import mesh04 from '@/components/three/methods/mesh04';
export default {
  name: 'index',
  data () {
    return {};
  },
  mixins: [mesh04],
  mounted () {
    this.initThree();
  },
  methods: {
    ...mesh04
  }
};
</script>

<style scoped>

</style>
