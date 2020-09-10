<template>
  <v-container>
    <v-row justify="space-between" align="center">
      <v-col>
        <p class="text-h4 font-weight-bold">
          API access tokens
        </p>
        <p>Create a few tokens to connect to the Purify API.</p>
      </v-col>
      <v-spacer />
      <v-col class="mr-3">
        <v-row align="center" justify="end">
          <v-btn color="primary" @click.stop="createDialog = true">
            <v-icon left>
              add
            </v-icon>Create API token
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>
        <v-text-field
          id="search"
          v-model="searchTerm"
          prepend-inner-icon="search"
          label="Filter by token"
          solo
          dense
          clearable
        />
        <v-skeleton-loader
          :loading="loading"
          transition="slide-y-transition"
          type="table-tbody"
        >
          <v-card outlined>
            <v-data-table
              :headers="headers"
              item-key="_id"
              :items="tokens"
              :search="searchTerm"
              :items-per-page="5"
            >
              <template v-slot:item.createdAt="{ item }">
                <span class="text-none mr-5">{{ formatDate(item.createdAt) }}</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu
                  bottom
                  right
                  transition="slide-x-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-permission="['owner']"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click.stop="openConfirmationDialog(item)">
                      <strong class="red--text text--lighten-1">Delete token</strong>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-dialog
      v-model="createDialog"
      max-width="400"
      @click:outside="createDialog = false"
      @keydown.esc="createDialog = false"
    >
      <v-card>
        <v-card-title>
          <span>New API Token</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="tokenName"
                v-model="name"
                label="Token name"
                dense
                outlined
                @keydown.enter="createToken"
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click.stop="createDialog = false"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            :disabled="!name || name.length < 3"
            @click.stop="createToken"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this token?"
      message="Are you sure you want to continue?"
      @handle-click="deleteToken()"
    />
    <v-dialog
      v-model="exampleDialog"
      max-width="500"
      @click:outside="exampleDialog = false"
      @keydown.esc="exampleDialog = false"
    >
      <v-card>
        <v-card-title>
          New token created
        </v-card-title>
        <v-card-subtitle>Record this token and keep it safe. For your security, it will not be displayed again.</v-card-subtitle>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="textToCopy"
                label="Token value"
                dense
                outlined
                filled
                :value="newToken"
                readonly
                :append-outer-icon="ttcIcon"
                @click:append-outer="copyText"
              />
            </v-row>
            <v-row>
              <v-text-field
                id="tokenName"
                label="Token name"
                dense
                outlined
                filled
                :value="name"
                readonly
              />
            </v-row>
            <v-row>
              <v-textarea
                filled
                dense
                outlined
                label="Example usage"
                :value="`curl -H &quot;apikey: ${newToken}&quot; -H &quot;Content-Type: application/json&quot; ${API_URL}/whoami`"
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            @click.stop="exampleDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  ComputedRef,
  Ref,
} from '@vue/composition-api';
import store from '@/store';
import {
  CREATE_ACCESS_TOKEN,
  DELETE_ACCESS_TOKEN,
  FETCH_ACCESS_TOKENS,
  SHOW_SUCCESS_MSG,
} from '@/store/actions';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { Token } from '@/store/types';
import { formatDate } from '@/utils/helpers';
export default defineComponent({
  name: 'AccessTokens',

  components: { ConfirmDialog },

  setup() {
    const loading = ref(true);
    const searchTerm = ref('');
    const ttcIcon = ref('mdi-content-copy');
    const headers = ref([
      { text: 'Token name', value: 'name' },
      {
        text: 'Logged IP',
        value: 'lastActivity.fromIP',
      },
      {
        text: 'User Agent',
        value: 'lastActivity.userAgent',
      },
      {
        text: 'Last used',
        value: 'lastActivity.date',
      },
      {
        text: 'Created At',
        value: 'createdAt',
        align: 'center',
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
      },
    ]);

    const tokens = computed(() => store.state.profile.accessTokens);

    onMounted(() => {
      store
        .dispatch(FETCH_ACCESS_TOKENS)
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    function copyText() {
      const ttc = document.querySelector('#textToCopy') as HTMLInputElement;
      ttc!.select();
      document.execCommand('copy');
      ttcIcon.value = 'mdi-check';
    }

    return {
      loading,
      tokens,
      searchTerm,
      headers,
      ttcIcon,
      copyText,
      formatDate,
      ...useDeleteToken(),
      ...useCreateToken(),
    };
  },
});

function useDeleteToken() {
  const confirmDialog = ref(false);
  const tokenId = ref('');

  function deleteToken() {
    store
      .dispatch(DELETE_ACCESS_TOKEN, { _id: tokenId.value })
      .then(async () => {
        confirmDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The token has been deleted');
      })
      .catch(() => {});
  }

  function openConfirmationDialog(item: Token) {
    confirmDialog.value = true;
    tokenId.value = item._id;
  }

  return {
    confirmDialog,
    tokenId,
    openConfirmationDialog,
    deleteToken,
  };
}

function useCreateToken() {
  const createDialog = ref(false);
  const exampleDialog = ref(false);
  const name = ref('');
  const newToken = ref({});

  function createToken() {
    store
      .dispatch(CREATE_ACCESS_TOKEN, {
        name: name.value,
      })
      .then(async (token: Token) => {
        await store.dispatch(SHOW_SUCCESS_MSG, 'The token has been created');
        createDialog.value = false;

        newToken.value = token.value;
        exampleDialog.value = true;
      })
      .catch(() => {});
  }

  return {
    createDialog,
    createToken,
    exampleDialog,
    newToken,
    name,
  };
}
</script>