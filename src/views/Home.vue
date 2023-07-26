<template>
  <div class="home">
    <keyframes/>
  </div>
</template>

<script type="text/ecmascript-6">
import keyframes from '@/views/animation/keyframes/index.vue';
export default {
  name: 'Home',
  components: {
    keyframes
  },
  data () {
    return {
      isShowThree: false,
      isShowMash: false
    };
  },
  methods: {
    handleClick () {
      this.isShowThree = !this.isShowThree;
    }
  }
};
</script>
