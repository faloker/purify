<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="400px"
      persistent
      @input="$emit('input', $event.target.value)"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ heading }}</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="project-title-input"
                v-model="title"
                label="Project title"
                clearable
                required
                @input="$emit('update:title', title)"
                @keydown.enter="handleClick"
              />
            </v-row>
            <v-row>
              <v-text-field
                id="project-subtitle-input"
                v-model="subtitle"
                label="Project short description"
                clearable
                hint="For example, a tech stack: django, react, e.t.c"
                required
                @input="$emit('update:subtitle', subtitle)"
                @keydown.enter="handleClick"
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click="$emit('input', false)"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            :disabled="!title || title.length < 3"
            text
            @click="handleClick"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'ProjectDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    heading: {
      type: String,
      default: 'New Project',
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
      required: true,
    },
  },

  setup(props, { emit }) {
    function handleClick() {
      emit('handle-click');
    }
    return { handleClick };
  },
});
</script>