<template>
  <v-snackbar
    v-model="snackbar"
    :color="message.type"
    :timeout="timeout"
    multi-line
    absolute
    app
    right
    top
  >
    <div>
      <v-icon dark left>
        {{ message.icon }}
      </v-icon>
      {{ message.text }}
    </div>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Snackbar',
  data: () => ({
    snackbar: false,
    timeout: 3500,
  }),

  computed: {
    ...mapState({
      message: (state) => state.app.snackbar,
    }),
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'showMessage') {
        this.snackbar = true;
      }
    });
  },
};
</script>