<template>
  <v-snackbar
    v-model="snackbar"
    :color="message.type"
    :timeout="timeout"
    multi-line
    app
    right
    top
  >
    <v-row align="center" justify="center">
      <v-col cols="2">
        <v-icon dark left>
          {{ message.icon }}
        </v-icon>
      </v-col>
      <v-col>
        <v-row>
          <div class="font-weight-bold subtitle-1">
            {{ message.title }}
          </div>
        </v-row>
        <v-row>
          <div class="body-1">
            {{ message.text }}
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-snackbar>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onBeforeMount,
} from '@vue/composition-api';
import store from '@/store';

export default defineComponent({
  setup() {
    const snackbar = ref(false);
    const timeout = ref(3500);
    const message = computed(() => store.state.system.message);

    onBeforeMount(() => {
      store.subscribe((mutation, state) => {
        if (mutation.type === 'setMessage') {
          snackbar.value = true;
        }
      });
    });

    return { timeout, snackbar, message };
  },
});
</script>
