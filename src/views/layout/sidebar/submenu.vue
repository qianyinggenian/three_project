<template>
  <div>
    <router-link :to="menu.path" v-if="!hasChildren(menu)">
      <el-menu-item :index="menu && menu.path" :route="menu && menu.path">
        <item :title="menu && menu.meta.title"/>
      </el-menu-item>
    </router-link>

    <el-submenu v-else ref="subMenu" :index="menu.path" popper-append-to-body>
      <template v-slot:title>
        <item v-if="menu && menu.meta" :svgClass="menu && menu.meta && menu.meta.svgClass"
              :title="menu && menu.meta.title"/>
      </template>
      <submenu
          v-for="child in menu.children"
          :key="child.path"
          :menu="child"
          class="next-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import item from './item.vue';

export default {
  name: 'submenu',
  components: {
    item
  },
  data () {
    return {};
  },
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  watch: {},
  computed: {},
  mounted () {
  },
  methods: {
    hasChildren (item) {
      if (item && item.children) {
        return item && item.children.length !== 0;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
