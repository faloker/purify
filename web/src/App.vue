<template>
  <v-app id="app">
    <router-view name="header" />
    <v-main>
      <snackbar />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Snackbar from '@/components/Snackbar.vue';

export default defineComponent({
  components: { Snackbar },
});
</script>

<style>
#app {
  background-color: #ffffff;
}
.router-link-active {
  color: #2c3e50;
}
</style>
