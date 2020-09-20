import { DirectiveOptions } from 'vue';
import store from '@/store';
import { Role } from '@/store/types';

export const permission: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding;
    const userRole: Role = store.state.profile.user.role;

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;
      if (!permissionRoles.includes(userRole)) {
        el.style.display = 'none';
      }
    } else {
      throw new Error("Need roles! Like v-permission=\"['admin','user']\"");
    }
  },
};
