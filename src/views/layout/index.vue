<template>
  <el-container>
    <el-aside  :style="{width: isCollapse ? '65px': '200px'}">
      <sidebar ref="menu"></sidebar>
    </el-aside>
    <el-main>
      <router-view  style="height: 100%;width: 100%"/>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
import sidebar from './sidebar/index.vue';
export default {
  name: 'index',
  components: {
    sidebar
  },
  data () {
    return {};
  },
  props: {},
  watch: {},
  computed: {
    ...mapState('app', [
      'isCollapse',
      'isGreyOut',
      'isShowWaterMark',
      'personalMsg',
      'waterMarkArea'])
  },
  mounted () {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  .el-aside {
    height: 100%;
  }
  .el-main {
    width: calc(100% - 200px);
    position: relative;
    margin: 0;
    padding: 0;
  }
}
</style>
