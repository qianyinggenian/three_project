<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
  #app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    width: 100%;
  }
  * {
    margin: 0;
  }
</style>
