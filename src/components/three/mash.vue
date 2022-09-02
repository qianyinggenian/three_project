<template>
  <div></div>
</template>

<script>
import mesh03 from '@/components/three/methods/mesh03';
export default {
  name: 'index',
  data () {
    return {};
  },
  mixins: [mesh03],
  mounted () {
    this.initThree();
  },
  methods: {
    ...mesh03
  }
};
</script>

<style scoped>

</style>
