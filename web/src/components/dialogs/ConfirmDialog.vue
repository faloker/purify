<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      persistent
      max-width="290"
      @input="$emit('input', $event.target.value)"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ message }}
        </v-card-text>
        <!-- <v-divider /> -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="quinary"
            @click="$emit('input', false)"
          >
            {{ cancelButtonText }}
          </v-btn>
          <v-btn
            text
            color="quinary"
            @click="handleClick"
          >
            {{ okButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'ConfirmDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Confirm',
    },
    message: {
      type: String,
      default: 'Are you sure?',
    },
    okButtonText: {
      type: String,
      default: 'OK',
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel',
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