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
          {{ message.text }}
        </v-row>
      </v-col>
    </v-row>
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