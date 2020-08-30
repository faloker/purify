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
                id="displayName"
                v-model="displayNameModel"
                label="Display name"
                dense
                outlined
                @keydown.enter="$emit('handle-click')"
              />
            </v-row>
            <v-row>
              <v-text-field
                id="unitId"
                v-model="idPreview"
                label="ID"
                disabled
                dense
                outlined
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
            text
            :disabled="!displayName || displayName.length < 3"
            @click="$emit('handle-click')"
          >
            {{ okButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import slug from 'slug';
import store from '@/store';
export default defineComponent({
  name: 'UnitDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    heading: {
      type: String,
      default: 'New Unit',
    },
    displayName: {
      type: String,
      default: '',
    },
    okButtonText: {
      type: String,
      default: 'Save',
    },
  },

  setup(props, { emit }) {
    const displayNameModel = computed({
      get: () => props.displayName,
      set: val => emit('update:display-name', val),
    });
    const projectName = computed(() => store.state.system.projectName);
    const idPreview = computed(() => {
      return `${projectName.value}.${slug(displayNameModel.value)}`;
    });

    return { displayNameModel, idPreview };
  },
});
</script>