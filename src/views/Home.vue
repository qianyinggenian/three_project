<template>
  <div class="home">
<!--    <el-button plain @click="handleClick">朴素按钮</el-button>-->
    <three v-if="isShowThree"></three>
    <mash v-if="!isShowThree"></mash>
  </div>
</template>

<script type="text/ecmascript-6">
import mash from '@/components/three/mash';
import three from '@/components/three/index';

export default {
  name: 'Home',
  components: {
    mash,
    three
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
