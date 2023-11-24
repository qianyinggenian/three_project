<template>
  <div class="menu-container">
    <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#0a1a34"
        text-color="#fff"
        :router="true"
        :collapse="collapse"
        :unique-opened="true"
        active-text-color="#ffd04b">
      <submenu
          ref="submenu"
          v-for="menu in authRoutes"
          :key="menu.path"
          :base-path="menu.path"
          :menu="menu"></submenu>
    </el-menu>
    <div class="collapse-box" :class="{hidden: collapse}">
      <div v-if="!collapse">
        <img src="../../../assets/折叠.png" alt="" title="折叠" @click="handleClickCollapse(true)">
      </div>
      <div v-else>
        <img src="../../../assets/展开.png" alt="" title="展开" @click="handleClickCollapse(false)">
      </div>
    </div>
  </div>
</template>

<script>
import submenu from './submenu.vue';
import { config } from '@/router/config';

export default {
  name: 'indexView',
  components: {
    submenu
  },
  data () {
    return {
      authRoutes: config,
      collapse: false
    };
  },
  props: {},
  watch: {},
  computed: {
    activeMenu () {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    }
  },
  mounted () {
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    /**
     * @Description 展开或折叠触发
     * @author wangkangzhang
     * @date 2023/9/20
     */
    handleClickCollapse (flag) {
      this.collapse = flag;
      console.log('collapse', flag);
      this.$_store.commit('app/SET_COLLAPSE', flag);
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-container {
  height: 100%;
  overflow-x: hidden;

  .el-menu {
    height: calc(100% - 45px);
    overflow-y: auto;
    width: 100%;
    border: none;
    transition: width .3s;
  }

  .collapse-box {
    height: 43px;
    background-color: #0a1a34;
    border: 1px solid;
    border-image: linear-gradient(180deg, rgba(81.01349964737892, 209.00092989206314, 255, 0.30000001192092896), rgba(81.01349964737892, 209.00092989206314, 255, 0.5), rgba(81.01349964737892, 209.00357455015182, 255, 0.30000001192092896)) 1 1;

    > div {
      margin-top: 12px;
      width: 22px;
      height: 22px;
      margin-left: 16px;

      img {
        cursor: pointer;
      }
    }
  }

  .hidden {
    width: 63px;
  }
}
</style>
