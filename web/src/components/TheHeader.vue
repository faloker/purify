<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="currentUser.image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ currentUser.username }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />
      <v-list dense>
        <v-list-item
          active-class="primary--text"
          :to="{name: 'Dashboard'}"
        >
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          active-class="primary--text"
          :to="{name: 'Projects'}"
        >
          <v-list-item-action>
            <v-icon>mdi-apps</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item
          active-class="primary--text"
          :to="{name: 'Settings'}"
        >
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
      flat
      dense
      hide-on-scroll
    >
      <v-btn
        icon
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title>
        <span id="active-page-name" class="font-weight-bold">{{ activePage }}</span>
      </v-toolbar-title>
    </v-app-bar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheHeader',
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapGetters(['activePage', 'currentUser']),
  },
};
</script>
