<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="4" class="mt-12">
        <v-card min-width="400px">
          <v-row align="center" justify="center">
            <v-img
              class="mt-2"
              src="@/assets/logo_trans.png"
              max-width="90"
              max-height="90"
            />
          </v-row>
          <v-divider class="my-5" />
          <v-col class="cp-block">
            <v-row>
              <v-spacer />
              <v-text-field
                id="password"
                v-model="password1"
                label="New Password"
                required
                type="password"
                dense
                outlined
              />
              <v-spacer />
            </v-row>
            <v-row>
              <v-spacer />
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
              <v-spacer />
            </v-row>
            <v-row justify="center" align="center">
              <v-btn
                width="320"
                class="mx-5 mb-4"
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="password1 !== password2"
                @click.prevent="changePassword"
              >
                Change Password
              </v-btn>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import store from '@/store';
import { CHANGE_PASSWORD, SHOW_SUCCESS_MSG } from '@/store/actions';
import { router } from '@/router';
export default defineComponent({
  name: 'ChangePassword',

  setup(props, context) {
    const password1 = ref('');
    const password2 = ref('');
    const loading = ref(false);

    function changePassword() {
      store
        .dispatch(CHANGE_PASSWORD, {
          password: password1.value,
          token: context.root.$route.params.token,
        })
        .then(async () => {
          await store.dispatch(
            SHOW_SUCCESS_MSG,
            'The password has been changed'
          );
          router.push({ name: 'Welcome' });
        })
        .catch(() => {});
    }

    return {
      password1,
      password2,
      loading,
      changePassword,
    };
  },
});
</script>