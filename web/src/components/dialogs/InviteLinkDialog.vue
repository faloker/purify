<template>
  <v-dialog
    v-model="value"
    max-width="500"
    @input="$emit('input', $event.target.value)"
    @click:outside="$emit('input', false)"
    @keydown.esc="$emit('input', false)"
  >
    <v-card>
      <template v-if="!systemConfig.saml || isPasswordReset">
        <v-card-title>Share login link</v-card-title>
        <v-card-subtitle>To log in, the user will need to follow the link and set a password.</v-card-subtitle>
        <v-card-text>
          <v-text-field
            id="textToCopy"
            :value="link"
            label="Login link"
            dense
            outlined
            filled
            readonly
            :append-outer-icon="ttcIcon"
            @click:append-outer="copyText"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            @click.stop="$emit('input', false)"
          >
            OK
          </v-btn>
        </v-card-actions>
      </template>
      <v-template v-else>
        <v-card-title>User has been created</v-card-title>
        <v-card-subtitle>SSO is enabled in your installation, so users have to sign in with your identity provider.</v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            @click.stop="$emit('input', false)"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-template>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
} from '@vue/composition-api';
import store from '@/store';
import { SystemConfig } from '@/store/types';
export default defineComponent({
  name: 'InviteLinkDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
    isPasswordReset: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const ttcIcon = ref('mdi-content-copy');
    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );

    function copyText() {
      const ttc = document.querySelector('#textToCopy') as HTMLInputElement;
      ttc!.select();
      document.execCommand('copy');
      ttcIcon.value = 'mdi-check';
    }

    return {
      systemConfig,
      ttcIcon,
      copyText,
    };
  },
});
</script>