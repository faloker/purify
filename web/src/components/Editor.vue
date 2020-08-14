<template>
  <div :class="editorStyle">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';

require('script-loader!jsonlint');

export default {
  name: 'Editor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'mode'],
  data() {
    return {
      editor: {},
    };
  },
  computed: {
    editorStyle() {
      return this.mode === 'text/x-markdown' ? 'mrkd-editor' : 'json-editor';
    },
  },

  watch: {
    value(value) {
      const editorValue = this.editor.getValue();
      if (value !== editorValue) {
        this.editor.setValue(this.value);
        setTimeout(() => {
          this.editor.refresh();
        }, 1);
      }
    },
  },

  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: this.mode,
      gutters: ['CodeMirror-lint-markers'],
      theme: this.mode === 'text/x-markdown' ? 'default' : 'material',
      lint: true,
    });

    this.editor.setValue(this.value);
    setTimeout(() => {
      this.editor.refresh();
    }, 1);

    this.editor.on('change', cm => {
      this.$emit('changed', cm.getValue());
      this.$emit('input', cm.getValue());
    });
  },

  methods: {
    getValue() {
      return this.editor.getValue();
    },
  },
};
</script>

<style scoped>
.json-editor {
  height: 100%;
  font-size: 14px;
  position: relative;
}

.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}

.json-editor >>> .CodeMirror-scroll {
  min-height: 300px;
}

.mrkd-editor {
  height: auto;
  font-size: 14px;
}

.mrkd-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}

.mrkd-editor >>> .CodeMirror-scroll {
  min-height: 300px;
}
</style>