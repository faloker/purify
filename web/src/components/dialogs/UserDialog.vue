<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="500"
      @input="$emit('input', $event.target.value)"
      @click:outside="$emit('input', false)"
      @keydown.esc="$emit('input', false)"
    >
      <v-card>
        <v-card-title>
          <span>{{ heading }}</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="email"
                v-model="emailModel"
                type="email"
                label="Email"
                outlined
                dense
              />
            </v-row>
            <v-row v-if="heading === 'Edit User'">
              <v-text-field
                id="name"
                v-model="nameModel"
                label="Name"
                outlined
                dense
              />
            </v-row>
            <v-row>
              <v-radio-group
                v-model="roleModel"
                :hint="hintText"
                persistent-hint
              >
                <v-radio
                  v-for="role in roles"
                  :key="role"
                  :label="role"
                  :value="role"
                />
              </v-radio-group>
            </v-row>
            <v-row class="mt-5">
              <v-autocomplete
                v-model="membershipsModel"
                :items="projects"
                multiple
                :disabled="isOwner"
                dense
                outlined
                label="Projects"
                item-text="displayName"
                item-value="_id"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    ripple
                    @click="toggle"
                  >
                    <v-list-item-action>
                      <v-icon :color="membershipsModel.length > 0 ? 'indigo darken-4' : ''">
                        {{ icon }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Select All</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2" />
                </template>
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    v-if="index < 3"
                    label
                    small
                  >
                    <span>{{ item.displayName }}</span>
                  </v-chip>                  
                  <span
                    v-if="index === 3"
                    class="grey--text caption"
                  >(+{{ membershipsModel.length - 3 }} others)</span>
                </template>
              </v-autocomplete>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="ssoBypassModel"
                label="Allow this user to bypass Single Sign-On (SSO)"
                hint="This user can authenticate with their email and password when SSO is enabled."
                persistent-hint
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click="$emit('input', false)"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            @click="$emit('handle-click')"
          >
            {{ okButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  Ref,
  watch,
  computed,
  ComputedRef,
} from '@vue/composition-api';
import { Project, SystemConfig } from '@/store/types';
import store from '@/store';
export default defineComponent({
  name: 'UserDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    heading: {
      type: String,
      default: 'New User',
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    ssoBypass: {
      type: Boolean,
      default: false,
    },
    memberships: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    projects: {
      type: Array as PropType<Project[]>,
      default: () => [],
    },
    okButtonText: {
      type: String,
      default: 'Create',
    },
  },

  setup(props, { emit }) {
    const roles = ref(['Owner', 'Admin', 'User', 'Observer']);

    const nameModel = computed({
      get: () => props.name,
      set: val => emit('update:name', val),
    });
    const emailModel = computed({
      get: () => props.email,
      set: val => emit('update:email', val),
    });
    const roleModel = computed({
      get: () => props.role,
      set: val => emit('update:role', val),
    });
    const membershipsModel = computed({
      get: () => props.memberships,
      set: val => emit('update:memberships', val),
    });
    const ssoBypassModel = computed({
      get: () => props.ssoBypass,
      set: val => emit('update:sso-bypass', val),
    });

    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );
    const isOwner = computed(() => roleModel.value === 'Owner');
    const icon = computed(() => {
      if (membershipsModel.value.length === props.projects.length)
        return 'mdi-close-box';
      else if (membershipsModel.value.length > 0) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    });

    function toggle() {
      if (membershipsModel.value.length === props.projects.length) {
        membershipsModel.value = [];
      } else {
        membershipsModel.value = props.projects.map(
          (project: Project) => project._id
        );
      }
    }

    watch(roleModel, (newValue, oldValue) => {
      if (newValue === 'Owner') {
        membershipsModel.value = props.projects.map(
          (project: Project) => project._id
        );
      } else if (oldValue === 'Owner') {
        membershipsModel.value = [];
      }
    });

    const hintText = computed(() => {
      switch (roleModel.value) {
        case 'Owner':
          return 'Has access to all features, can edit all projects, and can make changes to user accounts.';
        case 'Admin':
          return 'Can invite new users and create units for specific projects.';
        case 'User':
          return 'Can edit issues, create templates and upload reports for specific projects.';
        case 'Observer':
          return 'Can view data for specific projects.';
        default:
          return '';
      }
    });

    return {
      nameModel,
      membershipsModel,
      roleModel,
      emailModel,
      ssoBypassModel,
      roles,
      toggle,
      icon,
      systemConfig,
      isOwner,
      hintText,
    };
  },
});
</script>