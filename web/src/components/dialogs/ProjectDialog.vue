<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="400px"
      @input="$emit('input', $event.target.value)"
      @click:outside="$emit('input', false)"
    >
      <v-card>
        <v-card-title>
          <span>{{ heading }}</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="project-title-input"
                v-model="titleModel"
                label="Project title"
                clearable
                required
                @keydown.enter="$emit('handle-click')"
              />
            </v-row>
            <v-row>
              <v-text-field
                id="project-subtitle-input"
                v-model="subtitleModel"
                label="Project short description"
                clearable
                hint="For example, a tech stack: django, react, e.t.c"
                required
                @keydown.enter="$emit('handle-click')"
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
            @click="$emit('handle-click')"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
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
    const subtitleModel = computed({
      get: () => props.subtitle,
      set: val => emit('update:subtitle', val),
    });
    const titleModel = computed({
      get: () => props.title,
      set: val => emit('update:title', val),
    });

    return { subtitleModel, titleModel };
  },
});
</script>