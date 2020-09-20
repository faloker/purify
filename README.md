<h1 align="center">
  <br>
  <a href="https://github.com/faloker/purify">
  <img src="web/src/assets/logo_trans.png" height="150" alt="purify"></a>
  <br>
  Purify
  <br>
</h1>

<h4 align="center">All-in-one tool for managing vulnerability reports</h4>

<p align="center">
  <a href="https://purify-demo.herokuapp.com/">Demo</a>
</p>
<p align="center">
  <a href="https://faloker.gitbook.io/purify-docs/">Docs</a>
</p>

<p align="center">
  <a href="https://github.com/faloker/purify/releases">
    <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/faloker/purify?include_prereleases">
  </a>
  <a href="https://github.com/faloker/purify/releases">
    <img alt="GitHub (Pre-)Release Date" src="https://img.shields.io/github/release-date-pre/faloker/purify">
  </a>
  <a href="https://github.com/faloker/purify/releases">
    <img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/faloker/purify/e2e%20tests/develop">
  </a>
  <a href="https://github.com/faloker/purify/issues">
    <img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed-raw/faloker/purify">
  </a>
</p>
<p align="center">
  <a href="https://codeclimate.com/github/faloker/purify/maintainability">
     <img src="https://api.codeclimate.com/v1/badges/e92c8f0912d7d6ec1b65/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/faloker/purify/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/e92c8f0912d7d6ec1b65/test_coverage" />
  </a>
</p>


## Description

The goal of Purify to be an easy-in-use and efficient tool to simplify a workflow of managing vulnerabilities delivered from various (even custom) tools.

Purify is aims to be a tool-agnostic application. Tool independence makes it possible to analyze results/findings/reports of any toolset. Technically, the report you want to upload should be one of the following:
- JSON file
- XML file
- JSON object (most webhooks dispatch events as separate JSON objects)

This means **you don't need any special plug-ins** to parse incoming reports. For this Purify introduces the concept of templates. Templates are code-free and user-friendly structures that parse reports the way you tell them.

Purify is able to remove duplicate results among various vulnerability scanners or tools. In addition, it can combine several results of the same tool based on selected fields and it is fully configurable. Purify does all this work to reduce the headache of the analyst.

Collect all your findings in one place, review/validate/track them, collaborate with your teammates, receive notifications via Slack, create Jira tickets and many more.

## Getting started

- [Official Documentation](https://faloker.gitbook.io/purify)
- [Live Demo](https://purify-demo.herokuapp.com)
  - email: system@purify.com
  - password: secret

## Questions

For questions and support please use the official [Discord channel](https://discord.gg/a9hz3PF). The issue list of this repo is exclusively for bug reports and feature requests.


## Built With

- [Nest](https://github.com/nestjs/nest) - The web framework used
- [Vuetify](https://github.com/vuetifyjs/vuetify) - Material Component Framework for Vue

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
