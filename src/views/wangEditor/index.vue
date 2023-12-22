<template>
<div class="wangeditor-container">
  <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
  />
  <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
  />
</div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
// import { IToolbarConfig } from '@wangeditor/editor';
export default {
  name: 'index',
  components: { Editor, Toolbar },
  data () {
    return {
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: { },
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default' // or 'simple'
    };
  },
  methods: {

    onCreated (editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    }
  }
};
</script>

<style lang="scss" scoped>
.wangeditor-container {
  width: 100%;
  height: 100%;
}
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>
