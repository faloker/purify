<template>
  <v-app id="app">
    <router-view name="header" />
    <v-content>
      <snackbar />
      <vue-page-transition name="fade">
        <router-view />
      </vue-page-transition>
    </v-content>
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar.vue';

export default {
  name: 'App',
  components: { Snackbar },
  data: () => ({
    drawer: null,
  }),
};
</script>

<style>
#app {
  background-color: #fafafa;
}
.router-link-active {
  color: #2c3e50;
}
</style>
