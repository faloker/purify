/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Perform login through the UI.
     *
     * @param {string} username The username to login with. Default is "test".
     * @param {string} password The password to login with. Default is "testtest".
     *
     * @example
     * // login with default credentials
     * cy.login()
     * // login with custom credentials
     * cy.login('username', 'password')
     */
    login(username?: string, password?: string): void;    
    
    /**
     * Perform login as System user via the UI.
     *
     *
     * @example
     * // login with default credentials
     * cy.loginAsSystem()
     */
    loginAsSystem(): void;

    /**
     * Register a new user through the UI.
     *
     * @param {string} username The username to use for registration. Default is "test".
     * @param {string} email The email to use for registration. Default is "test＠test.test".
     * @param {string} password The password to use for registration. Default is "testtest".
     *
     * @example
     * // register with default credentials
     * cy.register()
     * // register with custom credentials
     * cy.register('test', 'test＠test.test', 'testtest')
     */
    register(username?: string, email?: string, password?: string): void;

    /**
     * Create a new project through the UI.
     *
     * @param {string} name The name of the project.
     * @param {string} description Optional description of the project.
     *
     * @example
     * // create project without description
     * cy.createProject('another project');
     * // create project with description
     * cy.createProject('kkek', 'kekekke');
     */
    createProject(name: string, description?: string): void;

    /**
     * Create a new unit through the UI.
     *
     * @param {string} name The name of the project.
     *
     * @example
     * // create unit
     * cy.createUnit('dast');
     */
    createUnit(name: string): void;

    /**
     * Register a new user through the API.
     *
     * @param {string} email The email to use for registration. Default is "test＠example.com".
     *
     * @example
     * // create a new user with default credentials via API
     * cy.apiCreateUser();
     */
    apiCreateUser(user: any): Chainable<Response>;

    /**
     * Create a new project through the API.
     *
     * @param {string} displayName The name of the project. Defaults to "test name".
     * @param {string} name The name of the project. Defaults to "test-name".
     * @param {string} description Optional description of the project. Defaults to "test desc".
     *
     * @example
     * // create a new project with default params
     * cy.apiCreateProject();
     */
    apiCreateProject(displayName?: string, name?: string, description?: string): void;

    /**
     * Create a new unit through the API.
     *
     * @param {string} displayName The name of the unit. Defaults to "unit".
     *
     * @example
     * // create a new unit with default params
     * cy.apiCreateUnit(token);
     */
    apiCreateUnit(displayName?: string): void;

    /**
     * Upload the JSON object into the "test-name.unit" unit. A JSON object located at ../fixtures/oneshot-example.json.
     *
     * @param {string} templateName  Name of template to use.
     *
     * @example
     * // upload oneshot
     * cy.apiUploadOneshot('bandit');
     */
    apiUploadOneshot(templateName: string): void;

    /**
     * Create a new template for the report through the API.
     *
     * @param {string} apiToken The API token to use for authentication.
     * @param {string} reportId The UUID of the report.
     * @param {string} name The name of the template. Defaults to "bandit".
     *
     * @example
     * // create a new template
     * cy.apiCreateTemplate(apiToken, resp.body._id);
     */
    apiCreateTemplate(name: string, displayName: string): void;

    /**
     * Create a new API access token via UI.
     *
     * @param {string} name The name of the token.
     *
     * @example
     * // create a new token
     * cy.createAccessToken('monitoring');
     */
    createAccessToken(name: string): void;

    uploadReport(filename: string): void;

    createUser(email: string): void;

    assumeRole(role: string, memberships?: string[]): Chainable<string>;

    initAllRoles(memberships?: string[]): void;

    loginAs(role: string): void;

    logout(): void;
  }
}
