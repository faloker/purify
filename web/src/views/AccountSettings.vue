<template>
  <v-container>
    <!-- <v-row justify="space-between" align="center">
      <v-col>
        <p class="text-h4 font-weight-bold">
          Settings
        </p>
      </v-col>
      <v-spacer />
    </v-row>-->
    <v-row no-gutters dense>
      <v-col cols="4">
        <v-card outlined>
          <v-card-title>Your Info</v-card-title>
          <v-card-text>
            <v-col>
              <v-row align="center" justify="start">
                <v-avatar size="62">
                  <img :src="user.image">
                </v-avatar>
                <v-btn
                  class="mt-2 ml-3"
                  color="primary"
                  small
                  @click="changeAvatarDialog = true"
                >
                  Change avatar
                </v-btn>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-text-field
                  v-model="name"
                  label="Name"
                  dense
                  outlined
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="email"
                  label="Email"
                  dense
                  outlined
                />
              </v-row>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!systemConfig.saml || user.ssoBypass"
              color="primary"
              @click="dialog = true"
            >
              Change password
            </v-btn>
            <v-spacer />
            <v-btn color="primary" @click="changeName">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="400"
      @click:outside="dialog = false"
      @keydown.esc="dialog = false"
    >
      <v-card>
        <v-card-title>
          <span>Change password</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="oldPassword"
                v-model="oldPassword"
                label="Old Password"
                required
                type="password"
                dense
                outlined
              />
            </v-row>
            <v-row>
              <v-text-field
                id="newPassword"
                v-model="password1"
                label="New Password"
                required
                outlined
                dense
                type="password"
                @keydown.enter="changePassword"
              />
            </v-row> 
            <v-row>
              <v-text-field
                id="repeat-password"
                v-model="password2"
                label="Repeat Password"
                required
                outlined
                dense
                type="password"
                @keydown.enter="changePassword"
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click.stop="dialog = false"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            :disabled="password1 !== password2"
            @click.stop="changePwd"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>   
    <v-dialog
      v-model="changeAvatarDialog"
      max-width="400"
      @click:outside="changeAvatarDialog = false"
      @keydown.esc="changeAvatarDialog = false"
    >
      <v-card>
        <v-card-title>
          <span>Change avatar</span>
        </v-card-title>
        <v-card-subtitle>
          <span>Feel free to use any public image hosting, but take a look at 
            <a
              href="https://avatars.dicebear.com/"
              target="_blank"
            >avatars.dicebear.com</a> first.</span>
        </v-card-subtitle>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="newAvatarUrl"
                v-model="newAvatarUrl"
                label="New avatar URL"
                required
                dense
                outlined
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click="changeAvatarDialog = false"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            @click="changeAvatar"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import store from '@/store';
import {
  PROFILE_FETCH,
  SELF_CHANGE,
  SELF_CHANGE_PASSWORD,
  SHOW_SUCCESS_MSG,
} from '@/store/actions';
/* eslint-disable @typescript-eslint/no-use-before-define */
import { defineComponent, ref, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'AccountSettings',

  setup() {
    const user = computed(() => store.state.profile.user);
    const systemConfig = computed(() => store.state.system.config);
    const name = ref(user.value.name);
    const email = ref(user.value.email);
    const dialog = ref(false);
    const changeAvatarDialog = ref(false);
    const oldPassword = ref('');
    const password1 = ref('');
    const password2 = ref('');
    const newAvatarUrl = ref('');

    async function changePwd() {
      store
        .dispatch(SELF_CHANGE_PASSWORD, {
          oldPassword: oldPassword.value,
          newPassword: password2.value,
        })
        .then(async () => {
          dialog.value = false;
          await store.dispatch(
            SHOW_SUCCESS_MSG,
            'Your password has been changed'
          );
        })
        .catch(() => {});
    }

    async function changeName() {
      store
        .dispatch(SELF_CHANGE, { name: name.value, email: email.value })
        .then(async () => {
          await store.dispatch(SHOW_SUCCESS_MSG, 'Your data has been changed');
          await store.dispatch(PROFILE_FETCH).catch(() => {});
        })
        .catch(() => {});
    }

    async function changeAvatar() {
      store
        .dispatch(SELF_CHANGE, { image: newAvatarUrl.value })
        .then(async () => {
          changeAvatarDialog.value = false;

          await store.dispatch(
            SHOW_SUCCESS_MSG,
            'Your avatar has been changed'
          );

          await store.dispatch(PROFILE_FETCH).catch(() => {});
        })
        .catch(() => {});
    }

    return {
      user,
      changeAvatarDialog,
      changeAvatar,
      newAvatarUrl,
      systemConfig,
      name,
      email,
      changeName,
      dialog,
      password2,
      password1,
      oldPassword,
      changePwd,
    };
  },
});
</script>