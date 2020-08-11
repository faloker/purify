/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    login(username?: string, password?: string): void;
    register(username: string, email: string, password: string): void;
    createProject(name: string, description?: string): void;
    createUnit(name: string): void;

    apiCreateUser(username?: string, email?: string, password?: string): void;
    apiCreateProject(jwtToken: string, title?: string, subtitle?: string): void;
    apiCreateUnit(jwtToken: string, name?: string): void;
    apiUploadOneshot(apiToken: string): void;
    apiCreateTemplate(apiToken: string, reportId: string, name?: string): void;
  }
}
