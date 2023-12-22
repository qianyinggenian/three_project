<template>
<div>11111</div>
</template>

<script>
export default {
  name: 'index',
  components: {},
  data () {
    return {
      list: []
    };
  },
  props: {},
  watch: {},
  computed: {},
  mounted () {
    const str = this.list.map(item => item.taskName).join('、');
    console.log('str', str);
  },
  methods: {}
};
</script>

<style scoped>

</style>
