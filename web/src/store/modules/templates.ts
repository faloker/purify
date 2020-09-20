import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getTemplates,
  deleteTemplate,
  editTemplate,
  createTemplate,
  applyTemplate,
} from '@/api/templates.service';
import {
  TEMPLATES_FETCH,
  TEMPLATES_DELETE,
  TEMPLATES_EDIT,
  TEMPLATE_CREATE,
  APPLY_TEMPLATE,
  FETCH_REPORTS,
} from '@/store/actions';
import { TEMPLATES_SET } from '@/store/mutations';
import {
  Template,
  TemplateWithStats,
  EditTemplateDto,
  ApplyTemplateDto,
} from '../types';

@Module
export default class Templates extends VuexModule {
  items: TemplateWithStats[] = [];

  @Mutation
  [TEMPLATES_SET](templates: TemplateWithStats[]) {
    this.items = templates;
  }

  @Action
  async [TEMPLATES_FETCH](verbose = false) {
    const { data } = await getTemplates(verbose);
    this.context.commit(TEMPLATES_SET, data);
  }

  @Action
  async [TEMPLATE_CREATE](template: Template) {
    await createTemplate(template);
  }

  @Action
  async [TEMPLATES_DELETE](name: string) {
    await deleteTemplate(name);
    await this.context.dispatch(TEMPLATES_FETCH, true);
  }

  @Action
  async [TEMPLATES_EDIT](payload: EditTemplateDto) {
    await editTemplate(payload.name, payload.change);
    await this.context.dispatch(TEMPLATES_FETCH, true);
  }

  @Action
  async [APPLY_TEMPLATE](applyTemplateDto: ApplyTemplateDto) {
    await applyTemplate(applyTemplateDto);
    await this.context.dispatch(FETCH_REPORTS).catch(() => {});
  }
}
