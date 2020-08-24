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
          <v-row>
            <v-col v-if="systemConfig.saml" class="sso-block">
              <v-row align="center" justify="center">
                <div>
                  <v-icon class="mb-1 mr-1" small>
                    info
                  </v-icon>
                  <span class="text-uppercase text--disabled">Password Login is Disabled</span>
                  <p class="mt-3">
                    Your account requires Single Sign-On.
                  </p>
                </div>
              </v-row>
              <v-row justify="center" align="center">
                <v-btn
                  v-if="systemConfig.saml"
                  width="320"
                  dark
                  class="mt-1"
                  type="submit"
                  color="quinary"
                  :href="`${API_URL}/auth/saml`"
                >
                  <v-icon left>
                    lock
                  </v-icon>Sign In With Your Identity Provider
                </v-btn>
              </v-row>
              <v-row
                class="mt-5"
                align="center"
                justify="center"
              >
                <p
                  class="ml-2"
                >
                  If you are an admin, click 
                  <a
                    class="text-decoration-none"
                    @click="forceLogin = !forceLogin"
                  >here</a> to sign in.
                </p>
              </v-row>
            </v-col>
            <v-slide-y-transition>
              <v-col v-if="!systemConfig.saml || forceLogin" class="sign-in-block">
                <v-row>
                  <v-spacer />
                  <v-text-field
                    id="email"
                    v-model="email"
                    label="Email"
                    dense
                    outlined
                  />
                  <v-spacer />
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Password"
                    outlined
                    dense
                    type="password"
                    @keydown.enter="login"
                  />
                  <v-spacer />
                </v-row>
                <v-row justify="center" align="center">
                  <v-btn
                    width="320"
                    class="mx-5"
                    type="submit"
                    color="primary"
                    :loading="loading"
                    :disabled="!password || !email"
                    @click.prevent="login"
                  >
                    Sign In
                  </v-btn>
                </v-row>
              </v-col>
            </v-slide-y-transition>
          </v-row>
          <v-divider class="mx-3" />
          <v-row justify="center" align="center">
            <div class="body-1 mt-4 mb-7">
              <a
                href="https://github.com/faloker/purify/releases/latest"
                target="_blank"
              >Check Out What's New in Purify</a>
            </div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
} from '@vue/composition-api';
import { LOGIN } from '@/store/actions';
import { router } from '@/router';
import store from '@/store';
import { SystemConfig } from '@/store/types';

export default defineComponent({
  name: 'Welcome',

  setup() {
    const tabs = ref(null);
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const forceLogin = ref(false);

    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );

    function login() {
      loading.value = true;
      store
        .dispatch(LOGIN, {
          email: email.value,
          password: password.value,
        })
        .then(() => {
          router.push({ name: 'Projects' });
        })
        .catch(() => {
          loading.value = false;
        });
    }

    return {
      tabs,
      email,
      login,
      loading,
      password,
      forceLogin,
      systemConfig,
    };
  },
});
</script>
<style scoped>
.grey-form {
  background-color: #fafafa;
}
</style>
