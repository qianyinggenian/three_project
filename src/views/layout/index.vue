<template>
  <el-container>
    <el-header>
      <div class="header-container">threeJs学习
        <img src="/three_project/static/images/18.jpg" width="60" height="60" alt="">
      </div>
    </el-header>
    <el-container class="content-container">
      <el-aside  :style="{width: isCollapse ? '65px': '200px'}">
        <sidebar ref="menu"></sidebar>
      </el-aside>
      <el-main :class="{'collapse': isCollapse}">
        <router-view  style="height: 100%;width: 100%"/>
      </el-main>
    </el-container>
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
  overflow: hidden;
  .el-aside {
    height: 100%;
  }
  .el-main {
    position: relative;
    margin: 0;
    padding: 0;
    overflow-y: hidden;
  }
  .collapse {
  }
}
.el-header {
  display: flex;
  align-items: center;
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,34,121,1) 35%, rgba(0,212,255,1) 100%);
  .header-container {
    color: #ffffff;
    margin-left: 20px;
    font-size: 32px;
    background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
