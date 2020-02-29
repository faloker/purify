<template>
  <v-container
    justify-start
    fill-height
  >
    <v-layout
      column
      class="mt-5"
    >
      <v-flex shrink>
        <v-layout>
          <v-flex xs3>
            <div class="headline font-weight-bold">
              Public avatar
            </div>
            <div class="subheading">
              You can change your avatar here
              or remove the current avatar.
            </div>
          </v-flex>
          <v-flex
            shrink
            class="pl-5"
          >
            <v-avatar
              size="120"
            >
              <img
                :src="profile.image"
                alt="avatar"
              >
            </v-avatar>
          </v-flex>
          <v-flex shrink>
            <v-layout
              class="pl-5"
              column
            >
              <span class="font-weight-bold">Upload new avatar</span>
              <v-btn
                depressed
                class="text-none"
              >
                Choose file...
              </v-btn>
              <v-divider class="my-2" />
              <v-btn
                outline
                class="text-none"
                color="red darken-1"
              >
                Remove avatar
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex xs3>
            <div class="headline font-weight-bold">
              Main settings
            </div>
            <div class="subheading">
              This information will appear on your profile
            </div>
          </v-flex>
          <v-flex
            xs4
            class="pl-5"
          >
            <v-layout
              column
            >
              <v-text-field
                label="Username"
                :value="profile.username"
                box
              />
              <v-text-field
                label="Email"
                :value="profile.email"
                box
              />
            </v-layout>
            <v-btn
              class="text-none"
              color="primary"
              dark
            >
              Update profile
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PersonalSettings',
  computed: {
    ...mapGetters(['profile']),
  },
};
</script>
