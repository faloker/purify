<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list nav dense>
        <v-list-item active-class="primary--text" :to="{ name: 'Projects' }">
          <v-list-item-action>
            <v-icon>mdi-apps</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item active-class="primary--text" :to="{ name: 'Dashboard' }">
          <v-list-item-action>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item active-class="primary--text" :to="{ name: 'Templates' }">
          <v-list-item-action>
            <v-icon>mdi-file</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Templates</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      flat
      hide-on-scroll
      color="#1a73e8"
      dense
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <b>Purify</b>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn id="btn-mini-profile" icon>
              <v-avatar size="40" v-on="on">
                <img :src="currentUser.image" alt="ava" />
              </v-avatar>
            </v-btn>
          </template>

          <v-card id="menu-mini-profile">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="currentUser.image" alt="ava" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ currentUser.username }}</v-list-item-title>
                  <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    id="btn-logout"
                    icon
                    @click="killSession"
                  >
                    <v-icon>mdi-exit-to-app</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-tune</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Account settings</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-bell</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Notifications</v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { LOGOUT } from '@/store/actions';

export default {
  name: 'TheHeader',
  data() {
    return {
      item: null,
      menu: false,
      drawer: false,
    };
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  methods: {
    killSession() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$toasted.global.api_success({ msg: 'Bye' });
        this.$router.replace('welcome');
      });
    },
  },
};
</script>
