<template>
  <v-card height="100%">
    <v-layout
      fill-height
    >
      <v-navigation-drawer
        v-model="drawer"
        width="200"
        permanent
      >
        <v-list>
          <v-list-tile @click="currentTab = 'Personal'">
            <v-list-tile-action>
              <v-icon>mdi-account-tie</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Personal</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="currentTab = 'Tokens'">
            <v-list-tile-action>
              <v-icon>mdi-key-variant</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Tokens</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <transition
        appear
        name="fade"
        mode="out-in"
      >
        <keep-alive>
          <component
            :is="currentTabComponent"
          />
        </keep-alive>
      </transition>
    </v-layout>
  </v-card>
</template>
<script>
import PersonalSettings from '@/components/PersonalSettings.vue';
import TokensSettings from '@/components/TokensSettings.vue';
import {
  FETCH_PROFILE,
  LOGOUT,
} from '@/store/actions';

export default {
  name: 'Profile',
  components: {
    TokensSettings,
    PersonalSettings,
  },
  data() {
    return {
      drawer: true,
      currentTab: 'Personal',
      tabs: ['Personal', 'Tokens'],
    };
  },
  computed: {
    currentTabComponent() {
      return `${this.currentTab.toLowerCase()}-settings`;
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_PROFILE);
  },
  methods: {
    logout() {
      this.$store.dispatch(LOGOUT)
        .then(() => this.$router.push({ name: 'Welcome' }));
    },
  },
};
</script>
