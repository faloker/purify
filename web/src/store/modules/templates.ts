import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getTemplates,
  deleteTemplate,
  editTemplate,
  createTemplate,
} from '@/api/templates.service';
import {
  TEMPLATES_FETCH,
  TEMPLATES_DELETE,
  TEMPLATES_EDIT,
  TEMPLATE_CREATE,
} from '@/store/actions';
import { TEMPLATES_SET } from '@/store/mutations';
import { Template, TemplateWithStats, EditTemplateDto } from '../types';

@Module
export default class Templates extends VuexModule {
  items: TemplateWithStats[] = [];

  get findTemplateByName() {
    return (name: string) => {
      this.items.find(item => item.template.name === name);
    };
  }

  @Mutation
  [TEMPLATES_SET](templates: TemplateWithStats[]) {
    this.items = templates;
  }

  @Action
  async [TEMPLATES_FETCH]() {
    const { data } = await getTemplates();
    this.context.commit(TEMPLATES_SET, data);
  }

  @Action
  async [TEMPLATE_CREATE](template: Template) {
    await createTemplate(template);
  }

  @Action
  async [TEMPLATES_DELETE](slug: string) {
    await deleteTemplate(slug);
    this.context.dispatch(TEMPLATES_FETCH);
  }

  @Action
  async [TEMPLATES_EDIT](payload: EditTemplateDto) {
    await editTemplate(payload.slug, payload.change);
    this.context.dispatch(TEMPLATES_FETCH);
  }
}
