<template>
  <div></div>
</template>

<script>
import mesh02 from '@/components/three/methods/mesh02';
export default {
  name: 'index',
  data () {
    return {};
  },
  mixins: [mesh02],
  mounted () {
    this.initThree();
  },
  methods: {
    ...mesh02
  }
};
</script>

<style scoped>

</style>
