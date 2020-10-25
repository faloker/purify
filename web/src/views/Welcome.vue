<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col
        cols="3"
        xl="3"
        class="mt-12"
      >
        <v-card
          outlined
          min-width="250"
          max-height="600"
        >
          <v-card-title>
            <v-row align="center" justify="center">
              <v-img
                class="logo"
                src="@/assets/logo_trans.png"
                max-width="80"
                max-height="80"
              />
            </v-row>
          </v-card-title>
          <!-- <v-divider /> -->
          <v-card-text>
            <v-row>
              <v-col
                v-if="systemConfig.saml"
                class="sso-block"
                cols="12"
              >
                <v-row
                  align="center"
                  justify="center"
                  class="mb-3"
                >
                  <v-icon class="mr-1" small>
                    info
                  </v-icon>
                  <span class="text-uppercase text--disabled">Single Sign-On is required</span>
                </v-row>
                <v-row
                  align="center"
                  justify="center"
                >
                  <v-btn
                    v-if="systemConfig.saml"
                    dark
                    class="mt-1"
                    type="submit"
                    color="primary"
                    :href="`${API_URL}/auth/saml`"
                  >
                    <v-icon left>
                      lock
                    </v-icon>Sign In With Your IdP
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
                    Click 
                    <a
                      class="text-decoration-underline"
                      @click.stop="forceLogin = !forceLogin"
                    >here</a> to sign in with email and password.
                  </p>
                </v-row>
              </v-col>
              <v-slide-y-transition>
                <v-col
                  v-if="!systemConfig.saml || forceLogin"
                  class="sign-in-block mx-1"
                >
                  <v-row>
                    <v-text-field
                      id="email"
                      v-model="email"
                      label="Email"
                      dense
                      outlined
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      id="password"
                      v-model="password"
                      label="Password"
                      outlined
                      dense
                      type="password"
                      @keydown.enter="login"
                    />
                  </v-row>
                  <v-row>
                    <v-btn
                      block
                      color="primary"
                      :loading="loading"
                      :disabled="!password || !email || inProgress"
                      @click.prevent="login"
                    >
                      Sign In
                    </v-btn>
                  </v-row>
                </v-col>
              </v-slide-y-transition>
            </v-row>
          </v-card-text>
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
    const inProgress = ref(false);
    const forceLogin = ref(false);

    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );

    function login() {
      loading.value = true;
      inProgress.value = true;

      store
        .dispatch(LOGIN, {
          email: email.value,
          password: password.value,
        })
        .then(() => {
          router.push({ name: 'Overview' });
        })
        .catch(() => {
          loading.value = false;
          inProgress.value = false;
        });
    }

    return {
      tabs,
      email,
      login,
      loading,
      inProgress,
      password,
      forceLogin,
      systemConfig,
    };
  },
});
</script>
<style scoped>
.logo {
  border-radius: 50%;
  -webkit-transition: -webkit-transform 0.8s ease-in-out;
  transition: transform 0.8s ease-in-out;
}

.logo:hover {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
}
</style>
